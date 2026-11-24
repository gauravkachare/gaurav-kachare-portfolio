# Gaurav Kachare — Portfolio

A responsive, editorial-style personal website built with HTML, CSS and JavaScript.

## Run locally

Open `index.html` in a browser, or run `python -m http.server 8000` from this folder.

## Publish to GitHub Pages (Windows)

1. Extract this ZIP.
2. Open PowerShell in the extracted folder.
3. Run:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\deploy-to-github.ps1
   ```

4. Complete the GitHub sign-in prompt from Git Credential Manager if one appears.
5. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then Save.

The site URL will be `https://d3m0n-wq.github.io/gaurav-kachare-portfolio/` once GitHub Pages finishes deploying.

## Included assets

- `assets/gaurav-kachare.png` — profile photo supplied for this portfolio.
- `assets/favicon.svg` — site favicon.

The older résumé PDF is intentionally excluded. Add the updated public résumé when it is ready.

## Features

- Responsive navigation and mobile menu.
- Scroll-aware navigation and reading progress indicator.
- Tap-accessible market-data workflow explainer.
- Swipe/scroll project rail with category filters and arrow controls.
- Keyboard-accessible technical-skill tabs.
- Expandable role details and earlier experience.
- Copy-email action with a mailto fallback.

Professional work is described at a high level; no proprietary Barclays system names, internal architecture, client information or production details are included.
