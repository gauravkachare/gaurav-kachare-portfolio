$ErrorActionPreference = "Stop"
$repoUrl = "https://github.com/d3M0N-wq/gaurav-kachare-portfolio.git"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not installed. Install Git for Windows from https://git-scm.com/download/win, then reopen PowerShell."
    exit 1
}

if (-not (Test-Path ".git")) {
    git init
    if ($LASTEXITCODE -ne 0) { throw "git init failed." }
}

git branch -M main
if ($LASTEXITCODE -ne 0) { throw "Could not set the main branch." }

$currentRemote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0 -or -not $currentRemote) {
    git remote add origin $repoUrl
    if ($LASTEXITCODE -ne 0) { throw "Could not add the GitHub remote." }
} elseif ($currentRemote.Trim() -ne $repoUrl) {
    throw "The existing origin points to '$currentRemote'. This script stopped to avoid pushing to the wrong repository."
}

git add --all
if ($LASTEXITCODE -ne 0) { throw "git add failed." }

git diff --cached --quiet
$diffExit = $LASTEXITCODE
if ($diffExit -eq 1) {
    git commit -m "Publish Gaurav Kachare portfolio"
    if ($LASTEXITCODE -ne 0) { throw "git commit failed. Configure your Git author name and email, then run this script again." }
} elseif ($diffExit -gt 1) {
    throw "Could not inspect staged changes."
} else {
    Write-Host "No new changes to commit; pushing the current main branch."
}

git push --set-upstream origin main
if ($LASTEXITCODE -ne 0) {
    throw "Push failed. Check your GitHub sign-in and repository access, then run this script again."
}

Write-Host "Portfolio files pushed to $repoUrl" -ForegroundColor Green
Write-Host "Next: open https://github.com/d3M0N-wq/gaurav-kachare-portfolio/settings/pages"
Write-Host "Choose 'Deploy from a branch', branch 'main', folder '/ (root)', and Save."
