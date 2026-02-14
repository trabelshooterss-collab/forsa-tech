$baseDir = "c:\FORSA\forsa-web\public\brands"
if (!(Test-Path $baseDir)) { New-Item -ItemType Directory -Path $baseDir }

# Targeted list of previously failed or likely-to-fail logos
$logos = @{
    "mercedes"    = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mercedesbenz.svg"
    "lexus"       = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/lexus.svg"
    "dodge"       = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/dodge.svg"
    "jeep"        = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jeep.svg"
    "chevrolet"   = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/chevrolet.svg"
    "mg"          = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mg.svg"
    # GMC and Geely might name their files differently
    "gmc"         = "https://www.vectorlogo.zone/logos/gmc/gmc-icon.svg"
    "geely"       = "https://www.vectorlogo.zone/logos/geely/geely-icon.svg"
    "ferrari"     = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/ferrari.svg"
    "lamborghini" = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/lamborghini.svg"
    "porsche"     = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/porsche.svg"
    "jaguar"      = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jaguar.svg"
}

foreach ($brand in $logos.Keys) {
    $url = $logos[$brand]
    $outFile = Join-Path $baseDir "$brand.svg"
    Write-Host "Re-downloading $brand logo..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $outFile -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -ErrorAction Stop
        $size = (Get-Item $outFile).Length
        if ($size -lt 500) { Write-Warning "$brand logo size suspiciously small ($size bytes)" }
    } catch {
        Write-Warning "Failed to download $brand from $url"
    }
}
