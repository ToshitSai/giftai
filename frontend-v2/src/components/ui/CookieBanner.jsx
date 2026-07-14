import React, { useState, useEffect } from "react";

export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [view, setView] = useState("banner");
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    personalization: false,
  });

  // Load initial preferences from localStorage
  useEffect(() => {
    const savedConsent = localStorage.getItem("greetly-cookie-consent");
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      try {
        setPreferences(JSON.parse(savedConsent));
      } catch (e) {
        // Fallback if parsing fails
        setShowBanner(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      personalization: true,
    };
    localStorage.setItem("greetly-cookie-consent", JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("greetly-cookie-consent", JSON.stringify(preferences));
    setShowBanner(false);
  };

  const togglePreference = (key) => {
    if (key === "essential") return; // Essential cookies are required
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Neo-brutalist container */}
      <div className="bg-white text-[#0F0A1A] border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0_0_#000] relative">
        {/* Playful top-right spark design */}
        <div className="absolute -top-3 -right-3 bg-[#E8FF00] border-2 border-black px-2 py-1 text-xs font-black uppercase tracking-wider rounded-lg shadow-[2px_2px_0_0_#000] rotate-6">
          Cookie Alert 🍪
        </div>

        {/* VIEW: BANNER */}
        {view === "banner" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              We use <span className="text-[#FF5A5F]">Cookies!</span>
            </h2>
            <p className="font-body font-bold text-sm text-[#0F0A1A]/80 leading-relaxed">
              We use a few digital crumbs to keep you logged in, save your drafts,
              and learn which styles pop best. Essential stuff for a magical experience!
            </p>
            
            <div className="flex flex-col gap-3 mt-2">
              {/* FIXED: No login required to accept cookies! */}
              <button
                onClick={handleAcceptAll}
                className="btn-comic bg-[#FF5A5F] text-white border-brand-black w-full py-3 text-md font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-[#ff444a] transition-all"
              >
                Accept All ➔
              </button>

              <button
                onClick={() => setView("customize")}
                className="btn-comic bg-white text-[#0F0A1A] border-brand-black w-full py-3 text-md font-extrabold uppercase tracking-wider active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-gray-50 transition-all"
              >
                Customize
              </button>
            </div>

            <button
              onClick={() => setView("policy")}
              className="text-xs font-black uppercase tracking-wider underline hover:text-[#FF5A5F] text-center mt-1 transition-colors"
            >
              Read our Cookie Policy
            </button>
          </div>
        )}

        {/* VIEW: CUSTOMIZE */}
        {view === "customize" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-black uppercase tracking-tight">
              Your Preferences
            </h2>

            <div className="flex flex-col gap-3">
              {/* Essential Item */}
              <div className="border-3 border-black p-3 rounded-xl bg-gray-50 flex justify-between items-center">
                <div className="flex flex-col gap-0.5 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm uppercase">Essential</span>
                    <span className="bg-[#E8FF00] border border-black text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full">
                      Required
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0F0A1A]/70">
                    Required for login & security.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.essential}
                  disabled
                  className="w-5 h-5 border-2 border-black rounded bg-[#E8FF00] accent-[#E8FF00] cursor-not-allowed"
                />
              </div>

              {/* Analytics Item */}
              <div 
                onClick={() => togglePreference("analytics")}
                className="border-3 border-black p-3 rounded-xl bg-white flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-all"
              >
                <div className="flex flex-col gap-0.5 pr-2">
                  <span className="font-black text-sm uppercase">Analytics</span>
                  <span className="text-xs font-bold text-[#0F0A1A]/70">
                    Helps us understand what's working.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={() => togglePreference("analytics")}
                  className="w-5 h-5 border-2 border-black rounded accent-[#FF5A5F] cursor-pointer"
                />
              </div>

              {/* Personalization Item */}
              <div 
                onClick={() => togglePreference("personalization")}
                className="border-3 border-black p-3 rounded-xl bg-white flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-all"
              >
                <div className="flex flex-col gap-0.5 pr-2">
                  <span className="font-black text-sm uppercase">Personalization</span>
                  <span className="text-xs font-bold text-[#0F0A1A]/70">
                    Remembers your favorite tones.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.personalization}
                  onChange={() => togglePreference("personalization")}
                  className="w-5 h-5 border-2 border-black rounded accent-[#00E5FF] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setView("banner")}
                className="btn-comic bg-white text-[#0F0A1A] border-brand-black flex-1 py-3 text-sm font-extrabold uppercase tracking-wider active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              {/* FIXED: Directly saves preferences locally without auth-wall redirect! */}
              <button
                onClick={handleSavePreferences}
                className="btn-comic bg-[#FF5A5F] text-white border-brand-black flex-1 py-3 text-sm font-extrabold uppercase tracking-wider active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-[#ff444a] transition-all"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* VIEW: POLICY */}
        {view === "policy" && (
          <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1">
            <h2 className="text-xl font-black uppercase tracking-tight">
              Cookie Policy
            </h2>
            <div className="font-body text-xs text-[#0F0A1A]/90 space-y-3 font-bold">
              <p>
                At Greetly, we value your privacy. We use standard browser cookies to keep you safely signed in and remember your message presets.
              </p>
              <p className="font-black">Why we use them:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><span className="font-black">Authentication:</span> Keeps you logged in as you generate customized greetings.</li>
                <li><span className="font-black">Analytics:</span> Measures features so we can make them cooler.</li>
                <li><span className="font-black">Preferences:</span> Saves your custom tone options and drafts.</li>
              </ul>
            </div>
            <button
              onClick={() => setView("banner")}
              className="btn-comic bg-[#E8FF00] text-[#0F0A1A] border-brand-black w-full py-2 text-sm font-extrabold uppercase tracking-wider mt-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-[#d8ef00] transition-all"
            >
              Back to Banner
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
