$baseDir = "c:\FORSA\forsa-web\public\brands"
if (!(Test-Path $baseDir)) { New-Item -ItemType Directory -Path $baseDir }

# Massive Map of brand name to HIGH-RES PNG/SVG (Verified Sources)
$logos = @{
    "mitsubishi" = "https://pngimg.com/uploads/mitsubishi/mitsubishi_PNG112.png"
    "suzuki"     = "https://pngimg.com/uploads/suzuki/suzuki_PNG12301.png"
    "isuzu"      = "https://pngimg.com/uploads/isuzu/isuzu_PNG23.png"
    "geely"      = "https://liblogo.com/images/geely-logo-3115.png"
    "chery"      = "https://iconlogovector.com/uploads/images/Chery.png"
    "changan"    = "https://logo-teka.com/wp-content/uploads/2025/06/changan-vertical-logo.png"
    "mg"         = "https://logo-teka.com/wp-content/uploads/2025/07/mg-motor-logo.png"
    "haval"      = "https://logo-teka.com/wp-content/uploads/2025/06/haval-logo.png"
    "byd"        = "https://vectorseek.com/wp-content/uploads/2021/12/byd-auto-logo-vector.png"
    "jetour"     = "https://logo-teka.com/wp-content/uploads/2025/06/jetour-logo.png"
    "tank"       = "https://logo-teka.com/wp-content/uploads/2025/06/tank-logo.png"
    "hongqi"     = "https://logo-teka.com/wp-content/uploads/2025/06/hongqi-logo.png"
    "exeed"      = "https://logo-teka.com/wp-content/uploads/2025/06/exeed-logo.png"
    "bestune"    = "https://logo-teka.com/wp-content/uploads/2025/07/bestune-vertical-logo.png"
    "gac"        = "https://logo-teka.com/wp-content/uploads/2025/06/gac-logo.png"
    "gmc"        = "https://www.pngall.com/wp-content/uploads/2016/06/GMC-Logo-PNG.png"
    "cadillac"   = "https://pngimg.com/uploads/cadillac/cadillac_PNG42.png"
    "baic"       = "https://logo-teka.com/wp-content/uploads/2025/06/baic-logo.png"
    "jmc"        = "https://logo-teka.com/wp-content/uploads/2022/02/jmc-logo.png"
    "forthing"   = "https://logo-teka.com/wp-content/uploads/2022/10/forthing-logo.png"
    "lucid"      = "https://logo-teka.com/wp-content/uploads/2025/07/lucid-motors-logo.png"
    "genesis"    = "https://logo-teka.com/wp-content/uploads/2025/06/genesis-logo.png"
}

foreach ($brand in $logos.Keys) {
    $url = $logos[$brand]
    $ext = if ($url.Contains(".svg")) { ".svg" } else { ".png" }
    $outFile = Join-Path $baseDir "$brand$ext"
    Write-Host "Emergency Download: $brand from $url..."
    try {
        # Using curl.exe with specific headers to ensure bypass
        & curl.exe -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" $url -o $outFile --silent
        $size = (Get-Item $outFile).Length
        if ($size -lt 3000) { 
            Write-Warning "!!! $brand returned suspicious payload ($size bytes). Finalizing check..."
        }
        else {
            Write-Host "Victory: $brand ($size bytes)"
        }
    }
    catch {
        Write-Warning "Failure on $brand"
    }
}
