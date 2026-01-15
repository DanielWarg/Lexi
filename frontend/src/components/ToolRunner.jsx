import React, { useState, useEffect } from 'react';
import { Terminal, Play, FileText, Check } from 'lucide-react';

const ToolRunner = () => {
    const [tools, setTools] = useState([]);
    const [selectedTool, setSelectedTool] = useState(null);
    const [params, setParams] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/v1/tools/')
            .then(res => res.json())
            .then(data => setTools(data));
    }, []);

    const handleExecute = async () => {
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch(`/api/v1/tools/${selectedTool.id}/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            setResult({ error: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-zinc-900/40 p-6 rounded-xl border border-zinc-800 h-full flex flex-col">
            <div className="flex items-center gap-3 text-cyan-400 mb-6">
                <Terminal size={20} />
                <h3 className="uppercase tracking-widest text-xs">Command Center</h3>
            </div>

            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                {tools.map(tool => (
                    <button
                        key={tool.id}
                        onClick={() => { setSelectedTool(tool); setParams({}); setResult(null); }}
                        className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all border ${selectedTool?.id === tool.id
                                ? 'bg-cyan-900/30 border-cyan-500/50 text-cyan-200'
                                : 'bg-zinc-800 border-transparent hover:bg-zinc-700 text-zinc-400'
                            }`}
                    >
                        {tool.name}
                    </button>
                ))}
            </div>

            {selectedTool && (
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                    <p className="text-sm text-zinc-500 italic">{selectedTool.description}</p>

                    {/* Dynamic Form Generation from JSON Schema */}
                    {Object.entries(selectedTool.input_schema?.properties || {}).map(([key, prop]) => (
                        <div key={key} className="space-y-2">
                            <label className="text-xs uppercase text-zinc-500 tracking-wider">{prop.description || key}</label>
                            {key.includes('content') || key.includes('key_points') ? (
                                <textarea
                                    className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none min-h-[100px]"
                                    onChange={e => setParams({ ...params, [key]: e.target.value })}
                                    value={params[key] || ''}
                                />
                            ) : (
                                <input
                                    type="text"
                                    className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                                    onChange={e => setParams({ ...params, [key]: e.target.value })}
                                    value={params[key] || ''}
                                />
                            )}
                        </div>
                    ))}

                    <button
                        onClick={handleExecute}
                        disabled={loading}
                        className="w-full py-3 bg-cyan-700 hover:bg-cyan-600 rounded-lg text-white text-sm font-medium tracking-wide transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? 'Executing...' : <><Play size={16} /> Execute Protocol</>}
                    </button>

                    {result && (
                        <div className="mt-6 p-4 bg-black/50 rounded-lg border border-zinc-800 animate-in fade-in">
                            <div className="flex items-center gap-2 text-green-400 mb-2">
                                <Check size={16} />
                                <span className="text-xs uppercase">Output Generated</span>
                            </div>
                            <pre className="text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap font-mono">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                            {result.file_path && (
                                <div className="mt-3 flex items-center gap-2 text-cyan-400 text-xs">
                                    <FileText size={14} />
                                    Saved to: {result.filename}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {!selectedTool && (
                <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
                    Select a module to begin operation.
                </div>
            )}
        </div>
    );
};

export default ToolRunner;
