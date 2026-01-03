const API_BASE = 'http://localhost:8000/api/v1';

export const agentApi = {
    architect: async (intent: string) => {
        const res = await fetch(`${API_BASE}/agents/architect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ intent }),
        });
        if (!res.ok) throw new Error('Architect agent failed');
        return res.json();
    },

    optimize: async (currentPrompt: string) => {
        const res = await fetch(`${API_BASE}/agents/optimize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ current_prompt: currentPrompt }),
        });
        if (!res.ok) throw new Error('Optimizer agent failed');
        return res.json();
    },

    test: async (prompt: string) => {
        const res = await fetch(`${API_BASE}/agents/test`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });
        if (!res.ok) throw new Error('Tester agent failed');
        return res.json();
    },

    evaluate: async (prompt: string) => {
        const res = await fetch(`${API_BASE}/agents/evaluate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });
        if (!res.ok) throw new Error('Evaluator agent failed');
        return res.json();
    },
};
