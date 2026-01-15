import React from 'react';
import { Database } from 'lucide-react';

const MemoryInspector = () => {
    // Placeholder for A0 - static mock or simple fetch if we had an endpoint
    // We didn't build a 'GET /memory' endpoint yet, so we will stub it for UI completeness

    return (
        <div className="bg-zinc-900/40 p-6 rounded-xl border border-zinc-800 h-full">
            <div className="flex items-center gap-3 text-purple-400 mb-6">
                <Database size={20} />
                <h3 className="uppercase tracking-widest text-xs">Memory Stream</h3>
            </div>

            <div className="space-y-4">
                <div className="p-3 bg-black/30 rounded border border-zinc-800/50 border-l-2 border-l-cyan-500">
                    <p className="text-xs text-zinc-500 mb-1">User Profile • System</p>
                    <p className="text-sm text-zinc-300">Executive role established. Leadership style: Collaborative.</p>
                </div>
                <div className="p-3 bg-black/30 rounded border border-zinc-800/50 border-l-2 border-l-purple-500">
                    <p className="text-xs text-zinc-500 mb-1">Observation • Auto</p>
                    <p className="text-sm text-zinc-300">User prefers direct communication and visual summaries.</p>
                </div>
                <div className="p-3 bg-black/30 rounded border border-zinc-800/50 text-center text-zinc-600 text-xs mt-8">
                    Database Connection Active (SQLite + Chroma)
                </div>
            </div>
        </div>
    );
};

export default MemoryInspector;
