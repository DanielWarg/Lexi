import React, { useEffect, useRef } from 'react';
import { Globe, X, Send } from 'lucide-react';

const BrowserWindow = ({ imageSrc, logs, onClose, socket }) => {
    const [input, setInput] = React.useState('');
    const logsEndRef = useRef(null);

    // Auto-scroll logs to bottom
    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const handleSend = () => {
        if (!input.trim()) return;
        if (socket) {
            socket.emit('prompt_web_agent', { prompt: input });
        }
        setInput('');
    };

    return (
        <div className="w-full h-full relative flex flex-col bg-black/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
            {/* Header Bar */}
            <div
                data-drag-handle
                className="h-12 bg-gradient-to-r from-blue-900/30 to-cyan-900/20 border-b border-white/10 flex items-center justify-between px-4 shrink-0 cursor-grab active:cursor-grabbing"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Globe size={18} className="text-blue-400" />
                    </div>
                    <div>
                        <span className="text-white font-semibold tracking-wide">Web Agent</span>
                        <span className="text-white/40 text-xs ml-2">Browser Automation</span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-all duration-200 hover:scale-105"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Browser Content - Main View */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden min-h-0">
                {imageSrc ? (
                    <img
                        src={`data:image/jpeg;base64,${imageSrc}`}
                        alt="Browser View"
                        className="max-w-full max-h-full object-contain"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-4 text-gray-500">
                        <Globe size={48} className="opacity-20 animate-pulse" />
                        <div className="text-sm font-mono">Waiting for browser stream...</div>
                        <div className="text-xs text-gray-600">Use the input below to give Web Agent a task</div>
                    </div>
                )}
            </div>

            {/* Input Bar */}
            <div className="h-14 bg-black/80 border-t border-white/10 flex items-center px-4 gap-3">
                <span className="text-cyan-500 font-mono text-sm">{'>'}</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Tell Web Agent what to do..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none text-white text-sm font-mono placeholder-gray-500 focus:border-cyan-500/50 transition-colors"
                />
                <button
                    onClick={handleSend}
                    className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-all duration-200 hover:scale-105"
                >
                    <Send size={18} />
                </button>
            </div>

            {/* Logs Panel */}
            <div className="h-32 bg-black/95 border-t border-white/10 p-3 font-mono text-xs overflow-y-auto scrollbar-hide">
                <div className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Activity Log</div>
                {logs.length === 0 ? (
                    <div className="text-gray-600 italic">No activity yet...</div>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className="mb-1.5 border-l-2 border-cyan-500/30 pl-2 text-green-400/80 break-words">
                            <span className="text-cyan-600/50 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                            {log}
                        </div>
                    ))
                )}
                <div ref={logsEndRef} />
            </div>
        </div>
    );
};

export default BrowserWindow;
