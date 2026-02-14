$baseDir = "c:\FORSA\forsa-web\public\brands"
if (!(Test-Path $baseDir)) { New-Item -ItemType Directory -Path $baseDir }

# Slugs and URLs for the 9 specifically failing brands
$logos = @{
    "mitsubishi" = "https://www.vectorlogo.zone/logos/mitsubishi/mitsubishi-icon.svg"
    "suzuki"     = "https://www.vectorlogo.zone/logos/suzuki/suzuki-icon.svg"
    "isuzu"      = "https://www.vectorlogo.zone/logos/isuzu/isuzu-ar21.svg"
    "geely"      = "https://www.vectorlogo.zone/logos/geely/geely-ar21.svg"
    "chery"      = "https://www.vectorlogo.zone/logos/chery/chery-ar21.svg"
    "hongqi"     = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hongqi.svg"
    "exeed"      = "https://www.exeed-uae.com/wp-content/uploads/2022/02/exeed-logo.png"
    "gmc"        = "https://www.vectorlogo.zone/logos/gmc/gmc-icon.svg"
    "cadillac"   = "https://www.vectorlogo.zone/logos/cadillac/cadillac-icon.svg"
}

foreach ($brand in $logos.Keys) {
    $url = $logos[$brand]
    $ext = if ($url.Contains(".svg")) { ".svg" } else { ".png" }
    $outFile = Join-Path $baseDir "$brand$ext"
    Write-Host "Downloading $brand logo from $url..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $outFile -UserAgent "Mozilla/5.0" -TimeoutSec 10 -ErrorAction Stop
        $size = (Get-Item $outFile).Length
        if ($size -lt 500) { 
            Write-Warning "$brand returned small file ($size bytes), might be broken."
        }
        else {
            Write-Host "Downloaded $brand ($size bytes)"
        }
    }
    catch {
        Write-Warning "Failed to download $brand"
    }
}
