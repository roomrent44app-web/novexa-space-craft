import { useEffect, useState } from "react";
import logo from "@/assets/5am-logo.png";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

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

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setOpen(false);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    // Show on every website visit until the app is installed.
    const showTimer = window.setTimeout(() => {
      setIos(isIos());
      setOpen(true);
    }, 700);

    return () => {
      window.clearTimeout(showTimer);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const close = () => setOpen(false);

  const install = async () => {
    if (!deferred) {
      window.alert('Open your browser menu and choose "Install app" or "Add to Home screen".');
      return;
    }
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
