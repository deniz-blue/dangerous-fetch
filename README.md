# Dangerous Fetch

An extension that allows web apps to do unlimited API requests. Bypasses CORS! Reads cookies! Very scary.

Motivation for this project is to be able to make Single Page Apps that do HTTP Scraping/etc without the need for a backend in the future.

> [!CAUTION]
> Usage of this extension makes you extremely vulnerable (XSS, credential stealing, MITM, etc). Only use if you know what you're doing!

## TODO

- [ ] Popup-based Access Control per origin - only let websites that the users pick be able to use the extension
  - [ ] Each origin gets access to the browser-user-specified origins.

## API

This extension provides a `dangerousFetch` function to the `Window` interface, which is almost identical to the native `fetch` API.

## Contributing <a name="contributing"></a>
Feel free to open PRs or raise issues!

Use `pnpm dev` to develop for firefox. `pnpm dev:chrome` for chrome.

### Load your extension
For Chrome
1. Open - Chrome browser
2. Access - [chrome://extensions](chrome://extensions)
3. Tick - Developer mode
4. Find - Load unpacked extension
5. Select - `dist_chrome` folder in this project (after dev or build)

For Firefox
1. Open - Firefox browser
2. Access - [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)
3. Click - Load temporary Add-on
4. Select - any file in `dist_firefox` folder (i.e. `manifest.json`) in this project (after dev or build)
