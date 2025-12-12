@echo off
REM Development startup script for Under People Club (Windows)

setlocal enabledelayedexpansion

REM Colors
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Helper functions
goto :functions_end

:print_banner
    echo.
    echo %BLUE%╔═══════════════════════════════════════════════╗%NC%
    echo %BLUE%║     UNDER PEOPLE CLUB - Development Setup     ║%NC%
    echo %BLUE%║         Cyberpunk Community Platform          ║%NC%
    echo %BLUE%╚═══════════════════════════════════════════════╝%NC%
    echo.
    exit /b 0

:print_success
    echo %GREEN%[√] %~1%NC%
    exit /b 0

:print_error
    echo %RED%[X] %~1%NC%
    exit /b 0

:print_info
    echo %BLUE%[→] %~1%NC%
    exit /b 0

:print_warning
    echo %YELLOW%[!] %~1%NC%
    exit /b 0

:functions_end

REM Main execution
if "%1"=="" goto :start
if "%1"=="start" goto :start
if "%1"=="stop" goto :stop
if "%1"=="restart" goto :restart
if "%1"=="logs" goto :logs
goto :help

:start
    call :print_banner
    call :print_info "Checking environment..."
    echo.
    
    REM Check Docker
    docker --version >nul 2>&1
    if %errorlevel% equ 0 (
        call :print_success "Docker is installed"
    ) else (
        call :print_warning "Docker not found"
    )
    
    REM Check Node.js
    node --version >nul 2>&1
    if %errorlevel% equ 0 (
        for /f "tokens=*" %%i in ('node --version') do set VERSION=%%i
        call :print_success "Node.js !VERSION! is installed"
    ) else (
        call :print_warning "Node.js not found"
    )
    
    REM Copy environment files
    if not exist "backend\.env" (
        call :print_info "Creating backend\.env..."
        copy backend\.env.example backend\.env >nul
        call :print_warning "Edit backend\.env with your configuration"
    )
    
    if not exist "frontend\.env.local" (
        call :print_info "Creating frontend\.env.local..."
        copy frontend\.env.example frontend\.env.local >nul
    )
    
    echo.
    call :print_info "Starting services with Docker Compose..."
    docker-compose up -d
    
    echo.
    call :print_success "Services started!"
    echo.
    echo Available at:
    echo   %BLUE%Frontend:  http://localhost:3000%NC%
    echo   %BLUE%API:       http://localhost:8000%NC%
    echo   %BLUE%API Docs:  http://localhost:8000/docs%NC%
    echo   %BLUE%Database:  localhost:5432%NC%
    echo   %BLUE%Redis:     localhost:6379%NC%
    echo.
    echo Next steps:
    echo   1. Edit backend\.env with your Telegram bot token
    echo   2. Visit http://localhost:3000 in your browser
    echo   3. Check logs: docker-compose logs -f
    echo.
    goto :end

:stop
    call :print_info "Stopping services..."
    docker-compose down
    call :print_success "Services stopped"
    goto :end

:restart
    docker-compose down
    timeout /t 2 /nobreak >nul
    call :start
    goto :end

:logs
    docker-compose logs -f
    goto :end

:help
    echo Usage: %0 {start^|stop^|restart^|logs}
    echo.
    echo   start   - Start development environment (default)
    echo   stop    - Stop all services
    echo   restart - Restart all services
    echo   logs    - View Docker logs
    goto :end

:end
    endlocal
    exit /b 0
