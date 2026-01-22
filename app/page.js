'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function MarketLauncher() {
    const [minAge, setMinAge] = useState(18);
    const [maxAge, setMaxAge] = useState(65);
    const [income, setIncome] = useState('Middle');
    const [channel, setChannel] = useState('Instagram');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- MASDA LOGIC ---
    const calculateMASDA = (data, p_min, p_max, p_inc, p_chan) => {
        const profit = data.net_profit || 0;
        const size = data.segment_size || 0;

        // 1. ACCESSIBLE (Channel Fit)
        // Logic: Does the channel reach the demographics?
        let fitScore = 0; // 0-100
        let fitReason = "";

        if (p_chan === 'Instagram') {
            if (p_max <= 35) { fitScore = 95; fitReason = "Perfect! Gen Z & Millennials dominate this platform."; }
            else if (p_min > 50) { fitScore = 20; fitReason = "Poor fit. Older demographics have low engagement here."; }
            else { fitScore = 60; fitReason = "Decent mix, but you might miss the older segment."; }
        }
        else if (p_chan === 'LinkedIn') {
            if (p_min >= 22 && p_max <= 60 && (p_inc === 'Middle' || p_inc === 'High' || p_inc === 'Ultra-High')) {
                fitScore = 90; fitReason = "Excellent. The professional demographic is active here.";
            } else if (p_inc === 'Low') {
                fitScore = 30; fitReason = "Low income products struggle on a premium professional network.";
            } else {
                fitScore = 50; fitReason = "Mixed results. Niche targeting required.";
            }
        }
        else if (p_chan === 'TV') {
            if (p_inc === 'Low' || p_inc === 'Middle') {
                fitScore = 85; fitReason = "Great for mass market appeal.";
            } else {
                fitScore = 40; fitReason = "High/Ultra-High income groups view less traditional TV.";
            }
        }
        else if (p_chan === 'Email') {
            if (p_inc === 'High' || p_inc === 'Ultra-High') {
                fitScore = 80; fitReason = "High conversion for affluent users if the list is good.";
            } else {
                fitScore = 50; fitReason = "Average performance. Depends heavily on list quality.";
            }
        }
        else { // Word of Mouth
            if (profit > 10000) { fitScore = 90; fitReason = "High virality potential due to strong product value."; }
            else { fitScore = 30; fitReason = "Hard to scale without initial localized success."; }
        }

        // 2. MEASURABLE (Size)
        const measurable = size > 0
            ? `Identified ${size.toLocaleString()} households matching criteria.`
            : "Segment is too small or nonexistent to measure.";

        // 3. SUBSTANTIAL (Profit)
        const substantial = profit > 0
            ? "Strong. The segment generates positive ROI."
            : "Weak. Costs outweigh the revenue from this segment.";

        // 4. DIFFERENTIABLE (Heuristic)
        // Are they distinct? (Simplified logic)
        const differentiable = (p_max - p_min) < 20
            ? "High. Narrow age range allows for hyper-targeted messaging."
            : "Low. Broad age range makes it hard to create a specific message.";

        // 5. ACTIONABLE (Recommendation)
        let actionable = "";
        if (profit < 0) actionable = "Increase Price or narrows Age Range to reduce ad spend waste.";
        else if (fitScore < 50) actionable = `Switch channel. ${p_chan} is not efficient for this group.`;
        else actionable = "Scale up! Launch a Phase 2 campaign with double the budget.";

        return {
            measurable,
            accessible: `${fitReason} (Score: ${fitScore}%)`,
            substantial,
            differentiable,
            actionable,
            fitScore
        };
    };

    const handleLaunch = async () => {
        setLoading(true);
        setResults(null);

        try {
            const { data, error } = await supabase.rpc('launch_campaign', {
                p_min_age: minAge,
                p_max_age: maxAge,
                p_income_level: income,
                p_chosen_channel: channel,
            });

            if (error) {
                console.error('Error launching campaign:', error);
                alert('Simulation failed. Check console for details.');
            } else {
                // Calculate MASDA locally
                const masda = calculateMASDA(data, minAge, maxAge, income, channel);
                setResults({ ...data, ...masda });
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            alert('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 font-sans text-gray-800">
            {/* Header */}
            <header className="w-full max-w-4xl text-center mb-8">
                <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">Market Launcher</h1>
                <p className="text-sm text-gray-500 mt-2 font-medium">Developed by Dr. Om Jee Gupta, Professor of Marketing</p>
            </header>

            {/* Main Card */}
            <main className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8 border border-gray-200">

                {/* Controls */}
                <div className="space-y-6">

                    {/* Age Range */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Target Age Range</label>
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <span className="text-xs text-gray-500 block mb-1">Min Age: {minAge}</span>
                                <input
                                    type="range"
                                    min="10" max="80"
                                    value={minAge}
                                    onChange={(e) => setMinAge(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>
                            <div className="flex-1">
                                <span className="text-xs text-gray-500 block mb-1">Max Age: {maxAge}</span>
                                <input
                                    type="range"
                                    min="10" max="80"
                                    value={maxAge}
                                    onChange={(e) => setMaxAge(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>
                        </div>
                        {minAge > maxAge && <p className="text-xs text-red-500 mt-1">Min Age cannot be greater than Max Age</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Income Level */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Income Level</label>
                            <select
                                value={income}
                                onChange={(e) => setIncome(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            >
                                <option value="Low">Low</option>
                                <option value="Middle">Middle</option>
                                <option value="High">High</option>
                                <option value="Ultra-High">Ultra-High</option>
                            </select>
                        </div>

                        {/* Channel */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Marketing Channel</label>
                            <select
                                value={channel}
                                onChange={(e) => setChannel(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            >
                                <option value="Instagram">Instagram</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="TV">TV</option>
                                <option value="Email">Email</option>
                                <option value="Word of Mouth">Word of Mouth</option>
                            </select>
                        </div>
                    </div>

                    {/* Launch Button */}
                    <button
                        onClick={handleLaunch}
                        disabled={loading || minAge > maxAge}
                        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transform transition active:scale-95 flex justify-center items-center ${loading || minAge > maxAge ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                            }`}
                    >
                        {loading ? (
                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'LAUNCH CAMPAIGN 🚀'
                        )}
                    </button>
                </div>

                {/* Results Card */}
                {results && (
                    <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in-up space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800 text-center">Campaign Results</h3>

                        {/* KPI Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100 shadow-sm">
                                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Net Profit</div>
                                <div className={`text-xl font-extrabold mt-1 ${results.net_profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ${results.net_profit?.toLocaleString()}
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100 shadow-sm">
                                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Segment Size</div>
                                <div className="text-xl font-bold text-blue-900 mt-1">
                                    {results.segment_size?.toLocaleString()}
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100 shadow-sm">
                                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Channel Fit</div>
                                <div className={`text-xl font-bold mt-1 ${results.fitScore >= 80 ? 'text-green-600' : results.fitScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {results.fitScore}%
                                </div>
                            </div>
                        </div>

                        {/* MASDA Framework Report */}
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">M.A.S.D.A. Strategic Analysis</h4>

                            <div className="space-y-4 text-sm">
                                <div className="flex">
                                    <span className="w-32 font-bold text-slate-700 flex-shrink-0">Measurable</span>
                                    <span className="text-slate-600">{results.measurable}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-32 font-bold text-slate-700 flex-shrink-0">Accessible</span>
                                    <span className="text-slate-600">{results.accessible}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-32 font-bold text-slate-700 flex-shrink-0">Substantial</span>
                                    <span className="text-slate-600">{results.substantial}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-32 font-bold text-slate-700 flex-shrink-0">Differentiable</span>
                                    <span className="text-slate-600">{results.differentiable}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-32 font-bold text-slate-700 flex-shrink-0">Actionable</span>
                                    <span className="text-slate-600 italic font-medium text-blue-700">{results.actionable}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}
