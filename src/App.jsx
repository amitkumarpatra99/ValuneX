import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";

/* --- COMPREHENSIVE CURRENCY TO COUNTRY MAP --- */
const currencyMap = {
  USD: "US", EUR: "EU", GBP: "GB", INR: "IN", JPY: "JP", CNY: "CN",
  AUD: "AU", CAD: "CA", SGD: "SG", CHF: "CH", NZD: "NZ", KRW: "KR",
  ZAR: "ZA", TRY: "TR", RUB: "RU", BRL: "BR", AED: "AE", SAR: "SA",
  MXN: "MX", IDR: "ID", PKR: "PK", VND: "VN", NGN: "NG", EGP: "EG",
  THB: "TH", MYR: "MY", PHP: "PH", HKD: "HK", TWD: "TW", SEK: "SE",
  NOK: "NO", DKK: "DK", PLN: "PL", HUF: "HU", CZK: "CZ", ILS: "IL",
  CLP: "CL", COP: "CO", ARS: "AR", PEN: "PE", KWD: "KW", QAR: "QA",
  OMR: "OM", BHD: "BH", JOD: "JO", LBP: "LB", LKR: "LK", BDT: "BD",
  NPR: "NP", KES: "KE", GHS: "GH", MAD: "MA", DZD: "DZ", TND: "TN",
  UAH: "UA", RON: "RO", BGN: "BG", HRK: "HR", ISK: "IS", CRC: "CR",
  UYU: "UY", DOP: "DO", GTQ: "GT", HNL: "HN", NIO: "NI", PAB: "PA",
  BOB: "BO", PYG: "PY", VEF: "VE", IQD: "IQ", IRR: "IR", SYP: "SY",
  YER: "YE", AFN: "AF", MMK: "MM", KHP: "KH", LAK: "LA", MNT: "MN",
  BND: "BN", MVR: "MV", BTN: "BT", KZT: "KZ", UZS: "UZ", TMT: "TM",
  KGZ: "KG", TJS: "TJ", GEL: "GE", AMD: "AM", AZN: "AZ", BYN: "BY",
  MDL: "MD", RSD: "RS", MKD: "MK", ALL: "AL", BAM: "BA", MUR: "MU",
  SCR: "SC", MGA: "MG", ETB: "ET", TZS: "TZ", UGX: "UG", RWF: "RW",
  BIF: "BI", ZMW: "ZM", MWK: "MW", MZN: "MZ", AOA: "AO", NAD: "NA",
  BWP: "BW", SZL: "SZ", LSL: "LS", XOF: "SN", XAF: "CM", CDF: "CD",
  GNF: "GN", SLL: "SL", LRD: "LR", GMD: "GM", CVE: "CV", DJF: "DJ",
  SOS: "SO", SDG: "SD", SSP: "SS", ERN: "ER", LYD: "LY",
};

export default function App() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [amount, setAmount] = useState("1");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getFlag = (code) => {
    const countryCode = currencyMap[code] || code.substring(0, 2);
    return `https://flagsapi.com/${countryCode}/flat/64.png`;
  };

  useEffect(() => {
    handleConvert();
  }, []);

  async function handleConvert(source = from, target = to, value = amount) {
    const amt = parseFloat(value);
    if (!amt || amt <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${source}`);
      if (!res.ok) throw new Error("The exchange rate service is unavailable.");
      const data = await res.json();
      const fetchedRate = data.rates?.[target];
      if (!fetchedRate) throw new Error("A rate for this currency pair is not available.");
      setResult(fetchedRate * amt);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error("API Error:", err);
      setError(err instanceof Error ? err.message : "Unable to retrieve the exchange rate.");
    } finally {
      setLoading(false);
    }
  }

  function handleSwap() {
    setFrom(to);
    setTo(from);
    handleConvert(to, from);
  }

  const openModal = (type) => {
    setModalType(type);
    setSearchQuery("");
    setModalOpen(true);
  };

  const selectCurrency = (code) => {
    const source = modalType === "from" ? code : from;
    const target = modalType === "to" ? code : to;
    if (modalType === "from") setFrom(code);
    if (modalType === "to") setTo(code);
    setModalOpen(false);
    handleConvert(source, target);
  };

  return (
    <>
      <Navbar />

      {/* --- MAIN BACKGROUND CONTAINER --- */}
      <div className="app-shell pt-24 min-h-screen flex flex-col text-white">

        {/* --- CONTENT WRAPPER --- */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="app-layout w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_420px] gap-8 relative">

            {/* LEFT SECTION */}
            <div className="hero-panel p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col justify-center relative overflow-hidden">
              <div className="hero-glow absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl"></div>
              <div className="hero-content">
                <div className="eyebrow"><span className="eyebrow-dot" /> Currency, without the guesswork</div>
                <h1 className="hero-title">
                  Your money, <span>in any currency.</span>
                </h1>
                <p className="hero-description">
                  Know what it’s worth wherever life takes you. Convert with current exchange rates in just a few taps.
                </p>
              </div>

              <div className="feature-grid grid grid-cols-1 sm:grid-cols-2 gap-4 z-10">
                <FeatureItem icon="bolt" color="text-purple-400" bg="bg-purple-500/20" text="Instant Live Rates" />
                <FeatureItem icon="earth-americas" color="text-amber-400" bg="bg-amber-500/20" text="160+ Countries" />
                <FeatureItem icon="magnifying-glass" color="text-sky-400" bg="bg-sky-500/20" text="Smart Search" />
                <FeatureItem icon="shield-halved" color="text-green-400" bg="bg-green-500/20" text="Secure & Free" />
              </div>
            </div>

            {/* RIGHT SECTION */}
            <aside className="converter-panel p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-6 relative z-20">
              
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <div className="converter-kicker">Currency converter</div>
                  <div className="converter-heading">Exchange rate</div>
                </div>
                <div className="live-status flex items-center gap-2 text-xs text-slate-400 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                  <div className={`w-2 h-2 rounded-full ${lastUpdated ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  {loading ? "Updating" : lastUpdated ? "Live rates" : error ? "Unavailable" : "Connecting"}
                </div>
              </div>

              <div className="relative group">
                <label className="text-xs text-slate-400 font-medium ml-1 mb-2 block">Amount</label>
                <div className="amount-field flex items-center bg-black/20 border border-white/10 rounded-2xl px-4 py-4 focus-within:border-purple-500/50 transition-colors">
                  <span className="amount-currency text-slate-400 font-semibold text-lg mr-2">{from}</span>
                  <input
                    type="number"
                    value={amount}
                    min="0.01"
                    step="0.01"
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleConvert()}
                    className="w-full bg-transparent text-2xl font-bold text-white outline-none placeholder-slate-600"
                    placeholder="0.00"
                    aria-label="Amount to convert"
                  />
                </div>
              </div>

              <div className="relative grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                <CurrencySelector
                  code={from}
                  flag={getFlag(from)}
                  onClick={() => openModal("from")}
                  label="FROM"
                />

                <div className="flex justify-center">
                  <button
                    onClick={handleSwap}
                    aria-label="Swap currencies"
                    className="swap-button w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center justify-center transition-all hover:rotate-180 active:scale-90"
                  >
                    <i className="fa-solid fa-arrow-right-arrow-left text-xs text-purple-300" />
                  </button>
                </div>

                <CurrencySelector
                  code={to}
                  flag={getFlag(to)}
                  onClick={() => openModal("to")}
                  label="TO"
                />
              </div>

              <div className="result-panel p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-center" aria-live="polite">
                <div className="text-sm text-slate-400 mb-1">Total Estimated Value</div>
                <div className="text-3xl font-bold text-white drop-shadow-md">
                  {result !== null ? result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "---"}
                  <span className="text-base font-normal text-slate-400 ml-2">{to}</span>
                </div>
                {lastUpdated && <div className="result-caption">Based on the latest available rate</div>}
              </div>

              {error && <p className="conversion-error" role="alert">{error}</p>}

              <button
                onClick={handleConvert}
                className="convert-button w-full py-4 rounded-xl bg-white text-indigo-900 font-bold text-lg shadow-lg shadow-white/10 hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  "Convert Now"
                )}
              </button>
            </aside>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <footer className="site-footer w-full py-8 mt-12 border-t border-white/5 text-center text-slate-400 text-sm relative z-10">
           <div className="container mx-auto px-6">
             <p className="mb-2">
               Made with ❤️ by <span className="text-purple-400 font-bold bg-white/5 px-2 py-0.5 rounded-md">MR PATRA</span>
             </p>
             <p className="text-xs text-slate-500">
               © {new Date().getFullYear()} All Rights Reserved.
             </p>
           </div>
        </footer>

      </div>

      {/* --- SEARCH MODAL --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setModalOpen(false)}
          ></div>

          <div className="currency-modal relative w-full max-w-md bg-[#1e1b4b] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-[fadeIn_0.3s_ease-out]">
            <div className="p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3 bg-black/20 rounded-xl px-4 py-3 border border-white/10 focus-within:border-purple-500 transition-colors">
                <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search (e.g., USD, Euro, India)..."
                  className="bg-transparent w-full text-white outline-none placeholder-slate-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
              {Object.keys(currencyMap)
                .filter(c =>
                  c.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (currencyMap[c] && currencyMap[c].toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((c) => (
                  <button
                    key={c}
                    onClick={() => selectCurrency(c)}
                    className="currency-option flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-white/5 w-full text-left"
                  >
                    <img src={getFlag(c)} alt={c} className="w-10 h-10 rounded-full object-cover bg-white/10" />
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-lg">{c}</span>
                      <span className="text-xs text-slate-400">Currency</span>
                    </div>
                    {(c === from || c === to) && (
                      <i className="fa-solid fa-check text-green-400 ml-auto"></i>
                    )}
                  </button>
                ))}

              {Object.keys(currencyMap).filter(c => c.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div className="text-center p-8 text-slate-500">
                  No currency found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FeatureItem({ icon, color, bg, text }) {
  return (
    <div className="feature-item flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
      <div className={`feature-icon w-10 h-10 rounded-full ${bg} flex items-center justify-center ${color}`}>
        <i className={`fa-solid fa-${icon}`}></i>
      </div>
      <div className="text-sm text-slate-200 font-medium">{text}</div>
    </div>
  );
}

function CurrencySelector({ code, flag, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="currency-selector relative group cursor-pointer flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all active:scale-95"
      aria-label={`Choose ${label.toLowerCase()} currency, currently ${code}`}
    >
      <img
        src={flag}
        alt={code}
        className="w-10 h-10 rounded-full shadow-lg object-cover mb-2 group-hover:scale-110 transition-transform"
      />
      <div className="flex items-center gap-1">
        <span className="text-xl font-bold text-white">{code}</span>
        <i className="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
      </div>
      <span className="text-[10px] text-slate-500 font-medium mt-1 text-center w-full truncate px-1 tracking-wider">
        {label}
      </span>
    </button>
  );
}