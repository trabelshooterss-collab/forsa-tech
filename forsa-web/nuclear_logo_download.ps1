$baseDir = "c:\FORSA\forsa-web\public\brands"
if (!(Test-Path $baseDir)) { New-Item -ItemType Directory -Path $baseDir }

# Dictionary of Brand Name to Wikimedia/Stable URL
# Using SVG where possible for maximum quality
$logos = @{
    "mitsubishi"  = "https://upload.wikimedia.org/wikipedia/commons/b/b7/Mitsubishi-logo.svg"
    "suzuki"      = "https://upload.wikimedia.org/wikipedia/commons/1/12/Suzuki_logo_2.svg"
    "isuzu"       = "https://upload.wikimedia.org/wikipedia/commons/3/3b/Isuzu_logo.svg"
    "toyota"      = "https://upload.wikimedia.org/wikipedia/commons/5/5e/Toyota_EU.svg"
    "hyundai"     = "https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg"
    "kia"         = "https://upload.wikimedia.org/wikipedia/commons/4/47/Kia_logo_2021.svg"
    "nissan"      = "https://upload.wikimedia.org/wikipedia/commons/2/23/Nissan_2020_logo.svg"
    "ford"        = "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg"
    "honda"       = "https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg"
    "chevrolet"   = "https://upload.wikimedia.org/wikipedia/commons/c/cd/Chevrolet_logo.svg"
    "mazda"       = "https://upload.wikimedia.org/wikipedia/commons/f/ff/Mazda_logo_2024.svg"
    "changan"     = "https://upload.wikimedia.org/wikipedia/commons/c/c2/ChanganLogo.svg"
    "geely"       = "https://upload.wikimedia.org/wikipedia/en/f/f6/Geely_logo.svg"
    "haval"       = "https://upload.wikimedia.org/wikipedia/commons/a/a9/Haval-logo.svg"
    "mg"          = "https://upload.wikimedia.org/wikipedia/commons/4/4b/MG_Motor_logo.svg"
    "chery"       = "https://upload.wikimedia.org/wikipedia/en/a/a0/Chery_Automobile_logo.svg"
    "jetour"      = "https://upload.wikimedia.org/wikipedia/commons/f/f0/Jetour_logo.svg"
    "tank"        = "https://cdn.worldvectorlogo.com/logos/tank-logo.svg"
    "hongqi"      = "https://upload.wikimedia.org/wikipedia/commons/d/d4/Hongqi_Logo.svg"
    "byd"         = "https://upload.wikimedia.org/wikipedia/commons/3/36/BYD_logo.svg"
    "baic"        = "https://upload.wikimedia.org/wikipedia/commons/2/23/BAIC_logo.svg"
    "gac"         = "https://upload.wikimedia.org/wikipedia/commons/f/f6/GAC_Group_logo.svg"
    "exeed"       = "https://upload.wikimedia.org/wikipedia/commons/5/52/Exeed_logo.svg"
    "bestune"     = "https://upload.wikimedia.org/wikipedia/commons/7/77/Bestune_Logo.svg"
    "mercedes"    = "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Benz_logo_2011.svg"
    "bmw"         = "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg"
    "audi"        = "https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg"
    "porsche"     = "https://upload.wikimedia.org/wikipedia/commons/d/d8/Porsche_logo.svg"
    "lexus"       = "https://upload.wikimedia.org/wikipedia/commons/d/d1/Lexus_logo.svg"
    "landrover"   = "https://upload.wikimedia.org/wikipedia/commons/6/69/Land_Rover_logo.svg"
    "jeep"        = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Jeep_logo.svg"
    "dodge"       = "https://upload.wikimedia.org/wikipedia/commons/b/bd/Dodge_logo.svg"
    "gmc"         = "https://upload.wikimedia.org/wikipedia/commons/1/14/GMC_logo.svg"
    "cadillac"    = "https://upload.wikimedia.org/wikipedia/commons/6/69/Cadillac_logo.svg"
    "lucid"       = "https://upload.wikimedia.org/wikipedia/commons/e/e9/Lucid_Motors_logo.svg"
    "tesla"       = "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg"
    "ferrari"     = "https://upload.wikimedia.org/wikipedia/en/d/d1/Ferrari-Logo.svg"
    "lamborghini" = "https://upload.wikimedia.org/wikipedia/en/d/df/Lamborghini_Logo.svg"
    "genesis"     = "https://upload.wikimedia.org/wikipedia/commons/7/7d/Genesis_Logo.svg"
}

foreach ($brand in $logos.Keys) {
    $url = $logos[$brand]
    $outFile = Join-Path $baseDir "$brand.svg"
    Write-Host "Downloading $brand logo..."
    try {
        # Using curl.exe with -L (follow redirects) and -H (User-Agent)
        & curl.exe -L -H "User-Agent: Mozilla/5.0" $url -o $outFile --silent
        $size = (Get-Item $outFile).Length
        if ($size -lt 500) { 
            Write-Warning "$brand logo is suspiciously small ($size bytes). Powering up for PNG fallback..."
        }
        else {
            Write-Host "Successfully downloaded $brand ($size bytes)"
        }
    }
    catch {
        Write-Warning "Failed to download $brand"
    }
}
