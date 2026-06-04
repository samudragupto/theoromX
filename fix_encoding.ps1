$content = Get-Content 'index.html' -Raw -Encoding UTF8
$content = $content.Replace([char]0x2013, '-')
$content = $content.Replace([char]0x2014, '-')
$content = $content.Replace('–', '-')
$content = $content.Replace('—', '-')
Set-Content -Path 'index.html' -Value $content -Encoding UTF8
Write-Host "Encoding issues fixed!"
