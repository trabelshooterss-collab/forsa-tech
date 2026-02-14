$baseDir = "c:\FORSA\forsa-web\public\brands"
if (!(Test-Path $baseDir)) { New-Item -ItemType Directory -Path $baseDir }

# Map of brand name to official high-res PNG/SVG URL
# We will use stable, direct links to ensure no 403s or broken downloads.
$logos = @{
    "mitsubishi" = "https://cdn.iconscout.com/icon/free/png-512/free-mitsubishi-logo-icon-download-in-svg-png-gif-file-formats--vehicle-symbol-logos-icons-2651037.png?f=webp&w=256"
    "suzuki"     = "https://cdn.iconscout.com/icon/free/png-512/free-suzuki-logo-icon-download-in-svg-png-gif-file-formats--vehicle-manufacturer-symbol-logos-icons-284897.png?f=webp&w=256"
    "isuzu"      = "https://cdn.iconscout.com/icon/free/png-256/free-isuzu-logo-icon-download-in-svg-png-gif-file-formats--brand-manufacturer-symbol-logos-icons-284852.png"
    "changan"    = "https://seeklogo.com/images/C/changan-logo-4E6E3C0F5E-seeklogo.com.png"
    "geely"      = "https://cdn.iconscout.com/icon/free/png-512/free-geely-logo-icon-download-in-svg-png-gif-file-formats--vehicle-maker-symbol-logos-icons-284869.png?f=webp&w=256"
    "mg"         = "https://cdn.iconscout.com/icon/free/png-512/free-mg-logo-icon-download-in-svg-png-gif-file-formats--vehicle-manufacturer-symbol-logos-icons-284859.png?f=webp&w=256"
    "chery"      = "https://cdn.iconscout.com/icon/free/png-256/free-chery-logo-icon-download-in-svg-png-gif-file-formats--brand-manufacturer-symbol-logos-icons-284838.png"
    "jetour"     = "https://jetourglobal.com/wp-content/uploads/2021/07/jetour-logo-1.png"
    "tank"       = "https://gwm-global.com/static/images/tank/tank-logo.png"
    "hongqi"     = "https://www.hongqi-global.com/images/logo.png"
    "exeed"      = "https://www.exeed-uae.com/wp-content/uploads/2022/02/exeed-logo.png"
    "bestune"    = "https://www.faw-arabia.com/content/images/bestune-logo.png"
    "gmc"        = "https://cdn.iconscout.com/icon/free/png-512/free-gmc-logo-icon-download-in-svg-png-gif-file-formats--vehicle-manufacturer-symbol-logos-icons-284877.png?f=webp&w=256"
    "cadillac"   = "https://cdn.iconscout.com/icon/free/png-512/free-cadillac-logo-icon-download-in-svg-png-gif-file-formats--vehicle-manufacturer-symbol-logos-icons-284835.png?f=webp&w=256"
    "gac"        = "https://www.gac-motor.com/dist/images/logo.png"
    "byd"        = "https://cdn.iconscout.com/icon/free/png-512/free-byd-logo-icon-download-in-svg-png-gif-file-formats--vehicle-maker-symbol-logos-icons-284851.png?f=webp&w=256"
    "haval"      = "https://cdn.iconscout.com/icon/free/png-512/free-haval-logo-icon-download-in-svg-png-gif-file-formats--vehicle-maker-symbol-logos-icons-284841.png?f=webp&w=256"
}

foreach ($brand in $logos.Keys) {
    $url = $logos[$brand]
    $ext = if ($url.Contains(".png")) { ".png" } elseif ($url.Contains(".png?")) { ".png" } else { ".png" } # Defaulting to PNG for most
    if ($url.Contains(".svg")) { $ext = ".svg" }
    
    $outFile = Join-Path $baseDir "$brand$ext"
    Write-Host "Downloading $brand logo..."
    try {
        # Using Mozilla User-Agent to prevent 403s
        Invoke-WebRequest -Uri $url -OutFile $outFile -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" -TimeoutSec 15 -ErrorAction Stop
        Write-Host "Success: $brand ($((Get-Item $outFile).Length) bytes)"
    }
    catch {
        Write-Warning "Failed to download $brand from $url"
    }
}
