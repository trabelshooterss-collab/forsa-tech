$baseDir = "c:\FORSA\forsa-web\public\brands"
if (!(Test-Path $baseDir)) { New-Item -ItemType Directory -Path $baseDir }

# Surgical Rescue for specific brands
$logos = @{
    "mazda" = "https://pngimg.com/uploads/mazda/mazda_PNG86.png"
    "geely" = "https://vectorseek.com/wp-content/uploads/2023/07/Geely-Auto-Logo-Vector.png"
}

foreach ($brand in $logos.Keys) {
    $url = $logos[$brand]
    $ext = ".png"
    $outFile = Join-Path $baseDir "$brand$ext"
    Write-Host "Emergency Download: $brand from $url..."
    try {
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
