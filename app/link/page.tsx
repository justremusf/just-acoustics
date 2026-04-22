import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Just Acoustics — Link in Bio',
  description: 'Acoustic panels, echo control, and sound treatment across Singapore.',
}

const links = [
  {
    href: 'https://justacoustics.co',
    label: 'Visit our website',
    sub: 'justacoustics.co',
    color: '#FF6B00',
    bg: 'rgba(255,107,0,0.13)',
    border: 'rgba(255,107,0,0.25)',
    delay: '0.1s',
    floatDelay: '0s',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    href: 'https://justacoustics.co/products',
    label: 'See our projects',
    sub: 'Completed installations',
    color: '#6C5CE7',
    bg: 'rgba(108,92,231,0.13)',
    border: 'rgba(108,92,231,0.25)',
    delay: '0.2s',
    floatDelay: '0.8s',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    href: 'https://justacoustics.co/#faq',
    label: 'Frequently asked questions',
    sub: 'Quick acoustic answers',
    color: '#00B09B',
    bg: 'rgba(0,176,155,0.13)',
    border: 'rgba(0,176,155,0.25)',
    delay: '0.3s',
    floatDelay: '1.6s',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <circle cx="12" cy="17" r="0.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    href: 'https://wa.me/6589301905',
    label: 'WhatsApp us',
    sub: '+65 8930 1905',
    color: '#25D366',
    bg: 'rgba(37,211,102,0.13)',
    border: 'rgba(37,211,102,0.25)',
    delay: '0.4s',
    floatDelay: '2.4s',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    href: 'tel:+6598877797',
    label: 'Call us',
    sub: '+65 9887 7797',
    color: '#E84393',
    bg: 'rgba(232,67,147,0.13)',
    border: 'rgba(232,67,147,0.25)',
    delay: '0.5s',
    floatDelay: '3.2s',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      </svg>
    ),
  },
]

export default function LinkInBioPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

        .lib-page {
          min-height: 100dvh;
          font-family: 'Manrope', sans-serif;
          background: #FFF3E8;
          overflow-x: hidden;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        /* ── Animated mesh background (more movement) ── */
        .lib-bg {
          position: fixed;
          inset: -30%;
          width: 160%;
          height: 160%;
          z-index: 0;
          background:
            radial-gradient(ellipse 60% 50% at 20% 20%, #FFD580, transparent),
            radial-gradient(ellipse 55% 45% at 80% 15%, #FFBF94, transparent),
            radial-gradient(ellipse 50% 55% at 65% 85%, #FF9A6C, transparent),
            radial-gradient(ellipse 60% 40% at 10% 75%, #FFE0B2, transparent),
            radial-gradient(ellipse 40% 40% at 50% 50%, #FFD0A0, transparent),
            #FFF3E8;
          animation: mesh-drift 8s ease-in-out infinite alternate;
        }
        @keyframes mesh-drift {
          0%   { transform: translate(0%, 0%) rotate(0deg) scale(1); }
          20%  { transform: translate(4%, 5%) rotate(2deg) scale(1.05); }
          40%  { transform: translate(-5%, 3%) rotate(-1.5deg) scale(1.08); }
          60%  { transform: translate(6%, -4%) rotate(2.5deg) scale(1.04); }
          80%  { transform: translate(-3%, -6%) rotate(-2deg) scale(1.07); }
          100% { transform: translate(2%, 4%) rotate(1.5deg) scale(1.03); }
        }

        /* Rotating conic shimmer */
        .lib-bg-shimmer {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: conic-gradient(
            from 0deg at 50% 50%,
            rgba(255,165,0,0.09) 0deg,
            transparent 60deg,
            rgba(255,200,100,0.07) 120deg,
            transparent 180deg,
            rgba(255,130,50,0.08) 240deg,
            transparent 300deg,
            rgba(255,165,0,0.09) 360deg
          );
          animation: shimmer-spin 16s linear infinite;
        }
        @keyframes shimmer-spin {
          from { transform: rotate(0deg) scale(2.2); }
          to   { transform: rotate(360deg) scale(2.2); }
        }

        /* Dot texture */
        .lib-bg-dots {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.03;
          background-image: radial-gradient(circle, #7a4000 1px, transparent 1px);
          background-size: 22px 22px;
        }

        /* ── Content ── */
        .lib-inner {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          padding: 52px 20px 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ── Logo ── */
        .lib-logo {
          width: 154px;
          height: auto;
          margin-bottom: 28px;
          filter: brightness(0) saturate(100%) invert(22%) sepia(80%) saturate(600%) hue-rotate(10deg) brightness(80%);
          animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }

        /* ── Headline ── */
        .lib-headline {
          font-family: 'Instrument Sans', sans-serif;
          font-size: clamp(28px, 7vw, 36px);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -1.2px;
          color: #010101;
          text-align: center;
          margin: 0 0 14px;
          max-width: 320px;
          animation: fade-up 0.8s 0.05s cubic-bezier(0.16,1,0.3,1) both;
        }
        .lib-headline span { color: #FF6B00; }

        /* ── Subtext ── */
        .lib-subtext {
          text-align: center;
          margin: 0 0 34px;
          animation: fade-up 0.8s 0.1s cubic-bezier(0.16,1,0.3,1) both;
        }
        .lib-subtext p {
          margin: 0;
          font-size: 13px;
          font-weight: 500;
          color: rgba(1,1,1,0.48);
          line-height: 1.7;
          letter-spacing: 0.01em;
        }
        .lib-subtext p:first-child {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(1,1,1,0.35);
          margin-bottom: 2px;
        }

        /* ── Links stack ── */
        .lib-links {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 40px;
        }

        /* ── Link card ── */
        .lib-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 20px;
          background: rgba(255,255,255,0.26);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255,255,255,0.58);
          border-top-color: rgba(255,255,255,0.78);
          box-shadow: 0 6px 24px rgba(120,60,0,0.09), 0 1px 0 rgba(255,255,255,0.72) inset;
          text-decoration: none;
          color: #010101;
          opacity: 0;
          animation: fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1),
                      box-shadow 0.35s ease,
                      background 0.3s ease;
        }
        .lib-link:hover {
          transform: translateY(-3px);
          background: rgba(255,255,255,0.40);
          box-shadow: 0 10px 32px rgba(120,60,0,0.13), 0 1px 0 rgba(255,255,255,0.72) inset;
        }

        /* ── Icon bubble ── */
        .lib-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: float 5s ease-in-out infinite;
          transition: transform 0.3s ease;
        }
        .lib-link:hover .lib-icon {
          transform: scale(1.06) translateY(-1px);
        }

        /* ── Link text ── */
        .lib-link-text { flex: 1; min-width: 0; }
        .lib-link-label {
          font-size: 15.5px;
          font-weight: 700;
          color: #010101;
          line-height: 1.2;
          letter-spacing: -0.2px;
        }
        .lib-link-sub {
          font-size: 12px;
          font-weight: 500;
          color: #6a6a6a;
          margin-top: 2px;
        }

        /* ── Arrow ── */
        .lib-arrow {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: rgba(255,255,255,0.54);
          border: 1px solid rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.28s ease, background 0.28s ease, border-color 0.28s ease;
          color: #8a8a8a;
        }
        .lib-arrow svg { transition: transform 0.28s ease, color 0.28s ease; }
        .lib-link:hover .lib-arrow {
          background: rgba(255,107,0,0.10);
          border-color: rgba(255,107,0,0.22);
          color: #FF6B00;
        }
        .lib-link:hover .lib-arrow svg { transform: translateX(3px); }

        /* ── Footer ── */
        .lib-footer {
          text-align: center;
          opacity: 0;
          animation: fade-up 0.6s 0.65s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .lib-footer p {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: rgba(1,1,1,0.32);
          margin: 0;
        }
        .lib-footer a {
          color: rgba(1,1,1,0.32);
          text-decoration: none;
          transition: color 0.2s;
        }
        .lib-footer a:hover { color: #FF6B00; }

        /* ── Keyframes ── */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-3px); }
        }
      `}</style>

      <div className="lib-page">
        <div className="lib-bg" />
        <div className="lib-bg-shimmer" />
        <div className="lib-bg-dots" />

        <div className="lib-inner">
          <Image
            src="/assets/webflow/69635d202eb00a587d5f2386_Just%20Acoustics%201600x900%20(1).svg"
            alt="Just Acoustics"
            width={154}
            height={42}
            className="lib-logo"
            priority
          />

          <h1 className="lib-headline">
            Reduce Echo.<br />
            <span>Make Your Space</span><br />
            Easier To Hear.
          </h1>

          <div className="lib-subtext">
            <p>For spaces like...</p>
            <p>Churches, offices, studios, restaurants, and more.</p>
          </div>

          <div className="lib-links">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="lib-link"
                style={{ animationDelay: link.delay }}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <div
                  className="lib-icon"
                  style={{
                    background: link.bg,
                    border: `1.5px solid ${link.border}`,
                    color: link.color,
                    animationDelay: link.floatDelay,
                  }}
                >
                  {link.icon}
                </div>

                <div className="lib-link-text">
                  <div className="lib-link-label">{link.label}</div>
                  <div className="lib-link-sub">{link.sub}</div>
                </div>

                <div className="lib-arrow">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>

          <div className="lib-footer">
            <p>© Just Acoustics Singapore &nbsp;·&nbsp; <a href="https://justacoustics.co/privacy-policy">Privacy Policy</a></p>
          </div>
        </div>
      </div>
    </>
  )
}
