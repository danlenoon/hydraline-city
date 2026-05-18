import React, { useState, useEffect, useRef } from 'react';

const FAUCET_RATES = [1, 10, 100, 1000, 10000, 50000, 100000];
const FAUCET_NAMES = ['Faucet mini', 'Faucet Neo', 'Faucet Plus', 'Faucet Pro', 'Faucet Max', 'Faucet Ultra', 'Faucet Extreme'];
const FAUCET_REQS = [
  { res: 0, com: 0, ind: 0 }, { res: 10, com: 0, ind: 0 }, { res: 25, com: 5, ind: 0 },
  { res: 50, com: 25, ind: 5 }, { res: 150, com: 75, ind: 15 }, { res: 250, com: 100, ind: 25 }, { res: 1000, com: 500, ind: 250 },
];
const FLASK_CAPS = [0.25, 0.5, 1, 2, 4, 6, 10, 25, 100, 250, 500, 1000];
const FLASK_NAMES = ['Hydroflask mini', 'Hydroflask Neo', 'Hydroflask Plus', 'Hydroflask Pro', 'Hydroflask Max', 'Hydroflask Ultra', 'Hydroflask Extreme', 'Hydrodispenser', 'Hydrodispenser Pro', 'Hydrodispenser Max', 'Hydrodispenser Ultra', 'Hydrodispenser Extreme'];
const ASSET_DRINK_COSTS = [500, 1500, 3000, 6000, 9000, 15000, 30000, 90000, 250000, 720000, 1500000, 5000000]; // in mL

interface Flask { id: number; typeIndex: number; current: number; }

const formatVolume = (ml: number) => {
  if (ml < 1000) return `${Math.floor(ml)}mL`;
  return `${Number((ml / 1000).toFixed(2))}L`;
};

const Icon = ({ name, className = "w-4 h-4" }: { name: string, className?: string }) => {
  const icons: any = {
    chevronLeft: <path d="M15 18l-6-6 6-6" />,
    chevronRight: <path d="M9 18l6-6-6-6" />,
    calendar: <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    settings: <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
    cart: <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
    play: <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />,
    pause: <path d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    sun: <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.344l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />,
    moon: <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />,
    close: <path d="M6 18L18 6M6 6l12 12" />,
    reset: <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
    male: <path d="M15 9l5-5m0 0h-4m4 0v4M12 12a4 4 0 100-8 4 4 0 000 8zM5 19a7 7 0 1114 0" />,
    female: <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 0v8m0 0h-3m3 0h3" />,
    others: <path d="M12 12a2 2 0 100-4 2 2 0 000 4zM4 19a8 8 0 1116 0" />
  };
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
};

const FaucetVisual = ({ typeIndex: _typeIndex }: { typeIndex: number }) => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto animate-pulse">
    <path d="M40 20 L40 50 C40 70 60 70 60 50 L60 20" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <circle cx="50" cy="55" r="5" className="fill-alkaline-400" />
    <path d="M50 60 V90" stroke="url(#water-gradient)" strokeWidth="4" strokeDasharray="4 4" className="animate-flow" />
    <defs>
      <linearGradient id="water-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00bcd4" /><stop offset="100%" stopColor="#22c55e" /></linearGradient>
    </defs>
  </svg>
);

const VesselVisual = ({ typeIndex: _typeIndex, current, max }: { typeIndex: number, current: number, max: number }) => {
  const fill = Math.min(100, (current / max) * 100);
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto">
      <rect x="30" y="20" width="40" height="60" rx="10" fill="none" stroke="currentColor" strokeWidth="4" />
      <rect x="34" y={80 - (fill * 0.56)} width="32" height={fill * 0.56} rx="5" className="fill-alkaline-500/50" />
    </svg>
  );
};

const LiquidSpinner = ({ value, onChange, placeholder, min = 0, className = "" }: any) => {
  return (
    <div className="relative group w-full">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        className={`liquid-input w-full pr-12 pl-6 ${className}`}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-0 opacity-30 group-focus-within:opacity-100 transition-opacity">
        <button type="button" onClick={() => onChange((parseInt(value) || 0) + 1)} className="hover:text-alkaline-500 transition-colors p-0.5 leading-none text-[10px]">▲</button>
        <button type="button" onClick={() => onChange(Math.max(min, (parseInt(value) || 0) - 1))} className="hover:text-alkaline-500 transition-colors p-0.5 leading-none text-[10px]">▼</button>
      </div>
    </div>
  );
};

const GlassSelect = ({ value, options, onChange, placeholder, className = "" }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchString, setSearchString] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const click = (e: any) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  useEffect(() => { if (!isOpen) setSearchString(""); }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " ") { setIsOpen(true); e.preventDefault(); }
      return;
    }
    if (e.key === "Backspace") {
      setSearchString(prev => prev.slice(0, -1));
      e.preventDefault();
    } else if (e.key === "Enter") {
      const match = options.find((o: any) => o.label.toString().toLowerCase().startsWith(searchString.toLowerCase()));
      if (match) { onChange(match.value); setIsOpen(false); }
      else if (searchString === "") setIsOpen(false);
      e.preventDefault();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      e.preventDefault();
    } else if (e.key.length === 1) {
      setSearchString(prev => prev + e.key);
      e.preventDefault();
    }
  };

  const selectedLabel = options.find((o: any) => o.value.toString() === value.toString())?.label || placeholder;
  const matchedOption = searchString ? options.find((o: any) => o.label.toString().toLowerCase().startsWith(searchString.toLowerCase())) : null;

  return (
    <div ref={ref} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full liquid-input flex items-center group active:scale-95 text-xs font-bold !pl-2 outline-none focus:ring-2 focus:ring-alkaline-500/50"
      >
        <span className="opacity-40 group-hover:opacity-100 transition-opacity mr-1.5"><Icon name="chevronRight" className="w-3 h-3 rotate-90" /></span>
        <span className="flex-1 text-right truncate">{searchString ? `${searchString}_` : selectedLabel}</span>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[110] glass-card border-white/30 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
          <div className="max-h-48 overflow-y-auto custom-scrollbar overflow-x-hidden p-2">
            <div className="py-1">
              {options.map((opt: any, idx: number) => {
                const isTop = idx === 0;
                const isBot = idx === options.length - 1;
                const roundingClass = options.length === 1 ? 'norman-item-single' : (isTop ? 'norman-item-top' : (isBot ? 'norman-item-bot' : 'norman-item-mid'));
                const isMatched = matchedOption && matchedOption.value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                    className={`w-full text-right px-6 py-3.5 transition-all text-xs font-bold ${roundingClass} ${value.toString() === opt.value.toString() || isMatched ? 'alkaline-gradient text-white shadow-lg z-10 relative' : 'hover:bg-alkaline-500/20 text-neutral-600 dark:text-neutral-300'}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Calendar = ({ initialDate, onSelect, onClose }: { initialDate: string, onSelect: (d: string) => void, onClose: () => void }) => {
  const parseDate = (dStr: string) => {
    const parts = dStr.split('-');
    if (parts.length !== 3) return new Date();
    const y = Math.max(1583, parseInt(parts[0]));
    return new Date(y, parseInt(parts[1]) - 1, parseInt(parts[2]));
  };

  const [viewDate, setViewDate] = useState(parseDate(initialDate));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const setToday = () => {
    const today = new Date();
    setViewDate(today);
    onSelect(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
  };

  const canGoPrev = year > 1583 || (year === 1583 && month > 0);

  return (
    <div ref={ref} className="glass-card p-6 w-full z-50 shadow-xl text-neutral-800 dark:text-white my-3 border-alkaline-400/20 max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={() => canGoPrev && setViewDate(new Date(year, month - 1, 1))}
          className={`w-10 h-10 glass-button p-0 flex items-center justify-center font-black transition-all ${!canGoPrev ? 'opacity-20 cursor-default' : 'hover:scale-110 active:scale-90'}`}
        ><Icon name="chevronLeft" /></button>
        <span className="font-black text-[10px] uppercase tracking-[0.2em] alkaline-text">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="w-10 h-10 glass-button p-0 flex items-center justify-center font-black transition-all hover:scale-110 active:scale-90"><Icon name="chevronRight" /></button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-[9px] font-black opacity-30 capitalize tracking-widest">{d}</div>
        ))}
        {padding.map(p => <div key={`p-${p}`} />)}
        {days.map(d => {
          const isSelected = initialDate === `${year}-${month + 1}-${d}`;
          return (
            <button
              type="button"
              key={d}
              onClick={() => onSelect(`${year}-${month + 1}-${d}`)}
              className={`w-full aspect-square flex items-center justify-center text-[10px] font-bold rounded-full transition-all duration-300 border ${isSelected ? 'alkaline-gradient text-white border-white/40 shadow-md scale-110' : 'hover:bg-alkaline-500/20 border-transparent text-neutral-600 dark:text-neutral-400'}`}
            >
              {d}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={setToday} className="flex-1 glass-button h-10 text-[9px] px-0 capitalize tracking-widest">Today</button>
        <button type="button" onClick={onClose} className="flex-1 glass-button h-10 text-[9px] px-0 capitalize tracking-widest text-red-500/70">Close</button>
      </div>
    </div>
  );
};

const RegistrationInputs = ({ data, onChange, hUnit, setHUnit, wUnit, handleHUnitChange, handleWUnitChange, showCalendar, setShowCalendar, selectedDate, setSelectedDate }: any) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dateParts = selectedDate ? selectedDate.split('-') : [data?.year || "2000", data?.month || "1", data?.day || "1"];
  const curY = dateParts[0];
  const curM = dateParts[1];
  const curD = dateParts[2];

  const handleLocalChange = (e: any) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-4">
      <input name="name" value={data?.name || ''} onChange={handleLocalChange} placeholder="Name" autoComplete="off" className="block w-full liquid-input !text-left" required />

      <div className="flex gap-2">
        <input type="hidden" name="sex" value={data?.sex || ''} />
        {['Male', 'Female', 'Others'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange({ ...data, sex: s })}
            className={`flex-1 glass-button h-12 transition-all duration-300 ${data?.sex === s ? 'alkaline-gradient text-white border-white/40 shadow-lg' : 'text-neutral-500'}`}
          >
            <Icon name={s.toLowerCase() as any} className="w-3.5 h-3.5 mr-2" />
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center w-full">
        <GlassSelect
          value={curM}
          options={months.map((m, i) => ({ label: m, value: i + 1 }))}
          onChange={(val: any) => {
            const newDate = `${curY}-${val}-${curD}`;
            setSelectedDate(newDate);
            onChange({ ...data, month: val.toString() });
            setShowCalendar(false);
          }}
          className="flex-1"
        />
        <GlassSelect
          value={curD}
          options={Array.from({ length: 31 }, (_, i) => ({ label: (i + 1).toString(), value: i + 1 }))}
          onChange={(val: any) => {
            const newDate = `${curY}-${curM}-${val}`;
            setSelectedDate(newDate);
            onChange({ ...data, day: val.toString() });
            setShowCalendar(false);
          }}
          className="flex-1"
        />
        <GlassSelect
          value={curY}
          options={Array.from({ length: new Date().getFullYear() - 1583 + 1 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return { label: year.toString(), value: year };
          })}
          onChange={(val: any) => {
            const newDate = `${val}-${curM}-${curD}`;
            setSelectedDate(newDate);
            onChange({ ...data, year: val.toString() });
            setShowCalendar(false);
          }}
          className="flex-1"
        />
        <button type="button" onClick={() => {
          const parts = [data.year, data.month, data.day];
          setSelectedDate(parts.join('-'));
          setShowCalendar(!showCalendar);
        }} className="w-12 h-12 glass-button flex items-center justify-center p-0 shadow-lg shadow-alkaline-500/10 transition-all hover:scale-110 active:scale-90 flex-shrink-0"><Icon name="calendar" className="w-5 h-5" /></button>
      </div>

      {showCalendar && <Calendar initialDate={selectedDate} onSelect={(d) => {
        setSelectedDate(d);
        const [y, m, day] = d.split('-');
        onChange({ ...data, year: y, month: m, day: day });
      }} onClose={() => setShowCalendar(false)} />}

      <div className="flex gap-2 items-center">
        {hUnit === 'ft' ? (
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <LiquidSpinner value={data?.ft || ''} onChange={(val: any) => onChange({ ...data, ft: val })} placeholder="0" className="!pr-16 !text-right" />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30 pointer-events-none">ft</span>
            </div>
            <div className="relative flex-1">
              <LiquidSpinner value={data?.in || ''} onChange={(val: any) => onChange({ ...data, in: val })} placeholder="0" className="!pr-16 !text-right" />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30 pointer-events-none">in</span>
            </div>
          </div>
        ) : (
          <LiquidSpinner value={data?.height || ''} onChange={(val: any) => onChange({ ...data, height: val })} placeholder="Height" className="!pr-16 !text-right" />
        )}
        <GlassSelect
          value={hUnit}
          options={[{ label: 'cm', value: 'cm' }, { label: 'ft/in', value: 'ft' }, { label: 'in', value: 'in' }, { label: 'm', value: 'm' }]}
          onChange={(val: any) => { setHUnit(val); handleHUnitChange(val); }}
          className="w-32"
        />
      </div>
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <LiquidSpinner value={data?.weight || ''} onChange={(val: any) => onChange({ ...data, weight: val })} placeholder="Weight" className="!text-right" />
        </div>
        <div className="flex gap-2 h-12 w-44">
          <button type="button" onClick={() => handleWUnitChange('kg')} className={`flex-1 h-12 glass-button px-0 transition-all duration-300 ${wUnit === 'kg' ? 'alkaline-gradient text-white border-white/40 shadow-md' : 'text-neutral-500'}`}>kg</button>
          <button type="button" onClick={() => handleWUnitChange('lbs')} className={`flex-1 h-12 glass-button px-0 transition-all duration-300 ${wUnit === 'lbs' ? 'alkaline-gradient text-white border-white/40 shadow-md' : 'text-neutral-500'}`}>lbs</button>
        </div>
      </div>    </div>
  );
};

const HydralineCityApp = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [draftProfile, setDraftProfile] = useState<any>({
    name: '', sex: '',
    month: "1",
    day: "1",
    year: "2000",
    height: '', ft: '', in: '', weight: ''
  });
  const [replicaFlask, setReplicaFlask] = useState<Flask>(() => {
    const saved = localStorage.getItem('Hydraline City_game_state');
    return saved ? JSON.parse(saved).replicaFlask : { id: Date.now(), typeIndex: 0, current: 0 };
  });
  const [assetFlasks, setAssetFlasks] = useState<Flask[]>(() => {
    const saved = localStorage.getItem('Hydraline City_game_state');
    return saved ? JSON.parse(saved).assetFlasks : [];
  });
  const [faucetLevel, setFaucetLevel] = useState<number>(() => {
    const saved = localStorage.getItem('Hydraline City_game_state');
    return saved ? JSON.parse(saved).faucetLevel : 0;
  });
  const [zones, setZones] = useState(() => {
    const saved = localStorage.getItem('Hydraline City_game_state');
    return saved ? JSON.parse(saved).zones : { residential: 0, commercial: 0, industrial: 0 };
  });
  const [integrity, setIntegrity] = useState(() => {
    const saved = localStorage.getItem('Hydraline City_game_state');
    return saved ? JSON.parse(saved).integrity ?? 100 : 100;
  });
  const [showShop, setShowShop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2000-1-1");
  const [hUnit, setHUnit] = useState('cm');
  const [wUnit, setWUnit] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [totalDrunk, setTotalDrink] = useState(() => {
    const saved = localStorage.getItem('Hydraline City_game_state');
    return saved ? JSON.parse(saved).totalDrunk : 0;
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [selectedFaucet, setSelectedFaucet] = useState<number | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<number | null>(null);
  const [tutorialActive, setTutorialActive] = useState(false);
  const [isFirstTimeTutorial, setIsFirstTimeTutorial] = useState(false);
  const [tutStep, setTutStep] = useState(0);

  const tutorialGoals = [
    { id: 'tut-collect', text: "Collect water in primary hydroflask.", targetId: 'btn-collect' },
    { id: 'tut-consume', text: "Consume water in primary hydroflask.", targetId: 'btn-consume' },
    { id: 'tut-collect-again', text: "Collect water in primary hydroflask again.", targetId: 'btn-collect' },
    { id: 'tut-shop', text: "Open the shop.", targetId: 'btn-shop' },
    { id: 'tut-evolve', text: "Upgrade your primary hydroflask by clicking Evolve.", targetId: 'btn-evolve' },
    { id: 'tut-close-shop-1', text: "Close the shop.", targetId: 'btn-close-shop' },
    { id: 'tut-collect-3', text: "Collect water in primary hydroflask for the third time.", targetId: 'btn-collect' },
    { id: 'tut-consume-2', text: "Consume water in primary hydroflask again.", targetId: 'btn-consume' },
    { id: 'tut-shop-2', text: "Open the shop.", targetId: 'btn-shop' },
    { id: 'tut-select-asset', text: "Select Hydroflask Plus under the Industrial Assets section on the Shop.", targetId: 'asset-item-2' },
    { id: 'tut-buy-asset', text: "Purchase Hydroflask Plus.", targetId: 'btn-buy-asset' },
    { id: 'tut-close-shop-2', text: "Close the shop.", targetId: 'btn-close-shop' },
    { id: 'tut-collect-asset', text: "Collect water in Hydroflask Plus asset.", targetId: 'btn-collect-asset' },
    { id: 'tut-build', text: "Build the Residential unit.", targetId: 'btn-build-residential' },
    { id: 'tut-shop-3', text: "Open the shop.", targetId: 'btn-shop' },
    { id: 'tut-select-faucet', text: "Select Faucet Neo under the Faucet Technology section on the Shop.", targetId: 'faucet-item-1' },
    { id: 'tut-buy-faucet', text: "Purchase Faucet Neo.", targetId: 'btn-buy-faucet' },
    { id: 'tut-close-shop-3', text: "Close the shop.", targetId: 'btn-close-shop' },
    { id: 'tut-conclusion', text: "You must adhere to the metropolitan requirements and grid protocols to progress. Have fun in the game and keep the city fully hydrated!", targetId: 'btn-start-game' }
  ];

  const getHighlightClass = (targetId: string) => {
    return (tutorialActive && tutorialGoals[tutStep]?.targetId === targetId) ? 'tutorial-highlight !pointer-events-auto relative z-[250]' : '';
  };

  const [tooltipStyle, setTooltipStyle] = useState<{ top: string; left: string; transform?: string }>({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
  const [tutWarning, setTutWarning] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (!tutorialActive || !tutorialGoals[tutStep]) {
      setTutWarning(null);
      return;
    }

    const updatePosition = () => {
      const targetId = tutorialGoals[tutStep]?.targetId;
      if (!targetId || targetId === 'btn-start-game') {
        setTutWarning(null);
        setTooltipStyle({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
        return;
      }

      const element = document.getElementById(targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        const isAbove = rect.bottom < 40;
        const isBelow = rect.top > (window.innerHeight - 40);

        if (isAbove) {
          setTutWarning('up');
          setTooltipStyle({
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)'
          });
        } else if (isBelow) {
          setTutWarning('down');
          setTooltipStyle({
            top: `${window.innerHeight - 180}px`,
            left: '50%',
            transform: 'translateX(-50%)'
          });
        } else {
          setTutWarning(null);
          const spaceBelow = window.innerHeight - rect.bottom;
          if (spaceBelow > 180) {
            setTooltipStyle({
              top: `${rect.bottom + 12}px`,
              left: `${rect.left + rect.width / 2}px`,
              transform: 'translateX(-50%)'
            });
          } else {
            setTooltipStyle({
              top: `${rect.top - 12}px`,
              left: `${rect.left + rect.width / 2}px`,
              transform: 'translate(-50%, -100%)'
            });
          }
        }
      } else {
        setTutWarning(null);
        setTooltipStyle({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
      }
    };

    updatePosition();
    const handle = setInterval(updatePosition, 150);

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      clearInterval(handle);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [tutorialActive, tutStep, showShop, showSettings, assetFlasks]);

  const startMainGame = () => {
    setTutorialActive(false);
    if (isFirstTimeTutorial) {
      setReplicaFlask({ id: Date.now(), typeIndex: 0, current: 0 });
      setAssetFlasks([]);
      setFaucetLevel(0);
      setZones({ residential: 0, commercial: 0, industrial: 0 });
      setTotalDrink(0);
      setIntegrity(100);
      setIsFirstTimeTutorial(false);
    }
    showNotify("Simulation active! Have fun!");
  };

  const getEffectiveFaucetRate = () => {
    if (tutorialActive) return 50000;
    return FAUCET_RATES[faucetLevel];
  };

  const getEffectiveFaucetLevel = () => {
    if (tutorialActive) return FAUCET_NAMES.length - 1;
    return faucetLevel;
  };

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error("Hydraline City Runtime Error:", event.error);
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  useEffect(() => {
    if (step === 2 && !tutorialActive) {
      localStorage.setItem('Hydraline City_game_state', JSON.stringify({ replicaFlask, assetFlasks, faucetLevel, zones, totalDrunk, integrity }));
    }
  }, [replicaFlask, assetFlasks, faucetLevel, zones, totalDrunk, integrity, step, tutorialActive]);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const isRegistrationComplete = () => {
    const d = draftProfile;
    const isHeightDone = hUnit === 'ft' ? (d.ft && d.in) : d.height;
    return d.name && d.sex && d.month && d.day && d.year && d.weight && isHeightDone && wUnit;
  };

  const isSettingsDirty = () => {
    if (!profile) return false;
    const d = draftProfile;
    const p = profile;
    return d.name !== p.name || d.sex !== p.sex || d.month !== p.month ||
      d.day !== p.day || d.year !== p.year || d.height !== p.height ||
      d.ft !== p.ft || d.in !== p.in || d.weight !== p.weight ||
      hUnit !== p.hUnit || wUnit !== p.wUnit || profile.loc !== p.loc;
  };

  const isStateDirty = (d: any, h: string, w: string | null, l: boolean) => {
    const savedStr = localStorage.getItem('Hydraline City_profile');
    if (!savedStr) return true;
    const s = JSON.parse(savedStr);
    return d.name !== s.name || d.sex !== s.sex || d.month !== s.month ||
      d.day !== s.day || d.year !== s.year || d.height !== s.height ||
      d.ft !== s.ft || d.in !== s.in || d.weight !== s.weight ||
      h !== s.hUnit || w !== s.wUnit || l !== s.loc;
  };

  const handleSettingsFormChange = (newDraft: any) => {
    setDraftProfile(newDraft);
    if (step === 2 && isStateDirty(newDraft, hUnit, wUnit, profile.loc)) {
      showNotify("Sync required");
    }
  };

  const formatBiometric = (num: number) => {
    const rounded = Math.round(num * 100) / 100;
    return rounded.toString();
  };

  const handleHUnitChange = (newUnit: string) => {
    const d = { ...draftProfile };
    let cm = 0;
    if (hUnit === 'cm') cm = parseFloat(d.height) || 0;
    else if (hUnit === 'ft') cm = (parseFloat(d.ft) || 0) * 30.48 + (parseFloat(d.in) || 0) * 2.54;
    else if (hUnit === 'in') cm = (parseFloat(d.height) || 0) * 2.54;
    else if (hUnit === 'm') cm = (parseFloat(d.height) || 0) * 100;

    if (cm > 0) {
      if (newUnit === 'cm') d.height = formatBiometric(cm);
      else if (newUnit === 'ft') {
        const totalIn = cm / 2.54;
        d.ft = Math.floor(totalIn / 12).toString();
        d.in = parseFloat((totalIn % 12).toFixed(2)).toString();
      }
      else if (newUnit === 'in') d.height = formatBiometric(cm / 2.54);
      else if (newUnit === 'm') d.height = formatBiometric(cm / 100);
    }
    setDraftProfile(d);
    setHUnit(newUnit);
    if (step === 2 && isStateDirty(d, newUnit, wUnit, profile.loc)) {
      showNotify("Sync required");
    }
  };

  const handleWUnitChange = (newUnit: string) => {
    if (wUnit === newUnit) return;
    const d = { ...draftProfile };
    let val = parseFloat(d.weight) || 0;
    if (val > 0) {
      if (newUnit === 'lbs') d.weight = formatBiometric(val * 2.20462);
      else if (newUnit === 'kg') d.weight = formatBiometric(val / 2.20462);
    }
    setDraftProfile(d);
    setWUnit(newUnit);
    if (step === 2 && isStateDirty(d, hUnit, newUnit, profile.loc)) {
      showNotify("Sync required");
    }
  };

  const handleLocationToggle = () => {
    const next = !profile.loc;
    setProfile((p: any) => ({ ...p, loc: next }));
    if (step === 2 && isStateDirty(draftProfile, hUnit, wUnit, next)) {
      showNotify("Sync required");
    }
  };

  const collectToReplica = () => {
    if (isPaused || (tutorialActive && tutStep !== 0 && tutStep !== 2 && tutStep !== 6)) return;
    const cap = FLASK_CAPS[replicaFlask.typeIndex] * 1000;
    const currentRate = getEffectiveFaucetRate();
    setReplicaFlask(f => {
      const next = Math.min(cap, f.current + currentRate);
      if (tutorialActive) {
        if (tutStep === 0 && next >= cap) setTutStep(1);
        else if (tutStep === 2 && next >= cap) setTutStep(3);
        else if (tutStep === 6 && next >= cap) setTutStep(7);
      }
      return { ...f, current: next };
    });
  };

  const collectToSpecificAsset = (id: number) => {
    if (isPaused) return;
    const currentRate = getEffectiveFaucetRate();
    setAssetFlasks(prev => prev.map(f => {
      if (f.id === id) {
        const cap = FLASK_CAPS[f.typeIndex] * 1000;
        const next = Math.min(cap, f.current + currentRate);
        if (tutorialActive && tutStep === 12 && next >= cap) {
          setTutStep(13);
        }
        return { ...f, current: next };
      }
      return f;
    }));
  };


  useEffect(() => {
    const saved = localStorage.getItem('Hydraline City_profile');
    const savedTheme = localStorage.getItem('Hydraline City_theme');
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');

    if (saved) {
      try {
        const p = JSON.parse(saved);
        setProfile(p);
        setDraftProfile(p);
        setHUnit(p.hUnit || 'cm');
        setWUnit(p.wUnit || null);
        if (p.year && p.month && p.day) setSelectedDate(`${p.year}-${p.month}-${p.day}`);
        setStep(2);
      } catch (e) {
        console.error("Failed to load profile", e);
        localStorage.clear();
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('Hydraline City_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (step !== 2 || isPaused) return;
    const interval = setInterval(() => {
      let decay = profile?.loc ? 0.05 : 0.005;
      setIntegrity(prev => {
        const next = Math.max(0, prev - decay);
        if (next <= 0) setShowShop(false);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, profile, isPaused]);

  const drink = () => {
    if (isPaused || (tutorialActive && tutStep !== 1 && tutStep !== 7)) {
      if (tutorialActive) showNotify("Tutorial: Consume Water");
      return;
    }
    const consumed = replicaFlask.current;
    if (consumed === 0) {
      showNotify("Vessel Empty");
      return;
    }
    setReplicaFlask(f => ({ ...f, current: 0 }));
    setTotalDrink((prev: number) => prev + consumed);
    const restore = consumed * 0.32;
    setIntegrity(prev => Math.min(100, prev + restore));
    if (tutorialActive) {
      if (tutStep === 1) setTutStep(2);
      else if (tutStep === 7) setTutStep(8);
    }
  };

  const upgradeReplicaFlask = () => {
    const threshold = FLASK_CAPS[replicaFlask.typeIndex] * 1000 * 0.8;
    if (replicaFlask.current >= threshold && replicaFlask.typeIndex < FLASK_CAPS.length - 1) {
      const newName = FLASK_NAMES[replicaFlask.typeIndex + 1];
      setReplicaFlask(f => ({ ...f, typeIndex: f.typeIndex + 1, current: 0 }));
      setTotalDrink(0);
      showNotify(`Evolved to ${newName}`);
      if (tutorialActive && tutStep === 4) {
        setTutStep(5);
      }
    } else if (replicaFlask.typeIndex < FLASK_CAPS.length - 1) {
      showNotify("Threshold 80% req");
    }
  };

  const downgradeReplicaFlask = () => {
    if (replicaFlask.typeIndex > 0) {
      const newName = FLASK_NAMES[replicaFlask.typeIndex - 1];
      setReplicaFlask(f => ({ ...f, typeIndex: f.typeIndex - 1, current: 0 }));
      setTotalDrink(0);
      showNotify(`Reverted to ${newName}`);
    }
  };

  const executeFaucetPurchase = () => {
    if (selectedFaucet === null) return;
    const req = FAUCET_REQS[selectedFaucet];
    if (tutorialActive || (zones.residential >= req.res && zones.commercial >= req.com && zones.industrial >= req.ind)) {
      setFaucetLevel(selectedFaucet);
      showNotify(`Tech Initialized: ${FAUCET_NAMES[selectedFaucet]}`);
      if (tutorialActive && tutStep === 16) {
        setTutStep(17);
      }
    } else {
      showNotify(`Auth error: Grid req`);
    }
  };

  const buyAssetFlask = () => {
    if (isPaused || selectedAssetType === null) return;

    if (tutorialActive) {
      if (selectedAssetType !== 2) {
        showNotify("Tutorial: Please Select Hydroflask Plus");
        return;
      }
      if (tutStep !== 10) return;
    }

    const cost = ASSET_DRINK_COSTS[replicaFlask.typeIndex];
    const maxAllowedType = Math.min(FLASK_NAMES.length - 1, replicaFlask.typeIndex + 1);

    if ((tutorialActive || totalDrunk >= cost) && selectedAssetType <= maxAllowedType) {
      setTotalDrink(0);
      setAssetFlasks(prev => [...prev, { id: Date.now(), typeIndex: selectedAssetType, current: 0 }]);
      showNotify(`Asset Stabilized: ${FLASK_NAMES[selectedAssetType]}`);
      setSelectedAssetType(null);
      if (tutorialActive && tutStep === 10) {
        setTutStep(11);
      }
    } else if (selectedAssetType > maxAllowedType) {
      showNotify("Registry Error: Upgrade Vessel");
    } else {
      showNotify(`${formatVolume(cost)} Bank Required`);
    }
  };

  const build = (zone: keyof typeof zones) => {
    if (isPaused) return;
    const required = zones[zone] + 1;
    const typeMap: any = { residential: 3, commercial: 4, industrial: 5 };
    let targetType = typeMap[zone];
    if (tutorialActive && zone === 'residential') {
      targetType = 2;
    }
    const validFlasks = assetFlasks.filter(f => f.typeIndex === targetType && f.current >= FLASK_CAPS[f.typeIndex] * 1000);

    if (validFlasks.length >= required) {
      setAssetFlasks(prev => {
        let n = [...prev];
        let removed = 0;
        while (removed < required) {
          const idx = n.findIndex(f => f.typeIndex === targetType && f.current >= FLASK_CAPS[f.typeIndex] * 1000);
          n.splice(idx, 1);
          removed++;
        }
        return n;
      });
      setZones((prev: any) => ({ ...prev, [zone]: prev[zone] + 1 }));
      showNotify(`${String(zone)} Sector est.`);

      if (tutorialActive && zone === 'residential') {
        if (tutStep === 13) {
          setTutStep(14);
        }
      }
    } else {
      showNotify(`Need ${required} Full ${FLASK_NAMES[targetType]}`);
    }
  };

  const onSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegistrationComplete() && step === 0) {
      showNotify("Incomplete link");
      return;
    }

    const newProfile = { ...draftProfile, hUnit, wUnit, loc: profile?.loc ?? false };
    setProfile(newProfile);
    localStorage.setItem('Hydraline City_profile', JSON.stringify(newProfile));

    if (step < 2) {
      setStep(1);
    } else {
      setShowSettings(false);
      showNotify("Baseline saved");
    }
  };

  return (
    <div className={`min-h-screen w-full transition-all duration-700 font-mono flex flex-col items-center justify-center relative overflow-hidden ${isDarkMode ? 'bg-[#000508] text-white' : 'bg-[#EBF5F8] text-neutral-800'}`}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-alkaline-400/30 dark:bg-alkaline-500/10 blur-[150px] rounded-full animate-liquid-bg"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-aqua-500/20 dark:bg-alkaline-800/10 blur-[150px] rounded-full animate-liquid-bg" style={{ animationDelay: '-10s' }}></div>
      </div>

      {notification && (
        <div
          onClick={() => setNotification(null)}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[110] backdrop-blur-3xl bg-alkaline-500/90 dark:bg-alkaline-400/80 px-8 py-4 rounded-full font-black text-white shadow-2xl border border-white/50 cursor-pointer animate-in fade-in zoom-in slide-in-from-top-8 duration-500 tracking-widest text-[10px]"
        >
          {notification}
        </div>
      )}

      {tutorialActive && (
        <div className="fixed inset-0 z-[200] transition-all duration-500 pointer-events-none">
          {tutorialGoals[tutStep] && (
            <div
              className="absolute glass-card p-6 border-alkaline-400/30 shadow-2xl animate-in zoom-in fade-in duration-500 max-w-xs text-center pointer-events-auto"
              style={tooltipStyle}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 alkaline-gradient rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-neutral-800 dark:text-white leading-relaxed italic">"{tutorialGoals[tutStep].text}"</p>
                  {tutWarning && (
                    <div className="mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-alkaline-500/10 border border-alkaline-500/30 text-[9px] font-black tracking-widest text-alkaline-600 dark:text-alkaline-400 animate-pulse">
                      {tutWarning === 'up' ? '▲ Scroll Up to Locate Target' : '▼ Scroll Down to Locate Target'}
                    </div>
                  )}
                  {tutStep === 18 && (
                    <button
                      id="btn-start-game"
                      onClick={startMainGame}
                      className="mt-4 w-full alkaline-gradient h-10 rounded-full font-black capitalize tracking-widest text-white shadow-lg hover:scale-105 active:scale-95 transition-all text-[10px]"
                    >
                      Start Game
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="max-w-6xl w-full p-6 z-10 relative flex flex-col items-center justify-center min-h-screen">
        {step === 0 && (
          <div className="glass-container max-w-lg w-full p-8 border-white/20 shadow-2xl overflow-hidden flex flex-col items-center">
            <h1 className="text-4xl font-black alkaline-text mb-4 text-center capitalize tracking-tighter leading-none">Hydraline City</h1>
            <p className="text-neutral-400 dark:text-neutral-500 mb-10 text-[9px] text-left capitalize tracking-[0.2em] font-black opacity-60 max-w-sm">Establish Your Presence Within The Metropolis By Registering Your Biological Signature And Aligning With Our System Protocol. Rest Assured, All Biological Data Is Heavily Encrypted And Processed Within A Secure, Private Environment To Guarantee Your Total Privacy.</p>
            <div className="w-full">
              <RegistrationInputs data={draftProfile} onChange={setDraftProfile} hUnit={hUnit} setHUnit={setHUnit} wUnit={wUnit} handleHUnitChange={handleHUnitChange} handleWUnitChange={handleWUnitChange} showCalendar={showCalendar} setShowCalendar={setShowCalendar} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            </div>
            <button onClick={onSaveProfile} className={`w-full mt-10 glass-button alkaline-gradient text-white border-white/40 shadow-xl hover:scale-105 active:scale-95 px-0`}>
              Synchronize
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="glass-container max-w-lg w-full p-8 text-center border-white/20 shadow-2xl">
            <button onClick={() => setStep(0)} className="w-10 h-10 glass-button p-0 flex items-center justify-center font-black transition-all hover:scale-110 active:scale-90 mb-8"><Icon name="chevronLeft" className="w-5 h-5" /></button>
            <h1 className="text-3xl font-black mb-6 capitalize tracking-tighter alkaline-text leading-none">Privacy & Permission</h1>
            <p className="text-[11px] mb-10 text-neutral-500 dark:text-neutral-400 text-left leading-relaxed capitalize tracking-widest font-black opacity-70">To Operate Effectively Within Hydraline City, Your System Must Sync With Local Environmental Data. Enable Real-Time Synchronization To Automatically Calibrate Your Metabolic Baseline And Protect Your Integrity Within High-Activity Zones. Rest Assured, All Biological Data Is Heavily Encrypted And Processed Within A Secure, Private Environment To Guarantee Your Total Privacy.</p>

            <div className="my-10 flex items-center justify-between glass-card p-6 border-alkaline-500/20 shadow-inner rounded-full">
              <span className="text-[10px] capitalize font-black tracking-widest alkaline-text opacity-70">Location Services</span>
              <button type="button" onClick={handleLocationToggle} className={`w-20 h-8 rounded-full transition-all duration-500 relative border border-white/30 ${profile?.loc ? 'alkaline-gradient shadow-lg' : 'bg-neutral-300 dark:bg-neutral-800'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-2xl transition-all duration-500 shadow-xl ${profile?.loc ? 'left-12' : 'left-1'}`} />
              </button>
            </div>

            <button onClick={() => {
              if (profile) {
                setStep(2);
                localStorage.setItem('Hydraline City_profile', JSON.stringify(profile));
                if (!localStorage.getItem('Hydraline City_tutorial_shown')) {
                  setTutorialActive(true);
                  setIsFirstTimeTutorial(true);
                  setAssetFlasks([{ id: Date.now(), typeIndex: 3, current: 0 }]);
                  localStorage.setItem('Hydraline City_tutorial_shown', 'true');
                }
                showNotify("Metropolis Active");
              }
            }} className="w-full alkaline-gradient h-12 rounded-full font-black capitalize tracking-[0.2em] text-white shadow-xl border border-white/40 text-[10px]">Initialize Simulation</button>
          </div>
        )}

        {step === 2 && (
          <div className={`transition-all duration-1000 w-full flex flex-col items-center justify-center ${isPaused ? 'suspended-animation' : 'blur-0 scale-100 opacity-100'}`}>
            <header className={`mb-10 glass-container p-10 flex flex-col sm:flex-row justify-between items-center w-full border-white/20 gap-8 transition-all ${showSettings || showShop ? 'shadow-none' : 'shadow-2xl'} max-w-5xl`}>
              <div className="text-center sm:text-left flex-1 w-full sm:w-auto">
                <div className="flex items-end gap-3 mb-2">
                  <h1 className="text-4xl md:text-6xl font-black alkaline-text capitalize tracking-tighter leading-none">{integrity.toFixed(1)}%</h1>
                  <span className="text-[10px] tracking-widest opacity-40 capitalize font-black mb-1 leading-none">Stability</span>
                </div>
                <div className="w-full max-w-sm bg-neutral-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden border border-white/5 relative mb-4">
                  <div className="h-full alkaline-gradient transition-all duration-1000 shadow-[0_0_10px_#00bcd4]" style={{ width: `${integrity}%` }}></div>
                </div>
                <p className="text-[9px] text-neutral-400 dark:text-neutral-500 capitalize tracking-[0.2em] font-black opacity-60">Metabolic storage: {formatVolume(totalDrunk)}</p>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                  <button onClick={() => setIsPaused(!isPaused)} className={`w-14 h-14 glass-button px-0 shadow-xl pointer-events-auto ${isPaused ? 'alkaline-gradient text-white border-white/50' : 'text-alkaline-600 dark:text-alkaline-400'}`}><Icon name={isPaused ? "play" : "pause"} className="w-6 h-6" /></button>
                  <span className="text-[9px] font-black opacity-40 capitalize tracking-widest leading-none">{isPaused ? 'Play' : 'Pause'}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-14 h-14 glass-button px-0 text-alkaline-600 dark:text-alkaline-400 shadow-xl pointer-events-auto"><Icon name={isDarkMode ? "sun" : "moon"} className="w-6 h-6" /></button>
                  <span className="text-[9px] font-black opacity-40 capitalize tracking-widest leading-none">Mode</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button onClick={() => setShowSettings(true)} className="w-14 h-14 glass-button px-0 text-alkaline-600 dark:text-alkaline-400 shadow-xl pointer-events-auto"><Icon name="settings" className="w-6 h-6" /></button>
                  <span className="text-[9px] font-black opacity-40 capitalize tracking-widest leading-none">Settings</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button id="btn-shop" disabled={integrity <= 0} onClick={() => {
                    if (tutorialActive) {
                      if (tutStep === 3) setTutStep(4);
                      else if (tutStep === 8) setTutStep(9);
                      else if (tutStep === 14) setTutStep(15);
                    }
                    setShowShop(true);
                  }} className={`w-14 h-14 glass-button px-0 shadow-xl pointer-events-auto ${integrity <= 0 ? 'opacity-20 grayscale' : 'text-alkaline-600 dark:text-alkaline-400'} ${getHighlightClass('btn-shop')}`}><Icon name="cart" className="w-6 h-6" /></button>
                  <span className="text-[9px] font-black opacity-40 capitalize tracking-widest leading-none">Shop</span>
                </div>
              </div>
            </header>

            {showSettings && (
              <div className="fixed inset-0 bg-black/40 z-[60] overflow-y-auto backdrop-blur-[50px] p-6 flex items-center justify-center">
                <div className="glass-container max-w-lg w-full p-8 border-white/30 shadow-none flex flex-col items-center">
                  <div className="flex justify-between items-center mb-8 w-full">
                    <h2 className="text-2xl font-black alkaline-text capitalize tracking-tighter leading-none">Settings</h2>
                    <button onClick={() => setShowSettings(false)} className="w-10 h-10 glass-button flex items-center justify-center text-red-500 text-xl p-0 shadow-none transition-all hover:scale-110 active:scale-90"><Icon name="close" /></button>
                  </div>

                  <form onSubmit={onSaveProfile} noValidate className="space-y-6 w-full">
                    <RegistrationInputs data={draftProfile} onChange={handleSettingsFormChange} hUnit={hUnit} setHUnit={handleHUnitChange} wUnit={wUnit} handleHUnitChange={handleHUnitChange} handleWUnitChange={handleWUnitChange} showCalendar={showCalendar} setShowCalendar={setShowCalendar} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                    <div className="flex items-center justify-between glass-card p-6 border-alkaline-500/20 shadow-inner rounded-full">
                      <span className="text-[10px] capitalize font-black tracking-widest opacity-60">Location Services</span>
                      <button type="button" onClick={handleLocationToggle} className={`w-20 h-8 rounded-full transition-all duration-500 relative border border-white/30 ${profile.loc ? 'alkaline-gradient shadow-lg' : 'bg-neutral-300 dark:bg-neutral-800'}`}>
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-xl ${profile.loc ? 'left-12' : 'left-1'}`} />
                      </button>
                    </div>
                    <button type="submit" className={`w-full h-14 rounded-full font-black capitalize tracking-[0.2em] text-[10px] transition-all border flex items-center justify-center ${(isSettingsDirty() || profile.loc !== JSON.parse(localStorage.getItem('Hydraline City_profile') || '{}').loc) ? 'alkaline-gradient text-white border-white/40 shadow-xl hover:scale-105 active:scale-95' : 'bg-neutral-200 dark:bg-white/5 border-transparent text-neutral-400 opacity-40 cursor-default shadow-none'}`}>
                      Save Changes
                    </button>
                  </form>

                  <div className="mt-10 text-center w-full">
                    {!showResetConfirm ? (
                      <button onClick={() => setShowResetConfirm(true)} className="glass-button w-full h-12 text-red-500 border-red-500/20 hover:bg-red-500/10 shadow-none font-black text-[9px] capitalize tracking-[0.3em]">
                        <Icon name="reset" className="w-3 h-3 mr-2" />
                        Reset All Data
                      </button>
                    ) : (
                      <div className="flex gap-4 animate-in fade-in zoom-in duration-300">
                        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="flex-1 bg-red-600/80 text-white py-3 h-12 rounded-full font-black capitalize text-[9px] tracking-widest shadow-xl border border-red-400/30">Confirm</button>
                        <button onClick={() => { setShowResetConfirm(false); }} className="flex-1 glass-button py-3 h-12 text-neutral-500 font-black capitalize text-[9px] tracking-widest border-white/10 shadow-none">Cancel</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showShop && (
              <div className="fixed inset-0 bg-black/40 z-[140] overflow-y-auto backdrop-blur-[60px] p-6 flex items-center justify-center">
                <div className="glass-container max-w-screen-2xl w-full p-10 border-white/30 shadow-none relative overflow-hidden flex flex-col max-h-[95vh]">
                  <div className="flex justify-between items-center mb-10 relative w-full">
                    <h2 className="text-4xl font-black alkaline-text uppercase tracking-tighter leading-none">Shop</h2>
                    <button id="btn-close-shop" onClick={() => { setShowShop(false); if (tutorialActive) { if (tutStep === 5) setTutStep(6); else if (tutStep === 11) setTutStep(12); else if (tutStep === 17) setTutStep(18); } }} className={`w-12 h-12 glass-button flex items-center justify-center text-red-500 text-2xl p-0 shadow-none transition-all hover:scale-110 active:scale-90 ${getHighlightClass('btn-close-shop')}`}><Icon name="close" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative w-full flex-1 overflow-y-auto custom-scrollbar">
                    <div className="glass-card p-10 border-white/15 bg-white/5 flex flex-col h-[580px] overflow-hidden space-y-6 rounded-2xl">
                      <h3 className="text-alkaline-500 font-black capitalize text-[10px] tracking-widest border-b border-white/10 pb-4">Faucet Technology</h3>
                      <div className="space-y-4 flex-1 overflow-y-auto pr-3 custom-scrollbar">
                        {FAUCET_NAMES.map((n, i) => (
                          <button key={i} id={`faucet-item-${i}`} onClick={() => { setSelectedFaucet(selectedFaucet === i ? null : i); if (tutorialActive && tutStep === 15 && i === 1) setTutStep(16); }} className={`block w-full text-right p-6 border transition-all rounded-2xl ${selectedFaucet === i ? 'alkaline-gradient text-white border-white/40 scale-[1.02]' : (faucetLevel === i ? 'bg-alkaline-500/10 border-alkaline-500/40 opacity-100' : 'bg-white/5 border-transparent opacity-60 hover:opacity-100 hover:bg-white/10')} ${getHighlightClass(`faucet-item-${i}`)}`}>
                            <div className="font-black text-[11px] capitalize mb-2 tracking-widest">{n}</div>
                            <div className="text-[10px] opacity-70 font-black capitalize tracking-widest italic leading-none mb-4">Flow: {formatVolume(FAUCET_RATES[i])} per click</div>
                            <div className="flex justify-end gap-3 text-[9px] font-black opacity-40 capitalize">
                              <span className={zones.residential >= FAUCET_REQS[i].res ? 'text-green-500' : ''}>{zones.residential}/{FAUCET_REQS[i].res} Residential</span>
                              <span className={zones.commercial >= FAUCET_REQS[i].com ? 'text-green-500' : ''}>{zones.commercial}/{FAUCET_REQS[i].com} Commercial</span>
                              <span className={zones.industrial >= FAUCET_REQS[i].ind ? 'text-green-500' : ''}>{zones.industrial}/{FAUCET_REQS[i].ind} Industrial</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      <button id="btn-buy-faucet" disabled={selectedFaucet === null || selectedFaucet === faucetLevel} onClick={executeFaucetPurchase} className={`w-full h-14 rounded-full font-black capitalize tracking-widest text-[10px] transition-all border flex items-center justify-center ${selectedFaucet === null || selectedFaucet === faucetLevel ? 'bg-neutral-200 dark:bg-white/5 text-neutral-400 opacity-20 cursor-default' : 'alkaline-gradient text-white border-white/40 shadow-xl hover:scale-[1.02] active:scale-95'} ${getHighlightClass('btn-buy-faucet')}`}>
                        Upgrade Engine
                      </button>
                    </div>

                    <div className="glass-card p-10 border-white/15 bg-white/5 flex flex-col h-[580px] overflow-hidden space-y-6 text-center rounded-2xl ml-8">
                      <h3 className="text-alkaline-500 font-black capitalize text-[10px] tracking-widest border-b border-white/10 pb-4 text-center">Operational Core</h3>
                      <div className="glass-card p-6 text-center border-alkaline-500/20 bg-alkaline-500/5 flex-1 flex flex-col justify-center overflow-hidden rounded-2xl max-w-sm mx-auto w-full">
                        <div className="flex-1 flex flex-col justify-center overflow-y-auto custom-scrollbar pr-1">
                          <div className="text-2xl font-black alkaline-text mb-4 tracking-tighter leading-tight">{FLASK_NAMES[replicaFlask.typeIndex]}</div>
                          <div className="w-full bg-neutral-200 dark:bg-black/40 h-3 rounded-full mb-4 overflow-hidden relative border border-white/10 p-0.5 mx-auto">
                            <div className="h-full alkaline-gradient rounded-full transition-all duration-[1500ms] shadow-[0_0_15px_#00bcd4]" style={{ width: `${Math.min(100, (replicaFlask.current / (FLASK_CAPS[replicaFlask.typeIndex] * 1000 * 0.8)) * 100)}%` }}></div>
                          </div>
                          <div className="text-[10px] font-black alkaline-text capitalize tracking-widest italic leading-none">{formatVolume(replicaFlask.current)} / {formatVolume(FLASK_CAPS[replicaFlask.typeIndex] * 1000 * 0.8)}</div>
                        </div>
                      </div>
                      <div className="flex gap-4 justify-center max-w-sm mx-auto w-full">
                        <button
                          id="btn-evolve"
                          onClick={upgradeReplicaFlask}
                          disabled={replicaFlask.current < (FLASK_CAPS[replicaFlask.typeIndex] * 1000 * 0.8) || replicaFlask.typeIndex >= FLASK_CAPS.length - 1}
                          className={`flex-1 h-14 rounded-full font-black capitalize tracking-widest text-[10px] border border-white/40 shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center ${replicaFlask.current < (FLASK_CAPS[replicaFlask.typeIndex] * 1000 * 0.8) || replicaFlask.typeIndex >= FLASK_CAPS.length - 1 ? 'bg-neutral-200 dark:bg-white/5 text-neutral-400 opacity-20 cursor-default' : 'alkaline-gradient text-white'} ${getHighlightClass('btn-evolve')}`}
                        >Evolve</button>
                        <button
                          onClick={downgradeReplicaFlask}
                          disabled={replicaFlask.typeIndex <= 0}
                          className={`flex-1 h-14 rounded-full font-black capitalize tracking-widest text-[10px] flex items-center justify-center ${replicaFlask.typeIndex <= 0 ? 'bg-neutral-200 dark:bg-white/5 text-neutral-400 opacity-20 cursor-default' : 'glass-button text-alkaline-400 border-alkaline-500/30'}`}
                        >Revert</button>
                      </div>
                    </div>

                    <div className="glass-card p-10 border-white/15 bg-white/5 flex flex-col h-[580px] overflow-hidden space-y-6 rounded-2xl">
                      <div className="flex justify-between items-end border-b border-white/10 pb-4">
                        <h3 className="text-alkaline-500 font-black capitalize text-[10px] tracking-widest">Industrial Assets</h3>
                        <div className="text-[10px] text-alkaline-600 font-black italic leading-none">Bank: {formatVolume(totalDrunk)}</div>
                      </div>
                      <div className="space-y-4 h-[380px] overflow-y-auto pr-3 custom-scrollbar flex-1">
                        {FLASK_NAMES.map((n, i) => {
                          const cost = ASSET_DRINK_COSTS[replicaFlask.typeIndex];
                          const maxAllowed = Math.min(FLASK_NAMES.length - 1, replicaFlask.typeIndex + 1);
                          const isLocked = i > maxAllowed;
                          return (
                            <button key={i} id={`asset-item-${i}`} disabled={isLocked} onClick={() => { setSelectedAssetType(selectedAssetType === i ? null : i); if (tutorialActive && tutStep === 9 && i === 2) setTutStep(10); }} className={`block w-full text-right p-6 border transition-all rounded-2xl ${selectedAssetType === i ? 'alkaline-gradient text-white border-white/40 scale-[1.02]' : (isLocked ? 'opacity-10 grayscale border-transparent' : 'bg-white/5 border-transparent opacity-70 hover:opacity-100 hover:bg-white/10')} ${getHighlightClass(`asset-item-${i}`)}`}>
                              <div className="font-black text-[12px] capitalize mb-2 tracking-widest">{n}</div>
                              <div className="text-[10px] opacity-70 font-black capitalize tracking-widest italic leading-none text-alkaline-400 mb-2">Max Capacity: {formatVolume(FLASK_CAPS[i] * 1000)}</div>
                              <div className="text-[10px] opacity-60 font-black capitalize tracking-widest italic leading-none text-neutral-400">Requirement: {formatVolume(cost)}</div>
                            </button>
                          );
                        })}
                      </div>
                      <button id="btn-buy-asset" disabled={selectedAssetType === null} onClick={buyAssetFlask} className={`w-full h-14 rounded-full font-black capitalize tracking-widest text-[10px] transition-all border flex items-center justify-center ${selectedAssetType === null ? 'bg-neutral-200 dark:bg-white/5 text-neutral-400 opacity-20 cursor-default' : 'alkaline-gradient text-white border-white/40 shadow-xl hover:scale-[1.02] active:scale-95'} ${getHighlightClass('btn-buy-asset')}`}>
                        Initialize Deployment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12 w-full transition-all ${showSettings || showShop ? 'shadow-none opacity-20 scale-95 blur-xl' : 'shadow-2xl scale-100 opacity-100'} max-w-5xl`}>
              <section className="glass-container p-10 flex flex-col gap-8 relative overflow-hidden group border-white/20 w-full shadow-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-alkaline-500/5 rounded-full -mr-32 -mt-32 group-hover:bg-alkaline-500/10 transition-all duration-[2000ms] animate-liquid-bg"></div>
                <h2 className="text-[11px] font-black alkaline-text capitalize tracking-[0.2em] flex items-center gap-4 leading-none">
                  <div className="w-3 h-3 alkaline-gradient rounded-full shadow-[0_0_20px_#00bcd4] animate-ping opacity-40"></div>
                  Vitality Engine
                </h2>
                <div className="flex flex-col items-center py-6">
                  <FaucetVisual typeIndex={faucetLevel} />
                  <VesselVisual typeIndex={replicaFlask.typeIndex} current={replicaFlask.current} max={FLASK_CAPS[replicaFlask.typeIndex] * 1000} />
                </div>
                <div className="glass-card p-10 bg-alkaline-500/5 border-white/10 flex justify-between items-center shadow-inner group-hover:border-alkaline-500/40 transition-all duration-700 w-full">
                  <div className="space-y-2 text-left">
                    <span className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 capitalize tracking-widest block opacity-70">Primary Hydroflask</span>
                    <span className="text-2xl font-black capitalize tracking-tighter text-neutral-800 dark:text-white group-hover:alkaline-text transition-colors duration-700 leading-tight">{FLASK_NAMES[replicaFlask.typeIndex]}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-6xl font-black alkaline-text block tabular-nums tracking-tighter leading-none group-hover:scale-105 transition-transform duration-1000">{formatVolume(replicaFlask.current)}</span>
                    <span className="text-[11px] opacity-30 capitalize tracking-[0.2em] font-black block mt-6 italic leading-none">out of {formatVolume(FLASK_CAPS[replicaFlask.typeIndex] * 1000)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <button id="btn-collect" onClick={collectToReplica} className={`alkaline-gradient h-16 rounded-full font-black capitalize tracking-[0.2em] text-[11px] shadow-2xl border border-white/40 hover:scale-105 active:scale-95 transition-all text-white ${getHighlightClass('btn-collect')}`}>Collect</button>
                  <button id="btn-consume" onClick={drink} className={`glass-button h-16 text-alkaline-600 dark:text-alkaline-400 font-black capitalize tracking-[0.2em] text-[11px] shadow-xl hover:bg-alkaline-500/10 transition-all border-alkaline-400/20 ${getHighlightClass('btn-consume')}`}>Consume</button>
                </div>
              </section>

              <section className="glass-container p-10 flex flex-col gap-8 border-white/20 w-full justify-center shadow-none">
                <h2 className="text-[11px] font-black text-neutral-400 capitalize tracking-[0.2em] flex items-center gap-4 opacity-50 leading-none">
                  <div className="w-3 h-3 bg-neutral-300 dark:bg-neutral-800 rounded-full shadow-inner"></div>
                  Grid Logistics
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { name: 'Residential', type: 3, color: 'from-cyan-400 via-blue-500 to-blue-600 shadow-cyan-500/30' },
                    { name: 'Commercial', type: 4, color: 'from-blue-500 via-indigo-600 to-indigo-700 shadow-blue-600/30' },
                    { name: 'Industrial', type: 5, color: 'from-indigo-600 via-alkaline-600 to-alkaline-800 shadow-indigo-700/30' }
                  ].map(z => {
                    let targetType = z.type;
                    if (tutorialActive && z.name.toLowerCase() === 'residential') {
                      targetType = 2;
                    }
                    const required = zones[z.name.toLowerCase() as keyof typeof zones] + 1;
                    const validFlasks = assetFlasks.filter(f => f.typeIndex === targetType && f.current >= FLASK_CAPS[f.typeIndex] * 1000).length;
                    return (
                      <div key={z.name} className="glass-card p-8 bg-white/5 border-white/10 shadow-inner group">
                        <h3 className="font-black text-neutral-400 dark:text-neutral-500 mb-2 capitalize text-[9px] tracking-widest opacity-60 text-left">{z.name}</h3>
                        <div className="text-5xl font-black mb-4 text-neutral-800 dark:text-white tabular-nums tracking-tighter group-hover:alkaline-text transition-colors duration-700 text-left leading-none">{zones[z.name.toLowerCase() as keyof typeof zones]}</div>
                        <div className="text-[8px] font-black opacity-30 capitalize tracking-widest mb-6 text-left">{FLASK_NAMES[targetType]} ({validFlasks}/{required})</div>
                        <button id={`btn-build-${z.name.toLowerCase()}`} disabled={integrity <= 0 || isPaused || (tutorialActive && (tutStep !== 13 || z.name.toLowerCase() !== 'residential'))} onClick={() => build(z.name.toLowerCase() as keyof typeof zones)} className={`w-full h-12 rounded-full font-black text-[9px] capitalize tracking-[0.2em] transition-all border-2 border-white/30 shadow-2xl hover:brightness-110 active:scale-95 hover:scale-110 ${integrity <= 0 || isPaused || (tutorialActive && (tutStep !== 13 || z.name.toLowerCase() !== 'residential')) ? 'opacity-10 grayscale cursor-default' : `bg-gradient-to-r ${z.color} text-white`} ${getHighlightClass(`btn-build-${z.name.toLowerCase()}`)}`}>Build</button>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className={`glass-container p-12 border-white/20 mb-10 w-full flex flex-col transition-all ${showSettings || showShop ? 'shadow-none opacity-20 scale-95 blur-xl' : 'shadow-2xl scale-100 opacity-100'} max-w-5xl`}>
              <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-10 w-full">
                <h3 className="text-xs font-black text-neutral-400 capitalize tracking-[0.2em] opacity-40 leading-none">Active Asset Fleet Grid</h3>
                <div className="flex items-center gap-6">
                  <span className="text-[10px] text-alkaline-600 dark:text-alkaline-400 font-black capitalize tracking-[0.2em] bg-alkaline-500/10 px-8 py-4 rounded-full border border-alkaline-500/30 shadow-inner">
                    {assetFlasks.length} Unit{assetFlasks.length !== 1 ? 's' : ''} Synced
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-h-[600px] overflow-y-auto pr-6 custom-scrollbar">
                {assetFlasks.map((f) => (
                  <div key={f.id} className="glass-card p-12 bg-white/5 border-white/10 shadow-xl relative overflow-hidden flex flex-col items-center text-center leading-none">
                    <div className="text-[10px] opacity-30 mb-6 capitalize font-black tracking-widest group-hover:text-alkaline-500 group-hover:opacity-100 transition-all text-center leading-tight">{FLASK_NAMES[f.typeIndex]}</div>
                    <div className="text-xl font-black alkaline-text mb-4 tabular-nums tracking-tighter text-center leading-none">
                      {formatVolume(f.current)} <span>out of {formatVolume(FLASK_CAPS[f.typeIndex] * 1000)}</span>
                    </div>
                    <button id="btn-collect-asset" onClick={() => collectToSpecificAsset(f.id)} className={`w-full h-12 alkaline-gradient text-white py-0 rounded-full text-[9px] font-black capitalize tracking-[0.2em] shadow-lg border border-white/40 hover:brightness-110 active:scale-90 transition-all flex items-center justify-center ${tutorialActive && tutStep === 7 && f.typeIndex === 3 ? 'tutorial-highlight !pointer-events-auto relative z-[210]' : ''}`}>Collect</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HydralineCityApp;
