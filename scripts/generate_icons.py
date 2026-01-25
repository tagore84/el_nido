from PIL import Image
import os

SOURCE_IMAGE = "/Users/alberto/src/nido/el_nido.png"
TARGET_DIR = "/Users/alberto/src/nido/apps/nido-web/frontend/public"

def generate_icons():
    if not os.path.exists(SOURCE_IMAGE):
        print(f"Error: Source image not found at {SOURCE_IMAGE}")
        return

    if not os.path.exists(TARGET_DIR):
        print(f"Error: Target directory not found at {TARGET_DIR}")
        return

    try:
        img = Image.open(SOURCE_IMAGE)
        
        # 1. Generate favicon.ico (multi-resolution)
        # Standard sizes for favicon.ico
        icon_sizes = [(16, 16), (32, 32), (48, 48)] 
        img.save(os.path.join(TARGET_DIR, "favicon.ico"), format='ICO', sizes=icon_sizes)
        print("Generated favicon.ico")

        # 2. Generate apple-touch-icon.png (180x180)
        apple_icon = img.resize((180, 180), Image.Resampling.LANCZOS)
        apple_icon.save(os.path.join(TARGET_DIR, "apple-touch-icon.png"))
        print("Generated apple-touch-icon.png")

        # 3. Generate logo-192.png
        logo192 = img.resize((192, 192), Image.Resampling.LANCZOS)
        logo192.save(os.path.join(TARGET_DIR, "logo-192.png"))
        print("Generated logo-192.png")

        # 4. Generate logo-512.png
        logo512 = img.resize((512, 512), Image.Resampling.LANCZOS)
        logo512.save(os.path.join(TARGET_DIR, "logo-512.png"))
        print("Generated logo-512.png")

        print("All assets generated successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    generate_icons()
