# Search Blocklist Extension

A Chrome/Firefox web extension that adds a blocklist button to search results on DuckDuckGo, Google, and Brave Search.

## TODO:

- https://github.com/ublacklist/builtin/tree/main

## Features

- Hover over search results to show an "add to blocklist" button
- Click the button to select a color (green, yellow, or red)
- Sends the selection to a native Node.js app via IPC

## Installation

### Browser Extension

1. Load the extension in Chrome/Firefox:
   - Chrome: Go to `chrome://extensions/`, enable Developer mode, click "Load unpacked", select this directory
   - Firefox: Go to `about:debugging`, click "This Firefox", "Load Temporary Add-on", select `manifest.json`

2. Update the `native-messaging-host.json` file with your extension ID (get it from the extension page)

### Native Messaging Host

1. Make the Node.js script executable:
   ```bash
   chmod +x hyperupcall-ublacklist-add.js
   ```

2. Install the native messaging host (Chrome example):
   ```bash
   # Linux
   mkdir -p ~/.config/google-chrome/NativeMessagingHosts/
   cp native-messaging-host.json ~/.config/google-chrome/NativeMessagingHosts/
   
   # Update the extension ID in the JSON file first!
   ```

3. Test the native app:
   ```bash
   node hyperupcall-ublacklist-add.js
   ```

## Usage

1. Search on Google, DuckDuckGo, or Brave Search
2. Hover over any search result
3. Click "add to blocklist" button
4. Select a color (green, yellow, or red)
5. The selection is sent to the native Node.js app and printed to stdout

## Files

- `manifest.json` - Extension manifest
- `content.js` - Content script for search result detection
- `background.js` - Background script for native messaging
- `popup.html/js` - Extension popup
- `styles.css` - CSS for the extension
- `hyperupcall-ublacklist-add.js` - Native Node.js app
- `native-messaging-host.json` - Native messaging host configuration
