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

    const { choices } = state;
    const minAge = choices.ageRange[0];
    const maxAge = choices.ageRange[1];

    // --- 1. CRITICAL FAILURES (Errors) ---
    // Teenagers & Business Messaging (WhatsApp logic)
    if (maxAge < 20 && choices.mediaAllocation.whatsapp > 50) {
        errors.push("Strategic Fail: Teenagers (15-19) have low engagement with WhatsApp Business API messages.");
        score -= 25;
    }

    // Math Fail
    const totalAllocation = choices.mediaAllocation.reels + choices.mediaAllocation.shorts + choices.mediaAllocation.whatsapp;
    if (totalAllocation > 100) {
        errors.push("Math Fail: Media allocation exceeds 100%.");
        score -= 50;
    }

    // --- 2. LOGIC TRAPS (Warnings & Penalties) ---

    // The "Status" Trap: Low Income cannot prioritize Status over Utility
    // Income Levels: 0-10 (Low), 10-20 (Mid), 20-50 (High), 50+ (Ultra) -> Logic uses number
    if (choices.incomeLevel < 10 && choices.motivation === 'Status') {
        warnings.push("Strategy Error: Low income segments prioritize 'Utility' or 'Value' over 'Status'.");
        score -= 15;
    }

    // The "Trend" Mismatch: Seniors don't chase fast trends
    if (minAge > 50 && choices.motivation === 'Trend') {
        warnings.push("Demographic Mismatch: Seniors (>50) rarely prioritize 'Trend'. They prefer 'Health' or 'Utility'.");
        score -= 10;
    }

    // Psychographic Clash: Adventurous vs Traditionalist
    if (choices.personality === 'Adventurous' && choices.culturalFit === 'Traditionalist') {
        warnings.push("Psychographic Clash: 'Adventurous' personality conflicts with 'Traditionalist' cultural values.");
        score -= 10;
    }

    // Cultural Friction: Modernist values in Deep Rural (Tier 3)
    if (choices.cityTier === 3 && choices.culturalFit === 'Modernist') {
        warnings.push("Cultural Friction: Projecting Modernist values on a traditional rural (Tier 3) segment.");
        score -= 15;
    }

    // City/Family Reality: Tier 1 Metros are predominantly Nuclear
    if (choices.cityTier === 1 && choices.familyStructure === 'Joint') {
        warnings.push("Market Reality: Tier 1 Metros have a 70%+ skew towards 'Nuclear' families.");
        score -= 5;
    }

    // Budget Efficiency: Leaving money on the table
    if (totalAllocation < 95) {
        warnings.push(`Inefficiency: ${100 - totalAllocation}% of your budget is unallocated.`);
        score -= 5;
    }

    // Platform Mismatch: Seniors on Reels/Shorts
    if (minAge > 50 && (choices.mediaAllocation.reels + choices.mediaAllocation.shorts > 60)) {
        warnings.push("Platform Mismatch: >50 demographics have lower adoption of short-form vertical video.");
        score -= 10;
    }

    // --- 3. CALCULATE P&L ---
    const multiplier = Math.max(0, score) / 50;
    const pnl = (calculateBudget(state.insightsUnlocked) * multiplier) - calculateBudget(state.insightsUnlocked);

    // --- 4. ASSIGN GRADE (Hard Mode) ---
    // A+: 97-100, A: 93-96, A-: 90-92
    // B+: 87-89, B: 83-86, B-: 80-82
    // C+: 77-79, C: 73-76, C-: 70-72
    // F: <70
    let grade = 'F';
    if (score >= 97) grade = 'A+';
    else if (score >= 93) grade = 'A';
    else if (score >= 90) grade = 'A-';
    else if (score >= 87) grade = 'B+';
    else if (score >= 83) grade = 'B';
    else if (score >= 80) grade = 'B-';
    else if (score >= 77) grade = 'C+';
    else if (score >= 73) grade = 'C';
    else if (score >= 70) grade = 'C-';

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
