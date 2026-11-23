# NEXORA Unified Build and Test Automation Script
param(
    [switch]$SkipTests = $false,
    [switch]$Release = $true
)

$ErrorActionPreference = "Stop"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NEXORA Windows Build Automation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Resolve Compiler & Toolchain Paths
$mingwBin = "C:\Users\ossamamehmood\AppData\Local\Microsoft\WinGet\Packages\BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\mingw64\bin"
$cargoBin = "$env:USERPROFILE\.cargo\bin"
$env:PATH = "$mingwBin;$cargoBin;$env:PATH"

Write-Host "[1/4] Verifying Build Toolchain..." -ForegroundColor Yellow
& gcc --version | Select-Object -First 1
& cargo --version | Select-Object -First 1

# 2. Build Frontend Assets
Write-Host "`n[2/4] Building Frontend UI Bundle with Vite..." -ForegroundColor Yellow
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot
& npm.cmd run build

# 3. Execute Safety and Unit Tests
if (-not $SkipTests) {
    Write-Host "`n[3/4] Running Rust Safety and Unit Test Suite..." -ForegroundColor Yellow
    Set-Location (Join-Path $projectRoot "src-tauri")
    & cargo test
}

# 4. Packaging
Write-Host "`n[4/4] Project verified and built successfully!" -ForegroundColor Green
Write-Host "Distribution assets available in: dist/ and src-tauri/target/" -ForegroundColor Cyan
Set-Location $projectRoot
