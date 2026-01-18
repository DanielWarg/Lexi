import React from 'react';
import { Mic, MicOff, Settings, Power, Video, VideoOff, Lightbulb, Printer, Globe } from 'lucide-react';

const ToolButton = ({ onClick, disabled, active, activeColor, children, title }) => {
    const baseClasses = "p-2 rounded-lg transition-all duration-200 relative group";

    const getColorClasses = () => {
        if (disabled) return "text-gray-700 cursor-not-allowed opacity-50";
        if (active) {
            switch (activeColor) {
                case 'green': return "text-green-400 bg-green-500/20 shadow-[0_0_12px_rgba(34,197,94,0.4)]";
                case 'red': return "text-red-400 bg-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.4)]";
                case 'cyan': return "text-cyan-400 bg-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.4)]";
                case 'purple': return "text-purple-400 bg-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.4)]";
                case 'yellow': return "text-yellow-300 bg-yellow-500/20 shadow-[0_0_12px_rgba(253,224,71,0.4)]";
                case 'blue': return "text-blue-400 bg-blue-500/20 shadow-[0_0_12px_rgba(96,165,250,0.4)]";
                default: return "text-cyan-400 bg-cyan-500/20";
            }
        }
        return "text-cyan-600 hover:text-cyan-400 hover:bg-white/5";
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`${baseClasses} ${getColorClasses()}`}
        >
            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-all duration-200" />
            <div className="relative z-10">
                {children}
            </div>
        </button>
    );
};

const ToolsModule = ({
    isConnected,
    isMuted,
    isVideoOn,
    showSettings,
    onTogglePower,
    onToggleMute,
    onToggleVideo,
    onToggleSettings,
    onToggleKasa,
    showKasaWindow,
    onTogglePrinter,
    showPrinterWindow,
    onToggleBrowser,
    showBrowserWindow,
    position,
    onMouseDown
}) => {
    return (
        <div
            id="tools"
            onMouseDown={onMouseDown}
            className="absolute transition-all duration-300 ease-out"
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'auto'
            }}
        >
            {/* TARS-inspired monolithic bar */}
            <div className="flex items-center gap-1 px-3 py-2 backdrop-blur-xl bg-black/60 border border-white/10 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                {/* Subtle noise texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay rounded-xl" />

                {/* Primary controls group */}
                <div className="flex items-center gap-1 relative z-10">
                    <ToolButton
                        onClick={onTogglePower}
                        active={isConnected}
                        activeColor="green"
                        title={isConnected ? "Disconnect" : "Connect"}
                    >
                        <Power size={20} />
                    </ToolButton>

                    <ToolButton
                        onClick={onToggleMute}
                        disabled={!isConnected}
                        active={!isMuted && isConnected}
                        activeColor={isMuted ? "red" : "cyan"}
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    </ToolButton>

                    <ToolButton
                        onClick={onToggleVideo}
                        active={isVideoOn}
                        activeColor="purple"
                        title={isVideoOn ? "Stop Camera" : "Start Camera"}
                    >
                        {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
                    </ToolButton>

                    <ToolButton
                        onClick={onToggleSettings}
                        active={showSettings}
                        activeColor="cyan"
                        title="Settings"
                    >
                        <Settings size={20} />
                    </ToolButton>
                </div>

                {/* Separator */}
                <div className="w-px h-6 bg-white/10 mx-1" />

                {/* Secondary controls group */}
                <div className="flex items-center gap-1 relative z-10">
                    <ToolButton
                        onClick={onToggleKasa}
                        active={showKasaWindow}
                        activeColor="yellow"
                        title="Smart Lights"
                    >
                        <Lightbulb size={20} />
                    </ToolButton>

                    <ToolButton
                        onClick={onTogglePrinter}
                        active={showPrinterWindow}
                        activeColor="green"
                        title="3D Printers"
                    >
                        <Printer size={20} />
                    </ToolButton>

                    <ToolButton
                        onClick={onToggleBrowser}
                        active={showBrowserWindow}
                        activeColor="blue"
                        title="Web Agent"
                    >
                        <Globe size={20} />
                    </ToolButton>
                </div>
            </div>
        </div>
    );
};

export default ToolsModule;
