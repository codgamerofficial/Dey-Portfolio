import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Folder } from 'lucide-react';

export default function Dashboard() {
    // Mock data for now
    const projects = [
        { id: '1', name: 'Customer Support Bot', prompts: 5, updated: '2h ago' },
        { id: '2', name: 'Creative Writing Assistant', prompts: 2, updated: '1d ago' },
    ];

    return (
        <div className="container mx-auto p-8 text-foreground">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">Manage your AI engineering workspaces.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Link key={project.id} href={`/editor/project-${project.id}`}>
                        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {project.name}
                                </CardTitle>
                                <Folder className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{project.prompts} Prompts</div>
                                <p className="text-xs text-muted-foreground">
                                    Updated {project.updated}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                <Card className="flex items-center justify-center border-dashed cursor-pointer hover:bg-accent/50">
                    <div className="flex flex-col items-center py-10 text-muted-foreground">
                        <Plus className="h-8 w-8 mb-2" />
                        <span>Create New Project</span>
                    </div>
                </Card>
            </div>
        </div>
    );
}
