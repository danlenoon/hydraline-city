import React, { useState, useEffect, useRef } from 'react';

const FAUCET_RATES = [1, 10, 100, 1000, 10000, 50000, 100000];
const FAUCET_NAMES = ['Mini', 'Neo', 'Plus', 'Pro', 'Max', 'Ultra', 'Extreme'];
const FAUCET_REQS = [
  { res: 0, com: 0, ind: 0 }, { res: 10, com: 0, ind: 0 }, { res: 25, com: 5, ind: 0 },
  { res: 50, com: 25, ind: 5 }, { res: 150, com: 75, ind: 15 }, { res: 250, com: 100, ind: 25 }, { res: 1000, com: 500, ind: 250 },
];
const FLASK_CAPS = [0.25, 0.5, 1, 2, 4, 6, 10, 25, 100, 250, 500, 1000]; 
const FLASK_NAMES = ['Mini', 'Neo', 'Plus', 'Pro', 'Max', 'Ultra', 'Extreme', 'Hydrodispenser', 'Dispenser Pro', 'Dispenser Max', 'Dispenser Ultra', 'Dispenser Extreme'];
const ASSET_DRINK_COSTS = [500, 1500, 3000, 6000, 9000, 15000, 30000, 90000, 250000, 720000, 1500000, 5000000]; // in mL

interface Flask { id: number; typeIndex: number; current: number; }

const formatVolume = (ml: number) => {
  if (ml < 1000) return `${Math.floor(ml)}mL`;
  return `${(ml / 1000).toFixed(2)}L`;
};

const Calendar = ({ initialDate, onSelect, onClose }: { initialDate: string, onSelect: (d: string) => void, onClose: () => void }) => {
  const parseDate = (dStr: string) => {
    const parts = dStr.split('-');
    if (parts.length !== 3) return new Date();
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
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

  return (
    <div ref={ref} className="bg-neutral-900 p-4 border border-sky-500 w-full z-50 shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-lg text-white my-2">
      <div className="flex justify-between items-center mb-4 text-xs">
        <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} className="hover:text-sky-400 p-2 font-black">{'<'}</button>
        <span className="font-black text-[10px] uppercase tracking-widest text-sky-400">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="hover:text-sky-400 p-2 font-black">{'>'}</button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className="text-[9px] font-black text-neutral-500">{d}</div>
        ))}
        {padding.map(p => <div key={`p-${p}`} />)}
        {days.map(d => {
          const isSelected = initialDate === `${year}-${month + 1}-${d}`;
          return (
            <button 
              type="button" 
              key={d} 
              onClick={() => onSelect(`${year}-${month + 1}-${d}`)} 
              className={`p-2 text-[9px] font-bold rounded transition-all hover:scale-110 active:scale-95 border ${isSelected ? 'bg-sky-600 border-sky-400 text-white shadow-[0_0_10px_rgba(2,132,199,0.5)]' : 'bg-black border-sky-900/30 hover:bg-sky-900 text-neutral-300'}`}
            >
              {d}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 mt-4 border-t border-sky-900/30 pt-4">
        <button type="button" onClick={setToday} className="flex-1 bg-sky-900/50 hover:bg-sky-800 p-2 text-[9px] font-black uppercase tracking-tighter rounded border border-sky-500/30 transition-colors">Today</button>
        <button type="button" onClick={onClose} className="flex-1 bg-red-900/50 hover:bg-red-800 p-2 text-[9px] font-black uppercase tracking-tighter rounded border border-red-500/30 transition-colors">Close</button>
      </div>
    </div>
  );
};

const RegistrationInputs = ({ data, onChange, hUnit, setHUnit, wUnit, setWUnit, showCalendar, setShowCalendar, selectedDate, setSelectedDate }: any) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dateParts = selectedDate ? selectedDate.split('-') : [data?.year || new Date().getFullYear().toString(), data?.month || "1", data?.day || "1"];
  const curY = dateParts[0];
  const curM = dateParts[1];
  const curD = dateParts[2];

  const handleLocalChange = (e: any) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <>
      <input name="name" value={data?.name || ''} onChange={handleLocalChange} placeholder="Name" className="block w-full bg-black p-3 my-2 border border-sky-900 focus:border-sky-500 outline-none rounded text-white text-left" required />
      
      <div className="flex gap-2 my-2 w-full">
        <input type="hidden" name="sex" value={data?.sex || ''} />
        {['Male', 'Female', 'Others'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange({ ...data, sex: s })}
            className={`flex-1 py-3 border rounded text-[10px] font-black uppercase tracking-widest transition-all ${data?.sex === s ? 'bg-sky-700 border-sky-400 text-white shadow-[0_0_10px_rgba(2,132,199,0.3)]' : 'bg-black border-sky-900 text-neutral-500 hover:border-sky-700'}`}
          >
            {s}
          </button>
        ))}
      </div>
      
      <div className="flex gap-2 my-2 w-full text-white">
        <select 
          name="month" 
          value={curM} 
          onChange={(e) => { 
            const newDate = `${curY}-${e.target.value}-${curD}`;
            setSelectedDate(newDate); 
            onChange({ ...data, month: e.target.value });
            setShowCalendar(false); 
          }}
          onClick={() => setShowCalendar(false)}
          className="w-1/3 bg-black p-3 border border-sky-900 text-xs rounded text-right [text-align-last:right]" required
        >
            {months.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
        </select>
        <select 
          name="day" 
          value={curD} 
          onChange={(e) => { 
            const newDate = `${curY}-${curM}-${e.target.value}`;
            setSelectedDate(newDate); 
            onChange({ ...data, day: e.target.value });
            setShowCalendar(false); 
          }}
          onClick={() => setShowCalendar(false)}
          className="w-1/3 bg-black p-3 border border-sky-900 text-xs rounded text-right [text-align-last:right]" required
        >
            {Array.from({length: 31}, (_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
        </select>
        <div className="w-1/3 flex">
            <select 
              name="year" 
              value={curY} 
              onChange={(e) => { 
                const newDate = `${e.target.value}-${curM}-${curD}`;
                setSelectedDate(newDate); 
                onChange({ ...data, year: e.target.value });
                setShowCalendar(false); 
              }}
              onClick={() => setShowCalendar(false)}
              className="w-full bg-black p-3 border border-sky-900 text-xs rounded text-right [text-align-last:right]" required
            >
                {Array.from({length: new Date().getFullYear() - 1583 + 1}, (_, i) => <option key={i} value={new Date().getFullYear()-i}>{new Date().getFullYear()-i}</option>)}
            </select>
            <button type="button" onClick={() => {
                const parts = [data.year, data.month, data.day];
                setSelectedDate(parts.join('-'));
                setShowCalendar(!showCalendar);
            }} className="p-3 bg-neutral-900 border border-sky-900 border-l-0 rounded-r hover:bg-neutral-800 text-white text-xs">📅</button>
        </div>
      </div>

      {showCalendar && <Calendar initialDate={selectedDate} onSelect={(d) => { 
          setSelectedDate(d); 
          const [y, m, day] = d.split('-');
          onChange({ ...data, year: y, month: m, day: day });
      }} onClose={() => setShowCalendar(false)} />}

      <div className="flex gap-2 my-2 items-center text-white">
        {hUnit === 'ft' ? (
            <div className="flex-1 flex gap-2">
                <input name="ft" type="number" min="0" step="1" value={data?.ft || ''} onChange={handleLocalChange} placeholder="ft" className="w-1/2 bg-black p-3 border border-sky-900 rounded outline-none text-right" required />
                <input name="in" type="number" min="0" step="1" value={data?.in || ''} onChange={handleLocalChange} placeholder="in" className="w-1/2 bg-black p-3 border border-sky-900 rounded outline-none text-right" required />
            </div>
        ) : (
            <input name="height" type="number" min="0" step="1" value={data?.height || ''} onChange={handleLocalChange} placeholder="Height" className="flex-1 bg-black p-3 border border-sky-900 rounded outline-none text-white text-right" required />
        )}
        <select value={hUnit} onChange={(e) => setHUnit(e.target.value)} className="bg-black p-3 border border-sky-900 text-xs rounded text-right [text-align-last:right]"><option value="cm">cm</option><option value="ft">ft/in</option><option value="in">in</option><option value="m">m</option></select>
      </div>
      <div className="flex gap-2 text-white">
        <input name="weight" type="number" min="0" step="1" value={data?.weight || ''} onChange={handleLocalChange} placeholder="Weight" className="flex-1 bg-black p-3 border border-sky-900 rounded outline-none text-right" required />
        <input type="hidden" name="wUnit" value={wUnit || ''} />
        <div className="flex gap-1">
          <button type="button" onClick={() => setWUnit('kg')} className={`px-4 py-2 border rounded text-[10px] font-black uppercase tracking-widest transition-all ${wUnit === 'kg' ? 'bg-sky-700 border-sky-400 text-white' : 'bg-black border-sky-900 text-neutral-500 hover:border-sky-700'}`}>kg</button>
          <button type="button" onClick={() => setWUnit('lbs')} className={`px-4 py-2 border rounded text-[10px] font-black uppercase tracking-widest transition-all ${wUnit === 'lbs' ? 'bg-sky-700 border-sky-400 text-white' : 'bg-black border-sky-900 text-neutral-500 hover:border-sky-700'}`}>lbs</button>
        </div>
      </div>
    </>
  );
};

const HydrailApp = () => {
  const today = new Date();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [draftProfile, setDraftProfile] = useState<any>({
    name: '', sex: '', 
    month: (today.getMonth() + 1).toString(), 
    day: today.getDate().toString(), 
    year: today.getFullYear().toString(),
    height: '', ft: '', in: '', weight: ''
  });
  const [replicaFlask, setReplicaFlask] = useState<Flask>({ id: Date.now(), typeIndex: 0, current: 0 });
  const [assetFlasks, setAssetFlasks] = useState<Flask[]>([]);
  const [faucetLevel, setFaucetLevel] = useState(0);
  const [zones, setZones] = useState({ residential: 0, commercial: 0, industrial: 0 });
  const [integrity, setIntegrity] = useState(100);
  const [showShop, setShowShop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
  const [hUnit, setHUnit] = useState('cm');
  const [wUnit, setWUnit] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [totalDrunk, setTotalDrink] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [selectedFaucet, setSelectedFaucet] = useState<number | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<number | null>(null);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const saved = localStorage.getItem('hydrail_profile');
    if (saved) {
      const p = JSON.parse(saved);
      setProfile(p);
      setDraftProfile(p);
      setHUnit(p.hUnit || 'cm');
      setWUnit(p.wUnit || null);
      if (p.year && p.month && p.day) setSelectedDate(`${p.year}-${p.month}-${p.day}`);
      setStep(2);
    }
  }, []);

  useEffect(() => {
    if (step !== 2 || isPaused) return;
    const interval = setInterval(() => {
      let decay = profile?.loc ? 0.01 : 0.005;
      setIntegrity(prev => {
        const next = Math.max(0, prev - decay);
        if (next <= 0) setShowShop(false);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, profile, isPaused]);

  const drink = () => {
    if (isPaused) return;
    const consumed = replicaFlask.current;
    if (consumed === 0) {
        showNotify("Human Vitality Unit is Empty");
        return;
    }
    setReplicaFlask(f => ({...f, current: 0}));
    setTotalDrink(prev => prev + consumed);
    const restore = consumed * 0.32;
    setIntegrity(prev => Math.min(100, prev + restore));
  };

  const upgradeReplicaFlask = () => {
    const threshold = FLASK_CAPS[replicaFlask.typeIndex] * 1000 * 0.8;
    if (replicaFlask.current >= threshold && replicaFlask.typeIndex < FLASK_CAPS.length - 1) {
        const newName = FLASK_NAMES[replicaFlask.typeIndex + 1];
        setReplicaFlask(f => ({...f, typeIndex: f.typeIndex + 1, current: 0}));
        setTotalDrink(0); 
        showNotify(`Upgraded Replica to ${newName}`);
    } else if (replicaFlask.typeIndex < FLASK_CAPS.length - 1) {
        showNotify("Insufficient fill level (80% req)");
    }
  };

  const downgradeReplicaFlask = () => {
    if (replicaFlask.typeIndex > 0) {
        const newName = FLASK_NAMES[replicaFlask.typeIndex - 1];
        setReplicaFlask(f => ({...f, typeIndex: f.typeIndex - 1, current: 0}));
        setTotalDrink(0); 
        showNotify(`Downgraded Replica to ${newName}`);
    }
  };

  const executeFaucetPurchase = () => {
    if (selectedFaucet === null) return;
    const req = FAUCET_REQS[selectedFaucet];
    if (zones.residential >= req.res && zones.commercial >= req.com && zones.industrial >= req.ind) {
        setFaucetLevel(selectedFaucet);
        showNotify(`Faucet Tech: ${FAUCET_NAMES[selectedFaucet]}`);
    } else {
        showNotify(`Requirements: ${req.res}R, ${req.com}C, ${req.ind}I`);
    }
  };

  const buyAssetFlask = () => {
    if (isPaused || selectedAssetType === null) return;
    const cost = ASSET_DRINK_COSTS[replicaFlask.typeIndex];
    const maxAllowedType = Math.min(FLASK_NAMES.length - 1, replicaFlask.typeIndex + 1);
    
    if (totalDrunk >= cost && selectedAssetType <= maxAllowedType) {
        setTotalDrink(0); 
        setAssetFlasks(prev => [...prev, { id: Date.now(), typeIndex: selectedAssetType, current: 0 }]);
        showNotify(`Purchased ${FLASK_NAMES[selectedAssetType]} Asset`);
        setSelectedAssetType(null);
    } else if (selectedAssetType > maxAllowedType) {
        showNotify("Tier Locked: Upgrade Replica First");
    } else {
        showNotify(`Insufficient Bank: ${formatVolume(cost)} Required`);
    }
  };

  const build = (zone: keyof typeof zones) => {
    if (isPaused) return;
    const required = zones[zone] + 1;
    const typeMap = { residential: 3, commercial: 4, industrial: 5 };
    const targetType = typeMap[zone];
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
      setZones(prev => ({...prev, [zone]: prev[zone] + 1}));
      showNotify(`Metropolis Expanded: ${zone.toUpperCase()}`);
    } else {
        showNotify(`Need ${required} Full ${FLASK_NAMES[targetType]} Flasks`);
    }
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
           wUnit !== p.wUnit;
  };

  const onSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegistrationComplete() && step === 0) {
        showNotify("Incomplete Demographics");
        return;
    }
    if (!isSettingsDirty() && step === 2) {
        showNotify("No Changes Detected");
        return;
    }

    const newProfile = { ...draftProfile, hUnit, wUnit, loc: profile?.loc ?? false };
    setProfile(newProfile);
    localStorage.setItem('hydrail_profile', JSON.stringify(newProfile));
    
    if (step < 2) {
        setStep(1);
        showNotify("Biometrics Synchronized");
    } else {
        setShowSettings(false);
        showNotify("Profile Synchronized");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-4 font-mono flex flex-col items-center relative">
      {notification && (
        <div 
            onClick={() => setNotification(null)}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-sky-600 px-6 py-3 rounded-full font-black shadow-[0_0_20px_rgba(2,132,199,0.5)] border border-sky-400 cursor-pointer hover:bg-sky-500 transition-colors"
        >
            {notification.toUpperCase()}
        </div>
      )}
      <div className="max-w-6xl w-full">
        {step === 0 && (
          <form onSubmit={onSaveProfile} noValidate className="bg-neutral-900 p-6 rounded-lg max-w-lg mx-auto mt-10 border border-sky-900/30 shadow-[0_0_50px_rgba(2,132,199,0.1)] text-white">
            <h1 className="text-3xl font-black text-sky-500 mb-2 text-center uppercase tracking-tighter">Welcome to Hydrail!</h1>
            <p className="text-neutral-400 mb-8 text-[10px] text-center uppercase tracking-widest leading-relaxed font-bold">Build a metropolis powered by your physical vitality. Sync your human replica and start your industrial expansion today.</p>
            <RegistrationInputs data={draftProfile} onChange={setDraftProfile} hUnit={hUnit} setHUnit={setHUnit} wUnit={wUnit} setWUnit={setWUnit} showCalendar={showCalendar} setShowCalendar={setShowCalendar} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <button className={`p-4 w-full mt-4 font-black uppercase tracking-widest transition-all border ${isRegistrationComplete() ? 'bg-sky-700 border-sky-500 hover:bg-sky-600 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-500 cursor-pointer'}`}>
                Continue
            </button>
          </form>
        )}
        {step === 1 && (
          <div className="max-w-lg mx-auto mt-10 p-8 bg-neutral-900 rounded-lg text-center border border-sky-900 shadow-2xl">
              <button onClick={() => setStep(0)} className="text-sky-500 font-bold mb-6 block text-left text-xs uppercase tracking-tighter hover:text-sky-400">← Back</button>
              <h1 className="text-2xl font-black mb-4 uppercase tracking-tighter">Location Services</h1>
              <p className="text-[10px] mb-8 text-neutral-400 text-left leading-relaxed uppercase tracking-widest">Enabling location services is essential for a dynamic and personalized Human Replica simulation. We use your current geolocation to fetch real-time weather, temperature, humidity, and sunset/sunrise data to dynamically adjust your physical integrity decay rate.</p>
              
              <div className="my-8 flex items-center justify-between bg-black p-4 border border-sky-900 rounded-lg shadow-inner text-white">
                  <span className="text-[10px] uppercase font-black tracking-widest">Geo-Adaptive Engine</span>
                  <button type="button" onClick={() => {
                      const next = !profile.loc;
                      setProfile((p: any) => ({...p, loc: next}));
                      showNotify(next ? "Geo-Adaptive Engaged" : "Baseline Engine Active");
                  }} className={`w-12 h-6 rounded-full transition-all duration-300 shadow-inner ${profile?.loc ? 'bg-green-600' : 'bg-red-900'}`}>
                      <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${profile?.loc ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
              </div>

              <button onClick={() => { 
                  setStep(2); 
                  localStorage.setItem('hydrail_profile', JSON.stringify(profile));
                  showNotify("Metropolis Initialized"); 
              }} className="bg-sky-700 p-6 w-full font-black uppercase tracking-widest hover:bg-sky-600 transition-colors shadow-lg text-white">Start Metropolis</button>
          </div>
        )}
        {step === 2 && (
          <>
            <header className="mb-6 border-b border-sky-900 pb-4 flex justify-between items-center w-full">
                <div>
                    <h1 className="text-xl md:text-3xl font-black text-sky-500 uppercase tracking-tighter text-left">Integrity: {integrity.toFixed(1)}%</h1>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-black text-left">Metabolic Bank: {formatVolume(totalDrunk)}</p>
                </div>
                <div className="flex gap-2 text-[10px]">
                    <button onClick={() => setIsPaused(!isPaused)} className={`${isPaused ? 'bg-green-700' : 'bg-neutral-800'} p-3 font-bold text-[9px] uppercase tracking-widest text-white`}>{isPaused ? 'Resume' : 'Pause'}</button>
                    <button onClick={() => setShowSettings(true)} className="bg-neutral-800 p-3 font-black uppercase tracking-widest hover:bg-neutral-700 transition-colors text-white">Settings</button>
                    <button disabled={integrity <= 0 || isPaused} onClick={() => setShowShop(true)} className={`p-3 font-black uppercase tracking-widest ${integrity <= 0 || isPaused ? 'bg-neutral-800 opacity-50 text-white' : 'bg-amber-700 hover:bg-amber-600 text-white'}`}>Shop</button>
                </div>
            </header>

            {showSettings && (
                <div className="fixed inset-0 bg-black/95 p-8 z-[60] overflow-y-auto backdrop-blur-sm text-white">
                    <div className="max-w-lg mx-auto bg-neutral-900 p-6 rounded-lg border border-sky-900 shadow-2xl">
                        <button onClick={() => setShowSettings(false)} className="bg-red-900 p-2 mb-4 text-[9px] font-black uppercase tracking-widest shadow-md text-white">Exit Settings</button>
                        <h2 className="text-xl font-black text-sky-400 mb-6 uppercase tracking-tighter text-center">Profile Configuration</h2>
                        <form onSubmit={onSaveProfile} noValidate>
                            <RegistrationInputs data={draftProfile} onChange={setDraftProfile} hUnit={hUnit} setHUnit={setHUnit} wUnit={wUnit} setWUnit={setWUnit} showCalendar={showCalendar} setShowCalendar={setShowCalendar} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                            <div className="my-4 flex items-center justify-between bg-black p-3 border border-sky-900 rounded-lg shadow-inner text-white">
                                <span className="text-[10px] uppercase font-black tracking-widest">Geo-Adaptive Engine</span>
                                <button type="button" onClick={() => {
                                    const next = !profile.loc;
                                    setProfile((p: any) => ({...p, loc: next}));
                                    showNotify(next ? "Geo-Adaptive Engaged" : "Baseline Engine Active");
                                }} className={`w-12 h-6 rounded-full transition-all duration-300 shadow-inner ${profile.loc ? 'bg-green-600' : 'bg-red-900'}`}>
                                    <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${profile.loc ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            <button className={`p-4 w-full mt-4 font-black uppercase tracking-widest transition-all border text-xs ${isSettingsDirty() ? 'bg-sky-700 border-sky-500 hover:bg-sky-600 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-500 cursor-pointer'}`}>
                                Sync Changes
                            </button>
                        </form>
                        
                        <div className="mt-12 w-full text-white">
                            {!showResetConfirm ? (
                                <button 
                                    onClick={() => setShowResetConfirm(true)} 
                                    className="bg-red-700 w-full p-4 font-black uppercase tracking-widest hover:bg-red-600 transition-colors text-xs shadow-lg text-white"
                                >
                                    Terminate All Local Data
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => { localStorage.clear(); window.location.reload(); }} 
                                        className="flex-1 bg-red-600 p-4 font-black uppercase tracking-widest hover:bg-red-500 text-xs shadow-lg text-white"
                                    >
                                        Confirm Reset
                                    </button>
                                    <button 
                                        onClick={() => { 
                                            setShowResetConfirm(false); 
                                            setWUnit(null); 
                                            setSelectedDate(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
                                            setDraftProfile({
                                                name: '', sex: '', 
                                                month: (today.getMonth() + 1).toString(), 
                                                day: today.getDate().toString(), 
                                                year: today.getFullYear().toString(),
                                                height: '', ft: '', in: '', weight: ''
                                            });
                                        }} 
                                        className="flex-1 bg-neutral-900 p-4 font-black uppercase tracking-widest hover:bg-neutral-600 text-xs shadow-lg text-white"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showShop && (
                <div className="fixed inset-0 bg-black/95 p-8 z-[60] overflow-y-auto backdrop-blur-sm text-white">
                    <div className="max-w-6xl mx-auto bg-neutral-900 p-6 rounded-lg border border-sky-900 shadow-2xl text-white">
                        <button onClick={() => setShowShop(false)} className="bg-red-900 p-2 mb-4 text-[9px] font-black uppercase shadow-lg hover:bg-red-800 transition-colors text-white">Close Shop</button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                            <div className="bg-black/40 p-4 rounded-lg border border-sky-900/50 shadow-inner text-left">
                                <div className="flex justify-between items-center mb-4 border-b border-sky-900 pb-2">
                                    <h2 className="text-sky-400 font-black uppercase text-[10px] tracking-widest">Faucet Technology</h2>
                                    <div className="text-[8px] text-sky-200/50 uppercase font-black text-right">R:{zones.residential} C:{zones.commercial} I:{zones.industrial}</div>
                                </div>
                                <div className="space-y-1 h-[300px] overflow-y-auto pr-2 custom-scrollbar text-white">
                                    {FAUCET_NAMES.map((n, i) => (
                                        <button key={i} onClick={() => setSelectedFaucet(i)} className={`block w-full text-left p-3 border text-[9px] transition-all rounded shadow-sm ${selectedFaucet === i ? 'bg-sky-600 border-sky-400 scale-[1.02]' : (faucetLevel === i ? 'bg-sky-900 border-sky-500 opacity-100' : 'bg-black border-neutral-800 opacity-70 hover:opacity-100 hover:border-sky-800')}`}>
                                            {n.toUpperCase()} | Rate: {formatVolume(FAUCET_RATES[i])} <br/>
                                            <span className="opacity-50 text-[8px]">Req: {FAUCET_REQS[i].res}R, {FAUCET_REQS[i].com}C, {FAUCET_REQS[i].ind}I</span>
                                        </button>
                                    ))}
                                </div>
                                <button disabled={selectedFaucet === null} onClick={executeFaucetPurchase} className={`w-full mt-4 p-4 font-black uppercase tracking-widest text-[10px] rounded border ${selectedFaucet === null ? 'bg-neutral-800 opacity-30 cursor-not-allowed text-white' : 'bg-sky-600 border-sky-400 hover:bg-sky-500 shadow-[0_0_15px_rgba(2,132,199,0.5)] text-white'}`}>
                                    Purchase Upgrade
                                </button>
                            </div>
                            <div className="bg-black/40 p-4 rounded-lg border border-amber-900/50 shadow-inner text-left">
                                <h2 className="text-amber-500 font-black mb-4 border-b border-amber-900 pb-2 uppercase text-[10px] tracking-widest">Replica Maintenance</h2>
                                <p className="text-[8px] mb-4 opacity-70 italic text-left leading-relaxed uppercase tracking-tighter text-amber-200/50">Current Bank: {formatVolume(totalDrunk)}</p>
                                <div className="p-4 bg-black border border-amber-900/30 rounded text-center mb-4 shadow-2xl text-white">
                                    <div className="text-[8px] opacity-70 mb-1 uppercase tracking-tighter text-amber-500">Active Tier: {FLASK_NAMES[replicaFlask.typeIndex]}</div>
                                    <div className="text-xl font-black tracking-tighter text-white">{formatVolume(FLASK_CAPS[replicaFlask.typeIndex] * 1000)}</div>
                                    <div className="text-[9px] mt-2 font-black text-sky-400 uppercase tracking-widest">{formatVolume(replicaFlask.current)} / {formatVolume(FLASK_CAPS[replicaFlask.typeIndex]*1000*0.8)} (80%)</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-white">
                                    <button onClick={upgradeReplicaFlask} className="bg-amber-900 p-4 text-[10px] font-black uppercase tracking-widest border border-amber-600 hover:bg-amber-800 transition-all rounded shadow-lg active:scale-95 text-white text-xs">Upgrade</button>
                                    <button onClick={downgradeReplicaFlask} disabled={replicaFlask.typeIndex === 0} className={`p-4 text-[10px] font-black uppercase tracking-widest border rounded transition-all active:scale-95 ${replicaFlask.typeIndex === 0 ? 'bg-neutral-800 border-neutral-700 opacity-50 cursor-not-allowed text-neutral-500' : 'bg-red-900 border-red-600 hover:bg-red-800 text-white shadow-lg text-xs'}`}>Downgrade</button>
                                </div>
                            </div>
                            <div className="bg-black/40 p-4 rounded-lg border border-emerald-900/50 shadow-inner text-left text-white">
                                <h2 className="text-emerald-500 font-black mb-4 border-b border-emerald-900 pb-2 uppercase text-[10px] tracking-widest text-left">Industrial Assets</h2>
                                <p className="text-[9px] mb-4 opacity-70 italic leading-relaxed uppercase tracking-tighter font-bold text-emerald-400/80 text-left">Metabolic Bank: {formatVolume(totalDrunk)}</p>
                                <div className="grid grid-cols-1 gap-1 h-[350px] overflow-y-auto pr-2 custom-scrollbar text-white">
                                    {FLASK_NAMES.map((n, i) => {
                                        const cost = ASSET_DRINK_COSTS[replicaFlask.typeIndex];
                                        const maxAllowed = Math.min(FLASK_NAMES.length - 1, replicaFlask.typeIndex + 1);
                                        const isLocked = i > maxAllowed;
                                        return (
                                            <button key={i} disabled={isLocked} onClick={() => setSelectedAssetType(i)} className={`block w-full text-left p-3 border text-[9px] transition-all rounded shadow-sm ${selectedAssetType === i ? 'bg-emerald-600 border-emerald-400 scale-[1.02]' : (isLocked ? 'bg-neutral-900 border-neutral-800 opacity-30 cursor-not-allowed' : 'bg-black border-sky-900/30 hover:border-sky-500 hover:bg-sky-900/10 text-white')}`}>
                                                {n.toUpperCase()} ({FLASK_CAPS[i]}L)
                                                <div className="text-[8px] opacity-60 mt-1 uppercase tracking-tighter font-black text-emerald-400 text-left text-white">Cost: {formatVolume(cost)}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                                <button disabled={selectedAssetType === null} onClick={buyAssetFlask} className={`w-full mt-4 p-4 font-black uppercase tracking-widest text-[10px] rounded border ${selectedAssetType === null ? 'bg-neutral-800 opacity-30 cursor-not-allowed text-white' : 'bg-emerald-600 border-emerald-400 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] text-white'}`}>
                                    Purchase Asset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 w-full text-white">
                <section className="bg-neutral-900/50 p-6 border border-sky-900 rounded-xl flex flex-col gap-4 shadow-xl text-left">
                    <h2 className="text-[10px] font-black text-sky-500 uppercase tracking-widest text-left flex items-center gap-2 text-white">
                        <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse shadow-[0_0_5px_#0ea5e9]"></span>
                        Human Vitality Unit
                    </h2>
                    <div className="bg-neutral-950 p-4 border border-sky-500/20 rounded-lg flex justify-between items-center shadow-lg group transition-all hover:border-sky-500/40 text-white">
                        <div className="text-left text-white">
                            <span className="text-[8px] font-black text-neutral-500 uppercase block tracking-tighter mb-1 text-left text-white">Active Replica Flask</span>
                            <span className="text-xs font-bold uppercase tracking-tight text-white/90 group-hover:text-sky-400 transition-colors text-white">{FLASK_NAMES[replicaFlask.typeIndex]}</span>
                        </div>
                        <div className="text-right text-left text-white">
                            <span className="text-sky-400 font-black text-sm block tabular-nums text-right">{formatVolume(replicaFlask.current)}</span>
                            <span className="text-[8px] opacity-30 uppercase tracking-widest text-right block text-white">Limit: {formatVolume(FLASK_CAPS[replicaFlask.typeIndex]*1000)}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-white">
                        <button onClick={collectToReplica} className="bg-sky-600 p-6 font-black text-xs uppercase tracking-widest hover:bg-sky-500 border-b-4 border-sky-800 rounded-md transition-all active:scale-95 shadow-lg active:border-b-0 active:translate-y-1 text-white">Collect</button>
                        <button onClick={drink} className="bg-emerald-700 p-6 font-black text-xs uppercase tracking-widest hover:bg-emerald-600 border-b-4 border-emerald-800 rounded-md transition-all active:scale-95 shadow-lg active:border-b-0 active:translate-y-1 text-white">Drink</button>
                    </div>
                </section>

                <section className="bg-neutral-900/50 p-6 border border-amber-900 rounded-xl flex flex-col gap-4 shadow-xl text-left text-white">
                    <h2 className="text-[10px] font-black text-amber-500 uppercase tracking-widest text-left flex items-center gap-2 text-left text-white">
                        <span className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_5px_#f59e0b]"></span>
                        Industrial Construction
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-left text-white">
                        {[
                          { name: 'residential', req: 'Pro', type: 3, color: 'border-amber-900/50 hover:border-amber-500/50' },
                          { name: 'commercial', req: 'Max', type: 4, color: 'border-indigo-900/50 hover:border-indigo-500/50' },
                          { name: 'industrial', req: 'Ultra', type: 5, color: 'border-rose-900/50 hover:border-rose-500/50' }
                        ].map(z => (
                            <div key={z.name} className={`bg-neutral-900 p-3 border ${z.color} rounded-lg transition-all hover:brightness-125 shadow-md text-left text-white`}>
                                <h3 className="font-black text-amber-500 mb-1 uppercase text-[10px] tracking-tighter opacity-80 text-white">{z.name}</h3>
                                <div className="text-xl font-black mb-2 text-white/90 tabular-nums text-white">{zones[z.name as keyof typeof zones]}</div>
                                <button disabled={integrity <= 0 || isPaused} onClick={() => build(z.name as keyof typeof zones)} className={`w-full p-2 font-black text-[9px] uppercase tracking-tighter rounded border border-white/5 shadow-inner ${integrity <= 0 || isPaused ? 'bg-neutral-900 opacity-50 cursor-not-allowed text-white' : 'bg-amber-900 hover:bg-amber-800 transition-colors text-white'}`}>Build ({zones[z.name as keyof typeof zones]+1} {z.req})</button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="w-full text-left bg-neutral-900/30 p-4 border border-white/5 rounded-2xl shadow-2xl text-white">
                <h3 className="text-[10px] font-black text-sky-500 mb-4 uppercase tracking-[0.2em] px-2 flex justify-between items-center text-left text-white">
                    <span>Industrial Asset Fleet ({assetFlasks.length})</span>
                    <span className="text-[8px] text-neutral-500 font-normal uppercase tracking-widest opacity-50 text-right text-white">Logistics Grid Active</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 px-2 pb-2 max-h-[250px] overflow-y-auto custom-scrollbar text-white">
                    {assetFlasks.map((f, i) => (
                        <div key={f.id} className="bg-black p-3 border border-neutral-800 rounded-xl text-center shadow-2xl flex flex-col justify-between group hover:border-amber-900/50 transition-all duration-300 hover:scale-[1.02] text-white">
                            <div>
                                <div className="text-[8px] opacity-40 mb-2 leading-none uppercase font-black group-hover:text-amber-500 transition-colors tracking-tighter text-white">{FLASK_NAMES[f.typeIndex]}</div>
                                <div className="text-[10px] font-black text-white/90 mb-3 tabular-nums text-white">{formatVolume(f.current)} <span className="opacity-20 font-normal text-[8px] text-white">/ {formatVolume(FLASK_CAPS[f.typeIndex]*1000)}</span></div>
                            </div>
                            <button onClick={() => collectToSpecificAsset(f.id)} className="w-full bg-neutral-900 hover:bg-amber-900 py-2 text-[9px] font-black uppercase rounded-lg border border-white/5 transition-all active:scale-95 group-hover:border-amber-500/30 shadow-md text-white">Collect</button>
                        </div>
                    ))}
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default HydrailApp;