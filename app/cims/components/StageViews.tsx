'use client';

import React, { useState } from 'react';
import { GameState, Stage, getStrategicAnalysis } from '../lib/gameLogic';

interface StageProps {
    state: GameState;
    onUpdate: (updates: Partial<GameState['choices']>) => void;
    onUpdateState: (updates: Partial<GameState>) => void; // For top-level state like name
    onNext: () => void;
}

// ----------------------------------------------------------------------
// STAGE 0: LOGIN GATE
// ----------------------------------------------------------------------
export function LoginStage({ state, onUpdateState, onNext }: StageProps) {
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (passcode !== 'JIML26') {
            setError('Invalid Faculty Passcode');
            return;
        }
        if (!state.studentName || !state.enrollmentNumber) {
            setError('Please fill in all student details');
            return;
        }
        onNext();
    };

    return (
        <div className="animate-fadeIn max-w-md mx-auto mt-20">
            <div className="bg-slate-900 border border-slate-700 p-8 shadow-2xl rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500"></div>

                <div className="text-center mb-8">
                    <h1 className="text-xl font-bold tracking-tight text-white mb-1 leading-tight">
                        CIMS: War Room
                    </h1>
                    <p className="text-xs text-slate-400">Jaipuria Institute of Management, Lucknow</p>
                    <p className="text-xs text-cyan-500 italic mt-1">Dr. Om Jee Gupta</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Student Name</label>
                        <input
                            type="text"
                            value={state.studentName}
                            onChange={(e) => onUpdateState({ studentName: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded focus:border-cyan-500 focus:outline-none"
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Enrollment Number</label>
                        <input
                            type="text"
                            value={state.enrollmentNumber}
                            onChange={(e) => onUpdateState({ enrollmentNumber: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded focus:border-cyan-500 focus:outline-none"
                            placeholder="e.g. JIML-2026-001"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Faculty Passcode</label>
                        <input
                            type="password"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded focus:border-cyan-500 focus:outline-none"
                            placeholder="******"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        onClick={handleLogin}
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded transition-colors shadow-lg shadow-cyan-500/20"
                    >
                        ENTER WAR ROOM
                    </button>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// STAGE 1: THE BRIEFING
// ----------------------------------------------------------------------
export function BriefingStage({ onNext }: StageProps) {
    return (
        <div className="animate-fadeIn space-y-6">
            <div className="bg-slate-900 border border-slate-700 p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-white tracking-tight">CEO DIRECTIVE: PROJECT CHRONOS</h2>
                    <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/20 rounded">CONFIDENTIAL</span>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
                    <p className="text-lg leading-relaxed">
                        "The market is flooded with mediocrity. We don't just want to launch a smartwatch;
                        we want to launch a <span className="text-white font-semibold">lifestyle companion</span>."
                    </p>
                    <p>
                        Your mandate is clear: Deploy the <span className="text-cyan-400 font-bold">₹14,999 Chronos Elite</span>.
                        This price point puts us in the 'Premium Mass' segment — a dangerous middle ground.
                        Too cheap for luxury buyers, too expensive for budget seekers.
                    </p>
                    <p>
                        You have <span className="text-emerald-400 font-mono">₹10,00,000</span>.
                        Every decision you make in this War Room will determine if we disrupt the market or disappear.
                    </p>
                    <p className="italic text-slate-500 border-l-2 border-slate-700 pl-4">
                        - Advisors are standing by. Investing in data will cost you budget, but flying blind costs you everything.
                    </p>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onNext}
                        className="group relative px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium tracking-wide transition-all overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center">
                            ACCEPT MISSION
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// STAGE 2: DEMOGRAPHICS (UPDATED)
// ----------------------------------------------------------------------
export function DemographicsStage({ state, onUpdate, onNext }: StageProps) {
    // Simple dual slider implementation
    // We'll use two range inputs for Min and Max, with visual validation
    const minAge = state.choices.ageRange[0];
    const maxAge = state.choices.ageRange[1];

    // Z-index management to handle overlapping sliders
    const [focusedSlider, setFocusedSlider] = useState<'min' | 'max' | null>(null);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.min(parseInt(e.target.value), maxAge - 1);
        onUpdate({ ageRange: [val, maxAge] });
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(parseInt(e.target.value), minAge + 1);
        onUpdate({ ageRange: [minAge, val] });
    };

    return (
        <div className="animate-fadeIn space-y-8">
            <SectionHeader title="Target Demographics" subtitle="Define who enters our funnel." />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <ControlPanel title="Age Range (Dual Slider)">
                    <div className="mb-4 flex justify-between text-sm text-slate-400">
                        <span>Min: <b className="text-white">{minAge}</b></span>
                        <span>Max: <b className="text-white">{maxAge}</b></span>
                    </div>

                    <div className="relative h-10">
                        {/* Visual Track */}
                        <div className="absolute top-4 left-0 w-full h-2 bg-slate-700 rounded-lg overflow-hidden">
                            <div
                                className="h-full bg-cyan-500"
                                style={{
                                    left: `${((minAge - 15) / 45) * 100}%`,
                                    width: `${((maxAge - minAge) / 45) * 100}%`,
                                    position: 'absolute'
                                }}
                            ></div>
                        </div>

                        {/* Inputs */}
                        <input
                            type="range" min="15" max="60"
                            value={minAge}
                            onChange={handleMinChange}
                            onMouseEnter={() => setFocusedSlider('min')}
                            onTouchStart={() => setFocusedSlider('min')}
                            className={`absolute top-1 w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto ${focusedSlider === 'min' ? 'z-30' : 'z-20'}`}
                        />
                        <input
                            type="range" min="15" max="60"
                            value={maxAge}
                            onChange={handleMaxChange}
                            onMouseEnter={() => setFocusedSlider('max')}
                            onTouchStart={() => setFocusedSlider('max')}
                            className={`absolute top-1 w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto ${focusedSlider === 'max' ? 'z-30' : 'z-20'}`}
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-2 text-center">Drag white knob for Min, blue knob for Max</p>
                </ControlPanel>

                <ControlPanel title="Annual Income (LPA)">
                    <label className="block text-sm text-slate-400 mb-4 h-6">
                        Minimum: <span className="text-emerald-400 font-mono">₹{state.choices.incomeLevel} Lakhs</span>
                    </label>
                    <input
                        type="range" min="3" max="50" step="1"
                        value={state.choices.incomeLevel}
                        onChange={(e) => onUpdate({ incomeLevel: parseInt(e.target.value) })}
                        className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </ControlPanel>
            </div>

            <ControlPanel title="City Tier Focus">
                <div className="flex space-x-4 mt-2">
                    {[1, 2, 3].map((tier) => (
                        <button
                            key={tier}
                            onClick={() => onUpdate({ cityTier: tier })}
                            className={`flex-1 py-4 border transition-all duration-200
                ${state.choices.cityTier === tier
                                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                                    : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-500'}`}
                        >
                            <span className="block text-2xl font-bold mb-1">Tier {tier}</span>
                            <span className="text-xs uppercase tracking-wider">
                                {tier === 1 ? 'Metros' : tier === 2 ? 'Emerging' : 'Rural/Semi'}
                            </span>
                        </button>
                    ))}
                </div>
            </ControlPanel>

            <NextButton onClick={onNext} />
        </div>
    );
}

// ----------------------------------------------------------------------
// STAGE 3: SOCIAL ARCHITECTURE
// ----------------------------------------------------------------------
export function SocialStage({ state, onUpdate, onNext }: StageProps) {
    return (
        <div className="animate-fadeIn space-y-8">
            <SectionHeader title="Social Architecture" subtitle="How do they live and who influences them?" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* INPUTS */}
                <div className="space-y-6">
                    <ControlPanel title="Family Structure">
                        <div className="flex space-x-4">
                            {['Nuclear', 'Joint'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => onUpdate({ familyStructure: type as any })}
                                    className={`flex-1 py-3 text-sm font-medium border transition-colors
                      ${state.choices.familyStructure === type
                                            ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                >
                                    {type} Family
                                </button>
                            ))}
                        </div>
                    </ControlPanel>

                    <ControlPanel title="Reference Group">
                        <select
                            value={state.choices.referenceGroup || ''}
                            onChange={(e) => onUpdate({ referenceGroup: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded focus:outline-none focus:border-cyan-500"
                        >
                            <option value="" disabled>Select Primary Influencers</option>
                            <option value="friends">Peer Group / Friends</option>
                            <option value="family">Family / Elders</option>
                            <option value="celebrities">Celebrities / Influencers</option>
                            <option value="experts">Tech Experts / Reviewers</option>
                        </select>
                    </ControlPanel>
                </div>

                {/* VISUALIZATION: HEATMAP MOCK */}
                <div className="bg-slate-800/50 border border-slate-700 p-6 flex flex-col items-center justify-center relative min-h-[300px]">
                    <h4 className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Social Density Heatmap</h4>

                    {state.choices.familyStructure ? (
                        <div className="grid grid-cols-3 gap-2 w-full max-w-[240px]">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-16 w-full rounded transition-all duration-500
                      ${state.choices.familyStructure === 'Joint'
                                            ? 'bg-purple-500'
                                            : 'bg-cyan-500'}
                    `}
                                    style={{ opacity: Math.random() * 0.5 + 0.2 }}
                                />
                            ))}
                            <div className="col-span-3 text-center mt-4 text-xs text-slate-400">
                                Simulating {state.choices.familyStructure} cluster density...
                            </div>
                        </div>
                    ) : (
                        <div className="text-slate-600 italic">Select Family Structure to visualize</div>
                    )}
                </div>
            </div>

            <NextButton onClick={onNext} />
        </div>
    );
}

// ----------------------------------------------------------------------
// STAGE 4: PSYCHOGRAPHICS
// ----------------------------------------------------------------------
export function PsychographicsStage({ state, onUpdate, onNext }: StageProps) {
    return (
        <div className="animate-fadeIn space-y-8">
            <SectionHeader title="Psychographics" subtitle="Understand the mind." />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {/* PERSONALITY TOGGLES */}
                    <ControlPanel title="Personality Archetype">
                        <div className="grid grid-cols-2 gap-3">
                            {['Adventurous', 'Conservative', 'Introverted', 'Extroverted'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => onUpdate({ personality: p })}
                                    className={`py-2 text-sm border ${state.choices.personality === p ? 'bg-orange-500/10 border-orange-500 text-orange-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </ControlPanel>

                    <ControlPanel title="Primary Motivation">
                        <div className="grid grid-cols-2 gap-3">
                            {['Status', 'Utility', 'Health', 'Trend'].map(m => (
                                <button
                                    key={m}
                                    onClick={() => onUpdate({ motivation: m })}
                                    className={`py-2 text-sm border ${state.choices.motivation === m ? 'bg-pink-500/10 border-pink-500 text-pink-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </ControlPanel>
                </div>

                {/* MOCK RADAR CHART */}
                <div className="bg-slate-800/50 border border-slate-700 p-6 flex items-center justify-center relative">
                    <h4 className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mindset Radar</h4>
                    <div className="w-64 h-64 border border-slate-600 rounded-full relative flex items-center justify-center opacity-70">
                        <div className="w-48 h-48 border border-slate-600 rounded-full absolute"></div>
                        <div className="w-32 h-32 border border-slate-600 rounded-full absolute"></div>

                        {/* Lines */}
                        <div className="w-full h-px bg-slate-600 absolute"></div>
                        <div className="h-full w-px bg-slate-600 absolute"></div>

                        {/* Dynamic Dot */}
                        {(state.choices.personality && state.choices.motivation) && (
                            <div className="absolute w-4 h-4 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)] animate-pulse"
                                style={{
                                    top: state.choices.motivation === 'Status' ? '20%' : state.choices.motivation === 'Utility' ? '80%' : '50%',
                                    left: state.choices.personality === 'Introverted' ? '20%' : state.choices.personality === 'Extroverted' ? '80%' : '50%'
                                }}
                            ></div>
                        )}
                    </div>
                </div>
            </div>

            <NextButton onClick={onNext} />
        </div>
    );
}

// ----------------------------------------------------------------------
// STAGE 5: CULTURAL FIT
// ----------------------------------------------------------------------
export function CulturalStage({ state, onUpdate, onNext }: StageProps) {
    return (
        <div className="animate-fadeIn space-y-8">
            <SectionHeader title="Cultural Framework" subtitle="The invisible force." />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                    { id: 'Traditionalist', desc: 'Values heritage, family approval, proven brands.', icon: '🏛️' },
                    { id: 'Modernist', desc: 'Values individualism, novelty, global trends.', icon: '🚀' }
                ].map((c) => (
                    <button
                        key={c.id}
                        onClick={() => onUpdate({ culturalFit: c.id as any })}
                        className={`p-8 border-2 rounded-xl text-left transition-all duration-300 group
              ${state.choices.culturalFit === c.id
                                ? 'bg-slate-800 border-yellow-500 shadow-xl scale-[1.02]'
                                : 'bg-slate-900 border-slate-700 hover:border-slate-500 opacity-70 hover:opacity-100'}`}
                    >
                        <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">{c.icon}</div>
                        <h3 className={`text-2xl font-bold mb-2 ${state.choices.culturalFit === c.id ? 'text-yellow-400' : 'text-slate-300'}`}>{c.id}</h3>
                        <p className="text-slate-400 leading-relaxed">{c.desc}</p>
                    </button>
                ))}
            </div>

            <NextButton onClick={onNext} />
        </div>
    );
}

// ----------------------------------------------------------------------
// STAGE 6: MEDIA ALLOCATION
// ----------------------------------------------------------------------
export function MediaStage({ state, onUpdate, onNext }: StageProps) {
    const total = state.choices.mediaAllocation.reels + state.choices.mediaAllocation.shorts + state.choices.mediaAllocation.whatsapp;
    const isOver = total > 100;

    const updateMedia = (key: keyof typeof state.choices.mediaAllocation, val: number) => {
        onUpdate({
            mediaAllocation: {
                ...state.choices.mediaAllocation,
                [key]: val
            }
        });
    }

    return (
        <div className="animate-fadeIn space-y-8">
            <SectionHeader title="Media Mix" subtitle="Allocate your 100% Share of Voice." />

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl max-w-2xl mx-auto">
                <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
                    <span className="text-slate-400">Total Allocation</span>
                    <span className={`text-3xl font-mono font-bold ${isOver ? 'text-red-500' : total === 100 ? 'text-emerald-500' : 'text-yellow-500'}`}>
                        {total}%
                    </span>
                </div>

                {[
                    { id: 'reels', label: 'Instagram Reels', color: 'accent-pink-600', text: 'text-pink-500' },
                    { id: 'shorts', label: 'YouTube Shorts', color: 'accent-red-600', text: 'text-red-500' },
                    { id: 'whatsapp', label: 'WhatsApp Business', color: 'accent-green-600', text: 'text-green-500' }
                ].map((channel) => (
                    <div key={channel.id} className="mb-6 last:mb-0">
                        <div className="flex justify-between mb-2 text-sm">
                            <span className="text-slate-300">{channel.label}</span>
                            <span className={channel.text}>{state.choices.mediaAllocation[channel.id as keyof typeof state.choices.mediaAllocation]}%</span>
                        </div>
                        <input
                            type="range" min="0" max="100"
                            value={state.choices.mediaAllocation[channel.id as keyof typeof state.choices.mediaAllocation]}
                            onChange={(e) => updateMedia(channel.id as any, parseInt(e.target.value))}
                            className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer ${channel.color}`}
                        />
                    </div>
                ))}
            </div>

            <div className="text-center">
                {isOver && <p className="text-red-400 mb-4 animate-bounce">Total cannot exceed 100%!</p>}
                <button
                    onClick={onNext}
                    disabled={isOver}
                    className="px-8 py-3 bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded hover:bg-cyan-500 transition-colors"
                >
                    LAUNCH CAMPAIGN
                </button>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// STAGE 7: STRATEGIC AUDIT REPORT (UPDATED)
// ----------------------------------------------------------------------
import { submitSimulation } from '../lib/gameLogic';

export function AARStage({ state }: { state: GameState }) {
    const { grade, pnl, warnings, errors, score } = getStrategicAnalysis(state);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    React.useEffect(() => {
        const doSubmit = async () => {
            if (submitStatus !== 'idle') return;
            setSubmitStatus('submitting');
            const result = await submitSimulation(state, { grade, pnl, warnings, errors, score });
            if (result.success) setSubmitStatus('success');
            else setSubmitStatus('error');
        };
        doSubmit();
    }, []);

    return (
        <div className="animate-fadeIn w-full">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-black text-white mb-2">STRATEGIC AUDIT</h1>
                <p className="text-slate-500 uppercase tracking-widest">Candidate: {state.studentName} ({state.enrollmentNumber})</p>
                <div className="mt-2 h-6">
                    {submitStatus === 'submitting' && <span className="text-xs text-yellow-500 animate-pulse">Saving to Cloud...</span>}
                    {submitStatus === 'success' && <span className="text-xs text-emerald-500">✓ Result Archived Securely</span>}
                    {submitStatus === 'error' && <span className="text-xs text-red-500">⚠ Cloud Save Failed (Check Console)</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* COLUMN 1: THE CHOICES (Recap) */}
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2">Your Strategic Choices</h3>
                    <ul className="space-y-4">
                        <RecapItem label="Demographics" value={`Age ${state.choices.ageRange[0]}-${state.choices.ageRange[1]} | Tier ${state.choices.cityTier} | >${state.choices.incomeLevel}LPA`} />
                        <RecapItem label="Social" value={`${state.choices.familyStructure} Family | Influence: ${state.choices.referenceGroup}`} />
                        <RecapItem label="Cultural" value={state.choices.culturalFit || 'N/A'} />
                        <RecapItem label="Media Mix" value={`Reels: ${state.choices.mediaAllocation.reels}%, Shorts: ${state.choices.mediaAllocation.shorts}%, WA: ${state.choices.mediaAllocation.whatsapp}%`} />
                    </ul>
                </div>

                {/* COLUMN 2: ANALYST FEEDBACK */}
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2">Analyst Intelligence</h3>

                    {errors.length > 0 && (
                        <div className="mb-6">
                            {errors.map((err, i) => (
                                <div key={i} className="bg-red-900/20 border-l-4 border-red-500 p-3 mb-2">
                                    <p className="text-red-400 font-bold text-sm">CRITICAL FAILURE</p>
                                    <p className="text-red-200 text-sm">{err}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {warnings.length > 0 ? (
                        <div>
                            {warnings.map((warn, i) => (
                                <div key={i} className="bg-yellow-900/20 border-l-4 border-yellow-500 p-3 mb-2">
                                    <p className="text-yellow-400 font-bold text-sm">WARNING</p>
                                    <p className="text-yellow-200 text-sm">{warn}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        errors.length === 0 && <p className="text-emerald-400">No strategic dissonance detected. Excellent alignment.</p>
                    )}

                    <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Projected P&amp;L</p>
                            <p className={`text-2xl font-mono ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Final Grade</p>
                            <p className={`text-6xl font-black ${grade === 'A' ? 'text-emerald-500' : grade === 'F' ? 'text-red-600' : 'text-yellow-500'}`}>
                                {grade}
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="text-center mt-12">
                <button onClick={() => window.location.reload()} className="px-6 py-2 border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded transition-colors">
                    Submit Another Simulation
                </button>
            </div>
        </div>
    );
}


// --- SHARED COMPONENTS ---

function SectionHeader({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <div className="mb-8 border-b border-slate-800 pb-4">
            <h2 className="text-3xl font-light text-white mb-2">{title}</h2>
            <p className="text-cyan-500/80 font-medium">{subtitle}</p>
        </div>
    );
}

function ControlPanel({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-lg hover:border-slate-600 transition-colors">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{title}</h3>
            {children}
        </div>
    );
}

function NextButton({ onClick }: { onClick: () => void }) {
    return (
        <div className="flex justify-end pt-8">
            <button
                onClick={onClick}
                className="px-8 py-3 bg-slate-100 hover:bg-white text-slate-900 font-bold rounded shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
            >
                CONFIRM & PROCEED
            </button>
        </div>
    );
}

function RecapItem({ label, value }: { label: string, value: string }) {
    return (
        <li className="flex justify-between border-b border-slate-800 pb-2 last:border-0">
            <span className="text-slate-500">{label}</span>
            <span className="text-slate-200 text-right font-medium">{value}</span>
        </li>
    )
}
