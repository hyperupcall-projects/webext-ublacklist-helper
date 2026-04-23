# Search Blocklist Extension

A webxtension that adds a blocklist button to search results on DuckDuckGo, Google, and Brave Search.

## Features

- Uses bits from [ublacklist/builtin](- https://github.com/ublacklist/builtin/tree/main
)
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
