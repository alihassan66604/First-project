'use client';

import { useState } from 'react';
import { executeAssistantCommand, type AssistantExecutionResult } from '@/lib/assistant/commands';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, Badge } from '@/components/ui';
import type { Keyword } from '@/types';

interface MessageLog {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  result?: AssistantExecutionResult;
  timestamp: string;
}

const QUICK_COMMANDS = [
  'research digital planner',
  'cluster',
  'etsy baby shower invitation',
  'blog etsy seo guide',
  'ideas real estate marketing',
  'export csv',
  'help'
];

export default function AssistantPage() {
  const [commandInput, setCommandInput] = useState('');
  const [history, setHistory] = useState<MessageLog[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Hello! I am your rule-based SEO Assistant. I can research keywords, create semantic clusters, draft Etsy listings, generate blog outlines, and export CSVs—all locally without any paid API keys. Type "help" or select a quick command below.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [activeKeywords, setActiveKeywords] = useState<Keyword[]>([]);

  const handleSendCommand = (textToSend?: string) => {
    const cmd = (textToSend || commandInput).trim();
    if (!cmd) return;

    const userMsg: MessageLog = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: cmd,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const execResult = executeAssistantCommand(cmd, activeKeywords);

    // If keywords were generated, preserve them in active context for subsequent 'cluster' or 'export' commands
    if (execResult.data?.type === 'keywords' && Array.isArray(execResult.data.payload)) {
      setActiveKeywords(execResult.data.payload as Keyword[]);
    }

    const assistantMsg: MessageLog = {
      id: `asst-${Date.now() + 1}`,
      sender: 'assistant',
      text: execResult.message,
      result: execResult,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHistory(prev => [...prev, userMsg, assistantMsg]);
    setCommandInput('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">SEO Assistant</h1>
          <Badge variant="purple">V1.0 Rule-Based</Badge>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Execute fast, deterministic SEO commands. No black-box AI models or paid API dependencies.
        </p>
      </div>

      {/* Suggested Quick Commands */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Suggested:</span>
        {QUICK_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => handleSendCommand(cmd)}
            className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-brand-50 hover:text-brand-700 dark:bg-slate-800 dark:hover:bg-brand-950/60 dark:hover:text-brand-300 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Chat Log Window */}
      <Card className="min-h-[460px] flex flex-col justify-between p-0 overflow-hidden border-slate-200 dark:border-slate-800">
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[550px]">
          {history.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                <p className="font-medium">{msg.text}</p>

                {/* Render command payload if any */}
                {msg.result?.data && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
                    {msg.result.data.type === 'help' && (
                      <div className="space-y-1">
                        {(msg.result.data.payload as any).commands.map((c: any, i: number) => (
                          <div key={i} className="flex gap-2 font-mono">
                            <span className="text-brand-600 dark:text-brand-400 font-bold">{c.command}</span>
                            <span className="text-slate-500 font-sans">- {c.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.result.data.type === 'keywords' && (
                      <p className="text-slate-500">
                        {activeKeywords.length} keywords loaded in memory. You can now type <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-brand-600 font-bold">cluster</code> or <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-brand-600 font-bold">export csv</code>.
                      </p>
                    )}

                    {msg.result.data.type === 'etsy' && (
                      <div className="space-y-1 font-mono text-[11px]">
                        <p><span className="font-bold">Title:</span> {(msg.result.data.payload as any).generated_title}</p>
                        <p><span className="font-bold">Tags (13):</span> {(msg.result.data.payload as any).generated_tags.join(', ')}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendCommand();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Type a command (e.g. 'research wedding checklist', 'cluster', 'help')..."
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Button type="submit" variant="primary" size="md">
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
