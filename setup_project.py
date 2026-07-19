from pathlib import Path

ROOT = Path.cwd()

# -----------------------------
# Files to remove
# -----------------------------
REMOVE_FILES = [
    "src/App.css",
    "src/index.css",
    "src/assets/react.svg",
]

# -----------------------------
# Folder structure
# -----------------------------
DIRECTORIES = [
    "src/app/layouts",
    "src/app/providers",
    "src/app/router",

    "src/assets",

    "src/components/common",
    "src/components/room",
    "src/components/ui",

    "src/features/auth",
    "src/features/chat",
    "src/features/editor",
    "src/features/files",
    "src/features/notes",

    "src/features/rooms/pages",

    "src/features/video",

    "src/hooks",
    "src/lib",
    "src/services",
    "src/socket",
    "src/stores",
    "src/styles",
    "src/types",
    "src/utils",
]

# -----------------------------
# Empty files to create
# -----------------------------
FILES = [
    "src/features/rooms/pages/HomePage.tsx",
    "src/features/rooms/pages/CreateRoomPage.tsx",
    "src/features/rooms/pages/JoinRoomPage.tsx",
    "src/features/rooms/pages/RoomPage.tsx",

    "src/components/ui/Button.tsx",
    "src/components/ui/Input.tsx",

    "src/components/common/Navbar.tsx",
    "src/components/common/Footer.tsx",
]


def remove_default_files():
    print("\nRemoving default Vite files...\n")

    for file in REMOVE_FILES:
        path = ROOT / file
        if path.exists():
            path.unlink()
            print(f"Deleted: {file}")
        else:
            print(f"Skipped: {file}")


def create_directories():
    print("\nCreating folder structure...\n")

    for folder in DIRECTORIES:
        path = ROOT / folder
        path.mkdir(parents=True, exist_ok=True)

        gitkeep = path / ".gitkeep"
        if not gitkeep.exists():
            gitkeep.touch()

        print(f"Created: {folder}")


def create_files():
    print("\nCreating starter files...\n")

    for file in FILES:
        path = ROOT / file
        path.parent.mkdir(parents=True, exist_ok=True)

        if not path.exists():
            path.write_text(
                f"""export default function {path.stem}() {{
    return (
        <div>
            <h1>{path.stem}</h1>
        </div>
    );
}}
""",
                encoding="utf-8",
            )
            print(f"Created: {file}")
        else:
            print(f"Exists: {file}")


def main():
    print("=" * 60)
    print(" ShareRoom Project Initializer ")
    print("=" * 60)

    remove_default_files()
    create_directories()
    create_files()

    print("\nDone!")
    print("\nProject initialized successfully.")


if __name__ == "__main__":
    main()