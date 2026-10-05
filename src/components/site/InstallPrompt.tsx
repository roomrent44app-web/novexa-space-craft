import { useEffect, useState } from "react";
import logo from "@/assets/5am-logo.png";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "5am-install-dismissed-at";
const DISMISS_DAYS = 3;

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 86400000) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setOpen(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // iPhone/iPad have no beforeinstallprompt — show manual instructions instead.
    if (isIos()) {
      const t = window.setTimeout(() => {
        setIos(true);
        setOpen(true);
      }, 2500);
      return () => {
        window.clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", onPrompt);
      };
    }
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const close = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setOpen(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") {
      setOpen(false);
    } else {
      close();
    }
    setDeferred(null);
  };

  if (!open) return null;

  return (
    <div className="ip-backdrop" role="dialog" aria-modal="true" aria-label="Install 5AM app" onClick={close}>
      <div className="ip-card" onClick={(e) => e.stopPropagation()}>
        <button className="ip-close" onClick={close} aria-label="Close install popup">×</button>
        <img className="ip-logo" src={logo} alt="5AM logo" width={72} height={72} />
        <h2 className="ip-title">Install the 5AM App</h2>
        <p className="ip-text">
          Get wake-up calls, live classes and attendance in one tap — right from your home screen.
        </p>
        {ios ? (
          <p className="ip-ios">
            Tap the <strong>Share</strong> button in your browser, then choose{" "}
            <strong>"Add to Home Screen"</strong>.
          </p>
        ) : (
          <button className="ip-btn" onClick={install}>Install App</button>
        )}
        <button className="ip-later" onClick={close}>Maybe later</button>
      </div>
    </div>
  );
}
