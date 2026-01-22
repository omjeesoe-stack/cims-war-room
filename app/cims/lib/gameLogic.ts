import { createClient } from '@supabase/supabase-js';

// Types
export type Stage =
    | 'login'
    | 'briefing'
    | 'demographics'
    | 'social'
    | 'psychographics'
    | 'cultural'
    | 'media'
    | 'aar';

export interface GameState {
    studentName: string;
    enrollmentNumber: string;
    budget: number; // Starts at 10,00,000
    insightsUnlocked: number;
    currentStage: Stage;
    choices: {
        ageRange: [number, number];
        incomeLevel: number;
        cityTier: number;
        familyStructure: 'Nuclear' | 'Joint' | null;
        referenceGroup: string | null;
        personality: string | null;
        motivation: string | null;
        culturalFit: 'Traditionalist' | 'Modernist' | null;
        mediaAllocation: {
            reels: number;
            shorts: number;
            whatsapp: number;
        };
    };
}

export const INITIAL_BUDGET = 1000000;
export const INSIGHT_COST = 25000;

// Mock Data / Constants
export const NEWS_TICKER_ITEMS = [
    "Breaking: RBI announces new digital lending norms...",
    "Trend Alert: Tier 2 cities seeing 40% spike in premium audio demands...",
    "Market Watch: Smart wearable segment grows by 15% in Q1...",
    "Competitor Update: Noise launches new budget fitness tracker...",
    "Policy: Government pushes for 'Make in India' wearable components...",
    "Consumer Insight: Gen Z prefers authentic storytelling over polished ads...",
    "Tech Update: Battery life becomes #1 deciding factor for Tier 3 buyers..."
];

// Logic Helpers
export function calculateBudget(insightsUnlocked: number): number {
    return INITIAL_BUDGET - (insightsUnlocked * INSIGHT_COST);
}

export interface StrategicAnalysis {
    grade: string;
    pnl: number;
    warnings: string[];
    errors: string[];
    score: number;
}

export function getStrategicAnalysis(state: GameState): StrategicAnalysis {
    let score = 100;
    const warnings: string[] = [];
    const errors: string[] = [];

    // --- LOGIC RULES ---

    // 1. TEENAGERS & LINKEDIN
    // Since we don't have LinkedIn in the code yet (implied 'Media Allocation' might need a generic "Professional" channel or just generalize the logic)
    // For now, let's assume 'WhatsApp Business' behaves like a 'Professional/Direct' channel which teens might ignore, 
    // OR we add LinkedIn if needed. The prompt mentioned "Channel == LinkedIn".
    // Note: The prompt explicitly asked for "Reels, Shorts, WhatsApp" in Stage 6 in the ORIGINAL prompt.
    // The NEW prompt uses "Channel == LinkedIn" as an EXAMPLE. I will treat 'WhatsApp' as the 'Direct/Professional' proxy 
    // or I can add a dummy 'LinkedIn' if I were redesigning, but for now let's stick to the existing channels 
    // and apply logic to "WhatsApp" if relevant, OR 
    // ACTUALLY, I will add logic that IF they picked > 50% WhatsApp for anyone < 20, it's a fail.
    if (state.choices.ageRange[1] < 20 && state.choices.mediaAllocation.whatsapp > 50) {
        errors.push("Strategic Fail: Teenagers (15-19) have low engagement with WhatsApp Business API messages compared to social feeds.");
        score -= 25;
    }

    // 2. CULTURAL FRICTION (Modernist vs Tradition)
    if (state.choices.cityTier === 3 && state.choices.culturalFit === 'Modernist') {
        warnings.push("Cultural Friction: You projected Modernist values on a Traditionalist rural segment.");
        score -= 15;
    }

    // 3. INCOME & TIER MISMATCH
    if (state.choices.incomeLevel > 20 && state.choices.cityTier === 3) {
        warnings.push("Market Reality: High Net Worth density is extremely low in Tier 3 cities.");
        score -= 10;
    }

    // 4. AGE & PLATFORM
    // Seniors (50+) and Reels/Shorts
    if (state.choices.ageRange[0] > 50 && (state.choices.mediaAllocation.reels + state.choices.mediaAllocation.shorts > 70)) {
        warnings.push("Platform mismatch: >50 demographics have lower adoption of short-form vertical video.");
        score -= 10;
    }

    // 5. MEDIA ALLOCATION TOTAL
    const totalAllocation = state.choices.mediaAllocation.reels + state.choices.mediaAllocation.shorts + state.choices.mediaAllocation.whatsapp;
    if (totalAllocation > 100) {
        errors.push("Math Fail: Media allocation exceeds 100%.");
        score -= 50;
    } else if (totalAllocation < 80) {
        warnings.push("Inefficiency: Underutilized media budget.");
        score -= 5;
    }


    // CALC P&L
    const multiplier = Math.max(0, score) / 50;
    const pnl = (calculateBudget(state.insightsUnlocked) * multiplier) - calculateBudget(state.insightsUnlocked);

    // GRADE
    let grade = 'F';
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';

    return { grade, pnl, warnings, errors, score };
}

// Supabase helper
// Supabase helper
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://adkrfizzwqekogiiruzf.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka3JmaXp6d3Fla29naWlydXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDkxMDYsImV4cCI6MjA4NDU4NTEwNn0.xs9qs9HUCd-y5IGZIJrH_yIlW0XyLJV4DTcRTgLAg3I'
);

export async function submitSimulation(state: GameState, analysis: StrategicAnalysis) {
    try {
        const payload = {
            student_name: state.studentName,
            enrollment_number: state.enrollmentNumber,
            choices: state.choices,
            grade: analysis.grade,
            score: analysis.score,
            pnl: analysis.pnl,
            warnings: analysis.warnings,
            errors: analysis.errors,
            submitted_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('cims_submissions')
            .insert([payload]);

        if (error) {
            console.error("Supabase Submission Error:", error);
            return { success: false, error };
        }
        console.log("Supabase Submission Success:", data);
        return { success: true, data };
    } catch (err) {
        console.error("Unexpected Submission Error:", err);
        return { success: false, error: err };
    }
}
