import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HelpCircle, Sparkles, ArrowRight, ChevronDown, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

// Design Constants
const THEME = {
    magenta: '#D9006C',
    purple: '#7C3AED',
    darkBg: '#0D081B',
    cardBg: '#151126',
};

const INDUSTRIES = [
    "Agriculture and Horticulture",
    "Forestry and Logging",
    "Fisheries and Aquaculture",
    "Mining and Minerals",
    "Manufacturing",
    "Construction and Building",
    "Energy",
    "Food and Beverage Processing",
    "Tourism",
    "Information Technology and Telecommunications",
    "Financial Services",
    "Healthcare and Social Services",
    "Education and Training",
    "Retail and Wholesale Trade",
    "Transport and Logistics",
    "Creative Industries",
    "Government and Public Services",
    "Environmental and Sustainability Services",
    "Research and Development",
    "Information Technology and Data Analysis",
    "Consulting",
    "High-level Education and Knowledge Services",
    "Innovation and Intellectual Services",
    "Government Leadership",
    "Corporate Executives and Top-Level Management"
];

// Custom Slider Component with properly positioned thumb ON the bar
const CustomSlider = ({ value, onChange, min = 0, max = 100, label, valueLabel }: any) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const updateValue = (clientX: number) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const newPercentage = x / rect.width;
        const newValue = Math.round(min + newPercentage * (max - min));
        onChange(Math.max(min, Math.min(max, newValue)));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        updateValue(e.clientX);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        updateValue(e.touches[0].clientX);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) updateValue(e.clientX);
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging) updateValue(e.touches[0].clientX);
        };
        const handleEnd = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging]);

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="text-sm text-slate-600 font-medium flex items-center gap-2">
                    {label}
                </label>
                <span className="text-[#6D28D9] font-bold text-lg">{valueLabel}</span>
            </div>
            <div
                ref={sliderRef}
                className="relative w-full h-2 bg-slate-100 rounded-full cursor-pointer select-none"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                {/* Filled track */}
                <motion.div
                    className="absolute h-full bg-[#7C3AED] rounded-full pointer-events-none"
                    style={{ width: `${percentage}%` }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
                {/* Thumb - properly positioned ON the bar */}
                <motion.div
                    className={cn(
                        "absolute w-4 h-4 bg-[#7C3AED] rounded-full shadow-lg pointer-events-none",
                        "top-1/2 -translate-y-1/2",
                        "border-2 border-white",
                        isDragging && "scale-110"
                    )}
                    style={{ left: `calc(${percentage}% - 8px)` }}
                    animate={{ left: `calc(${percentage}% - 8px)` }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
            </div>
        </div>
    );
};

// Custom Industry Dropdown with overlay modal
const IndustryDropdown = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-left flex items-center justify-between focus:outline-none focus:border-purple-500 transition-all"
            >
                <span className={cn("text-sm font-medium", value ? "text-slate-900" : "text-slate-400")}>
                    {value || "Select your industry..."}
                </span>
                <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 top-full left-0 right-0 mt-2 bg-[#2A2A3A] rounded-xl shadow-2xl border border-white/10 max-h-[400px] overflow-y-auto"
                    >
                        {INDUSTRIES.map((industry, idx) => (
                            <button
                                key={industry}
                                type="button"
                                onClick={() => {
                                    onChange(industry);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-3",
                                    value === industry
                                        ? "bg-[#5B6EE1] text-white"
                                        : "text-white/90 hover:bg-white/10",
                                    idx === 0 && "rounded-t-xl",
                                    idx === INDUSTRIES.length - 1 && "rounded-b-xl"
                                )}
                            >
                                {value === industry && <Check className="w-4 h-4" />}
                                <span className={value === industry ? "" : "ml-7"}>{industry}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Split Circle Chart - Left half (Without AI - Gray), Right half (With AI - Purple)
const SplitCircleChart = ({
    costWithoutAI,
    costWithAI,
    maxValue
}: {
    costWithoutAI: number,
    costWithAI: number,
    maxValue: number
}) => {
    const size = 320;
    const center = size / 2;
    const maxRadius = (size / 2) - 30;
    const minRadius = 30;

    // Calculate radii based on values (normalized to maxValue)
    const withoutAIRadius = minRadius + ((costWithoutAI / maxValue) * (maxRadius - minRadius));
    const withAIRadius = minRadius + ((costWithAI / maxValue) * (maxRadius - minRadius));

    // Ring labels
    const ringValues = [200000, 400000, 600000, 800000, 1000000, 1200000, 1400000];

    const formatValue = (val: number) => {
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        return val.toLocaleString();
    };

    return (
        <div className="relative w-full flex flex-col items-center justify-center py-4">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[320px] h-auto">
                <defs>
                    <linearGradient id="withAIGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                    <clipPath id="leftHalf">
                        <rect x="0" y="0" width={center} height={size} />
                    </clipPath>
                    <clipPath id="rightHalf">
                        <rect x={center} y="0" width={center} height={size} />
                    </clipPath>
                </defs>

                {/* Concentric ring guides with labels */}
                {ringValues.map((val, i) => {
                    const r = minRadius + ((val / maxValue) * (maxRadius - minRadius));
                    return (
                        <g key={i}>
                            <circle
                                cx={center}
                                cy={center}
                                r={r}
                                fill="none"
                                stroke="rgba(255,255,255,0.15)"
                                strokeWidth="1"
                            />
                            <text
                                x={center + 5}
                                y={center - r + 4}
                                fill="rgba(255,255,255,0.5)"
                                fontSize="10"
                                textAnchor="middle"
                            >
                                {formatValue(val)}
                            </text>
                        </g>
                    );
                })}

                {/* Left half - Without AI (Gray/Dark) */}
                <motion.circle
                    cx={center}
                    cy={center}
                    r={Math.min(withoutAIRadius, maxRadius)}
                    fill="rgba(80, 80, 100, 0.6)"
                    clipPath="url(#leftHalf)"
                    initial={{ r: minRadius }}
                    animate={{ r: Math.min(withoutAIRadius, maxRadius) }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />

                {/* Right half - With AI (Purple) */}
                <motion.circle
                    cx={center}
                    cy={center}
                    r={Math.min(withAIRadius, maxRadius)}
                    fill="url(#withAIGradient)"
                    clipPath="url(#rightHalf)"
                    initial={{ r: minRadius }}
                    animate={{ r: Math.min(withAIRadius, maxRadius) }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />

                {/* Center dividing line */}
                <line
                    x1={center} y1={center - maxRadius - 10}
                    x2={center} y2={center + maxRadius + 10}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                />

                {/* Center dot */}
                <circle cx={center} cy={center} r="4" fill="white" opacity="0.5" />
            </svg>

            {/* Labels */}
            <div className="flex justify-between w-full max-w-[320px] mt-4 px-4">
                <div className="text-center">
                    <p className="text-white text-lg font-medium">Without AI</p>
                </div>
                <div className="text-center">
                    <p className="text-white text-lg font-medium">With AI</p>
                </div>
            </div>
        </div>
    );
};


export const SupaCalculator = () => {
    const [activeTab, setActiveTab] = useState<'percent' | 'task'>('percent');

    // Common State
    const [industry, setIndustry] = useState('');
    const [avgSalary, setAvgSalary] = useState(65); // k
    const [billableRate, setBillableRate] = useState(330); // $

    // "% of time" mode state
    const [teamSize, setTeamSize] = useState(50);
    const [timeSpentPercent, setTimeSpentPercent] = useState(15);
    const [timeWithAIPercent, setTimeWithAIPercent] = useState(5);

    // "Time per task" mode state
    const [numUsers, setNumUsers] = useState(20);
    const [timePerTaskMinutes, setTimePerTaskMinutes] = useState(50);
    const [timeWithAIMinutes, setTimeWithAIMinutes] = useState(40);
    const [tasksPerWeek, setTasksPerWeek] = useState(10);

    // Calculations - vary based on mode
    const results = useMemo(() => {
        const annualSalary = avgSalary * 1000;
        const hoursPerYear = 2080; // 40 hrs/week * 52 weeks
        const hourlyRate = annualSalary / hoursPerYear;

        if (activeTab === 'percent') {
            const currentCost = teamSize * annualSalary * (timeSpentPercent / 100);
            const aiCost = teamSize * annualSalary * (timeWithAIPercent / 100);
            const savings = currentCost - aiCost;
            const currentFTE = (teamSize * timeSpentPercent) / 100;
            const aiFTE = (teamSize * timeWithAIPercent) / 100;
            const currentDays = Math.round((currentCost / annualSalary) * 260); // work days in year
            const aiDays = Math.round((aiCost / annualSalary) * 260);

            return { currentCost, aiCost, savings, currentFTE, aiFTE, currentDays, aiDays };
        } else {
            // Time per task mode
            const weeksPerYear = 52;
            const totalTasksPerYear = numUsers * tasksPerWeek * weeksPerYear;
            const currentHoursPerYear = (totalTasksPerYear * timePerTaskMinutes) / 60;
            const aiHoursPerYear = (totalTasksPerYear * timeWithAIMinutes) / 60;

            const currentCost = currentHoursPerYear * hourlyRate;
            const aiCost = aiHoursPerYear * hourlyRate;
            const savings = currentCost - aiCost;
            const currentFTE = currentHoursPerYear / hoursPerYear;
            const aiFTE = aiHoursPerYear / hoursPerYear;
            const currentDays = Math.round(currentHoursPerYear / 8);
            const aiDays = Math.round(aiHoursPerYear / 8);

            return { currentCost, aiCost, savings, currentFTE, aiFTE, currentDays, aiDays };
        }
    }, [activeTab, teamSize, avgSalary, timeSpentPercent, timeWithAIPercent, numUsers, timePerTaskMinutes, timeWithAIMinutes, tasksPerWeek]);

    // Max value for chart (use a sensible max based on calculations)
    const chartMaxValue = Math.max(results.currentCost, results.aiCost, 1400000) * 1.1;

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="w-full mx-auto font-sans">

            {/* Top Navigation Tabs - Styled per reference image */}
            <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-r from-[#D9006C] to-[#7C3AED] p-1.5 rounded-2xl inline-flex gap-2">
                    <button
                        onClick={() => setActiveTab('percent')}
                        className={cn(
                            "px-8 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 min-w-[140px]",
                            activeTab === 'percent'
                                ? "bg-white text-slate-900 shadow-lg"
                                : "bg-transparent text-white border-2 border-white/30 hover:border-white/50"
                        )}
                    >
                        % of time
                    </button>
                    <button
                        onClick={() => setActiveTab('task')}
                        className={cn(
                            "px-8 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 min-w-[140px]",
                            activeTab === 'task'
                                ? "bg-white text-slate-900 shadow-lg"
                                : "bg-transparent text-white border-2 border-white/30 hover:border-white/50"
                        )}
                    >
                        Time per task
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-stretch">

                {/* Left Panel: Inputs (White Card) */}
                <div className="w-full lg:w-5/12 bg-white rounded-3xl p-8 shadow-2xl relative z-10 flex flex-col">
                    <h2 className="text-xl font-medium text-slate-800 mb-8">
                        People & Operations | {activeTab === 'percent' ? '% of time' : 'time per task'}
                    </h2>

                    <div className="space-y-6 flex-1">
                        {/* Industry - Custom Dropdown */}
                        <div className="space-y-2">
                            <label className="text-slate-600 text-sm">What industry are you in?</label>
                            <IndustryDropdown value={industry} onChange={setIndustry} />
                        </div>

                        {activeTab === 'percent' ? (
                            <>
                                {/* % of time mode inputs */}
                                <div className="space-y-2">
                                    <label className="text-slate-600 text-sm">How many people carry out this task now?</label>
                                    <input
                                        type="number"
                                        value={teamSize}
                                        onChange={(e) => setTeamSize(Number(e.target.value))}
                                        className="w-full text-3xl p-2 font-medium text-slate-900 border-b border-slate-200 focus:border-purple-600 focus:outline-none bg-transparent transition-colors placeholder:text-slate-300"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="space-y-6 pt-2">
                                    <CustomSlider
                                        label="% of time the individuals spend on this task now?"
                                        value={timeSpentPercent}
                                        onChange={setTimeSpentPercent}
                                        valueLabel={`${timeSpentPercent}%`}
                                    />

                                    <CustomSlider
                                        label={
                                            <span className="flex items-center gap-1">
                                                % of time a individual would spend on this task once AI is in play?
                                                <HelpCircle className="w-4 h-4 text-[#7C3AED]" />
                                            </span>
                                        }
                                        value={timeWithAIPercent}
                                        onChange={setTimeWithAIPercent}
                                        valueLabel={`${timeWithAIPercent}%`}
                                        max={50}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Time per task mode inputs */}
                                <div className="space-y-2">
                                    <label className="text-slate-600 text-sm">How many users would benefit from this?</label>
                                    <input
                                        type="number"
                                        value={numUsers}
                                        onChange={(e) => setNumUsers(Number(e.target.value))}
                                        className="w-full text-3xl p-2 font-medium text-slate-900 border-b border-slate-200 focus:border-purple-600 focus:outline-none bg-transparent transition-colors placeholder:text-slate-300"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-slate-600 text-sm">What is the time taken per user on this task (minutes per task)</label>
                                    <input
                                        type="number"
                                        value={timePerTaskMinutes}
                                        onChange={(e) => setTimePerTaskMinutes(Number(e.target.value))}
                                        className="w-full text-3xl p-2 font-medium text-slate-900 border-b border-slate-200 focus:border-purple-600 focus:outline-none bg-transparent transition-colors placeholder:text-slate-300"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-slate-600 text-sm flex items-center gap-1">
                                        Estimated time (in minutes) for this task with AI
                                        <HelpCircle className="w-4 h-4 text-[#7C3AED]" />
                                    </label>
                                    <input
                                        type="number"
                                        value={timeWithAIMinutes}
                                        onChange={(e) => setTimeWithAIMinutes(Number(e.target.value))}
                                        className="w-full text-3xl p-2 font-medium text-slate-900 border-b border-slate-200 focus:border-purple-600 focus:outline-none bg-transparent transition-colors placeholder:text-slate-300"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-slate-600 text-sm">How many times is each user carrying out this task per week?</label>
                                    <input
                                        type="number"
                                        value={tasksPerWeek}
                                        onChange={(e) => setTasksPerWeek(Number(e.target.value))}
                                        className="w-full text-3xl p-2 font-medium text-slate-900 border-b border-slate-200 focus:border-purple-600 focus:outline-none bg-transparent transition-colors placeholder:text-slate-300"
                                        placeholder="0"
                                    />
                                </div>
                            </>
                        )}

                        {/* Common sliders for both modes */}
                        <div className="space-y-6 pt-2">
                            <CustomSlider
                                label="Average salary of staff doing this task? (1k bands)"
                                value={avgSalary}
                                onChange={setAvgSalary}
                                valueLabel={`${avgSalary}k`}
                                min={30}
                                max={300}
                            />

                            <CustomSlider
                                label="What is the billable rate per day? [If relevant]"
                                value={billableRate}
                                onChange={setBillableRate}
                                valueLabel={`$${billableRate}`}
                                min={0}
                                max={2000}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Panel: Results (Dark Dashboard) */}
                <div className="w-full lg:w-7/12 flex flex-col gap-4">
                    <h3 className="text-white/80 font-medium ml-1 text-lg">Results</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Cost Card */}
                        <div className="bg-[#151126] rounded-2xl p-6 border border-white/5 relative overflow-hidden h-full flex flex-col justify-center">
                            <div className="relative z-10">
                                <p className="text-white font-bold text-sm mb-3">Cost per year now</p>
                                <p className="text-white/60 text-xs mb-1">{results.currentDays} days</p>
                                <p className="text-4xl font-bold text-white mb-2 tracking-tight">{formatCurrency(results.currentCost)}</p>
                                <p className="text-white/60 text-xs font-bold uppercase tracking-wider">{results.currentFTE.toFixed(1)} FTE</p>
                            </div>
                        </div>

                        {/* Cost with AI Card */}
                        <div className="bg-[#151126] rounded-2xl p-6 border border-blue-500/30 relative overflow-hidden h-full flex flex-col justify-center shadow-[0_0_30px_-5px_rgba(59,130,246,0.1)]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-4 h-4 text-[#D9006C]" />
                                    <p className="text-white font-bold text-sm">Cost per year with AI</p>
                                </div>
                                <p className="text-white/60 text-xs mb-1">{results.aiDays} days</p>
                                <p className="text-4xl font-bold text-[#FFB6E0] mb-2 tracking-tight">{formatCurrency(results.aiCost)}</p>
                                <p className="text-white/60 text-xs font-bold uppercase tracking-wider">{results.aiFTE.toFixed(1)} FTE</p>
                            </div>
                        </div>
                    </div>

                    {/* Opportunity Cost - Wide */}
                    <div className="bg-[#151126] rounded-2xl p-6 border border-white/5 flex flex-col justify-center relative min-h-[100px]">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                                <h4 className="text-white text-xl font-bold mb-1">Opportunity Cost</h4>
                                <p className="text-white/50 text-sm">Revenue Upside from missed Billings per year</p>
                            </div>
                            <div className="text-4xl font-bold text-[#FFB6E0] tracking-tight">
                                {formatCurrency(results.savings)}
                            </div>
                        </div>
                    </div>

                    {/* Chart Section - Split Circle Chart */}
                    <div className="flex-1 bg-[#151126] rounded-2xl p-6 border border-white/5 relative overflow-hidden min-h-[350px] flex items-center justify-center">
                        {/* Radial Gradient Background */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#151126]/50 to-[#151126]"></div>

                        <div className="relative z-10 w-full">
                            <SplitCircleChart
                                costWithoutAI={results.currentCost}
                                costWithAI={results.aiCost}
                                maxValue={chartMaxValue}
                            />
                        </div>
                    </div>

                    {/* AI Analysis Button - Redirect to AI Research */}
                    <Link
                        to="/ai-research"
                        className="w-full bg-[#D9006C] hover:bg-[#b00058] text-white py-4 rounded-xl font-semibold shadow-lg shadow-pink-900/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 group mt-2"
                    >
                        AI Analysis
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                </div>

            </div>
        </div>
    );
};
