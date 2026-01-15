import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';

const Interview = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [question, setQuestion] = useState("Laddar...");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuestion();
    }, []);

    const fetchQuestion = async () => {
        try {
            const res = await fetch('/api/v1/onboarding/start');
            const data = await res.json();
            setQuestion(data.message);
            setStep(data.step);
            setLoading(false);
        } catch (err) {
            console.error("Failed to start interview", err);
        }
    };

    const submitAnswer = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/v1/onboarding/answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ step, answer })
            });
            const data = await res.json();

            if (data.complete) {
                onComplete();
            } else {
                setQuestion(data.message);
                setStep(data.next_step);
                setAnswer("");
            }
        } catch (err) {
            console.error("Failed to submit answer", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto w-full h-[80vh]">
            <div className="w-full space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-3 text-cyan-400 mb-8">
                    <MessageSquare size={24} />
                    <span className="text-sm tracking-widest uppercase">The Interview • Step {step + 1}</span>
                </div>

                <h2 className="text-3xl font-light leading-relaxed text-white">
                    {question}
                </h2>

                <div className="relative group">
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Ditt svar..."
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-lg text-white focus:outline-none focus:border-cyan-500/50 transition-all resize-none min-h-[150px]"
                        autoFocus
                    />
                    <button
                        onClick={submitAnswer}
                        disabled={!answer.trim() || loading}
                        className="absolute bottom-4 right-4 p-2 bg-cyan-600 rounded-full hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ArrowRight size={20} className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Interview;
