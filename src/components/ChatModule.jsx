import React, { useEffect, useRef } from 'react';

const ChatModule = ({
    messages,
    inputValue,
    setInputValue,
    handleSend,
    isModularMode,
    activeDragElement,
    position,
    width = 672, // default max-w-2xl
    height,
    onMouseDown
}) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div
            id="chat"
            onMouseDown={onMouseDown}
            className={`absolute px-6 py-4 pointer-events-auto transition-all duration-200 
            bg-black/80 border border-white/10 shadow-lg rounded-2xl
            ${isModularMode ? (activeDragElement === 'chat' ? 'ring-2 ring-green-500' : 'ring-1 ring-yellow-500/30') : ''}
        `}
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, 0)', // Aligned top-center
                width: width,
                height: height
            }}
        >
            {/* Removed heavy noise texture and mix-blend-mode */}

            <div
                className="flex flex-col gap-3 overflow-y-auto mb-4 scrollbar-hide mask-image-gradient relative z-10"
                style={{ height: height ? `calc(${height}px - 70px)` : '15rem' }}
            >
                {messages.slice(-5).map((msg, i) => (
                    <div key={i} className="text-sm border-l-2 border-cyan-800/50 pl-3 py-1">
                        <span className="text-cyan-600 font-mono text-xs opacity-70">[{msg.time}]</span> <span className="font-bold text-cyan-300 drop-shadow-sm">{msg.sender}</span>
                        <div className="text-gray-300 mt-1 leading-relaxed">{msg.text}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="absolute bottom-4 left-0 w-full px-6 z-10">
                <div className="flex items-center w-full bg-black/40 border border-cyan-700/30 rounded-lg px-3 py-3 backdrop-blur-sm focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
                    <span className="text-cyan-400 font-bold animate-pulse mr-2 select-none">_</span>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleSend}
                        placeholder="INITIALIZE COMMAND..."
                        className="flex-1 bg-transparent border-none outline-none text-cyan-50 placeholder-cyan-800/50 focus:ring-0 p-0 font-mono"
                    />
                </div>
            </div>
            {isModularMode && <div className={`absolute -top-6 left-0 text-xs font-bold tracking-widest ${activeDragElement === 'chat' ? 'text-green-500' : 'text-yellow-500/50'}`}>CHAT MODULE</div>}
        </div>
    );
};

export default ChatModule;
