"""
Lexi Speech-to-Text (STT)
=========================
Handles Swedish speech recognition.

Uses OpenAI Whisper for high-quality Swedish transcription.
"""

import asyncio
from abc import ABC, abstractmethod
from typing import Optional, Callable
from dataclasses import dataclass


@dataclass
class TranscriptionResult:
    """Result from STT processing."""
    text: str
    language: str
    confidence: float = 1.0
    is_final: bool = True


class SpeechToText(ABC):
    """Abstract base class for STT implementations."""
    
    @abstractmethod
    async def transcribe(self, audio_data: bytes) -> TranscriptionResult:
        """Transcribe audio data to text."""
        pass
    
    @abstractmethod
    async def start_streaming(
        self, 
        on_partial: Callable[[str], None],
        on_final: Callable[[TranscriptionResult], None]
    ):
        """Start streaming transcription."""
        pass
    
    @abstractmethod
    async def stop_streaming(self):
        """Stop streaming transcription."""
        pass


class WhisperSTT(SpeechToText):
    """
    OpenAI Whisper-based Speech-to-Text.
    
    Optimized for Swedish language input.
    Can run locally or via API.
    """
    
    def __init__(
        self,
        model_size: str = "base",
        language: str = "sv",  # Swedish
        use_local: bool = True
    ):
        self.model_size = model_size
        self.language = language
        self.use_local = use_local
        self._model = None
        self._is_streaming = False
    
    async def initialize(self):
        """Initialize the Whisper model."""
        if self.use_local:
            try:
                import whisper
                print(f"[STT] Loading Whisper model '{self.model_size}'...")
                self._model = whisper.load_model(self.model_size)
                print(f"[STT] Whisper model loaded successfully")
            except ImportError:
                print("[STT] Whisper not installed. Install with: pip install openai-whisper")
                raise
        else:
            # Use OpenAI API
            print("[STT] Using OpenAI Whisper API")
    
    async def transcribe(self, audio_data: bytes) -> TranscriptionResult:
        """
        Transcribe audio data to Swedish text.
        
        Args:
            audio_data: Raw audio bytes (16kHz, mono, 16-bit PCM)
            
        Returns:
            TranscriptionResult with Swedish text
        """
        if self.use_local and self._model:
            # Save to temp file for Whisper
            import tempfile
            import os
            
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
                f.write(audio_data)
                temp_path = f.name
            
            try:
                # Run transcription in thread pool to not block
                loop = asyncio.get_event_loop()
                result = await loop.run_in_executor(
                    None,
                    lambda: self._model.transcribe(
                        temp_path,
                        language=self.language,
                        task="transcribe"
                    )
                )
                
                return TranscriptionResult(
                    text=result["text"].strip(),
                    language=self.language,
                    is_final=True
                )
            finally:
                os.unlink(temp_path)
        else:
            # OpenAI API fallback
            return await self._transcribe_api(audio_data)
    
    async def _transcribe_api(self, audio_data: bytes) -> TranscriptionResult:
        """Use OpenAI Whisper API for transcription."""
        try:
            import openai
            import tempfile
            import os
            
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
                f.write(audio_data)
                temp_path = f.name
            
            try:
                with open(temp_path, "rb") as audio_file:
                    response = await asyncio.to_thread(
                        openai.Audio.transcribe,
                        model="whisper-1",
                        file=audio_file,
                        language=self.language
                    )
                
                return TranscriptionResult(
                    text=response["text"].strip(),
                    language=self.language,
                    is_final=True
                )
            finally:
                os.unlink(temp_path)
                
        except Exception as e:
            print(f"[STT] API transcription error: {e}")
            return TranscriptionResult(text="", language=self.language)
    
    async def start_streaming(
        self,
        on_partial: Callable[[str], None],
        on_final: Callable[[TranscriptionResult], None]
    ):
        """Start streaming transcription (not fully implemented)."""
        self._is_streaming = True
        print("[STT] Streaming mode started (batch processing)")
    
    async def stop_streaming(self):
        """Stop streaming transcription."""
        self._is_streaming = False
        print("[STT] Streaming mode stopped")


class GeminiSTT(SpeechToText):
    """
    Uses Gemini's native audio input for STT.
    This is already handled by the Gemini Live API in lexi.py.
    """
    
    def __init__(self):
        print("[STT] Using Gemini native audio (handled by lexi.py)")
    
    async def transcribe(self, audio_data: bytes) -> TranscriptionResult:
        """Not used - Gemini handles this internally."""
        raise NotImplementedError("Gemini STT is handled by the Live API")
    
    async def start_streaming(self, on_partial, on_final):
        """Not used - Gemini handles this internally."""
        pass
    
    async def stop_streaming(self):
        """Not used - Gemini handles this internally."""
        pass
