/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Moon, 
  Briefcase, 
  Utensils, 
  Car, 
  Smartphone, 
  Plus, 
  RefreshCw, 
  Compass,
  Droplet
} from 'lucide-react';

import { CustomHabit, LifespanStats } from './types';
import LandingView from './components/LandingView';
import LifeGrid from './components/LifeGrid';
import DetailsPanel from './components/DetailsPanel';
import ContemplativeQuotes from './components/ContemplativeQuotes';
import HabitSlider from './components/HabitSlider';

// Helper to calculate exact age in fractional years
const calculateAge = (birthdayStr: string) => {
  if (!birthdayStr) return 0;
  const birthDate = new Date(birthdayStr);
  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - birthDate.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return diffYears;
};

export default function App() {
  const [view, setView] = useState<'landing' | 'main'>('landing');

  // Core configuration states (initialized empty or zero - NO pre-filled values)
  const [birthday, setBirthday] = useState<string>('');
  const [lifespan, setLifespan] = useState<number>(80);
  const [sleepHours, setSleepHours] = useState<number>(0);
  const [gridSize, setGridSize] = useState<number>(10);
  const squaresCount = gridSize * gridSize;
  
  // Work & Retirement controls
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [workHours, setWorkHours] = useState<number>(0);

  // Daily Habits
  const [eatHours, setEatHours] = useState<number>(0);
  const [commuteHours, setCommuteHours] = useState<number>(0);
  const [socialHours, setSocialHours] = useState<number>(0);

  // Custom added categories (starts empty)
  const [customHabits, setCustomHabits] = useState<CustomHabit[]>([]);



  // Active pouring state to fuel the dynamic grid waves when sliders slide
  const [activePouringField, setActivePouringField] = useState<string | null>(null);

  // Reset to original brand new starting state (all completely un-filled)
  const handleReset = () => {
    setBirthday('');
    setLifespan(80);
    setSleepHours(0);
    setRetirementAge(65);
    setWorkHours(0);
    setEatHours(0);
    setCommuteHours(0);
    setSocialHours(0);
    setCustomHabits([]);
    setGridSize(10);
  };

  // Proportional math calculation core (LOCKED CLOSED-LOOP SYSTEM)
  const stats = useMemo<LifespanStats>(() => {
    const age = birthday ? Math.min(lifespan, calculateAge(birthday)) : 0;
    const totalDays = lifespan * 365.25;
    const totalHours = totalDays * 24;

    // 1. Sleep (whole life deduction)
    const sleepHoursTotal = totalDays * sleepHours;

    // 2. Waking past (already lived waking hours, excluding past sleep)
    const wakingPastHoursTotal = age * 365.25 * (24 - sleepHours);

    // 3. Remaining future waking time capacity
    const remainingYears = Math.max(0, lifespan - age);
    const remainingDays = remainingYears * 365.25;
    const remainingWakingHours = remainingDays * (24 - sleepHours);

    // 4. Future Career deduction (capped by retirement age)
    const yearsToRetire = Math.max(0, Math.min(lifespan, retirementAge) - age);
    const remainingWorkingDays = yearsToRetire * 365.25;
    const workHoursTotal = remainingWorkingDays * workHours;

    // 5. Normal Habits
    const eatingHoursTotal = remainingDays * eatHours;
    const commuteHoursTotal = remainingDays * commuteHours;
    const socialHoursTotal = remainingDays * socialHours;

    let customHabitsTotal = 0;
    const customHabitsStats = customHabits.map((h) => {
      const hoursTotal = remainingDays * h.hours;
      customHabitsTotal += hoursTotal;
      return { ...h, hoursTotal };
    });

    // 6. Total projected future activities
    const totalFutureDeductions = 
      workHoursTotal + 
      eatingHoursTotal + 
      commuteHoursTotal + 
      socialHoursTotal + 
      customHabitsTotal;

    // 7. Golden Free remainder
    const freeHoursTotal = Math.max(0, remainingWakingHours - totalFutureDeductions);

    // Guard if details exceed 24 hours in a day
    const isOverworked = (sleepHours + workHours + eatHours + commuteHours + socialHours + customHabits.reduce((acc,h)=>acc+h.hours, 0)) > 24;

    // Adjust ratios for representation (maintain exactly 100% loop)
    let scaleFactor = 1;
    if (isOverworked && remainingWakingHours > 0) {
      scaleFactor = remainingWakingHours / totalFutureDeductions;
    }

    const adjWorkHours = workHoursTotal * scaleFactor;
    const adjEatingHours = eatingHoursTotal * scaleFactor;
    const adjCommuteHours = commuteHoursTotal * scaleFactor;
    const adjSocialHours = socialHoursTotal * scaleFactor;

    const adjCustoms = customHabitsStats.map((h) => ({
      id: h.id,
      name: h.name,
      color: h.color,
      hours: h.hours,
      hoursTotal: h.hoursTotal * scaleFactor
    }));

    const adjFreeHours = isOverworked ? 0 : freeHoursTotal;

    // Compute percentages of total lifetime
    const pctSleep = (sleepHoursTotal / totalHours) * 100;
    const pctWakingPast = (wakingPastHoursTotal / totalHours) * 100;
    const pctWork = (adjWorkHours / totalHours) * 100;
    const pctEating = (adjEatingHours / totalHours) * 100;
    const pctCommute = (adjCommuteHours / totalHours) * 100;
    const pctSocial = (adjSocialHours / totalHours) * 100;

    const pctCustoms = adjCustoms.map((h) => ({
      id: h.id,
      name: h.name,
      color: h.color,
      percentage: (h.hoursTotal / totalHours) * 100
    }));

    const pctFree = (adjFreeHours / totalHours) * 100;

    // Construct sequential lists containing detailed metadata (highly distinguishable premium Scandinavian Mineral palette colors)
    const categoriesList = [
      { key: 'sleep', name: 'Sleep', color: '#5B7B9C', percentage: pctSleep, originalHours: sleepHours, desc: 'Projected lifetime sleep (past & future)' },
      { key: 'past', name: 'Waking Past', color: '#3E4A56', percentage: pctWakingPast, originalHours: 24 - sleepHours, desc: 'Active waking portion of life already lived' },
      { key: 'work', name: 'Projected Work', color: '#D97E5C', percentage: pctWork, originalHours: workHours, desc: `Future career output until retirement target age ${retirementAge}` },
    ];

    pctCustoms.forEach((h, idx) => {
      categoriesList.push({
        key: h.id,
        name: h.name,
        color: h.color,
        percentage: h.percentage,
        originalHours: customHabits[idx].hours,
        desc: `Future habit: ${h.name}`
      });
    });

    categoriesList.push(
      { key: 'eating', name: 'Eating & Dining', color: '#569E83', percentage: pctEating, originalHours: eatHours, desc: 'Daily dining and nutrition buffers' },
      { key: 'commute', name: 'Commuting & Transit', color: '#8D7EA3', percentage: pctCommute, originalHours: commuteHours, desc: 'Lifetime transit and travel overhead' },
      { key: 'social', name: 'Social Media & Screen', color: '#C75C73', percentage: pctSocial, originalHours: socialHours, desc: 'Time spent browsing, scrolling, and streaming' },
      { key: 'free', name: 'Remaining Free Time', color: 'transparent', percentage: pctFree, originalHours: 0, desc: 'Pure uncommitted potential. Write your destiny here.' }
    );

    // Compute active items
    const activeCategories: any[] = [];
    let cumulative = 0;
    categoriesList.forEach((cat) => {
      if (cat.percentage > 0) {
        activeCategories.push({
          ...cat,
          cumulativeStart: cumulative,
          cumulativeEnd: cumulative + cat.percentage
        });
        cumulative += cat.percentage;
      }
    });

    // Precision fallback forcing to 100%
    if (activeCategories.length > 0) {
      activeCategories[activeCategories.length - 1].cumulativeEnd = 100;
    }

    return {
      age,
      remainingYears,
      remainingDays,
      remainingWakingHours,
      workHoursTotal,
      eatingHoursTotal,
      commuteHoursTotal,
      socialHoursTotal,
      customHabitsStats,
      freeHoursTotal,
      isOverworked,
      scaleFactor,
      categoriesList,
      activeCategories,
      totalHours
    };
  }, [birthday, lifespan, sleepHours, retirementAge, workHours, eatHours, socialHours, commuteHours, customHabits]);

  // Action to append custom categories
  const handleAddCustomHabit = () => {
    const freshId = `custom-${Date.now()}`;
    const colors = ['#5F9EA0', '#8F8AAB', '#BC6F80', '#638F85', '#CC9360', '#7A8C9E'];
    const assignedCol = colors[customHabits.length % colors.length];
    
    // Add custom habit category with starting 0 hours (no pre-filled value)
    const newHabit: CustomHabit = {
      id: freshId,
      name: `Habit #${customHabits.length + 1}`,
      hours: 0,
      color: assignedCol
    };
    setCustomHabits([...customHabits, newHabit]);
  };

  const handleUpdateCustomHabitName = (id: string, name: string) => {
    setCustomHabits(prev => prev.map(h => h.id === id ? { ...h, name } : h));
  };

  const handleUpdateCustomHabitHours = (id: string, hours: number) => {
    setCustomHabits(prev => prev.map(h => h.id === id ? { ...h, hours } : h));
  };

  const handleUpdateCustomHabitColor = (id: string, color: string) => {
    setCustomHabits(prev => prev.map(h => h.id === id ? { ...h, color } : h));
  };

  const handleDeleteCustomHabit = (id: string) => {
    setCustomHabits(prev => prev.filter(h => h.id !== id));
  };

  if (view === 'landing') {
    return <LandingView onBegin={() => setView('main')} />;
  }

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#2c2a29] font-sans flex flex-col justify-between selection:bg-[#eae6db] selection:text-[#2c2a29]">
      
      {/* 1. Elegant Zen Header */}
      <header className="border-b border-[#2c2a29]/5 bg-[#fbfaf7]/85 backdrop-blur-md sticky top-0 z-50 px-6 py-4" id="app-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-[#c8563f] stroke-[1.5]" />
            <div className="flex flex-col">
              <h1 className="font-serif uppercase text-base font-medium tracking-[0.2em] text-[#2c2a29]" id="header-brand">
                Memento Mori
              </h1>
              <span className="text-[10px] text-[#73706c] font-serif italic">
                “Mono no aware” — Reflect on the passing moments
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4" id="header-controls">
            <div className="flex items-center gap-2" id="tapestry-dimension-selector">
              <label htmlFor="select-grid-size" className="text-[10px] sm:text-xs font-serif uppercase tracking-wider text-[#73706c] select-none">
                Tapestry Size
              </label>
              <select
                id="select-grid-size"
                value={gridSize}
                onChange={(e) => setGridSize(parseInt(e.target.value))}
                className="bg-[#fbfaf7] border border-[#2c2a29]/10 hover:border-[#2c2a29]/25 rounded-lg px-2.5 py-1 text-xs font-serif font-semibold text-[#2c2a29] focus:outline-none focus:ring-1 focus:ring-[#c8563f] cursor-pointer transition-all"
              >
                <option value={5}>5 × 5</option>
                <option value={8}>8 × 8</option>
                <option value={10}>10 × 10</option>
                <option value={12}>12 × 12</option>
                <option value={15}>15 × 15</option>
                <option value={20}>20 × 20</option>
              </select>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg border border-[#2c2a29]/10 bg-[#fbfaf7] hover:bg-[#2c2a29] text-xs font-serif text-[#73706c] hover:text-[#fbfaf7] transition-all cursor-pointer"
              id="btn-nav-reset"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Clear Blueprint</span>
              <span className="inline sm:hidden">Clear</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Dashboard Panel */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8" id="dashboard-main">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN (Control Panel & Sliders) */}
          <div className="lg:col-span-5 space-y-8" id="inputs-left-column">
            
            {/* Timeline setup & birth origins */}
            <div className="p-5 bg-[#eae6db]/15 border border-[#2c2a29]/10 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 border-b border-[#2c2a29]/10 pb-2.5">
                <Calendar className="w-4 h-4 text-[#73706c]" />
                <h3 className="text-xs uppercase tracking-[0.25em] font-serif text-[#2c2a29] font-medium">
                  Origins of Life
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="input-birthday" className="text-xs font-serif text-[#595757]">Date of Birth</label>
                  <input
                    type="date"
                    id="input-birthday"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#fbfaf7] border border-[#2c2a29]/10 focus:border-[#c8563f] focus:outline-none rounded-lg px-3 py-2 text-xs text-[#2c2a29] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="input-lifespan" className="text-xs font-serif text-[#595757]">Target Lifespan</label>
                  <div className="flex items-center gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => setLifespan(prev => Math.max(45, prev - 1))}
                      className="w-6 h-6 rounded border border-[#2c2a29]/10 bg-[#eae6db]/30 hover:bg-[#eae6db]/60 text-xs font-bold text-[#2c2a29] flex items-center justify-center cursor-pointer select-none transition-colors"
                      title="Decrease lifespan"
                    >
                      -
                    </button>
                    <div className="flex-1 flex items-center bg-[#eae6db]/30 border border-[#2c2a29]/10 rounded px-1.5 py-1 focus-within:ring-1 focus-within:ring-[#c8563f] focus-within:bg-[#fbfaf7] overflow-hidden">
                      <input
                        type="number"
                        id="input-lifespan"
                        min={45}
                        max={110}
                        value={lifespan}
                        onChange={(e) => {
                          let val = parseInt(e.target.value);
                          if (isNaN(val)) val = 80;
                          setLifespan(Math.max(45, Math.min(110, val)));
                        }}
                        className="font-mono text-xs font-bold text-[#2c2a29] bg-transparent w-full text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        title="Precise Lifespan Editor"
                      />
                      <span className="text-[10px] text-[#73706c] font-semibold pr-0.5 select-none font-mono">y</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLifespan(prev => Math.min(110, prev + 1))}
                      className="w-6 h-6 rounded border border-[#2c2a29]/10 bg-[#eae6db]/30 hover:bg-[#eae6db]/60 text-xs font-bold text-[#2c2a29] flex items-center justify-center cursor-pointer select-none transition-colors"
                      title="Increase lifespan"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Habit Dedication Hours */}
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#2c2a29]/10 pb-2">
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-[#c8563f]" />
                  <h3 className="text-xs uppercase tracking-[0.25em] font-serif text-[#2c2a29] font-medium">
                    Daily Hours Allocation
                  </h3>
                </div>
                {stats.isOverworked && (
                  <span className="text-[10px] uppercase font-serif text-[#b8483f] font-semibold bg-[#b8483f]/10 border border-[#b8483f]/20 px-2.5 py-0.5 rounded-lg">
                    ⚠ Sum limits exceeded
                  </span>
                )}
              </div>

              {/* Sliders Container */}
              <div className="space-y-4">
                
                {/* 1. Sleep Slider */}
                <HabitSlider
                  id="sleep"
                  name="Daily Sleep"
                  hours={sleepHours}
                  max={12}
                  step={0.1}
                  color="#5B7B9C"
                  onHoursChange={setSleepHours}
                  onStartPour={() => setActivePouringField('sleep')}
                  onEndPour={() => setActivePouringField(null)}
                  impactText={`Occupies ${(sleepHours / 24 * 100).toFixed(0)}% of your whole projected lifetime`}
                  icon={<Moon className="w-4 h-4" />}
                />

                {/* 2. Employment Slider (with Retirement Capper) */}
                <div className="p-4 rounded-xl border border-[#2c2a29]/10 bg-[#fbfaf7]/60 hover:bg-[#fbfaf7] hover:border-[#2c2a29]/20 transition-all duration-300 relative space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#2c2a29]/10"
                        style={{ backgroundColor: `rgba(217, 126, 92, 0.15)`, color: '#D97E5C' }}
                      >
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <span className="font-serif text-sm font-medium text-[#2c2a29]">
                        Work & Employment
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase text-[#73706c] font-serif">Retire at</span>
                      <select
                        value={retirementAge}
                        onChange={(e) => setRetirementAge(parseInt(e.target.value))}
                        className="bg-[#fbfaf7] border border-[#2c2a29]/10 rounded px-2 py-0.5 font-mono text-xs text-[#2c2a29] focus:outline-none focus:border-[#c8563f] cursor-pointer"
                        id="select-retire-age"
                      >
                        {Array.from({ length: 110 - Math.floor(stats.age) }, (_, i) => {
                          const val = Math.floor(stats.age) + i + 1;
                          return <option key={val} value={val}>{val}</option>;
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#73706c] font-serif">Daily Hours</span>
                      
                      {/* Work precise direct input */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const val = Math.max(0, workHours - 0.5);
                            setWorkHours(parseFloat(val.toFixed(1)));
                          }}
                          className="w-5 h-5 rounded border border-[#2c2a29]/10 bg-[#eae6db]/30 hover:bg-[#eae6db]/60 text-[10px] font-semibold text-[#2c2a29] flex items-center justify-center cursor-pointer select-none transition-colors"
                          title="Decrease hours"
                        >
                          -
                        </button>
                        
                        <div className="flex items-center bg-[#eae6db]/30 border border-[#2c2a29]/10 rounded px-1 focus-within:ring-1 focus-within:ring-[#c8563f] focus-within:bg-[#fbfaf7] overflow-hidden">
                          <input
                            type="number"
                            min={0}
                            max={14}
                            step={0.5}
                            value={Number(workHours.toFixed(1))}
                            onChange={(e) => {
                              let val = parseFloat(e.target.value);
                              if (isNaN(val)) val = 0;
                              val = Math.max(0, Math.min(14, val));
                              setWorkHours(parseFloat(val.toFixed(1)));
                            }}
                            onFocus={() => setActivePouringField('work')}
                            onBlur={() => setActivePouringField(null)}
                            className="font-mono text-xs font-bold text-[#2c2a29] bg-transparent w-8 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            title="Work hours input"
                            id="input-work-hours"
                          />
                          <span className="text-[10px] text-[#73706c] font-semibold pr-0.5 select-none font-mono">h</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const val = Math.min(14, workHours + 0.5);
                            setWorkHours(parseFloat(val.toFixed(1)));
                          }}
                          className="w-5 h-5 rounded border border-[#2c2a29]/10 bg-[#eae6db]/30 hover:bg-[#eae6db]/60 text-[10px] font-semibold text-[#2c2a29] flex items-center justify-center cursor-pointer select-none transition-colors"
                          title="Increase hours"
                        >
                          +
                        </button>
                      </div>
                    </div>

                  </div>

                  <div className="pt-2 border-t border-[#2c2a29]/10 text-[11px] font-serif italic text-[#73706c]">
                    Applying to {Math.max(0, Math.min(lifespan, retirementAge) - stats.age).toFixed(1)} remaining career years on earth.
                  </div>
                </div>

                {/* 3. Daily Eating Slider */}
                <HabitSlider
                  id="eating"
                  name="Eating & Dining"
                  hours={eatHours}
                  max={6}
                  step={0.1}
                  color="#569E83"
                  onHoursChange={setEatHours}
                  onStartPour={() => setActivePouringField('eating')}
                  onEndPour={() => setActivePouringField(null)}
                  impactText={`Spans roughly ${((stats.remainingDays * eatHours)/24/365.25).toFixed(1)} future life years`}
                  icon={<Utensils className="w-4 h-4" />}
                />

                {/* 4. Commuting Slider */}
                <HabitSlider
                  id="commute"
                  name="Commuting"
                  hours={commuteHours}
                  max={6}
                  step={0.1}
                  color="#8D7EA3"
                  onHoursChange={setCommuteHours}
                  onStartPour={() => setActivePouringField('commute')}
                  onEndPour={() => setActivePouringField(null)}
                  impactText={`Reduces future free window by ${((stats.remainingDays * commuteHours)/24/365.25).toFixed(1)} full years`}
                  icon={<Car className="w-4 h-4" />}
                />

                {/* 5. Social Media Slider */}
                <HabitSlider
                  id="social"
                  name="Social Media & Scrolling"
                  hours={socialHours}
                  max={12}
                  step={0.1}
                  color="#C75C73"
                  onHoursChange={setSocialHours}
                  onStartPour={() => setActivePouringField('social')}
                  onEndPour={() => setActivePouringField(null)}
                  impactText="Pours directly out of your free days"
                  icon={<Smartphone className="w-4 h-4" />}
                />

                {/* Rendering dynamically declared Custom categories */}
                {customHabits.map((hab) => (
                  <HabitSlider
                    key={hab.id}
                    id={hab.id}
                    name={hab.name}
                    hours={hab.hours}
                    max={8}
                    step={0.1}
                    color={hab.color}
                    isCustom={true}
                    onHoursChange={(hr) => handleUpdateCustomHabitHours(hab.id, hr)}
                    onNameChange={(name) => handleUpdateCustomHabitName(hab.id, name)}
                    onColorChange={(col) => handleUpdateCustomHabitColor(hab.id, col)}
                    onDelete={() => handleDeleteCustomHabit(hab.id)}
                    onStartPour={() => setActivePouringField(hab.id)}
                    onEndPour={() => setActivePouringField(null)}
                    impactText="Projected custom activity footprint"
                  />
                ))}

                {/* Button to append fresh habit */}
                <button
                  type="button"
                  onClick={handleAddCustomHabit}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-[#2c2a29]/20 hover:border-[#2c2a29]/60 bg-[#eae6db]/10 hover:bg-[#eae6db]/30 transition-all rounded-xl text-xs font-serif text-[#73706c] hover:text-[#2c2a29] cursor-pointer"
                  id="btn-add-custom-habit"
                >
                  <Plus className="w-4 h-4" />
                  <span>Woven Habit Category</span>
                </button>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (Tapestry and Ledger stats) */}
          <div className="lg:col-span-7 space-y-6" id="visuals-right-column">
            <div className="space-y-6">
              <LifeGrid
                lifespan={lifespan}
                age={stats.age}
                activeCategories={stats.activeCategories}
                activePouringField={activePouringField}
                squaresCount={squaresCount}
              />

              <DetailsPanel
                stats={stats}
                lifespan={lifespan}
              />
            </div>
          </div>

        </div>

        {/* Full-width Whole Lifespan Ledger section at the bottom to balance layout */}
        <div className="mt-12 pt-8 border-t border-[#2c2a29]/10" id="whole-lifespan-ledger">
          <div className="mb-6">
            <h4 className="text-xs uppercase tracking-[0.25em] font-serif text-[#73706c] block font-light">
              Your Whole Lifespan Ledger ({lifespan} Years Total)
            </h4>
            <p className="text-[11px] text-[#73706c] font-serif italic mt-1">
              Visualizing how each daily devotion accumulates to mold your ultimate life footprint
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stats.categoriesList.filter(c => c.percentage > 0).map((cat) => {
              const yearsOccupied = (cat.percentage / 100) * lifespan;

              return (
                <div 
                  key={cat.key} 
                  className="p-4 rounded-xl border border-[#2c2a29]/10 bg-[#fbfaf7] hover:bg-[#eae6db]/10 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ 
                          backgroundColor: cat.color === 'transparent' ? undefined : cat.color,
                          border: cat.color === 'transparent' ? '1px dashed #2c2a29/40' : 'none',
                          boxShadow: cat.key === 'free' ? '0 0 8px rgba(198, 86, 63, 0.4)' : 'none'
                        }} 
                      />
                      <span className="text-xs font-serif font-bold text-[#2c2a29]">
                        {cat.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#73706c] font-serif italic leading-snug">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#2c2a29]/5 flex items-baseline justify-between flex-wrap">
                    <span className="text-[10px] uppercase font-serif tracking-widest text-[#73706c]">Allocated</span>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-[#2c2a29] block">
                        {yearsOccupied.toFixed(1)} yrs
                      </span>
                      <span className="text-[10px] font-mono text-[#73706c] block">
                        {cat.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* 3. Contemplative Rolling Quote Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 pb-6">
        <ContemplativeQuotes />
      </footer>

    </div>
  );
}
