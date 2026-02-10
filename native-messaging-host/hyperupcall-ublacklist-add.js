#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

let buf = Buffer.alloc(0)

process.stdin.on('data', (chunk) => {
	buf = Buffer.concat([buf, chunk])

	while (buf.length >= 4) {
		const msgLen = buf.readUInt32LE(0)
		if (buf.length < 4 + msgLen) {
			return
		}

		const jsonBytes = buf.subarray(4, 4 + msgLen)
		// buf = buf.subarray(4 + msgLen)

		try {
			const msg = JSON.parse(jsonBytes.toString('utf8'))
			try {
				processMessage(msg)
			} catch (err) {
				sendMessage('helper error: ' + err.message)
			}
			process.exit(0)
		} catch (err) {
			console.error('Failed to parse native message JSON:', err)
			process.exit(1)
		}
	}
})

function processMessage(message) {
	const url = new URL(message.url)
	if (message.type === 'add') {
		const line = `@${message.severity}*://*.${url.hostname}/\n`
		fs.appendFileSync(
			path.join(
				os.homedir(),
				`.dotfiles/config/ublacklist-severity${message.severity}.txt`,
			),
			line,
		)
	} else if (message.type === 'unblock') {
		const url = new URL(message.url)
		const filePath = path.join(
			os.homedir(),
			`.dotfiles/config/ublacklist-ignored.txt`,
		)

		const domains = fs.readFileSync(filePath, 'utf-8').trimEnd().split('\n')
		if (!domains.includes(url.hostname)) {
			domains.push(url.hostname)
		}

		fs.writeFileSync(filePath, domains.join('\n'))
	}
	sendMessage('DONE ' + JSON.stringify(message))
}

function sendMessage(message) {
	const msgBuf = Buffer.from(JSON.stringify(message), 'utf-8')
	const lenBuf = Buffer.alloc(4)
	lenBuf.writeUInt32LE(msgBuf.length, 0)

	process.stdout.write(lenBuf)
	process.stdout.write(msgBuf)
}

process.on('SIGINT', () => {
	process.exit(0)
})

process.on('SIGTERM', () => {
	process.exit(0)
})
