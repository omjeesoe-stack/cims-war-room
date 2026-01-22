'use client';

import React, { useState } from 'react';
import WarRoomLayout from './components/WarRoomLayout';
import {
    LoginStage,
    BriefingStage,
    DemographicsStage,
    SocialStage,
    PsychographicsStage,
    CulturalStage,
    MediaStage,
    AARStage
} from './components/StageViews';
import { GameState, Stage, INITIAL_BUDGET, calculateBudget } from './lib/gameLogic';

// Initial Empty State
const INITIAL_STATE: GameState = {
    studentName: '',
    enrollmentNumber: '',
    budget: INITIAL_BUDGET,
    insightsUnlocked: 0,
    currentStage: 'login', // Stage 0 is now Login
    choices: {
        ageRange: [15, 60], // Updated default range
        incomeLevel: 8,
        cityTier: 1,
        familyStructure: null,
        referenceGroup: null,
        personality: null,
        motivation: null,
        culturalFit: null,
        mediaAllocation: { reels: 0, shorts: 0, whatsapp: 0 }
    }
};

export default function CIMSPage() {
    const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
    const [toast, setToast] = useState<{ message: string, visible: boolean } | null>(null);

    // --- ADVISOR INSIGHT SYSTEM ---
    const showToast = (message: string) => {
        setToast({ message, visible: true });
        // Auto-dismiss
        setTimeout(() => setToast(current => current ? { ...current, visible: false } : null), 4000);
    };

    const updateGameState = (updates: Partial<GameState['choices']>) => {
        setGameState(prev => {
            const newState = { ...prev, choices: { ...prev.choices, ...updates } };

            // TRIGGER INSIGHTS BASED ON CHANGES
            // 1. Tier 3 selection
            if (updates.cityTier === 3 && prev.choices.cityTier !== 3) {
                showToast("Advisor Note: Tier 3 markets rely heavily on 'word-of-mouth' over digital ads.");
            }

            // 2. High Income specific
            if (updates.incomeLevel && updates.incomeLevel > 20 && prev.choices.incomeLevel <= 20) {
                showToast("Advisor Note: High Net-Worth Individuals (HNIs) value 'Data Privacy' above features.");
            }

            // 3. Cultural Traditionalist
            if (updates.culturalFit === 'Traditionalist') {
                showToast("Advisor Note: Traditionalists align with 'Family' values. Ensure messaging reflects this.");
            }

            // 4. Media: Reels
            if (updates.mediaAllocation?.reels && updates.mediaAllocation.reels > 50) {
                showToast("Advisor: Heavy Instagram reliance? Ensure your creatives are under 15 seconds.");
            }

            return newState;
        });
    };

    const updateStateRoot = (updates: Partial<GameState>) => {
        setGameState(prev => ({ ...prev, ...updates }));
    }

    const advanceStage = () => {
        const stageOrder: Stage[] = [
            'login', 'briefing', 'demographics', 'social', 'psychographics', 'cultural', 'media', 'aar'
        ];
        const currentIndex = stageOrder.indexOf(gameState.currentStage);
        if (currentIndex < stageOrder.length - 1) {
            setGameState(prev => ({
                ...prev,
                currentStage: stageOrder[currentIndex + 1]
            }));
        }
    };

    // Render the current stage component
    const renderStage = () => {
        const props = {
            state: gameState,
            onUpdate: updateGameState,
            onUpdateState: updateStateRoot,
            onNext: advanceStage
        };

        switch (gameState.currentStage) {
            case 'login': return <LoginStage {...props} />;
            case 'briefing': return <BriefingStage onNext={advanceStage} state={gameState} onUpdate={updateGameState} onUpdateState={updateStateRoot} />;
            case 'demographics': return <DemographicsStage {...props} />;
            case 'social': return <SocialStage {...props} />;
            case 'psychographics': return <PsychographicsStage {...props} />;
            case 'cultural': return <CulturalStage {...props} />;
            case 'media': return <MediaStage {...props} />;
            case 'aar': return <AARStage state={gameState} />;
            default: return <div>Unknown Stage</div>;
        }
    };

    // If in Login stage, we don't show the War Room Layout (or we show a simplified/hidden version?)
    // Actually the prompt says "Before seeing the dashboard, the user must see a Login Screen."
    // So I'll render LoginStage *outside* the WarRoomLayout if it's the login stage.
    // OR, I can render it inside but hide the sidebar controls.
    // Let's render it outside to "Gate" completely.

    if (gameState.currentStage === 'login') {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 bg-[url('/grid-pattern.svg')]">
                <LoginStage {...{ state: gameState, onUpdate: updateGameState, onUpdateState: updateStateRoot, onNext: advanceStage }} />
            </div>
        );
    }

    return (
        <WarRoomLayout
            currentStage={gameState.currentStage}
            budget={calculateBudget(gameState.insightsUnlocked)}
        >
            {renderStage()}

            {/* TOAST NOTIFICATION COMPONENT */}
            <div className={`fixed bottom-8 right-8 max-w-sm w-full transform transition-all duration-500 z-50
        ${toast?.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}
      `}>
                <div className="bg-slate-900 border-l-4 border-cyan-500 shadow-2xl p-4 flex items-start rounded-r-lg">
                    <div className="flex-shrink-0 pt-0.5">
                        <span className="text-2xl">💡</span>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-cyan-400">Advisor Insight</h3>
                        <p className="mt-1 text-sm text-slate-300">{toast?.message}</p>
                    </div>
                    <button
                        onClick={() => setToast(null)}
                        className="ml-auto text-slate-500 hover:text-white"
                    >
                        ×
                    </button>
                </div>
            </div>
        </WarRoomLayout>
    );
}
