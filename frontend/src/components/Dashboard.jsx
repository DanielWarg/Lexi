import React from 'react';
import { Activity, Database, CheckSquare, Layers } from 'lucide-react';
import ToolRunner from './ToolRunner';
import MemoryInspector from './MemoryInspector';

const Dashboard = () => {
    return (
        <div className="p-8 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-700 h-[calc(100vh-2rem)]">
            {/* Header */}
            <div className="col-span-full border-b border-zinc-800 pb-6 mb-2 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-light text-white tracking-tight">Project Dashboard</h1>
                    <p className="text-zinc-500 mt-2 text-sm font-mono">Lexi Prime v4.0 • Vertical Slice</p>
                </div>
                <div className="flex gap-4 text-xs font-mono text-zinc-600">
                    <span className="text-green-500">● SYSTEM ONLINE</span>
                    <span>SECURE LINK</span>
                </div>
            </div>

            {/* Stats - Compact Row */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
                    <div className="p-2 bg-cyan-900/20 rounded-lg text-cyan-400"><Activity size={20} /></div>
                    <div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider">Latency</div>
                        <div className="text-xl font-mono text-white">12ms</div>
                    </div>
                </div>
                <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
                    <div className="p-2 bg-purple-900/20 rounded-lg text-purple-400"><Database size={20} /></div>
                    <div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider">Memory</div>
                        <div className="text-xl font-mono text-white">Active</div>
                    </div>
                </div>
                <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
                    <div className="p-2 bg-green-900/20 rounded-lg text-green-400"><Layers size={20} /></div>
                    <div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider">Projects</div>
                        <div className="text-xl font-mono text-white">3 Active</div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-12 lg:col-span-8 min-h-[500px]">
                <ToolRunner />
            </div>

            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
                <MemoryInspector />
            </div>
        </div>
    );
};

export default Dashboard;
