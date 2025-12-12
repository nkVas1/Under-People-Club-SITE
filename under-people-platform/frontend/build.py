#!/usr/bin/env python3
"""
Build helper script for Vercel deployment
Checks all requirements before building
"""

import subprocess
import sys
from pathlib import Path


class Color:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    END = '\033[0m'


def print_success(msg: str):
    print(f"{Color.GREEN}✅ {msg}{Color.END}")


def print_error(msg: str):
    print(f"{Color.RED}❌ {msg}{Color.END}")


def print_warning(msg: str):
    print(f"{Color.YELLOW}⚠️  {msg}{Color.END}")


def check_env():
    """Check environment variables"""
    print("\n📋 Checking environment variables...")

    required_vars = ['NEXT_PUBLIC_APP_URL']
    missing = [var for var in required_vars if not f'${{{var}}}' in str(Path('.env.example').read_text() if Path('.env.example').exists() else '')]

    if missing:
        print_warning(f"Missing in .env.example: {', '.join(missing)}")
        print_warning("These can be set in Vercel dashboard")
    else:
        print_success("All required environment variables documented")


def build_project():
    """Build Next.js project"""
    print("\n🔨 Building Next.js project...")
    try:
        result = subprocess.run(
            ['npm', 'run', 'build'],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            print_error("Build failed!")
            print(result.stdout)
            print(result.stderr)
            return False

        print_success("Build completed successfully")
        return True
    except Exception as e:
        print_error(f"Build error: {e}")
        return False


def main():
    print(f"""{Color.GREEN}{Color.GREEN}
╔════════════════════════════════════════════════╗
║   🔐 UNDER PEOPLE CLUB - BUILD HELPER 🔐       ║
║          Vercel Deployment Validator           ║
╚════════════════════════════════════════════════╝
{Color.END}""")

    check_env()

    if not build_project():
        sys.exit(1)

    print(f"\n{Color.GREEN}{Color.GREEN}✨ Ready for Vercel deployment!{Color.END}")
    print_success("Run 'vercel' to deploy")


if __name__ == '__main__':
    main()
