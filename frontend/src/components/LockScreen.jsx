import React, { useState, useEffect } from 'react';
import { Lock, Fingerprint, Unlock } from 'lucide-react';

const LockScreen = ({ onUnlock }) => {
    const [status, setStatus] = useState('locked'); // locked, authenticating, error
    const [errorMsg, setErrorMsg] = useState('');

    const handleUnlock = async () => {
        setStatus('authenticating');
        setErrorMsg('');

        if (window.electron && window.electron.authenticate) {
            try {
                const result = await window.electron.authenticate('Unlock Lexi Prime');
                if (result.success) {
                    setStatus('unlocked');
                    setTimeout(onUnlock, 500); // Small delay for animation
                } else {
                    setStatus('error');
                    setErrorMsg(result.error || 'Authentication failed');
                }
            } catch (err) {
                setStatus('error');
                setErrorMsg(err.message);
            }
        } else {
            // Dev mode fallback (Browser)
            console.warn("Electron API not found. Bypassing auth for Dev.");
            setStatus('unlocked');
            setTimeout(onUnlock, 500);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-black text-white z-50 absolute top-0 left-0">
            <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700">
                <h1 className="text-sm font-medium tracking-widest uppercase text-zinc-500 mb-8">Lexi Prime</h1>

                {status === 'error' && (
                    <p className="text-red-900/50 text-xs font-mono">{errorMsg}</p>
                )}

                <button
                    onClick={handleUnlock}
                    className="group"
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className={`w-1 h-1 rounded-full ${status === 'error' ? 'bg-red-900' : 'bg-zinc-800 group-hover:bg-zinc-200'} transition-all duration-500`}></div>
                        <span className="text-[10px] uppercase tracking-widest text-zinc-700 group-hover:text-zinc-400 transition-colors">Authenticate</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default LockScreen;
