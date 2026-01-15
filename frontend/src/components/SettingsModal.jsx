import React, { useState } from 'react';
import { X, Save, Settings } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, user, onSave }) => {
    const [systemPrompt, setSystemPrompt] = useState(user?.system_prompt_override || "You are Lexi, a strategic sparring partner for an Executive.");
    const [bio, setBio] = useState(user?.bio || "");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/v1/user/me/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ system_prompt: systemPrompt, bio: bio })
            });
            const updatedUser = await res.json();
            onSave(updatedUser);
            onClose();
        } catch (err) {
            console.error("Failed to save settings", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#050505]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-8 px-2">
                    <h2 className="text-zinc-400 text-xs font-medium tracking-widest uppercase">Configuration</h2>
                    <button onClick={onClose} className="text-zinc-600 hover:text-zinc-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="block text-zinc-500 text-sm font-light">System Persona</label>
                        <textarea
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            className="w-full h-32 bg-transparent border-b border-zinc-800 text-zinc-300 p-0 focus:border-zinc-500 focus:outline-none resize-none font-light text-sm leading-relaxed"
                            placeholder="Define behavior..."
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-zinc-500 text-sm font-light">User Profile (Identity Core)</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full h-24 bg-transparent border-b border-zinc-800 text-zinc-300 p-0 focus:border-zinc-500 focus:outline-none resize-none font-light text-sm leading-relaxed"
                            placeholder="Who are you?"
                        />
                    </div>
                </div>

                <div className="mt-12 flex justify-end gap-6">
                    <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400 text-sm font-light">Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="text-zinc-100 hover:text-white text-sm font-medium disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
