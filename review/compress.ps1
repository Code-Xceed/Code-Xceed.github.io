# Phase 4 media compression. Overwrites public/gallery/videos optimised copies.
$ErrorActionPreference = 'Continue'
$dir = "C:\Users\CodeX\Desktop\New-Portfolio\public\gallery\videos"

$targets = Get-ChildItem $dir -Filter *.mp4 | Where-Object { $_.Length -gt 4MB -and $_.Name -notlike "*-card.mp4" }
foreach ($f in $targets) {
  $before = [math]::Round($f.Length / 1MB, 1)
  $tmp = Join-Path $dir ("tmp-" + $f.Name)
  & ffmpeg -y -loglevel error -i $f.FullName -vf "scale='min(720,iw)':-2" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 96k -movflags +faststart $tmp
  if (Test-Path $tmp) {
    $after = [math]::Round((Get-Item $tmp).Length / 1MB, 1)
    Move-Item -Force $tmp $f.FullName
    "$($f.Name): $before MB -> $after MB"
  } else {
    "$($f.Name): FAILED, original kept"
  }
}

# Small 6-second loop for the home card (never the 960x540 original).
$src = Join-Path $dir "GixelMC.mp4"
$card = Join-Path $dir "GixelMC-card.mp4"
& ffmpeg -y -loglevel error -i $src -t 6 -vf "scale=480:-2" -an -c:v libx264 -crf 30 -preset medium -movflags +faststart $card
if (Test-Path $card) { "GixelMC-card.mp4: " + [math]::Round((Get-Item $card).Length / 1KB) + " KB" }

"TOTAL: " + [math]::Round(((Get-ChildItem $dir -Filter *.mp4 | Measure-Object Length -Sum).Sum / 1MB), 1) + " MB"
