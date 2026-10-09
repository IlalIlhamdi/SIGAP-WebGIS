Add-Type -AssemblyName System.Drawing
$srcPath = 'c:\laragon\www\SIGAP\public\app-icon.png'
$baseRes = 'c:\laragon\www\SIGAP\android\app\src\main\res'

$sizes = @{
    'mipmap-mdpi' = @{ launcher = 48; fg = 108 }
    'mipmap-hdpi' = @{ launcher = 72; fg = 162 }
    'mipmap-xhdpi' = @{ launcher = 96; fg = 216 }
    'mipmap-xxhdpi' = @{ launcher = 144; fg = 324 }
    'mipmap-xxxhdpi' = @{ launcher = 192; fg = 432 }
}

$srcImg = [System.Drawing.Image]::FromFile($srcPath)

foreach ($dir in $sizes.Keys) {
    $dirPath = Join-Path $baseRes $dir
    if (!(Test-Path $dirPath)) { New-Item -ItemType Directory -Path $dirPath -Force }
    
    # ic_launcher & ic_launcher_round
    $lSize = $sizes[$dir].launcher
    $bmpL = New-Object System.Drawing.Bitmap $lSize, $lSize
    $gL = [System.Drawing.Graphics]::FromImage($bmpL)
    $gL.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gL.DrawImage($srcImg, 0, 0, $lSize, $lSize)
    $gL.Dispose()
    $bmpL.Save((Join-Path $dirPath 'ic_launcher.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpL.Save((Join-Path $dirPath 'ic_launcher_round.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpL.Dispose()

    # ic_launcher_foreground
    $fgSize = $sizes[$dir].fg
    $bmpFg = New-Object System.Drawing.Bitmap $fgSize, $fgSize
    $gFg = [System.Drawing.Graphics]::FromImage($bmpFg)
    $gFg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $pad = [int]($fgSize * 0.16)
    $iconSize = $fgSize - (2 * $pad)
    $gFg.DrawImage($srcImg, $pad, $pad, $iconSize, $iconSize)
    $gFg.Dispose()
    $bmpFg.Save((Join-Path $dirPath 'ic_launcher_foreground.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpFg.Dispose()
}

$srcImg.Dispose()
Write-Host "SIGAP icons generated successfully."
