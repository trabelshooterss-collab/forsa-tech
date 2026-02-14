$baseDir = "c:\FORSA\forsa-web\public\brands"
if (!(Test-Path $baseDir)) { New-Item -ItemType Directory -Path $baseDir }

$logos = @{
    "mitsubishi" = "https://upload.wikimedia.org/wikipedia/commons/5/5a/Mitsubishi_logo.svg"
    "suzuki"     = "https://upload.wikimedia.org/wikipedia/commons/1/12/Suzuki_logo_2.svg"
    "isuzu"      = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Isuzu_logo.svg"
    "geely"      = "https://upload.wikimedia.org/wikipedia/commons/7/7a/Geely_logo_2023.svg"
    "chery"      = "https://upload.wikimedia.org/wikipedia/commons/b/bd/Chery_logo.svg"
    "hongqi"     = "https://upload.wikimedia.org/wikipedia/commons/e/e0/Hongqi_logo.svg"
    "exeed"      = "https://upload.wikimedia.org/wikipedia/pt/a/a2/Exeed_logo.png"
    "gmc"        = "https://upload.wikimedia.org/wikipedia/commons/e/e6/GMC_logo.svg"
    "cadillac"   = "https://upload.wikimedia.org/wikipedia/commons/5/53/Cadillac_Logo.svg"
}

foreach ($brand in $logos.Keys) {
    $url = $logos[$brand]
    $ext = if ($url.EndsWith(".svg")) { ".svg" } else { ".png" }
    $outFile = Join-Path $baseDir "$brand$ext"
    Write-Host "Downloading $brand logo..."
    try {
        # Using -UserAgent to avoid 403s
        Invoke-WebRequest -Uri $url -OutFile $outFile -UserAgent "Mozilla/5.0" -ErrorAction Stop
        Write-Host "Success: $brand"
    }
    catch {
        Write-Warning "Failed to download $brand from $url"
    }
}
