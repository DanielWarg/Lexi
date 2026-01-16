import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Folder, Archive, Trash2, Clock, FolderOpen } from 'lucide-react';

/**
 * ProjectListPopup - Draggable popup showing project list.
 * Opens via voice command "Visa projekt" or similar.
 * Per UX_CHARTER: Lexi-controlled, user can close/drag.
 */
const ProjectListPopup = ({ onSelectProject, onClose }) => {
    const [projects, setProjects] = useState([]);
    const [activeTab, setActiveTab] = useState('active');
    const [loading, setLoading] = useState(true);
    const constraintsRef = useRef(null);

    useEffect(() => {
        fetchProjects();
    }, [activeTab]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/v1/projects/?status=${activeTab}`);
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (err) {
            console.error("Failed to fetch projects:", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'archived': return <Archive size={14} className="text-amber-500/60" />;
            case 'deleted': return <Trash2 size={14} className="text-red-500/60" />;
            default: return <Folder size={14} className="text-cyan-500/60" />;
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
    };

    return (
        <>
            <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-40" />

            <motion.div
                drag
                dragConstraints={constraintsRef}
                dragElastic={0.1}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-20 left-20 z-50 pointer-events-auto cursor-grab active:cursor-grabbing"
            >
                <div className="w-80 rounded-2xl border border-cyan-500/30 bg-zinc-900/95 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-cyan-950/20">
                        <div className="flex items-center gap-2">
                            <FolderOpen size={18} className="text-cyan-400" />
                            <h2 className="text-white font-medium">Projekt</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 p-2 border-b border-white/5">
                        {[
                            { key: 'active', label: 'Aktiva' },
                            { key: 'archived', label: 'Arkiv' },
                            { key: 'deleted', label: 'Papperskorg' }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-1 px-3 py-2 text-[11px] uppercase tracking-wider rounded-lg transition-all
                                    ${activeTab === tab.key
                                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Project List */}
                    <div className="p-2 max-h-80 overflow-y-auto scrollbar-none">
                        {loading ? (
                            <div className="text-zinc-600 text-xs text-center py-8 animate-pulse">Laddar...</div>
                        ) : projects.length === 0 ? (
                            <div className="text-zinc-600 text-xs text-center py-8 italic">Inga projekt</div>
                        ) : (
                            <div className="space-y-1">
                                {projects.map((project) => (
                                    <button
                                        key={project.id}
                                        onClick={() => onSelectProject(project)}
                                        className="w-full text-left p-3 rounded-lg border border-transparent hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(project.status)}
                                                <span className="text-[10px] font-mono text-cyan-500/70">{project.key}</span>
                                            </div>
                                            <span className="text-[9px] text-zinc-600">{formatDate(project.updated_at)}</span>
                                        </div>
                                        <h3 className="text-sm text-zinc-300 mt-1 truncate">{project.name}</h3>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-white/5 bg-zinc-950/50">
                        <p className="text-[9px] text-zinc-600 text-center">
                            Säg "Stäng" eller tryck Esc
                        </p>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default ProjectListPopup;
