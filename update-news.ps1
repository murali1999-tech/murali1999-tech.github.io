
$root = "D:\murali1999-tech.github.io"

foreach ($section in @("india", "usa")) {
    $folder = Join-Path $root $section

    $articles = Get-ChildItem -Path $folder -Filter "*.html" -File |
        Where-Object { $_.Name -ne "index.html" } |
        Sort-Object LastWriteTime -Descending

    $heading = if ($section -eq "india") {
        "India News"
    } else {
        "USA News"
    }

    $description = if ($section -eq "india") {
        "Latest news and updates from India"
    } else {
        "Latest news and updates from the United States"
    }

    $links = foreach ($article in $articles) {
        $title = [System.IO.Path]::GetFileNameWithoutExtension($article.Name)
        $title = $title -replace "-", " "
        $title = (Get-Culture).TextInfo.ToTitleCase($title.ToLower())
        $url = "/$section/$($article.Name)"

        "    <p><a href=`"$url`">$([System.Net.WebUtility]::HtmlEncode($title))</a></p>"
    }

    $otherSection = if ($section -eq "india") { "usa" } else { "india" }
    $otherTitle = if ($section -eq "india") { "USA News" } else { "India News" }

    $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>$heading - NewsDaily</title>
<meta name="description" content="$description. Read the latest stories on NewsDaily.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://newsdaily.ink/$section/">
<style>
body{margin:0;padding:16px;font-family:Arial,Helvetica,sans-serif;line-height:1.7;color:#222;background:#fff}
main{max-width:850px;margin:auto}
h1{font-size:28px;font-weight:600}
p{margin:12px 0}
a{color:#1558a6}
footer{margin-top:30px;font-size:14px}
</style>
</head>
<body>
<main>
<h1>$heading</h1>
<p>$description</p>
<p>Browse the latest stories below.</p>
$($links -join "`n")
<footer>
<p><a href="/">Home</a> |
<a href="/$otherSection/">$otherTitle</a> |
<a href="/about.html">About</a> |
<a href="/contact.html">Contact</a> |
<a href="/privacy-policy.html">Privacy Policy</a></p>
<p>&copy; 2026 NewsDaily</p>
</footer>
</main>
</body>
</html>
"@

    Set-Content -Path (Join-Path $folder "index.html") -Value $html -Encoding UTF8
    Write-Host "$heading updated: $($articles.Count) articles listed"
}
