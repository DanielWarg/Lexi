import asyncio
import os
import pyaudio
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load environment variables (API_KEY)
load_dotenv()

BACKGROUND_YELLOW = "\033[43m"
RESET = "\033[0m"

VOICES = [
    "Kore", 
    "Achird", 
    "Algenib", 
    "Pulcherrima", 
    "Sulafat"
]

TEST_PHRASE = "Hej! Jag heter {voice}. Jag är din tänkpartner."

async def test_voice(client, voice_name):
    print(f"\n{BACKGROUND_YELLOW}--- Testing Voice: {voice_name} ---{RESET}")
    
    # Configure the session with the specific voice
    config = types.LiveConnectConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name=voice_name
                )
            )
        ),
        system_instruction="Du pratar endast svenska."
    )

    p = pyaudio.PyAudio()
    # Open stream for playback
    stream = p.open(format=pyaudio.paInt16,
                    channels=1,
                    rate=24000,
                    output=True)

    try:
        async with client.aio.live.connect(model="gemini-2.0-flash-exp", config=config) as session:
            print(f"Connected. Sending: '{TEST_PHRASE.format(voice=voice_name)}'")
            
            # Send text input
            await session.send(input=TEST_PHRASE.format(voice=voice_name), end_of_turn=True)

            print("Listening for response...")
            async for response in session.receive():
                if response.data:
                    # Play audio chunk
                    stream.write(response.data)
                
                # If we get text, print it
                if response.text:
                    print(f"AI: {response.text}")
                
                # Check for turn completion (server content generation done)
                if response.server_content and response.server_content.turn_complete:
                    print("Turn complete.")
                    break
                    
    except Exception as e:
        print(f"Error testing {voice_name}: {e}")
    finally:
        stream.stop_stream()
        stream.close()
        p.terminate()

async def main():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in .env")
        return

    client = genai.Client(http_options={'api_version': 'v1alpha'})
    
    print("Starting Voice Tour...")
    for voice in VOICES:
        await test_voice(client, voice)
        await asyncio.sleep(1) # Small pause
    
    print("\nTour complete!")

if __name__ == "__main__":
    asyncio.run(main())
