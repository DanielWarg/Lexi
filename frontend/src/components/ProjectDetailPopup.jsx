import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Folder, Clock, Activity, FileText } from 'lucide-react';

/**
 * ProjectDetailPopup - Lexi-controlled popup showing project details.
 * Per UX_CHARTER: Opened by Lexi, not user. User can close and drag.
 */
const ProjectDetailPopup = ({ project, isOpen, onClose }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const constraintsRef = useRef(null);

    if (!isOpen || !project) return null;

    return (
        <>
            {/* Drag constraints container */}
            <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-40" />

            <motion.div
                drag
                dragConstraints={constraintsRef}
                dragElastic={0.1}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto cursor-grab active:cursor-grabbing"
                style={{ x: position.x, y: position.y }}
            >
                <div className="w-96 rounded-2xl border border-cyan-500/30 bg-zinc-900/90 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 overflow-hidden">
                    {/* Header - Drag Handle */}
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-cyan-950/20">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                <Folder size={16} className="text-cyan-400" />
                            </div>
                            <div>
                                <span className="text-[10px] font-mono text-cyan-500/70 block">{project.key}</span>
                                <h2 className="text-white font-medium">{project.name}</h2>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider
                                ${project.status === 'active'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : project.status === 'archived'
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}
                            >
                                {project.status === 'active' ? 'Aktivt' : project.status === 'archived' ? 'Arkiverat' : 'Raderat'}
                            </span>
                            <div className="flex items-center gap-1 text-zinc-500 text-xs">
                                <Clock size={12} />
                                <span>Skapad {new Date(project.created_at).toLocaleDateString('sv-SE')}</span>
                            </div>
                        </div>

                        {/* Description */}
                        {project.description && (
                            <p className="text-sm text-zinc-400 leading-relaxed">{project.description}</p>
                        )}

                        {/* Stats (Placeholder for future data) */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                                <Activity size={14} className="mx-auto text-cyan-500/50 mb-1" />
                                <span className="text-lg text-white font-light">0</span>
                                <span className="text-[9px] text-zinc-600 block">Konversationer</span>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                                <FileText size={14} className="mx-auto text-cyan-500/50 mb-1" />
                                <span className="text-lg text-white font-light">0</span>
                                <span className="text-[9px] text-zinc-600 block">Dokument</span>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                                <Clock size={14} className="mx-auto text-cyan-500/50 mb-1" />
                                <span className="text-lg text-white font-light">-</span>
                                <span className="text-[9px] text-zinc-600 block">Senast</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer - Voice Hint */}
                    <div className="p-3 border-t border-white/5 bg-zinc-950/50">
                        <p className="text-[9px] text-zinc-600 text-center">
                            Säg "Stäng popup" eller tryck Esc
                        </p>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default ProjectDetailPopup;
