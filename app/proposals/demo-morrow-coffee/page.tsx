import type { Metadata } from "next";
import Image from "next/image";
import {
  CircleCheck,
  Download,
  Factory,
  FileText,
  Gauge,
  Hammer,
  Palette,
  PanelsTopLeft,
  PlayCircle,
  ScanLine,
  Timer,
  Volume2,
} from "lucide-react";
import ProposalFaq from "./ProposalFaq";
import "./proposal.css";

export const metadata: Metadata = {
  title: "Demo Proposal - Morrow Coffee Roastery",
  description: "A fictional Just Acoustics proposal workflow demonstration.",
  robots: { index: false, follow: false },
};

const asset = "/proposals/demo-morrow-coffee/";

const metrics = [
  { value: "18", label: "ceiling panels", icon: PanelsTopLeft },
  { value: "1.90 s", label: "RT60 before", icon: Timer },
  { value: "1.10 s", label: "RT60 target", icon: Gauge },
  { value: "~42%", label: "less reverberation", icon: Volume2 },
];

const steps = [
  {
    number: "01",
    title: "Final site check",
    body: "Verify dimensions, ceiling services, access and the final panel layout.",
    icon: ScanLine,
  },
  {
    number: "02",
    title: "Select colours",
    body: "Confirm the Flexi fabric colour and visual finish for the space.",
    icon: Palette,
  },
  {
    number: "03",
    title: "Production",
    body: "Approximately 4 weeks after deposit and final approvals.",
    icon: Factory,
  },
  {
    number: "04",
    title: "Installation",
    body: "Allow approximately 1 working day for this mock scope.",
    icon: Hammer,
  },
  {
    number: "05",
    title: "Handover",
    body: "Final inspection, care guidance and before/after documentation.",
    icon: CircleCheck,
  },
];

const faqs = [
  [
    "Will the panels block the lights or air-conditioning?",
    "No. The final site check confirms clearances around lighting, air-conditioning, sprinklers and other ceiling services before production.",
  ],
  [
    "Will the café need to close?",
    "For this mock scope, installation is planned for one working day. After-hours work can be quoted if normal operating hours must be protected.",
  ],
  [
    "Is the 42% reduction guaranteed?",
    "No. It is a design target derived from the mock RT60 figures. Real proposals label results as measured, calculated, manufacturer supplied or estimated.",
  ],
  [
    "Can I share only the quote or 3D proposal?",
    "Yes. The 3D render, walkthrough video and quote can each be downloaded separately for other stakeholders.",
  ],
] as const;

export default function MorrowCoffeeDemoProposal() {
  return (
    <main className="mc-page">
      <header className="mc-wrap mc-top">
        <Image
          className="mc-logo"
          src="/assets/webflow/69635d202eb00a587d5f2386_Just%20Acoustics%201600x900%20(1).svg"
          alt="Just Acoustics"
          width={180}
          height={40}
          priority
        />
        <div className="mc-demo">Fictional demo</div>
      </header>

      <section className="mc-wrap mc-hero">
        <div className="mc-render">
          <Image
            src={`${asset}3d-render.jpg`}
            alt="Restaurant acoustic ceiling treatment 3D render used for the mock proposal"
            fill
            priority
            sizes="(max-width: 1400px) 100vw, 1360px"
          />
          <div className="mc-render-copy">
            <div className="mc-kicker">
              Private acoustic proposal · Morrow Coffee
            </div>
            <h1 className="mc-h1">This is how the calmer café could look.</h1>
            <p className="mc-lead">
              18 suspended Flexi ceiling panels designed to reduce reverberation
              across the main seating zone while working around the existing
              lighting and services.
            </p>
            <div className="mc-actions">
              <a className="mc-btn" href="#walkthrough">
                <PlayCircle aria-hidden="true" />
                Watch Remus explain it
              </a>
              <a className="mc-btn alt" href={`${asset}3d-render.jpg`} download>
                <Download aria-hidden="true" />
                Download 3D render
              </a>
            </div>
            <div className="mc-small">
              Mock proposal · Restaurant reference assets used for demonstration
              only
            </div>
          </div>
        </div>
      </section>

      <section className="mc-wrap mc-section" id="walkthrough">
        <div className="mc-eyebrow">01 · Personal walkthrough</div>
        <h2 className="mc-h2">The proposal, explained by a person.</h2>
        <div className="mc-video-grid">
          <video
            className="mc-video"
            controls
            playsInline
            preload="metadata"
            poster={`${asset}3d-render.jpg`}
          >
            <source src={`${asset}walkthrough.mp4`} type="video/mp4" />
          </video>
          <div className="mc-video-copy">
            <div>
              <div className="mc-kicker">Short client video</div>
              <h3>What we are proposing and why.</h3>
              <p>
                Remus walks through the room, panel locations, expected result
                and practical considerations. The client does not need to
                interpret a technical drawing alone.
              </p>
            </div>
            <a className="mc-btn" href={`${asset}walkthrough.mp4`} download>
              <Download aria-hidden="true" />
              Download walkthrough video
            </a>
          </div>
        </div>
      </section>

      <section className="mc-section white">
        <div className="mc-wrap">
          <div className="mc-eyebrow">02 · Expected results</div>
          <h2 className="mc-h2">
            The important figures, understood in seconds.
          </h2>
          <div className="mc-metrics">
            {metrics.map(({ value, label, icon: Icon }) => (
              <div className="mc-metric" key={label}>
                <Icon className="mc-metric-icon" aria-hidden="true" />
                <div>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mc-benefit">
            <strong>What the client actually gets</strong>
            <span>
              Less noise build-up, easier conversations and a calmer customer
              experience during busy periods. For an office proposal, this line
              would instead focus on clearer Zoom meetings and better speech
              privacy.
            </span>
          </div>
        </div>
      </section>

      <section className="mc-wrap mc-section">
        <div className="mc-eyebrow">03 · Relevant before and after</div>
        <h2 className="mc-h2">Proof that matches the same type of space.</h2>
        <div className="mc-compare">
          <div className="mc-proof">
            <Image
              src={`${asset}before-reference.jpg`}
              alt="Restaurant before reference for mock acoustic proposal"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="mc-proof-copy">
              <b>Before reference</b>
              <h3>Hard surfaces and sound build-up</h3>
              <p>
                In a real proposal, this would be the client&apos;s own room or
                the closest restaurant case study.
              </p>
            </div>
          </div>
          <div className="mc-proof">
            <Image
              src={`${asset}after-reference.jpg`}
              alt="Restaurant after concept for mock acoustic proposal"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="mc-proof-copy">
              <b>After concept</b>
              <h3>Absorption across the occupied zone</h3>
              <p>
                The selected proof would come from the matching restaurant
                before/after library.
              </p>
            </div>
          </div>
        </div>
        <p className="mc-proof-note">
          Demo note: these are restaurant-category reference assets. The
          production workflow will select only matching space-type case studies,
          product photos and before/after media from your approved libraries.
        </p>
      </section>

      <section className="mc-section white">
        <div className="mc-wrap">
          <div className="mc-eyebrow">04 · Proposed treatment</div>
          <h2 className="mc-h2">
            A layout and product the client can picture.
          </h2>
          <div className="mc-plan-grid">
            <div className="mc-plan">
              <h3>Mock ceiling layout</h3>
              <p>
                Six rows of three panels across the main seating area. Your
                exported 3D views replace the diagram once available.
              </p>
              <div
                className="mc-ceiling"
                aria-label="Eighteen-panel ceiling layout"
              >
                {Array.from({ length: 18 }).map((_, index) => (
                  <span className="mc-panel" key={index} />
                ))}
              </div>
            </div>
            <div className="mc-product">
              <Image
                src="/assets/shop/standard-flexi/standard-flexi-1200x600.webp"
                alt="Flexi acoustic panel product reference"
                fill
                sizes="(max-width: 840px) 100vw, 44vw"
              />
              <div className="mc-product-copy">
                <h3>Flexi acoustic ceiling panel</h3>
                <p>
                  1200 x 600 x 50 mm · Final colour selected before production
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mc-wrap mc-section">
        <div className="mc-eyebrow">05 · What happens next</div>
        <h2 className="mc-h2">Five simple steps from approval to handover.</h2>
        <div className="mc-steps">
          {steps.map(({ number, title, body, icon: Icon }) => (
            <div className="mc-step" key={number}>
              <div className="mc-step-top">
                <Icon aria-hidden="true" />
                <b>{number}</b>
              </div>
              <strong>{title}</strong>
              <span>{body}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mc-section white">
        <div className="mc-wrap">
          <div className="mc-eyebrow">06 · Questions answered</div>
          <h2 className="mc-h2">Clear the final doubts before the decision.</h2>
          <ProposalFaq items={faqs} />
        </div>
      </section>

      <section className="mc-wrap mc-section">
        <div className="mc-eyebrow">07 · Investment</div>
        <h2 className="mc-h2">
          The commercial decision, with the source document attached.
        </h2>
        <div className="mc-investment">
          <div className="mc-quote">
            <h3>MOCK-QT-000401</h3>
            <p>
              The proposal page summarises the decision. The embedded PDF
              remains available for finance, procurement or other stakeholders.
            </p>
            <div className="mc-line">
              <span>18 Flexi panels + installation</span>
              <b>S$4,410</b>
            </div>
            <div className="mc-line">
              <span>High-ceiling access</span>
              <b>S$450</b>
            </div>
            <div className="mc-line">
              <span>Delivery</span>
              <b>S$180</b>
            </div>
            <div className="mc-total">
              <span>Total including mock GST</span>
              <strong>S$5,493.60</strong>
            </div>
            <div className="mc-downloads">
              <a className="mc-btn" href={`${asset}mock-quote.pdf`} download>
                <FileText aria-hidden="true" />
                Download quote PDF
              </a>
              <a className="mc-btn alt" href={`${asset}3d-render.jpg`} download>
                <Download aria-hidden="true" />
                Download 3D
              </a>
              <a
                className="mc-btn alt"
                href={`${asset}walkthrough.mp4`}
                download
              >
                <Download aria-hidden="true" />
                Download video
              </a>
            </div>
          </div>
          <div className="mc-pdf">
            <iframe
              title="Mock acoustic treatment quote"
              src={`${asset}mock-quote.pdf#toolbar=0&navpanes=0`}
            />
          </div>
        </div>
      </section>

      <footer className="mc-note">
        Fictional demonstration only · No quote has been issued or sent
      </footer>
    </main>
  );
}
