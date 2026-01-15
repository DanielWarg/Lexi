"""
Lexi Text-to-Speech (TTS)
=========================
Handles English speech synthesis.

Uses Edge TTS for high-quality, natural-sounding English speech.
This enables the language policy: Swedish text → English voice.
"""

import asyncio
import tempfile
import os
from abc import ABC, abstractmethod
from typing import Optional, Callable, AsyncGenerator
from dataclasses import dataclass


@dataclass
class SpeechResult:
    """Result from TTS processing."""
    audio_data: bytes
    format: str = "mp3"
    sample_rate: int = 24000


class TextToSpeech(ABC):
    """Abstract base class for TTS implementations."""
    
    @abstractmethod
    async def synthesize(self, text: str) -> SpeechResult:
        """Convert text to speech audio."""
        pass
    
    @abstractmethod
    async def stream(self, text: str) -> AsyncGenerator[bytes, None]:
        """Stream audio chunks as they're generated."""
        pass


class EdgeTTS(TextToSpeech):
    """
    Microsoft Edge TTS implementation.
    
    Uses the free Edge TTS API for high-quality English speech.
    Voice: en-US-AriaNeural (natural, friendly female voice)
    """
    
    def __init__(
        self,
        voice: str = "en-US-AriaNeural",
        rate: str = "+0%",
        pitch: str = "+0Hz"
    ):
        self.voice = voice
        self.rate = rate
        self.pitch = pitch
    
    async def synthesize(self, text: str) -> SpeechResult:
        """
        Convert text to English speech.
        
        Args:
            text: Text to speak (should be Swedish, will be spoken in English)
            
        Returns:
            SpeechResult with MP3 audio data
        """
        try:
            import edge_tts
            
            communicate = edge_tts.Communicate(
                text=text,
                voice=self.voice,
                rate=self.rate,
                pitch=self.pitch
            )
            
            # Collect all audio chunks
            audio_chunks = []
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_chunks.append(chunk["data"])
            
            audio_data = b"".join(audio_chunks)
            
            return SpeechResult(
                audio_data=audio_data,
                format="mp3",
                sample_rate=24000
            )
            
        except ImportError:
            print("[TTS] edge-tts not installed. Install with: pip install edge-tts")
            raise
        except Exception as e:
            print(f"[TTS] Synthesis error: {e}")
            raise
    
    async def stream(self, text: str) -> AsyncGenerator[bytes, None]:
        """
        Stream audio chunks as they're generated.
        
        Useful for low-latency playback.
        """
        try:
            import edge_tts
            
            communicate = edge_tts.Communicate(
                text=text,
                voice=self.voice,
                rate=self.rate,
                pitch=self.pitch
            )
            
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    yield chunk["data"]
                    
        except ImportError:
            print("[TTS] edge-tts not installed")
            return
    
    async def save_to_file(self, text: str, filepath: str) -> str:
        """Save synthesized speech to a file."""
        result = await self.synthesize(text)
        
        with open(filepath, "wb") as f:
            f.write(result.audio_data)
        
        return filepath
    
    @staticmethod
    def get_available_voices() -> list[str]:
        """Get list of available English voices."""
        return [
            "en-US-AriaNeural",      # Female, friendly
            "en-US-GuyNeural",       # Male, neutral
            "en-US-JennyNeural",     # Female, warm
            "en-GB-SoniaNeural",     # British female
            "en-GB-RyanNeural",      # British male
            "en-AU-NatashaNeural",   # Australian female
        ]


class GeminiTTS(TextToSpeech):
    """
    Uses Gemini's native audio output for TTS.
    This is already handled by the Gemini Live API in lexi.py.
    
    Note: Gemini Live API may not give full control over output language,
    so EdgeTTS is the recommended fallback for strict language policy.
    """
    
    def __init__(self):
        print("[TTS] Using Gemini native audio (handled by lexi.py)")
    
    async def synthesize(self, text: str) -> SpeechResult:
        """Not used - Gemini handles this internally."""
        raise NotImplementedError("Gemini TTS is handled by the Live API")
    
    async def stream(self, text: str) -> AsyncGenerator[bytes, None]:
        """Not used - Gemini handles this internally."""
        raise NotImplementedError("Gemini TTS is handled by the Live API")
        yield b""  # Required for generator type


class VoicePipeline:
    """
    Complete voice pipeline for Lexi.
    
    Handles the language policy:
    - Input: Swedish speech → Swedish text
    - Processing: LLM generates Swedish text response  
    - Output: Swedish text → English speech
    """
    
    def __init__(
        self,
        stt: Optional[TextToSpeech] = None,
        tts: Optional[TextToSpeech] = None
    ):
        self.stt = stt
        self.tts = tts or EdgeTTS()
    
    async def speak(self, text: str) -> bytes:
        """Convert text to English speech."""
        result = await self.tts.synthesize(text)
        return result.audio_data
    
    async def speak_stream(self, text: str) -> AsyncGenerator[bytes, None]:
        """Stream English speech from text."""
        async for chunk in self.tts.stream(text):
            yield chunk
