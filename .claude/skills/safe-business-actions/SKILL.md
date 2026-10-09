---
name: safe-business-actions
description: Safety checklist for any action that changes Just Acoustics business data or contacts a customer — creating or updating Bigin records, deals, notes or tasks; creating, updating, emailing or marking Zoho Books estimates, invoices, contacts or items; sending or replying to email from Zoho Mail, Gmail or Bigin; or any other write to a CRM, accounting or messaging tool. Use it BEFORE the write, every time, even for small updates, and also when a lookup or search keeps coming back empty or erroring.
---

# Safe business actions

Reading is free. Writing is not: a wrong quote, an email to the wrong lead or an
overwritten deal costs money and trust. Follow these steps before every write.

## 1. Re-fetch, don't trust memory

Data read earlier in the conversation may be stale — someone else may have
changed the lead, quote or schedule since.

- Immediately before the write, fetch the record again from the live source.
- Compare it with what you based your decision on (stage, amount, owner, email,
  dates, last modified time).
- If anything relevant changed, stop, tell the user what changed, and re-decide.

## 2. Show your evidence

Before writing, you must have every required fact from a real source — a tool
result in this conversation or the user's own words. Never from inference.

State it briefly, like this:

| Fact | Value | Source | Fetched |
|---|---|---|---|
| Customer | Tan Ah Kow (lead 4821) | Bigin getRecords | just now |
| Current stage | Site visit done | Bigin getRecords | just now |
| Price basis | 12 × Flexi 60×120 @ $X | Zoho Books item list | just now |

Required facts by action:

- **Quote / estimate:** customer record ID, contact email, items and quantities,
  price source (Zoho Books item or the user), any discount the user approved.
- **Invoice / mark as sent / void:** the linked estimate or job, amount, customer ID.
- **Customer email:** recipient address taken from the CRM record (never typed
  from memory), the thread or record it relates to, the final text.
- **CRM update:** record ID, the current value of every field you are changing,
  and why it should change.

If any fact is missing or only guessed, **ask the user. Do not write.**

## 3. Get approval when it matters

- **Always ask first:** anything a customer will see (emails, quotes, invoices
  sent), anything involving money (prices, discounts, voids, payments), deletes,
  and bulk changes (more than 3 records).
- **Fine without asking:** internal notes, tags and tasks on a record the user
  just pointed you at.
- When asking, show the exact change: record, field, old value → new value, or
  the full email text and recipient.

## 4. Write once

- Make the write a single call. Never "try again" on a write that may have
  worked: a timeout does not mean it failed.
- If the result is unclear, re-fetch the record to see whether it took effect
  before doing anything else.
- Only retry after confirming the first attempt did not land.

## 5. Report what you did

One short line per write: what changed, on which record, and the record link or
ID — so it can be checked or undone.

## Stopping rules (when tools fail)

- **3 empty or useless results in a row from the same source** → stop that path.
  Tell the user what you searched for. Do not guess or fill the gap.
- **2 identical errors in a row** → stop and report the error, or switch to a
  clearly different method.
- **Never invent** a customer, price, date or record ID to keep going.

Saying "I couldn't find it" is always better than a confident wrong answer.
