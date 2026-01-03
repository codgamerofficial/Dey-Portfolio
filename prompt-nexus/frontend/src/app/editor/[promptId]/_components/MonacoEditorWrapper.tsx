'use client';

import React from 'react';
import Editor, { EditorProps } from '@monaco-editor/react';

interface MonacoEditorWrapperProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language?: string;
}

export default function MonacoEditorWrapper({ value, onChange, language = 'markdown' }: MonacoEditorWrapperProps) {
    return (
        <div className="h-full w-full overflow-hidden rounded-md border text-left">
            <Editor
                height="100%"
                defaultLanguage={language}
                theme="vs-dark"
                value={value}
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                }}
            />
        </div>
    );
}
