chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	console.log('SENDING MESSAGE:', message)
	const response = await browser.runtime.sendNativeMessage(
		'com.edwinkofler.webext_ublacklist_helper_native',
		message,
	)
	console.log('RESPONSE: ', response)
	if (chrome.runtime.lastError) {
		console.error('Native messaging error:', chrome.runtime.lastError.message)
	}
})
