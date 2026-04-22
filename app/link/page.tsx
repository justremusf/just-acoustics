import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Link in Bio',
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
    delay: '0.15s',
    floatDelay: '0s',
    primary: false,
    badge: null,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    href: 'https://justacoustics.co/projects',
    label: 'See our projects',
    sub: 'Completed installations',
    color: '#6C5CE7',
    bg: 'rgba(108,92,231,0.13)',
    border: 'rgba(108,92,231,0.25)',
    delay: '0.25s',
    floatDelay: '0.8s',
    primary: false,
    badge: null,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    href: 'https://wa.me/6589301905',
    label: 'WhatsApp us',
    sub: 'Replies within 2 hours',
    color: '#fff',
    bg: '#25D366',
    border: '#1faf56',
    delay: '0.35s',
    floatDelay: '1.6s',
    primary: true,
    badge: null,
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
    delay: '0.45s',
    floatDelay: '2.4s',
    primary: false,
    badge: 'Mon–Sat, 9am–6pm',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
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
    delay: '0.55s',
    floatDelay: '3.2s',
    primary: false,
    badge: null,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <circle cx="12" cy="17" r="0.5" fill="currentColor"/>
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

        /* ── Animated mesh background ── */
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
          padding: 44px 20px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
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
          margin: 0 0 12px;
          max-width: 320px;
          animation: fade-up 0.8s 0.05s cubic-bezier(0.16,1,0.3,1) both;
        }
        .lib-headline span { color: #FF6B00; }

        /* ── Subtext ── */
        .lib-subtext {
          text-align: center;
          margin: 0 0 20px;
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

        /* ── Social proof bar ── */
        .lib-proof {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 0 0 20px;
          padding: 10px 18px;
          border-radius: 999px;
          background: rgba(255,255,255,0.52);
          border: 1px solid rgba(255,255,255,0.72);
          box-shadow: 0 2px 12px rgba(120,60,0,0.07), 0 1px 0 rgba(255,255,255,0.8) inset;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          animation: fade-up 0.8s 0.15s cubic-bezier(0.16,1,0.3,1) both;
        }
        .lib-proof-divider {
          width: 1px;
          height: 16px;
          background: rgba(0,0,0,0.12);
          flex-shrink: 0;
        }
        .lib-proof-item {
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }
        .lib-proof-label {
          font-size: 12px;
          font-weight: 600;
          color: #010101;
          letter-spacing: -0.1px;
        }
        /* Google G icon */
        .lib-google-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
        /* Stars */
        .lib-stars {
          display: flex;
          gap: 1px;
          align-items: center;
        }
        .lib-stars svg { flex-shrink: 0; }
        /* Projects icon */
        .lib-proof-icon {
          width: 16px;
          height: 16px;
          color: #FF6B00;
          flex-shrink: 0;
        }

        /* ── Hero image ── */
        .lib-hero {
          width: 100%;
          height: 200px;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 20px;
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 8px 32px rgba(120,60,0,0.12), 0 1px 0 rgba(255,255,255,0.72) inset;
          animation: fade-up 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) both;
          position: relative;
        }

        /* ── Links stack ── */
        .lib-links {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 36px;
        }

        /* ── Link card (standard) ── */
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

        /* ── Primary card (WhatsApp) ── */
        .lib-link-primary {
          background: #25D366;
          border-color: #1faf56;
          box-shadow: 0 8px 28px rgba(37,211,102,0.35), 0 1px 0 rgba(255,255,255,0.25) inset;
        }
        .lib-link-primary:hover {
          background: #22c45e;
          box-shadow: 0 12px 36px rgba(37,211,102,0.45), 0 1px 0 rgba(255,255,255,0.25) inset;
        }
        .lib-link-primary .lib-link-label { color: #fff; }
        .lib-link-primary .lib-link-sub { color: rgba(255,255,255,0.78); }
        .lib-link-primary .lib-arrow {
          background: rgba(255,255,255,0.22);
          border-color: rgba(255,255,255,0.3);
          color: #fff;
        }
        .lib-link-primary:hover .lib-arrow {
          background: rgba(255,255,255,0.32);
          border-color: rgba(255,255,255,0.4);
          color: #fff;
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
        .lib-link-primary .lib-icon {
          background: rgba(255,255,255,0.22) !important;
          border-color: rgba(255,255,255,0.3) !important;
          color: #fff !important;
        }
        .lib-link:hover .lib-icon {
          transform: scale(1.06) translateY(-1px);
        }

        /* ── Pulse dot on WhatsApp ── */
        .lib-pulse-wrap {
          position: relative;
        }
        .lib-pulse {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #fff;
          border: 2px solid #25D366;
          z-index: 1;
        }
        .lib-pulse::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 999px;
          background: rgba(255,255,255,0.5);
          animation: pulse-ring 1.8s ease-out infinite;
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        /* ── Badge (hours) ── */
        .lib-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 3px;
          padding: 2px 7px;
          border-radius: 999px;
          background: rgba(232,67,147,0.10);
          border: 1px solid rgba(232,67,147,0.2);
          font-size: 10.5px;
          font-weight: 600;
          color: #E84393;
          letter-spacing: 0.02em;
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
        .lib-arrow svg { transition: transform 0.28s ease; }
        .lib-link:hover .lib-arrow {
          background: rgba(255,107,0,0.10);
          border-color: rgba(255,107,0,0.22);
          color: #FF6B00;
        }
        .lib-link:hover .lib-arrow svg { transform: translateX(3px); }
        .lib-link-primary:hover .lib-arrow svg { transform: translateX(3px); }

        /* ── Footer ── */
        .lib-footer {
          text-align: center;
          opacity: 0;
          animation: fade-up 0.6s 0.7s cubic-bezier(0.16,1,0.3,1) forwards;
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
          <h1 className="lib-headline">
            Reduce Echo.<br />
            <span>Make Your Space</span><br />
            Easier To Hear.
          </h1>

          <div className="lib-subtext">
            <p>For spaces like...</p>
            <p>Churches, offices, studios, restaurants, and more.</p>
          </div>

          {/* Social proof */}
          <div className="lib-proof">
            <div className="lib-proof-item">
              {/* Google G */}
              <svg className="lib-google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div className="lib-stars">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#FBBC05">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <span className="lib-proof-label">4.9</span>
            </div>
            <div className="lib-proof-divider" />
            <div className="lib-proof-item">
              <svg className="lib-proof-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span className="lib-proof-label">100+ projects</span>
            </div>
          </div>

          {/* Hero image */}
          <div className="lib-hero">
            <Image
              src="/assets/webflow/6963a1ddcb30aae76c452853_Image%20from%20TinyPNG.webp"
              alt="Acoustic panel installation by Just Acoustics Singapore"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority
            />
          </div>

          <div className="lib-links">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`lib-link${link.primary ? ' lib-link-primary' : ''}`}
                style={{ animationDelay: link.delay }}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <div className={link.primary ? 'lib-pulse-wrap' : undefined}>
                  <div
                    className="lib-icon"
                    style={link.primary ? {
                      animationDelay: link.floatDelay,
                    } : {
                      background: link.bg,
                      border: `1.5px solid ${link.border}`,
                      color: link.color,
                      animationDelay: link.floatDelay,
                    }}
                  >
                    {link.icon}
                  </div>
                  {link.primary && <div className="lib-pulse" />}
                </div>

                <div className="lib-link-text">
                  <div className="lib-link-label">{link.label}</div>
                  <div className="lib-link-sub">{link.sub}</div>
                  {link.badge && (
                    <div className="lib-badge">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {link.badge}
                    </div>
                  )}
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
