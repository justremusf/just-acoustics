'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const proposal = '/proposals/rise-bakehouse/'
const whatsapp = 'https://wa.me/6589301905?text=Hi%20Just%20Acoustics%2C%20I%20would%20like%20to%20proceed%20with%20the%20Rise%20Bakehouse%20acoustic%20proposal%20(QT-000329).'

export default function RiseBakehouseProposal() {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <main className="rb-page">
      <style>{`
        .rb-page{--ink:#13202a;--navy:#163a53;--orange:#ef8d42;--cream:#fff8ef;--line:rgba(19,32,42,.13);min-height:100dvh;background:var(--cream);color:var(--ink);font-family:var(--font-body);padding-bottom:86px}.rb-page *{box-sizing:border-box}.rb-wrap{max-width:1180px;margin:0 auto;padding:0 20px}.rb-top{position:sticky;top:0;z-index:20;background:rgba(255,248,239,.9);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}.rb-topin{height:64px;display:flex;align-items:center;justify-content:space-between;gap:16px}.rb-brand{font-family:var(--font-heading);font-weight:800;font-size:17px;letter-spacing:-.8px;text-decoration:none;color:var(--ink)}.rb-brand b{color:var(--orange)}.rb-status{font-size:12px;font-weight:800;color:#315b47;display:flex;gap:7px;align-items:center}.rb-status:before{content:'';width:8px;height:8px;border-radius:50%;background:#54a578}.rb-hero{padding:46px 0 28px;background:radial-gradient(circle at 78% 14%,rgba(239,141,66,.25),transparent 30%),linear-gradient(135deg,#fff8ef,#f9ead9)}.rb-kicker{font-size:11px;letter-spacing:.13em;font-weight:800;text-transform:uppercase;color:#865a37}.rb-hero-grid{display:grid;grid-template-columns:1.08fr .92fr;gap:40px;align-items:end}.rb-h1{font-family:var(--font-heading);letter-spacing:-.065em;line-height:.94;font-size:clamp(43px,7vw,76px);margin:13px 0 20px;max-width:720px}.rb-lead{font-size:18px;line-height:1.55;color:#44515b;max-width:620px;margin:0}.rb-hero-card{background:var(--navy);color:white;border-radius:22px;padding:25px;box-shadow:0 26px 55px rgba(30,57,74,.2)}.rb-card-label{font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:800;color:#f6bb8a}.rb-price{font-family:var(--font-heading);font-size:46px;line-height:1;margin:7px 0 10px;letter-spacing:-.06em}.rb-hero-card p{margin:0;color:#dbe8ed;font-size:14px;line-height:1.55}.rb-cta{display:inline-flex;align-items:center;justify-content:center;gap:10px;background:var(--orange);color:#1d282c;text-decoration:none;border:0;border-radius:999px;font-weight:900;padding:16px 22px;font-size:14px;transition:.2s;cursor:pointer}.rb-cta:hover{transform:translateY(-2px);box-shadow:0 10px 20px rgba(239,141,66,.32)}.rb-cta-dark{background:var(--ink);color:white}.rb-hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:27px}.rb-text-link{display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:999px;padding:15px 19px;text-decoration:none;color:var(--ink);font-size:14px;font-weight:800;background:#fff}.rb-trust{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line);margin-top:34px}.rb-trust div{padding:18px 12px 0 0}.rb-trust div+div{padding-left:18px;border-left:1px solid var(--line)}.rb-trust strong{font-family:var(--font-heading);font-size:22px;letter-spacing:-.04em;display:block}.rb-trust span{font-size:12px;color:#64717a}.rb-section{padding:74px 0}.rb-section.alt{background:#f2e5d3}.rb-eyebrow{font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#a55d26}.rb-h2{font-family:var(--font-heading);font-size:clamp(32px,4.5vw,51px);letter-spacing:-.06em;line-height:1;margin:8px 0 16px;max-width:760px}.rb-body{font-size:16px;line-height:1.65;color:#4c5a63;max-width:680px;margin:0}.rb-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:34px}.rb-visual{border-radius:22px;overflow:hidden;border:1px solid rgba(19,32,42,.11);background:white}.rb-visual img{width:100%;height:auto;display:block}.rb-caption{padding:16px 17px;color:#56646c;font-size:13px;line-height:1.45}.rb-caption strong{display:block;color:var(--ink);font-size:15px;margin-bottom:3px}.rb-outcome{margin-top:32px;display:grid;grid-template-columns:1.05fr .95fr;gap:25px;align-items:stretch}.rb-metrics{background:var(--navy);padding:28px;border-radius:24px;color:white;display:grid;grid-template-columns:1fr 1fr;gap:20px}.rb-metric{border-top:1px solid rgba(255,255,255,.24);padding-top:15px}.rb-metric strong{font-family:var(--font-heading);font-size:40px;letter-spacing:-.06em;display:block;color:#f7b87e}.rb-metric span{font-size:13px;color:#dae5e9;line-height:1.35;display:block}.rb-details{background:white;border:1px solid var(--line);border-radius:24px;padding:29px}.rb-details h3{font-family:var(--font-heading);font-size:26px;letter-spacing:-.04em;margin:0 0 12px}.rb-details ul{list-style:none;padding:0;margin:18px 0 0;display:grid;gap:11px}.rb-details li{font-size:14px;line-height:1.4;padding-left:22px;position:relative}.rb-details li:before{content:'✓';position:absolute;left:0;color:#cd6e2e;font-weight:900}.rb-watch{margin-top:28px;width:100%;position:relative;overflow:hidden;border:0;border-radius:24px;background:#47677b;color:white;text-align:left;cursor:pointer;padding:0}.rb-watch img{height:285px;width:100%;object-fit:cover;opacity:.68;display:block}.rb-watch:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(13,37,52,.78),rgba(13,37,52,.14))}.rb-watch-content{position:absolute;z-index:2;inset:0;padding:28px;display:flex;flex-direction:column;justify-content:end}.rb-play{width:54px;height:54px;border-radius:50%;background:var(--orange);display:grid;place-items:center;color:#14212a;font-size:18px;margin-bottom:auto}.rb-watch h3{font-family:var(--font-heading);font-size:32px;letter-spacing:-.05em;margin:0}.rb-watch p{font-size:14px;margin:6px 0 0;color:#f0f5f5}.rb-quote{margin-top:28px;border-radius:24px;background:#fff;padding:30px;border:1px solid var(--line)}.rb-quote-grid{display:grid;grid-template-columns:1fr auto;gap:22px;align-items:end}.rb-quote h3{font-family:var(--font-heading);font-size:30px;letter-spacing:-.05em;margin:0 0 6px}.rb-quote p{margin:0;color:#58656d;font-size:14px;line-height:1.55}.rb-total{text-align:right}.rb-total span{font-size:11px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#6a767d}.rb-total strong{display:block;font-family:var(--font-heading);font-size:38px;letter-spacing:-.06em;line-height:1.1}.rb-accordion{margin-top:14px;border-top:1px solid var(--line)}.rb-accordion button{width:100%;border:0;background:transparent;display:flex;justify-content:space-between;gap:20px;padding:16px 0;color:var(--ink);font-size:14px;font-weight:900;cursor:pointer;text-align:left}.rb-accordion p{display:none;margin:0 0 17px;font-size:13px;line-height:1.6;color:#59666e}.rb-accordion.open p{display:block}.rb-docs{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}.rb-doc{font-size:13px;font-weight:800;text-decoration:none;color:var(--ink);padding:10px 13px;border:1px solid var(--line);border-radius:12px;background:white}.rb-final{padding:75px 0;background:#132b3a;color:white;text-align:center}.rb-final h2{font-family:var(--font-heading);font-size:clamp(39px,6vw,65px);letter-spacing:-.07em;line-height:.96;margin:13px auto 15px;max-width:780px}.rb-final p{margin:0 auto 26px;max-width:580px;color:#cbd8dc;line-height:1.6}.rb-final .rb-cta{min-width:230px}.rb-foot{padding:20px 0 0;color:#9cb0b9;font-size:11px}.rb-sticky{display:none}.rb-modal{position:fixed;inset:0;background:rgba(10,19,25,.75);z-index:60;padding:18px;display:grid;place-items:center}.rb-modal-inner{width:min(100%,940px);background:#0e1e29;border-radius:20px;overflow:hidden;position:relative}.rb-modal video{width:100%;max-height:78vh;display:block}.rb-close{position:absolute;z-index:2;right:12px;top:12px;background:#fff;border:0;border-radius:50%;width:38px;height:38px;cursor:pointer;font-size:20px}@media(max-width:760px){.rb-wrap{padding:0 17px}.rb-topin{height:56px}.rb-status{font-size:10px}.rb-hero{padding:32px 0 20px}.rb-hero-grid,.rb-outcome{grid-template-columns:1fr;gap:25px}.rb-h1{font-size:48px}.rb-lead{font-size:16px}.rb-hero-card{padding:21px}.rb-trust{margin-top:26px}.rb-trust strong{font-size:18px}.rb-trust span{font-size:10px}.rb-section{padding:51px 0}.rb-grid-2{grid-template-columns:1fr;gap:14px;margin-top:26px}.rb-metrics{padding:22px}.rb-metric strong{font-size:35px}.rb-watch img{height:260px}.rb-quote{padding:23px}.rb-quote-grid{grid-template-columns:1fr;gap:13px}.rb-total{text-align:left}.rb-final{padding:60px 0 76px}.rb-sticky{position:fixed;z-index:50;display:flex;left:10px;right:10px;bottom:10px;gap:10px;padding:10px;background:rgba(255,255,255,.92);backdrop-filter:blur(16px);border:1px solid rgba(19,32,42,.12);border-radius:17px;box-shadow:0 12px 32px rgba(10,25,34,.18)}.rb-sticky .rb-cta{flex:1;padding:13px 10px;font-size:13px}.rb-sticky .rb-text-link{padding:13px 14px;font-size:13px}.rb-page{padding-bottom:100px}}
      `}</style>

      <header className="rb-top">
        <div className="rb-wrap rb-topin">
          <Link className="rb-brand" href="/">Just <b>Acoustics</b></Link>
          <span className="rb-status">Private proposal for Rise Bakehouse</span>
        </div>
      </header>

      <section className="rb-hero">
        <div className="rb-wrap rb-hero-grid">
          <div>
            <div className="rb-kicker">Acoustic treatment proposal · Chinatown</div>
            <h1 className="rb-h1">A calmer, clearer Rise Bakehouse.</h1>
            <p className="rb-lead">A ceiling treatment plan designed to reduce disruptive echo while preserving the warmth and character of your space.</p>
            <div className="rb-hero-actions">
              <a className="rb-cta" href="#accept">Review & accept proposal <span>→</span></a>
              <button className="rb-text-link" onClick={() => setVideoOpen(true)}>Watch the 43-sec walkthrough</button>
            </div>
            <div className="rb-trust">
              <div><strong>23</strong><span>Flexi ceiling panels</span></div>
              <div><strong>60%</strong><span>Target echo reduction</span></div>
              <div><strong>4 weeks</strong><span>Lead time after deposit</span></div>
            </div>
          </div>
          <aside className="rb-hero-card">
            <div className="rb-card-label">Your approved scope</div>
            <div className="rb-price">S$6,185</div>
            <p>Supply and installation of suspended Flexi acoustic ceiling panels, including a high-ceiling access allowance.</p>
            <a href="#quote" className="rb-cta" style={{ marginTop: 20 }}>See the investment</a>
          </aside>
        </div>
      </section>

      <section className="rb-section">
        <div className="rb-wrap">
          <div className="rb-eyebrow">01 · The plan</div>
          <h2 className="rb-h2">Every panel has a job to do.</h2>
          <p className="rb-body">The proposed ceiling layout concentrates absorption across the main dining area, where hard surfaces and a high ceiling allow conversations to build into echo.</p>
          <div className="rb-grid-2">
            <figure className="rb-visual"><Image src={`${proposal}layout.jpg`} alt="Rise Bakehouse ceiling acoustic panel layout" width={1800} height={2880} /><figcaption className="rb-caption"><strong>Ceiling layout plan</strong>23 Flexi panels positioned around lighting, air-conditioning and skylight constraints.</figcaption></figure>
            <figure className="rb-visual"><Image src={`${proposal}model-overview.jpg`} alt="Three-dimensional overview of Rise Bakehouse ceiling treatment" width={1800} height={1200} /><figcaption className="rb-caption"><strong>Measured 3D overview</strong>A client-friendly view of the treatment in context, before anything is installed.</figcaption></figure>
          </div>
        </div>
      </section>

      <section className="rb-section alt">
        <div className="rb-wrap">
          <div className="rb-eyebrow">02 · Expected result</div>
          <h2 className="rb-h2">Less echo. Easier conversations.</h2>
          <div className="rb-outcome">
            <div className="rb-metrics">
              <div className="rb-metric"><strong>2.35s</strong><span>Current RT60 reference</span></div>
              <div className="rb-metric"><strong>1.59s</strong><span>Target RT60 after treatment</span></div>
              <div className="rb-metric"><strong>600mm</strong><span>Suspended air gap</span></div>
              <div className="rb-metric"><strong>50mm</strong><span>Flexi panel thickness</span></div>
            </div>
            <div className="rb-details">
              <h3>What this changes</h3>
              <ul><li>Less splash and echo across the dining room</li><li>Clearer speech at tables and the counter</li><li>More comfortable atmosphere at busy periods</li><li>High-performance infill with NRC 1.00 stated in the quote</li></ul>
            </div>
          </div>
          <figure className="rb-visual" style={{ marginTop: 24 }}><Image src={`${proposal}performance.jpg`} alt="Acoustic performance summary showing RT60 before and after" width={1800} height={700} /><figcaption className="rb-caption"><strong>Performance reference</strong>Target values are a design expectation based on the supplied room scope and panel layout, to be confirmed against final site conditions.</figcaption></figure>
        </div>
      </section>

      <section className="rb-section">
        <div className="rb-wrap">
          <div className="rb-eyebrow">03 · See it before we build it</div>
          <h2 className="rb-h2">Your proposal should make the decision obvious.</h2>
          <p className="rb-body">This is the format we can use for every suitable client: room plan, visual simulation, commercial scope and a direct next step in one private mobile-first page.</p>
          <button className="rb-watch" onClick={() => setVideoOpen(true)} aria-label="Play Rise Bakehouse proposal walkthrough">
            <Image src={`${proposal}model-perspective.jpg`} alt="Perspective view of acoustic ceiling panels in Rise Bakehouse" width={1800} height={1200} />
            <span className="rb-watch-content"><span className="rb-play">▶</span><h3>Walk through the solution</h3><p>43 seconds · layout, expected impact and product specification</p></span>
          </button>
        </div>
      </section>

      <section className="rb-section alt" id="quote">
        <div className="rb-wrap">
          <div className="rb-eyebrow">04 · Investment</div>
          <h2 className="rb-h2">One clear scope. No mystery line items.</h2>
          <div className="rb-quote">
            <div className="rb-quote-grid">
              <div><h3>QT-000329</h3><p>23 Flexi acoustic ceiling panels at S$245 each, supplied and installed with suspended wire ceiling kit, plus high-ceiling access allowance.</p></div>
              <div className="rb-total"><span>Total investment</span><strong>S$6,185</strong></div>
            </div>
            <div className={`rb-accordion ${detailsOpen ? 'open' : ''}`}>
              <button onClick={() => setDetailsOpen(!detailsOpen)} aria-expanded={detailsOpen}>What is included and how payment works <span>{detailsOpen ? '−' : '+'}</span></button>
              <p>Includes supply, installation, suspended wire ceiling kit and a S$550 high-ceiling surcharge for mobile scaffolding. Quote validity: 30 days. Payment terms: 50% deposit to confirm, 50% balance on completion. Standard lead time: approximately 4 weeks from deposit confirmation.</p>
            </div>
            <div className="rb-docs"><a className="rb-doc" href={`${proposal}quote-qt-000329.pdf`} target="_blank">Download quote PDF</a><a className="rb-doc" href={`${proposal}rise-bakehouse-acoustic-proposal.pdf`} target="_blank">Open full proposal PDF</a><a className="rb-doc" href={`${proposal}flexi-catalogue.pdf`} target="_blank">Flexi panel catalogue</a></div>
          </div>
        </div>
      </section>

      <section className="rb-final" id="accept">
        <div className="rb-wrap">
          <div className="rb-eyebrow" style={{ color: '#f5b178' }}>Ready when you are</div>
          <h2>Make Rise Bakehouse sound as good as it feels.</h2>
          <p>Reply on WhatsApp to confirm this scope, ask a question or arrange the final site check. We will handle the next steps from there.</p>
          <a className="rb-cta" href={whatsapp} target="_blank">Accept proposal on WhatsApp <span>→</span></a>
          <div className="rb-foot">Prepared for Rise Bakehouse · Quote QT-000329 · 30 June 2026</div>
        </div>
      </section>

      <div className="rb-sticky"><a className="rb-text-link" href="#quote">S$6,185</a><a className="rb-cta" href={whatsapp} target="_blank">Accept on WhatsApp →</a></div>

      {videoOpen && <div className="rb-modal" role="dialog" aria-modal="true" aria-label="Rise Bakehouse walkthrough"><div className="rb-modal-inner"><button className="rb-close" onClick={() => setVideoOpen(false)} aria-label="Close video">×</button><video controls autoPlay playsInline poster={`${proposal}model-perspective.jpg`}><source src={`${proposal}site-walkthrough.mp4`} type="video/mp4" /></video></div></div>}
    </main>
  )
}
