#!/usr/bin/env bash
set -euo pipefail

dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
name="com.edwinkofler.webext_ublacklist_helper_native"
out="$PWD/.cache/$name.json"

mkdir -p "${out%/*}"
sed "s|%%path_replace%%|$dir|g" "$dir/native-messaging-host/firefox-host.json" > "$out"
chmod +x "$dir/native-messaging-host/hyperupcall-ublacklist-add.js"

mkdir -p "$HOME/.mozilla/native-messaging-hosts"
mkdir -p "$HOME/.librewolf/native-messaging-hosts"
ln -sf "$out" "$HOME/.mozilla/native-messaging-hosts/$name.json"
ln -sf "$out" "$HOME/.librewolf/native-messaging-hosts/$name.json"
