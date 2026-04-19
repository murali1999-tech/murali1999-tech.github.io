$baseUrl = "https://newsdaily.ink"
$today = Get-Date -Format "yyyy-MM-dd"

$htmlFiles = Get-ChildItem -Path . -Recurse -Filter *.html

$xml = @()
$xml += '<?xml version="1.0" encoding="UTF-8"?>'
$xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

foreach ($file in $htmlFiles) {
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "") -replace "\\", "/"

    if ($relativePath -eq "index.html") {
        $url = "$baseUrl/"
    } else {
        $url = "$baseUrl/$relativePath"
    }

    $lastmod = $file.LastWriteTime.ToString("yyyy-MM-dd")

    $xml += "  <url>"
    $xml += "    <loc>$url</loc>"
    $xml += "    <lastmod>$lastmod</lastmod>"
    $xml += "    <changefreq>weekly</changefreq>"
    $xml += "    <priority>0.7</priority>"
    $xml += "  </url>"
}

$xml += '</urlset>'

$xml | Out-File -Encoding UTF8 sitemap.xml