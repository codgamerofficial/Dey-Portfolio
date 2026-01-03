'use client';

import React, { useEffect } from 'react';
import MonacoEditorWrapper from './_components/MonacoEditorWrapper';
import AgentSidebar from './_components/AgentSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Save, History, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePromptStore } from '@/lib/store/prompt-store';

export default function EditorPage({ params }: { params: { promptId: string } }) {
    const { currentPrompt, setPrompt, updatePromptContent, isLoading, consoleLogs } = usePromptStore();

    useEffect(() => {
        // Mock fetch for now, or real fetch if we had a backend list endpoint ready
        // For MVP, we initialize with a dummy prompt on load if null
        if (!currentPrompt) {
            setPrompt({
                id: params.promptId,
                title: "Untitled Prompt",
                description: "New prompt",
                activeVersionId: "v1",
                versions: [{
                    id: "v1",
                    version_number: 1,
                    content: "# System Role\n\n",
                    created_at: new Date().toISOString()
                }]
            })
        }
    }, [params.promptId, currentPrompt, setPrompt]);

    const activeContent = currentPrompt?.versions[0]?.content || "";

    return (
        <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden">
            {/* Header */}
            <header className="flex h-14 items-center justify-between border-b px-6 bg-card/50 backdrop-blur z-10">
                <div className="flex items-center gap-4">
                    <h1 className="font-semibold">{currentPrompt?.title || "Loading..."}</h1>
                    <Badge variant="outline">v1.2 (Draft)</Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                        <History className="mr-2 h-4 w-4" /> History
                    </Button>
                    <Button variant="secondary" size="sm">
                        <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button size="sm">
                        <Play className="mr-2 h-4 w-4" /> Run
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel: Project/Files (Mobile hidden usually, strictly keeping to requirements "Left Panel: Projects + Agents" -> Actually requirements said "Left: Projects+Agents", "Center: Editor", "Right: Output". I moved Agents to Sidebar. Let is adjust Layout) */}
                {/* Requirements: 
           Left Panel: Projects + Agents
           Center: Prompt Editor
           Right Panel: Agent output + scores
           Bottom: Version timeline
        */}

                {/* Revised Layout:
            Left Sidebar (COLLAPSIBLE): Navigation & Agents
            Center: Editor
            Right: Output (Chat/Test Results)
        */}

                <aside className="w-64 border-r p-4 hidden md:block bg-background/50">
                    <AgentSidebar />
                </aside>

                <main className="flex-1 flex flex-col relative min-w-0">
                    {/* Editor Area */}
                    <div className="flex-1 p-0 relative">
                        {isLoading && <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"><Loader2 className="animate-spin text-white" /></div>}
                        <MonacoEditorWrapper
                            value={activeContent}
                            onChange={(val) => updatePromptContent(val || '')}
                        />
                    </div>
                </main>

                <aside className="w-80 border-l bg-background/50 hidden lg:flex flex-col">
                    <div className="p-4 border-b font-semibold bg-muted/40 text-sm">Output Console</div>
                    <div className="flex-1 p-4 overflow-auto space-y-3">
                        {consoleLogs.length === 0 && <div className="text-muted-foreground text-xs opacity-50">System Ready. Waiting for agents...</div>}

                        {consoleLogs.map((log, idx) => (
                            <div key={idx} className="text-xs font-mono border rounded p-2 bg-black/40">
                                <div className={cn("font-bold mb-1", {
                                    'text-blue-400': log.type === 'info',
                                    'text-green-400': log.type === 'success',
                                    'text-red-400': log.type === 'error',
                                    'text-purple-400': log.type === 'agent',
                                })}>
                                    [{log.type.toUpperCase()}] {log.message}
                                </div>
                                {log.data && (
                                    <pre className="text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                                        {typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)}
                                    </pre>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>
            </div>

            {/* Bottom: Version Timeline (Placeholder) */}
            <div className="h-12 border-t flex items-center px-4 bg-card/30 text-xs text-muted-foreground">
                Timeline: [v1.0] ---- [v1.1] ---- (Current)
            </div>
        </div>
    );
}
