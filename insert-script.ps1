$htmlPath = "c:\TheromX 2026\index.html"
$jsPath = "c:\TheromX 2026\track-script.js"
$jsContent = Get-Content -Path $jsPath -Raw
$htmlContent = Get-Content -Path $htmlPath -Raw
$scriptTag = "`n      <script>`n        $jsContent`n      </script>`n"
$newHtml = $htmlContent -replace '</body>', ($scriptTag + '</body>')
Set-Content -Path $htmlPath -Value $newHtml -Encoding UTF8
Write-Host "Script inserted successfully!"
