#!/usr/bin/env python3
"""
Professional Frontend Starter Script for Under People Club
Handles dev server startup, dependency checking, and environment validation
"""

import os
import sys
import signal
import subprocess
import socket
import time
from pathlib import Path
from enum import Enum

# ============================================================================
# COLOR & STYLING
# ============================================================================

class Color:
    GREEN = '\033[92m'
    BLUE = '\033[94m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    CYAN = '\033[96m'
    MAGENTA = '\033[95m'
    END = '\033[0m'
    BOLD = '\033[1m'


# ============================================================================
# CONFIG
# ============================================================================

class Config:
    PROJECT_ROOT = Path(__file__).parent
    NODE_MODULES = PROJECT_ROOT / 'node_modules'
    PACKAGE_JSON = PROJECT_ROOT / 'package.json'
    PORTS = {'dev': 3000, 'fallback': 3001}
    NODE_VERSION_MIN = '16.0.0'


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def print_banner():
    """Print stylish startup banner"""
    banner = f"""
{Color.CYAN}{Color.BOLD}
╔════════════════════════════════════════════════════════════════╗
║         🔐 UNDER PEOPLE CLUB - FRONTEND STARTER 🔐             ║
║                   Frontend Development Server                   ║
╚════════════════════════════════════════════════════════════════╝
{Color.END}
    """
    print(banner)


def print_section(title: str):
    """Print section header"""
    print(f"\n{Color.BOLD}{Color.CYAN}{'─' * 60}")
    print(f"▸ {title.upper()}")
    print(f"{'─' * 60}{Color.END}\n")


def print_success(message: str):
    """Print success message"""
    print(f"{Color.GREEN}✅ {message}{Color.END}")


def print_info(message: str):
    """Print info message"""
    print(f"{Color.BLUE}ℹ️  {message}{Color.END}")


def print_warning(message: str):
    """Print warning message"""
    print(f"{Color.YELLOW}⚠️  {message}{Color.END}")


def print_error(message: str):
    """Print error message"""
    print(f"{Color.RED}❌ {message}{Color.END}")


# ============================================================================
# SYSTEM CHECKS
# ============================================================================

def check_node_installed():
    """Check if Node.js is installed"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        version = result.stdout.strip()
        print_success(f"Node.js installed: {version}")
        return True
    except FileNotFoundError:
        print_error("Node.js is not installed!")
        print_info("Download from: https://nodejs.org/")
        return False


def check_npm_installed():
    """Check if npm is installed"""
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        version = result.stdout.strip()
        print_success(f"npm installed: {version}")
        return True
    except FileNotFoundError:
        print_error("npm is not installed!")
        return False


def check_node_modules():
    """Check if node_modules exists"""
    if Config.NODE_MODULES.exists():
        print_success("node_modules found")
        return True
    else:
        print_warning("node_modules not found")
        print_info("Run: npm install --legacy-peer-deps")
        return False


def check_port_available(port: int) -> bool:
    """Check if port is available"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        result = sock.connect_ex(('127.0.0.1', port))
        is_available = result != 0
        sock.close()
        return is_available
    except:
        sock.close()
        return False


def get_available_port():
    """Find available port"""
    for port in Config.PORTS.values():
        if check_port_available(port):
            return port
    return None


# ============================================================================
# SETUP & INSTALLATION
# ============================================================================

def install_dependencies():
    """Install npm dependencies with legacy-peer-deps flag"""
    print_section("Installing Dependencies")

    if Config.NODE_MODULES.exists():
        print_info("node_modules already exists")
        response = input(f"{Color.YELLOW}Reinstall? (y/N):{Color.END} ")
        if response.lower() != 'y':
            print_info("Skipping reinstallation")
            return True

    print_info("Running: npm install --legacy-peer-deps")
    try:
        subprocess.run(
            ['npm', 'install', '--legacy-peer-deps'],
            cwd=Config.PROJECT_ROOT,
            check=True
        )
        print_success("Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print_error(f"Installation failed: {e}")
        return False


# ============================================================================
# PROCESS MANAGEMENT
# ============================================================================

class ProcessManager:
    def __init__(self):
        self.dev_process = None

    def start_dev_server(self, port: int):
        """Start Next.js dev server"""
        print_section("Starting Development Server")

        if not check_port_available(port):
            print_error(f"Port {port} is already in use!")
            return False

        print_info(f"Starting on http://localhost:{port}")
        print_info(f"Press Ctrl+C to stop the server\n")

        try:
            self.dev_process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=Config.PROJECT_ROOT,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True,
            )

            # Read output in real-time
            for line in self.dev_process.stdout:
                if line:
                    line = line.rstrip('\n\r')
                    # Color-code output
                    if 'error' in line.lower():
                        print(f"{Color.RED}{line}{Color.END}")
                    elif 'warning' in line.lower():
                        print(f"{Color.YELLOW}{line}{Color.END}")
                    elif 'ready' in line.lower() or 'compiled' in line.lower():
                        print(f"{Color.GREEN}{line}{Color.END}")
                    else:
                        print(line)

            return self.dev_process.poll() == 0
        except Exception as e:
            print_error(f"Failed to start dev server: {e}")
            return False

    def shutdown(self, signum=None, frame=None):
        """Gracefully shutdown all processes"""
        print_warning("\n\nShutting down server...")

        if self.dev_process:
            try:
                self.dev_process.terminate()
                try:
                    self.dev_process.wait(timeout=3)
                except subprocess.TimeoutExpired:
                    print_warning("Force killing dev server...")
                    self.dev_process.kill()
                    self.dev_process.wait()
                print_success("Dev server stopped")
            except Exception as e:
                print_error(f"Error stopping server: {e}")

        print_success("All processes terminated")
        sys.exit(0)


# ============================================================================
# MAIN
# ============================================================================

def main():
    """Main startup flow"""
    print_banner()

    # System checks
    print_section("System Checks")

    if not check_node_installed():
        sys.exit(1)

    if not check_npm_installed():
        sys.exit(1)

    has_modules = check_node_modules()

    # Installation if needed
    if not has_modules:
        response = input(f"\n{Color.YELLOW}Install dependencies now? (Y/n):{Color.END} ")
        if response.lower() != 'n':
            if not install_dependencies():
                sys.exit(1)
        else:
            print_warning("Dependencies required to run the app")
            sys.exit(1)

    # Port checking
    print_section("Port Configuration")

    port = get_available_port()
    if not port:
        print_error("No available ports found!")
        print_info(f"Expected ports: {', '.join(map(str, Config.PORTS.values()))}")
        sys.exit(1)

    print_success(f"Port {port} is available")

    # Start server
    manager = ProcessManager()

    # Setup graceful shutdown
    signal.signal(signal.SIGINT, manager.shutdown)
    signal.signal(signal.SIGTERM, manager.shutdown)

    # Info report
    print_section("Startup Summary")
    print(f"{Color.BOLD}Frontend: Next.js 14 (App Router){Color.END}")
    print(f"{Color.BOLD}URL: http://localhost:{port}{Color.END}")
    print(f"{Color.BOLD}Root: {Config.PROJECT_ROOT}{Color.END}")
    print()
    print_info("Available Routes:")
    print(f"  • Home:      http://localhost:{port}/")
    print(f"  • Shelter:   http://localhost:{port}/shelter")
    print(f"  • Arsenal:   http://localhost:{port}/arsenal")
    print(f"  • Chronicles: http://localhost:{port}/chronicles")
    print(f"  • Raid:      http://localhost:{port}/raid")
    print(f"  • Network:   http://localhost:{port}/network")
    print()

    # Start the server
    manager.start_dev_server(port)


if __name__ == '__main__':
    main()
