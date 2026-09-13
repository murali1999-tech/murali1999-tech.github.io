$siteUrl = "https://newsdaily.ink"
$root = "D:\murali1999-tech.github.io"
$sitemap = Join-Path $root "sitemap.xml"

$urls = @()

# Add homepage
$urls += @{
    Url = "$siteUrl/"
    File = Join-Path $root "index.html"
}

# Add important root pages
$rootPages = @(
    "about.html",
    "contact.html",
    "privacy-policy.html"
)

foreach ($page in $rootPages) {
    $file = Join-Path $root $page

    if (Test-Path $file) {
        $urls += @{
            Url = "$siteUrl/$page"
            File = $file
        }
    }
}

# Scan India and USA folders
$sections = @(
    "india",
    "usa"
)

foreach ($section in $sections) {

    $folder = Join-Path $root $section

    if (Test-Path $folder) {

        $files = Get-ChildItem $folder -Recurse -File -Filter "*.html"

        foreach ($file in $files) {

            $relative = $file.FullName.Substring($root.Length + 1)

            $relative = $relative -replace "\\", "/"

            if ($relative -eq "$section/index.html") {
                $url = "$siteUrl/$section/"
            }
            else {
                $url = "$siteUrl/$relative"
            }

            $urls += @{
                Url = $url
                File = $file.FullName
            }
        }
    }
}

# Remove duplicate URLs
$urls = $urls | Sort-Object Url -Unique

# Build sitemap
$xml = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
"@

foreach ($item in $urls) {

    $lastmod = (Get-Item $item.File).LastWriteTime.ToUniversalTime().ToString("yyyy-MM-dd")

    $xml += @"

  <url>
    <loc>$($item.Url)</loc>
    <lastmod>$lastmod</lastmod>
  </url>
"@
}

$xml += @"

</urlset>
"@

$xml | Set-Content $sitemap -Encoding UTF8

Write-Host ""
Write-Host "Sitemap updated successfully!"
Write-Host "Location: $sitemap"
Write-Host "URLs included: $($urls.Count)"
Write-Host ""
