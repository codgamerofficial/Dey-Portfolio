import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Sparkles, ShieldAlert, Award, Loader2, Send } from 'lucide-react';
import { agentApi } from '@/lib/api';
import { usePromptStore } from '@/lib/store/prompt-store';
import { Textarea } from '@/components/ui/textarea'; // We might need to create this or use simple textarea

export default function AgentSidebar() {
    const { currentPrompt, updatePromptContent, addLog } = usePromptStore();
    const [loading, setLoading] = useState<string | null>(null);
    const [architectIntent, setArchitectIntent] = useState("");
    const [evalResult, setEvalResult] = useState<any>(null);

    const handleArchitect = async () => {
        if (!architectIntent.trim()) return;
        setLoading('architect');
        addLog({ type: 'info', message: 'Architect Agent started...', data: { intent: architectIntent } });

        try {
            const res = await agentApi.architect(architectIntent);
            if (res.draft_prompt) {
                updatePromptContent(res.draft_prompt);
                addLog({ type: 'success', message: 'Architect generated a draft.', data: res });
            }
        } catch (e: any) {
            console.error(e);
            addLog({ type: 'error', message: 'Architect failed.', data: e.toString() });
        } finally {
            setLoading(null);
        }
    };

    const handleOptimize = async () => {
        if (!currentPrompt?.versions[0]?.content) return;
        setLoading('optimizer');
        addLog({ type: 'info', message: 'Optimizer Agent started...' });

        try {
            const res = await agentApi.optimize(currentPrompt.versions[0].content);
            if (res.optimized_prompt) {
                updatePromptContent(res.optimized_prompt);
                addLog({ type: 'success', message: 'Optimizer refined the prompt.', data: res });
            }
        } catch (e: any) {
            addLog({ type: 'error', message: 'Optimizer failed.', data: e.toString() });
        } finally {
            setLoading(null);
        }
    };

    const handleTest = async () => {
        if (!currentPrompt?.versions[0]?.content) return;
        setLoading('tester');
        addLog({ type: 'info', message: 'Tester Agent running adversarial checks...' });

        try {
            const res = await agentApi.test(currentPrompt.versions[0].content);
            addLog({ type: 'success', message: 'Tester completed.', data: res });
        } catch (e: any) {
            addLog({ type: 'error', message: 'Tester failed.', data: e.toString() });
        } finally {
            setLoading(null);
        }
    }

    const handleEvaluate = async () => {
        if (!currentPrompt?.versions[0]?.content) return;
        setLoading('evaluator');
        addLog({ type: 'info', message: 'Evaluator judging prompt...' });

        try {
            const res = await agentApi.evaluate(currentPrompt.versions[0].content);
            setEvalResult(res);
            addLog({ type: 'success', message: 'Evaluation complete.', data: res });
        } catch (e: any) {
            addLog({ type: 'error', message: 'Evaluation failed.', data: e.toString() });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex flex-col gap-4 h-full">
            <Card className="flex-1 overflow-auto bg-card/50 backdrop-blur">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5" /> Agents
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Architect Section */}
                    <div className="space-y-2 border-b pb-4 border-muted">
                        <div className="flex items-center gap-2 font-medium text-sm text-yellow-500">
                            <Sparkles className="h-4 w-4" /> Architect
                        </div>
                        <div className="space-y-2">
                            <textarea
                                className="w-full min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="Describe your prompt goal..."
                                value={architectIntent}
                                onChange={(e) => setArchitectIntent(e.target.value)}
                            />
                            <Button
                                size="sm"
                                className="w-full"
                                onClick={handleArchitect}
                                disabled={!!loading || !architectIntent}
                            >
                                {loading === 'architect' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                Generate Draft
                            </Button>
                        </div>
                    </div>

                    {/* Optimizer Section */}
                    <div className="space-y-2">
                        <Button
                            className="w-full justify-start"
                            variant="secondary"
                            onClick={handleOptimize}
                            disabled={!!loading}
                        >
                            {loading === 'optimizer' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Award className="mr-2 h-4 w-4 text-blue-500" />}
                            Optimize Prompt
                        </Button>
                        <div className="text-xs text-muted-foreground pl-2">Reduces tokens & improves clarity</div>
                    </div>

                    {/* Tester Section */}
                    <div className="space-y-2">
                        <Button
                            className="w-full justify-start"
                            variant="secondary"
                            disabled={!!loading}
                            onClick={handleTest}
                        >
                            <ShieldAlert className="mr-2 h-4 w-4 text-red-500" /> Run Edge Tests
                        </Button>
                        <div className="text-xs text-muted-foreground pl-2">Generates adversarial cases</div>
                    </div>
                </CardContent>
            </Card>

            <Card className="h-1/3 bg-card/50 backdrop-blur">
                <CardHeader>
                    <CardTitle>Evaluation</CardTitle>
                </CardHeader>
                <CardContent>
                    {evalResult ? (
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span>Clarity</span>
                                <span className="font-bold text-green-400">{evalResult.clarity}/10</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Safety</span>
                                <span className="font-bold text-green-400">{evalResult.safety}/10</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-2 border-t pt-2 max-h-[100px] overflow-auto">
                                {/* JSON hack to show feedback cleanly if string or obj */}
                                {typeof evalResult.feedback === 'string' ? evalResult.feedback : JSON.stringify(evalResult.feedback)}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-4">
                            <Button size="sm" variant="outline" onClick={handleEvaluate} disabled={!!loading}>
                                {loading === 'evaluator' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Run Grading"}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
