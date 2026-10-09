#!/usr/bin/env python3
"""Hard guard rails for Claude's MCP tool calls (Bigin, Zoho Books/Mail, Gmail...).

Prompts alone don't stop an agent from looping on a dead source or re-sending
a write, so these rules are enforced here, in code:

  1. 3 empty or failed results in a row from the same read tool -> block it.
  2. The same call failing twice with the same input -> block it.
  3. A write (create/update/send/email/delete...) already run with identical
     input this session -> block the repeat (no double-sends on retry).

Wired up in .claude/settings.json as both a PreToolUse and a PostToolUse hook.
PreToolUse decides whether to block; PostToolUse records what happened.
State is kept per session in the system temp dir.
"""
import hashlib
import json
import os
import re
import sys
import tempfile

EMPTY_LIMIT = 3
SAME_ERROR_LIMIT = 2

# Matched against the leading verb of the action, so reads like list_labels
# or getMessageAttachmentInfo don't count as writes.
WRITE_PATTERN = re.compile(
    r"(add|create|update|upsert|send|reply|forward|email|delete|trash|mark|"
    r"unmark|label|unlabel|apply|move|merge|assign|unassign|complete|edit|"
    r"write|publish|buy|cancel|void)",
    re.IGNORECASE,
)
PRODUCT_PREFIX = re.compile(r"^(Bigin|ZohoBooks|ZohoMail)_")


def is_write(tool_name: str) -> bool:
    # Only the part after mcp__<server>__ describes the action.
    action = PRODUCT_PREFIX.sub("", tool_name.split("__")[-1])
    return bool(WRITE_PATTERN.match(action))


def call_key(tool_name: str, tool_input) -> str:
    raw = json.dumps(tool_input, sort_keys=True, default=str)
    return tool_name + ":" + hashlib.sha256(raw.encode()).hexdigest()[:16]


def classify(response) -> str:
    """Return 'error', 'empty' or 'ok' for a tool response (best effort)."""
    if isinstance(response, dict):
        if response.get("is_error") or response.get("isError") or response.get("error"):
            return "error"
    text = json.dumps(response, default=str) if not isinstance(response, str) else response
    stripped = text.strip()
    lowered = stripped.lower()
    if lowered.startswith("error") or '"error"' in lowered[:200]:
        return "error"
    if stripped in ("", "[]", "{}", "null", '""') or re.search(
        r'"(data|records|results|items|messages|threads)"\s*:\s*\[\s*\]', stripped
    ) or "no records" in lowered or "no results" in lowered:
        return "empty"
    return "ok"


def state_path(session_id: str) -> str:
    safe = re.sub(r"[^A-Za-z0-9_-]", "", session_id or "default")
    return os.path.join(tempfile.gettempdir(), f"claude-agent-guard-{safe}.json")


def load(path: str) -> dict:
    try:
        with open(path) as f:
            return json.load(f)
    except (OSError, ValueError):
        return {"empty_streak": {}, "errors": {}, "writes": []}


def save(path: str, state: dict) -> None:
    try:
        with open(path, "w") as f:
            json.dump(state, f)
    except OSError:
        pass


def block(message: str) -> None:
    # Exit code 2 blocks the call; stderr is shown to Claude as the reason.
    print(message, file=sys.stderr)
    sys.exit(2)


def main() -> None:
    try:
        event = json.load(sys.stdin)
    except ValueError:
        return
    tool = event.get("tool_name", "")
    if not tool.startswith("mcp__"):
        return
    key = call_key(tool, event.get("tool_input"))
    path = state_path(event.get("session_id", ""))
    state = load(path)
    hook = event.get("hook_event_name")

    if hook == "PreToolUse":
        if state["errors"].get(key, 0) >= SAME_ERROR_LIMIT:
            block(
                f"Blocked: {tool} has failed {SAME_ERROR_LIMIT} times with this exact input. "
                "Stop retrying. Tell the user what failed and ask how to proceed, or switch method."
            )
        if is_write(tool) and key in state["writes"]:
            block(
                f"Blocked: this exact {tool} write already ran in this session. "
                "Do not repeat it. Re-fetch the record to confirm whether it took effect, "
                "and only retry if the user confirms the first attempt failed."
            )
        if not is_write(tool) and state["empty_streak"].get(tool, 0) >= EMPTY_LIMIT:
            block(
                f"Blocked: {tool} returned nothing useful {EMPTY_LIMIT} times in a row. "
                "Stop this retrieval path. Do not guess an answer; tell the user what you "
                "searched for and that the source came back empty."
            )
        return

    if hook == "PostToolUse":
        outcome = classify(event.get("tool_response"))
        if outcome == "error":
            state["errors"][key] = state["errors"].get(key, 0) + 1
        else:
            state["errors"].pop(key, None)
        if is_write(tool):
            if outcome != "error" and key not in state["writes"]:
                state["writes"].append(key)
        elif outcome == "ok":
            state["empty_streak"][tool] = 0
        else:
            state["empty_streak"][tool] = state["empty_streak"].get(tool, 0) + 1
        save(path, state)


if __name__ == "__main__":
    main()
