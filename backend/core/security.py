import keyring
import os

SERVICE_NAME = "LexiPrime"

def get_api_key(key_name: str) -> str:
    """
    Retrieves API key from System Keychain.
    Falls back to Environment Variable.
    """
    # 1. Try Env Var first (Active override)
    env_val = os.getenv(key_name)
    if env_val:
        return env_val
        
    # 2. Try Keychain
    try:
        token = keyring.get_password(SERVICE_NAME, key_name)
        if token:
            return token
    except Exception as e:
        print(f"⚠️ Keychain access failed for {key_name}: {e}")
        
    return None

def set_api_key(key_name: str, value: str):
    """Securely stores API key in Keychain"""
    try:
        keyring.set_password(SERVICE_NAME, key_name, value)
        print(f"✅ Securely stored {key_name} in Keychain.")
    except Exception as e:
        print(f"❌ Failed to store {key_name}: {e}")
