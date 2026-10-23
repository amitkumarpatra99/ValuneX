import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { currencies, currencyList, getFlag } from "./currencies";
import "./App.css";

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

  const filteredCurrencies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return currencyList;
    return currencyList.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  useEffect(() => {
    handleConvert();
  }, []);

  async function handleConvert(source = from, target = to, value = amount) {
    const src = typeof source === "string" ? source : from;
    const tgt = typeof target === "string" ? target : to;
    const rawVal = typeof value === "string" || typeof value === "number" ? value : amount;
    const amt = parseFloat(rawVal);
    if (!amt || amt <= 0) {
      setResult(null);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${src}`);
      if (!res.ok) throw new Error("The exchange rate service is unavailable.");
      const data = await res.json();
      const fetchedRate = data.rates?.[tgt];
      if (!fetchedRate) throw new Error("A rate for this currency pair is not available.");
      setResult(fetchedRate * amt);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error("API Error:", err);
      setResult(null);
      setLastUpdated(null);
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

      <div className="app-shell pt-16 sm:pt-20 md:pt-24 min-h-screen flex flex-col text-white">

        {/* --- CONTENT WRAPPER --- */}
        <div className="flex-1 flex items-center justify-center px-3.5 py-2 sm:px-6 sm:py-6">
          <div className="app-layout w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_420px] gap-6 md:gap-8 relative">

            {/* LEFT / HERO SECTION (2nd on mobile, 1st on desktop) */}
            <div className="hero-panel order-2 md:order-1 p-5 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col justify-center relative overflow-hidden">
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

            {/* RIGHT / CONVERTER SECTION (1st on mobile, 2nd on desktop) */}
            <aside className="converter-panel order-1 md:order-2 p-5 sm:p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-5 sm:gap-6 relative z-20">
              
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <div className="converter-kicker">Currency converter</div>
                  <div className="converter-heading">Exchange rate</div>
                </div>
                <div className="live-status flex items-center gap-2 text-xs text-slate-400 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                  <div className={`w-2 h-2 rounded-full ${lastUpdated ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  {loading ? "Updating" : error ? "Unavailable" : lastUpdated ? "Live rates" : "Connecting"}
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
                onClick={() => handleConvert()}
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
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setModalOpen(false)}
          ></div>

          <div className="currency-modal relative w-full max-w-md bg-white rounded-3xl border border-[#e2eae3] shadow-2xl overflow-hidden flex flex-col max-h-[82vh] animate-[fadeIn_0.25s_ease-out]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#edf2ee] bg-[#fbfdfb]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#18392b] font-['Manrope'] leading-tight">
                    Select Currency
                  </h3>
                  <p className="text-xs text-[#63786c] mt-0.5">
                    {modalType === "from" ? "Choose source currency (From)" : "Choose target currency (To)"}
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#edf3ef] hover:bg-[#e0ebe3] text-[#425e50] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>

              {/* Search input */}
              <div className="flex items-center gap-3 bg-[#f2f6f3] rounded-xl px-3.5 py-2.5 border border-[#dce6df] focus-within:border-[#3d956a] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3d956a]/15 transition-all">
                <i className="fa-solid fa-magnifying-glass text-[#688274] text-xs"></i>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search country, currency, or code (e.g. USD, India, Euro)..."
                  className="bg-transparent w-full text-[#18392b] text-sm outline-none placeholder-[#82968a]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[#82968a] hover:text-[#18392b] text-xs p-1 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <i className="fa-solid fa-circle-xmark"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Currency List */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-2.5 space-y-1 custom-scrollbar">
              {filteredCurrencies.map((c) => {
                const isSelected = c.code === (modalType === "from" ? from : to);
                const isOther = c.code === (modalType === "from" ? to : from);
                return (
                  <button
                    key={c.code}
                    onClick={() => selectCurrency(c.code)}
                    className={`currency-option flex items-center gap-3.5 p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all border w-full text-left ${
                      isSelected
                        ? "bg-[#eaf5ee] border-[#b8dfc7]"
                        : "bg-white border-transparent hover:bg-[#f3f7f4] hover:border-[#e3ece5]"
                    }`}
                  >
                    <img
                      src={getFlag(c.code)}
                      alt={c.code}
                      className="w-9 h-9 rounded-full object-cover shadow-sm border border-[#e2eae3] flex-shrink-0 bg-slate-100"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "https://flagcdn.com/w80/un.png";
                      }}
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#18392b] text-base font-['Manrope']">
                          {c.code}
                        </span>
                        <span className="text-xs text-[#526a5d] truncate font-medium">
                          {c.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#788e81] truncate">
                        {c.country}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="text-xs font-semibold text-[#1c6b45] bg-[#d5ede0] px-2.5 py-1 rounded-full flex items-center gap-1 flex-shrink-0">
                        <i className="fa-solid fa-check text-[10px]" />
                        Selected
                      </span>
                    )}
                    {!isSelected && isOther && (
                      <span className="text-[10px] font-medium text-[#7d9386] bg-[#edf2ef] px-2 py-0.5 rounded-full flex-shrink-0">
                        {modalType === "from" ? "To" : "From"}
                      </span>
                    )}
                  </button>
                );
              })}

              {filteredCurrencies.length === 0 && (
                <div className="text-center py-12 px-4 text-[#758a7e]">
                  <i className="fa-solid fa-magnifying-glass text-2xl text-[#a4b8ad] mb-2 block"></i>
                  <p className="font-medium text-[#18392b] text-sm">No currency found</p>
                  <p className="text-xs text-[#758a7e] mt-1">
                    Try searching by country name, currency name, or 3-letter code.
                  </p>
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
  const info = currencies[code];
  return (
    <button
      onClick={onClick}
      className="currency-selector relative group cursor-pointer flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all active:scale-95"
      aria-label={`Choose ${label.toLowerCase()} currency, currently ${code} (${info?.name || code})`}
    >
      <img
        src={flag}
        alt={code}
        className="w-10 h-10 rounded-full shadow-lg object-cover mb-2 group-hover:scale-110 transition-transform bg-slate-100"
        onError={(e) => {
          e.currentTarget.src = "https://flagcdn.com/w80/un.png";
        }}
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