'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Stage, NEWS_TICKER_ITEMS, calculateBudget } from '../lib/gameLogic';

interface WarRoomLayoutProps {
    children: React.ReactNode;
    currentStage: Stage;
    budget: number;
}

const STAGES: { id: Stage; label: string }[] = [
    { id: 'briefing', label: '1. The Briefing' },
    { id: 'demographics', label: '2. Demographics' },
    { id: 'social', label: '3. Social Architecture' },
    { id: 'psychographics', label: '4. Psychographics' },
    { id: 'cultural', label: '5. Cultural Fit' },
    { id: 'media', label: '6. Media Allocation' },
    { id: 'aar', label: '7. The AAR' },
];

export default function WarRoomLayout({ children, currentStage, budget }: WarRoomLayoutProps) {
    return (
        <div className="flex h-screen w-full bg-slate-950 text-white font-sans overflow-hidden selection:bg-cyan-500 selection:text-slate-900">

            {/* LEFT SIDEBAR */}
            <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900/50 flex flex-col justify-between relative z-20 backdrop-blur-md">

                {/* BRANDING HEADER */}
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold tracking-tight text-white mb-1 leading-tight">
                        Developed by<br />Dr. Om Jee Gupta
                    </h1>
                    <p className="text-sm text-cyan-400 italic mb-0.5">Professor of Marketing</p>
                    <p className="text-xs text-slate-400">Jaipuria Institute of Management, Lucknow</p>
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Mission Stages
                    </div>
                    {STAGES.map((stage) => {
                        const isActive = currentStage === stage.id;
                        return (
                            <div
                                key={stage.id}
                                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 cursor-default
                  ${isActive
                                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                    }`}
                            >
                                <div className={`w-2 h-2 rounded-full mr-3 ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'}`} />
                                {stage.label}
                            </div>
                        );
                    })}
                </nav>

                {/* BUDGET WIDGET */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/80">
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Available Budget</p>
                    <div className="text-2xl font-mono text-emerald-400 font-bold">
                        ₹{budget.toLocaleString('en-IN')}
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-[url('/grid-pattern.svg')] bg-[length:40px_40px]">
                {/* BACKGROUND GRID EFFECT (CSS-in-JS backup if SVG missing) */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                {/* TOP BAR WITH TICKER */}
                <header className="h-12 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center justify-between px-4 z-10">
                    <div className="flex items-center space-x-2">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Live Intel</span>
                    </div>

                    {/* NEWS TICKER */}
                    <div className="flex-1 mx-4 overflow-hidden relative group">
                        <div className="ticker-wrapper whitespace-nowrap overflow-hidden">
                            <div className="inline-block animate-marquee pl-full">
                                {NEWS_TICKER_ITEMS.map((item, i) => (
                                    <span key={i} className="text-sm text-slate-300 mx-8 border-l-2 border-slate-700 pl-4">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-slate-500 border border-slate-700 rounded px-2 py-0.5">
                        CIMS v1.0
                    </div>
                </header>

                {/* DYNAMIC STAGE CONTENT */}
                <div className="flex-1 overflow-y-auto p-8 relative z-0 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <div className="max-w-5xl mx-auto pb-20">
                        {children}
                    </div>
                </div>
            </main>

            {/* GLOBAL STYLES FOR ANIMATION */}
            <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
        .ticker-wrapper:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
}
