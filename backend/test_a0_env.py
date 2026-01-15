import sys
import os

def check_import(module_name):
    try:
        __import__(module_name)
        print(f"✅ {module_name}")
        return True
    except ImportError as e:
        print(f"❌ {module_name}: {e}")
        return False

print("--- Vertical Slice (A0) Environment Check ---")
modules = [
    "fastapi",
    "sqlmodel",
    "chromadb",
    "keyring",
    "sentence_transformers",
    # "mediapipe" # Optional for now
]

success = True
for mod in modules:
    if not check_import(mod):
        success = False

# Check Directory permissions for Chroma
chroma_dir = "./data/chroma"
try:
    if not os.path.exists(chroma_dir):
        os.makedirs(chroma_dir)
    print(f"✅ Data persistence dir created: {chroma_dir}")
except Exception as e:
    print(f"❌ Could not create persistence dir: {e}")
    success = False

if success:
    print("\n🚀 A0 Core Environment looks good!")
else:
    print("\n⚠️ Some A0 modules failed of file system issues.")
