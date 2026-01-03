import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <h1 className="mb-4 text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        PromptNexus
      </h1>
      <p className="mb-8 text-xl text-muted-foreground max-w-lg text-center">
        The Intelligent Prompt Engineering Platform. Architect, Optimize, and Test your prompts with AI Agents.
      </p>
      <div className="flex gap-4">
        <Link href="/dashboard">
          <Button size="lg">Get Started</Button>
        </Link>
        <Button variant="outline" size="lg">Documentation</Button>
      </div>
    </div>
  );
}
