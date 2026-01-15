import sys

def check_import(module_name):
    try:
        __import__(module_name)
        print(f"✅ {module_name}")
        return True
    except ImportError as e:
        print(f"❌ {module_name}: {e}")
        return False

print("--- Environment Check ---")
modules = [
    "fastapi",
    "sqlmodel",
    "redis",
    "faiss",
    "sentence_transformers",
    # "dlib", # Check dlib explicitly
    # "face_recognition"
]

success = True
for mod in modules:
    if not check_import(mod):
        success = False

# Check dlib/face_recognition removed. Using MediaPipe.
try:
    import mediapipe
    print("✅ mediapipe")
except ImportError as e:
    print(f"⚠️ mediapipe: {e}")

# try:
#     import dlib
#     print("✅ dlib")
# except ImportError:
#     print("⚠️ dlib (Required for face_rec)")

if success:
    print("\n🚀 Core Environment looks good!")
else:
    print("\n⚠️ Some core modules failed.")
