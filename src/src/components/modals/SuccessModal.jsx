import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useDispatch } from "react-redux";
import { Check, Zap } from "lucide-react";

const Z = {
  gold:       "#F5C518",
  goldGlow:   "rgba(245,197,24,0.15)",
  goldBorder: "rgba(245,197,24,0.28)",
  navy:       "#1A3A6B",
  teal:       "#4ECDC4",
  tealGlow:   "rgba(78,205,196,0.12)",
  tealBorder: "rgba(78,205,196,0.25)",
  surface:    "#0D1423",
  surface2:   "#111B2E",
  line:       "rgba(255,255,255,0.07)",
  muted:      "#4B5A72",
};

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Exo+2:wght@400;500;600&display=swap');
    .zyn-success * { box-sizing: border-box; font-family: 'Exo 2', sans-serif; }

    .zyn-success-panel {
      animation: successIn 0.3s ease both;
    }
    @keyframes successIn {
      from { opacity: 0; transform: scale(0.93) translateY(12px); }
      to   { opacity: 1; transform: scale(1)    translateY(0);    }
    }

    .zyn-check-ring {
      animation: ringPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.15s both;
    }
    @keyframes ringPop {
      from { transform: scale(0.4); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }

    .zyn-check-icon {
      animation: checkDraw 0.35s ease 0.35s both;
    }
    @keyframes checkDraw {
      from { opacity: 0; transform: scale(0.5) rotate(-15deg); }
      to   { opacity: 1; transform: scale(1)   rotate(0deg);   }
    }

    .zyn-close-btn {
      position: relative; overflow: hidden;
      transition: all 0.25s ease;
      font-family: 'Rajdhani', sans-serif;
      letter-spacing: 0.06em;
    }
    .zyn-close-btn::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
      transform: translateX(-100%);
      transition: transform 0.5s ease;
    }
    .zyn-close-btn:hover::after { transform: translateX(100%); }
    .zyn-close-btn:hover { box-shadow: 0 0 24px ${Z.goldGlow}; }
    .zyn-close-btn:active { transform: scale(0.97); }

    /* Ripple circles behind check */
    .zyn-ripple {
      position: absolute; border-radius: 50%;
      animation: ripple 2s ease-out infinite;
    }
    .zyn-ripple:nth-child(2) { animation-delay: 0.6s; }
    @keyframes ripple {
      0%   { transform: scale(1);   opacity: 0.35; }
      100% { transform: scale(2.2); opacity: 0;    }
    }
  `}</style>
);

export default function SuccessModal({ open, setOpen, message, reset }) {
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    dispatch(reset());
    window.location.reload();
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <GlobalStyle />

      {/* Backdrop */}
      <DialogBackdrop
        transition
        className="fixed inset-0"
        style={{
          background: "rgba(4,8,16,0.85)",
          backdropFilter: "blur(6px)",
          transition: "opacity 0.2s ease",
        }}
      />

      <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="zyn-success zyn-success-panel w-full max-w-sm rounded-3xl overflow-hidden"
          style={{
            background: Z.surface,
            border: `1px solid ${Z.line}`,
            boxShadow: `0 0 60px ${Z.tealGlow}, 0 30px 60px rgba(0,0,0,0.6)`,
          }}
        >
          {/* Top gradient bar */}
          <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${Z.teal}, ${Z.gold})` }} />

          <div className="px-6 pt-8 pb-6 text-center">

            {/* Check circle with ripples */}
            <div className="relative flex items-center justify-center mx-auto mb-6" style={{ width: 80, height: 80 }}>
              {/* Ripple rings */}
              <div className="zyn-ripple absolute inset-0" style={{ border: `1.5px solid ${Z.teal}` }} />
              <div className="zyn-ripple absolute inset-0" style={{ border: `1.5px solid ${Z.teal}` }} />

              {/* Main circle */}
              <div
                className="zyn-check-ring relative z-10 w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: Z.tealGlow, border: `2px solid ${Z.tealBorder}` }}
              >
                <Check className="zyn-check-icon w-9 h-9" style={{ color: Z.teal }} strokeWidth={2.5} />
              </div>
            </div>

            {/* Title */}
            <DialogTitle
              as="h3"
              className="text-2xl font-black mb-2"
              style={{ fontFamily: "'Rajdhani', sans-serif", color: "#fff", letterSpacing: "0.03em" }}
            >
              Operation{" "}
              <span style={{ color: Z.gold }}>Successful!</span>
            </DialogTitle>

            {/* Message */}
            <p className="text-sm leading-relaxed mb-8" style={{ color: Z.muted }}>
              {message}
            </p>

            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="zyn-close-btn w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
              style={{ background: Z.gold, color: Z.navy, fontSize: "14px" }}
            >
              <Zap className="w-4 h-4" />
              Close
            </button>
          </div>

          {/* Bottom teal accent line */}
          <div className="h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${Z.teal}40, transparent)` }} />
        </DialogPanel>
      </div>
    </Dialog>
  );
}