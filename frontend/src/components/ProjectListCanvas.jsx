import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Folder, Archive, Trash2, Clock } from 'lucide-react';

/**
 * ProjectListCanvas - Ambient background canvas showing all projects.
 * This component is READ-ONLY. All actions happen via voice.
 * Per UX_CHARTER: No clicks initiate actions.
 */
const ProjectListCanvas = ({ activeProjectId, onProjectSelect }) => {
    const [projects, setProjects] = useState([]);
    const [activeTab, setActiveTab] = useState('active');
    const [loading, setLoading] = useState(true);

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
        <div className="absolute inset-0 pointer-events-none z-0">
            {/* Ambient Project Grid - Visible in background */}
            <div className="absolute left-6 top-24 bottom-40 w-64 pointer-events-auto">
                {/* Tab Indicators (Read-only visual, tab switching via voice) */}
                <div className="flex gap-2 mb-4 opacity-40">
                    {['active', 'archived', 'deleted'].map(tab => (
                        <div
                            key={tab}
                            className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-full border
                                ${activeTab === tab
                                    ? 'border-cyan-500/50 text-cyan-400'
                                    : 'border-white/10 text-zinc-600'
                                }`}
                        >
                            {tab === 'active' ? 'Aktiva' : tab === 'archived' ? 'Arkiv' : 'Papperskorg'}
                        </div>
                    ))}
                </div>

                {/* Project List */}
                <div className="space-y-2 overflow-y-auto max-h-full scrollbar-none">
                    {loading ? (
                        <div className="text-zinc-600 text-xs animate-pulse">Laddar projekt...</div>
                    ) : projects.length === 0 ? (
                        <div className="text-zinc-600 text-xs italic">Inga projekt</div>
                    ) : (
                        projects.map((project, idx) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`
                                    group p-3 rounded-lg border backdrop-blur-sm transition-all
                                    ${activeProjectId === project.id
                                        ? 'bg-cyan-950/30 border-cyan-500/40'
                                        : 'bg-zinc-900/20 border-white/5 hover:border-white/10'
                                    }
                                `}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(project.status)}
                                        <span className="text-xs font-mono text-cyan-500/70">{project.key}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-zinc-600">
                                        <Clock size={10} />
                                        <span className="text-[9px]">{formatDate(project.updated_at)}</span>
                                    </div>
                                </div>
                                <h3 className="text-sm text-zinc-300 mt-1 truncate">{project.name}</h3>
                                {project.description && (
                                    <p className="text-[10px] text-zinc-600 mt-1 line-clamp-2">{project.description}</p>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Voice Hint */}
                <div className="absolute bottom-0 left-0 right-0 p-2 text-[9px] text-zinc-700 text-center">
                    Säg "Visa projekt [namn]" för att öppna
                </div>
            </div>
        </div>
    );
};

export default ProjectListCanvas;
