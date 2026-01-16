import React, { useState, useEffect, useRef } from 'react';
import { Send, Settings, Mic, Plus, Command, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsModal from './SettingsModal';
import BreathingOrb from './BreathingOrb';
import ProjectListCanvas from './ProjectListCanvas';
import ProjectDetailPopup from './ProjectDetailPopup';

const ChatInterface = ({ user, onUserUpdate }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Identity verified: ${user?.name || "User"}. Core systems initialized.` }
    ]);
    const [input, setInput] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [orbMode, setOrbMode] = useState('idle');
    const messagesEndRef = useRef(null);

    // Project State
    const [activeProject, setActiveProject] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isProjectPopupOpen, setIsProjectPopupOpen] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const updatedMessages = [...messages, { role: 'user', content: input }];
        setMessages(updatedMessages);
        setInput("");
        setOrbMode('thinking');

        try {
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'assistant', content: "Processing request. Protocols engaged." }]);
                setOrbMode('idle');
            }, 1200);
        } catch (err) {
            console.error(err);
            setOrbMode('idle');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-[#050505] text-white font-sans overflow-hidden relative selection:bg-cyan-500/30">

            {/* Deep Space Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)] pointer-events-none" />

            {/* Top HUD Bar */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10 pointer-events-none">
                <div className="flex flex-col">
                    <h1 className="text-cyan-500/50 text-[10px] font-mono tracking-[0.2em] uppercase neon-text">Lexi Prime /// v4.0</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-zinc-600 text-[9px] uppercase tracking-wider">Secure Connection</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="pointer-events-auto p-2 text-zinc-600 hover:text-cyan-400 transition-colors glass-panel rounded-lg hover:border-cyan-500/50"
                >
                    <Settings size={18} />
                </button>
            </div>

            {/* Central Intelligence (The Orb) */}
            <div className="absolute top-8 left-0 w-full flex justify-center z-0 pointer-events-none">
                <BreathingOrb mode={orbMode} />
            </div>

            {/* Chat Area - Glass Panels */}
            <div className="flex-1 w-full max-w-4xl mx-auto pt-44 pb-48 px-4 md:px-8 overflow-y-auto scrollbar-none z-10 relative">
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`mb-6 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`relative max-w-[80%] p-5 rounded-2xl border backdrop-blur-md ${msg.role === 'user'
                                ? 'bg-cyan-950/20 border-cyan-500/20 text-cyan-100 rounded-br-none'
                                : 'bg-zinc-900/40 border-white/5 text-zinc-300 rounded-bl-none shadow-lg'
                                }`}>
                                {/* Decorator Line for Assistant */}
                                {msg.role === 'assistant' && (
                                    <div className="absolute -left-[1px] top-4 bottom-4 w-[2px] bg-cyan-500/50 rounded-full" />
                                )}
                                <div className="text-[15px] leading-relaxed tracking-wide font-light">
                                    {msg.content}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Bottom Floating Command Deck (Jarvis Style) */}
            <div className="fixed bottom-0 left-0 w-full p-6 z-50">
                <div className="max-w-2xl mx-auto">
                    {/* The Capsule */}
                    <div className="group relative flex items-center gap-2 glass-panel rounded-full p-2 transition-all duration-300 hover:border-cyan-500/30 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_30px_rgba(0,240,255,0.1)]">

                        {/* Tools Button */}
                        <button className="p-3 text-cyan-500/60 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-all">
                            <Plus size={20} />
                        </button>

                        {/* Divider */}
                        <div className="w-[1px] h-6 bg-white/10" />

                        {/* Input Field */}
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Input command..."
                            className="flex-1 bg-transparent text-white placeholder-zinc-600 px-3 py-3 focus:outline-none resize-none text-[15px] font-light h-12 pt-3"
                            rows={1}
                        />

                        {/* Voice Node */}
                        <button className={`p-3 rounded-full transition-all ${input.trim().length > 0
                            ? 'text-zinc-600 hover:text-white'
                            : 'text-cyan-500 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                            }`}>
                            <div className="relative">
                                <Mic size={20} />
                                {!input.trim() && <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full animate-pulse" />}
                            </div>
                        </button>

                        {/* Send Action */}
                        <AnimatePresence>
                            {input.trim() && (
                                <motion.button
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    onClick={handleSend}
                                    className="p-3 bg-cyan-500 text-black rounded-full hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all mr-1"
                                >
                                    <Send size={18} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                user={user}
                onSave={onUserUpdate}
            />

            {/* Project System */}
            <ProjectListCanvas
                activeProjectId={activeProject?.id}
            />
            <AnimatePresence>
                <ProjectDetailPopup
                    project={selectedProject}
                    isOpen={isProjectPopupOpen}
                    onClose={() => setIsProjectPopupOpen(false)}
                />
            </AnimatePresence>
        </div>
    );
};

export default ChatInterface;
