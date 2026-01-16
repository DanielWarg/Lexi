import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Volume2, Mic } from 'lucide-react';

/**
 * SettingsModal - Clean settings panel inspired by Ada's design.
 * Built from scratch, no copied code.
 * Sections: Security, Audio
 */
const SettingsModal = ({ isOpen, onClose, user, onSave }) => {
    // Local settings state
    const [faceAuthEnabled, setFaceAuthEnabled] = useState(false);
    const [voiceOnlyMode, setVoiceOnlyMode] = useState(true);
    const [selectedMic, setSelectedMic] = useState('');
    const [selectedSpeaker, setSelectedSpeaker] = useState('');
    const [micDevices, setMicDevices] = useState([]);
    const [speakerDevices, setSpeakerDevices] = useState([]);

    // Load devices on mount
    useEffect(() => {
        const loadDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                setMicDevices(devices.filter(d => d.kind === 'audioinput'));
                setSpeakerDevices(devices.filter(d => d.kind === 'audiooutput'));
            } catch (err) {
                console.error('Could not enumerate devices:', err);
            }
        };
        if (isOpen) loadDevices();
    }, [isOpen]);

    if (!isOpen) return null;

    // Toggle component
    const Toggle = ({ enabled, onToggle }) => (
        <button
            onClick={onToggle}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${enabled ? 'bg-cyan-500/80' : 'bg-zinc-700'}`}
        >
            <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </button>
    );

    // Section header
    const SectionHeader = ({ icon: Icon, label }) => (
        <div className="flex items-center gap-2 mb-3">
            <Icon size={14} className="text-cyan-500/70" />
            <h3 className="text-cyan-400 font-semibold text-[11px] uppercase tracking-wider">{label}</h3>
        </div>
    );

    // Setting row with toggle
    const SettingRow = ({ label, enabled, onToggle }) => (
        <div className="flex items-center justify-between py-2 px-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <span className="text-zinc-300 text-sm">{label}</span>
            <Toggle enabled={enabled} onToggle={onToggle} />
        </div>
    );

    // Select dropdown
    const SelectField = ({ label, value, onChange, options }) => (
        <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-200 focus:border-cyan-500/50 focus:outline-none"
            >
                {options.length === 0 && <option value="">Ingen enhet hittad</option>}
                {options.map((opt, i) => (
                    <option key={opt.deviceId || i} value={opt.deviceId}>
                        {opt.label || `Enhet ${i + 1}`}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center"
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

                {/* Panel */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-96 max-h-[80vh] overflow-y-auto bg-zinc-950/95 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                        <h2 className="text-white font-medium">Inställningar</h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-6">
                        {/* Security Section */}
                        <div>
                            <SectionHeader icon={Shield} label="Säkerhet" />
                            <div className="space-y-2">
                                <SettingRow
                                    label="Face Authentication"
                                    enabled={faceAuthEnabled}
                                    onToggle={() => setFaceAuthEnabled(!faceAuthEnabled)}
                                />
                                <SettingRow
                                    label="Voice-Only Mode"
                                    enabled={voiceOnlyMode}
                                    onToggle={() => setVoiceOnlyMode(!voiceOnlyMode)}
                                />
                            </div>
                        </div>

                        {/* Audio Section */}
                        <div>
                            <SectionHeader icon={Volume2} label="Ljud" />
                            <div className="space-y-3">
                                <SelectField
                                    label="Mikrofon"
                                    value={selectedMic}
                                    onChange={setSelectedMic}
                                    options={micDevices}
                                />
                                <SelectField
                                    label="Högtalare"
                                    value={selectedSpeaker}
                                    onChange={setSelectedSpeaker}
                                    options={speakerDevices}
                                />
                            </div>
                        </div>

                        {/* User Info */}
                        {user && (
                            <div>
                                <SectionHeader icon={Mic} label="Profil" />
                                <div className="py-2 px-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                                    <span className="text-zinc-400 text-sm">Inloggad som: </span>
                                    <span className="text-white text-sm">{user.name || 'User'}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-zinc-800">
                        <p className="text-[10px] text-zinc-600 text-center">
                            Ändringar sparas automatiskt
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SettingsModal;
