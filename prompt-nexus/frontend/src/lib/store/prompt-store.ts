import { create } from 'zustand';

// Improve types using shared schemas conceptually, but simplified for frontend
export interface PromptVersion {
    id: string;
    version_number: number;
    content: string;
    created_at: string;
    commit_message?: string;
    // blueprint, model_config, variables...
}

export interface Prompt {
    id: string;
    title: string;
    description: string;
    activeVersionId?: string;
    versions: PromptVersion[];
}

interface PromptState {
    currentPrompt: Prompt | null;
    isLoading: boolean;
    agentsActive: {
        architect: boolean;
        optimizer: boolean;
        tester: boolean;
        evaluator: boolean;
    };
    consoleLogs: Array<{ type: 'info' | 'success' | 'error' | 'agent', message: string, data?: any }>;

    // Actions
    setPrompt: (prompt: Prompt) => void;
    updatePromptContent: (content: string) => void; // Local edit before save
    setLoading: (loading: boolean) => void;
    toggleAgent: (agent: keyof PromptState['agentsActive'], active: boolean) => void;
    addLog: (log: { type: 'info' | 'success' | 'error' | 'agent', message: string, data?: any }) => void;
}

export const usePromptStore = create<PromptState>((set) => ({
    currentPrompt: null,
    isLoading: false,
    agentsActive: {
        architect: false,
        optimizer: false,
        tester: false,
        evaluator: false,
    },
    consoleLogs: [],

    setPrompt: (prompt) => set({ currentPrompt: prompt }),

    updatePromptContent: (content) => set((state) => {
        if (!state.currentPrompt) return {};
        // Logic to update a "draft" state or the active version
        // For now, assuming we edit the active version deeply (simplified)
        return {
            currentPrompt: {
                ...state.currentPrompt,
                versions: state.currentPrompt.versions.map(v =>
                    v.id === state.currentPrompt!.activeVersionId
                        ? { ...v, content }
                        : v
                )
            }
        };
    }),

    setLoading: (loading) => set({ isLoading: loading }),

    toggleAgent: (agent, active) => set((state) => ({
        agentsActive: { ...state.agentsActive, [agent]: active }
    })),

    addLog: (log) => set((state) => ({ consoleLogs: [...state.consoleLogs, log] })),
}));
