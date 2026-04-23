// From https://github.com/ublacklist/builtin.
const SEARCH_RESULT_SELECTORS = {
	google: [
		'.vt6azd:not(.g-blk)', // Google desktop web results (from uBlacklist)
	],
	duckduckgo: [
		':root:not(.is-mobile) [data-testid="web-vertical"] li > article', // DDG desktop web results (from uBlacklist)
		':root.is-mobile [data-testid="web-vertical"] li > article', // DDG mobile web results (from uBlacklist)
	],
	brave: [
		'.snippet[data-type="web"]', // Brave web results (from uBlacklist)
	],
}

document.addEventListener('DOMContentLoaded', () => {
	// Wait a bit for JavaScript to continue executing just in case.
	setTimeout(() => {
		addBlacklistOptionsButton()
	}, 1000)
})

// Run when page content changes.
const observer = new MutationObserver(() => {
	addBlacklistOptionsButton()
})
observer.observe(document.body, {
	childList: true,
	subtree: true,
})

function addBlacklistOptionsButton() {
	const searchEngine = getSearchEngine()
	if (!searchEngine) {
		return
	}

	const selectors = SEARCH_RESULT_SELECTORS[searchEngine]

	for (const selector of selectors) {
		const results = document.querySelectorAll(selector)

		for (const result of results) {
			if (result.querySelector('.ublacklist-add-button')) {
				return
			}

			result.addEventListener('mouseenter', () => {
				let button = result.querySelector('.ublacklist-add-button')
				if (!button) {
					button = createBlocklistButton(result)
					result.appendChild(button)
				}
				button.classList.remove('ublacklisthelper_hide')
			})

			result.addEventListener('mouseleave', () => {
				const button = result.querySelector('.ublacklist-add-button')
				if (!button) {
					return
				}
				button.classList.add('ublacklisthelper_hide')
			})
		}
	}
}

function createBlocklistButton(resultElement) {
	const searchEngine = getSearchEngine()
	const button = document.createElement('button')
	button.className = 'ublacklist-add-button'
	button.textContent = 'Blocklist Options'

	// Position button based on uBlacklist defaults
	button.style.zIndex = (99999 - 100).toString() // 99999 is zIndex of uBlackList popup
	if (searchEngine === 'duckduckgo') {
		button.style.top = '11px'
		button.style.right = `${36 + 40}px`
	} else if (searchEngine === 'google') {
		// Google: similar positioning
		button.style.top = '4px'
		button.style.right = `${8 + 30}px`
	} else if (searchEngine === 'brave') {
		// Brave: similar positioning
		button.style.top = '6px'
		button.style.right = `${8 + 30}px`
	}
	button.style.backgroundColor = 'black !important !important'

	button.addEventListener('click', (e) => {
		e.preventDefault()
		e.stopPropagation()
		showColorPopup(button, resultElement)
	})

	return button
}

function showColorPopup(button, resultElement) {
	const existingPopup = document.querySelector('.ublacklist-color-popup')
	if (existingPopup) {
		existingPopup.remove()
	}

	const popup = document.createElement('div')
	popup.className = 'ublacklist-color-popup'

	const unblockButton = document.createElement('button')
	unblockButton.className = 'severity-button unblock-button'
	unblockButton.textContent = 'Unblock'
	unblockButton.style.backgroundColor = '#f0f0f0' // Light gray for unblock
	unblockButton.style.color = 'black'
	unblockButton.style.border = '1px solid #ccc'
	unblockButton.style.padding = '8px 12px'
	unblockButton.style.margin = '2px'
	unblockButton.style.cursor = 'pointer'
	unblockButton.addEventListener('click', () => {
		const searchEngine = getSearchEngine()
		const { url, title } = extractSiteInfo(searchEngine, resultElement)

		sendToBackground({ type: 'unblock', url, title }, 'unblock')
		popup.remove()
	})
	popup.appendChild(unblockButton)

	const severities = [
		{ number: 1, name: 'Great', class: 'severity-great' },
		{ number: 2, name: 'Good', class: 'severity-good' },
		{
			number: 3,
			name: 'Mediocre',
			class: 'severity-mediocre',
		},
		{ number: 4, name: 'Bad', class: 'severity-bad' },
	]
	for (const severity of severities) {
		const severityButton = document.createElement('button')
		severityButton.className = `severity-button ${severity.class}`
		severityButton.textContent = `${severity.number} - ${severity.name}`
		severityButton.addEventListener('click', () => {
			const searchEngine = getSearchEngine()
			const { url, title } = extractSiteInfo(searchEngine, resultElement)
			const message = {
				type: 'add',
				url: url,
				title: title?.substring(0, 200) || 'unknown',
			}
			if (severityNumber !== null) {
				message.severity = severity.number
			}
			sendToBackground(message)
			popup.remove()
		})
		popup.appendChild(severityButton)
	}

	// Position popup near the button
	document.body.appendChild(popup)

	const buttonRect = button.getBoundingClientRect()
	popup.style.position = 'fixed'
	popup.style.top = `${buttonRect.bottom + 5}px`
	popup.style.left = `${buttonRect.left}px`
	button.style.zIndex = (99999 - 50).toString()

	// Close popup when clicking outside
	document.addEventListener('click', function closePopup(e) {
		if (!popup.contains(e.target)) {
			popup.remove()
			document.removeEventListener('click', closePopup)
		}
	})
}

function extractSiteInfo(
	/** @type {string} */ searchEngine,
	/** @type {HTMLElement} */ resultElement,
) {
	let url = 'unknown'
	let title = 'unknown'

	if (searchEngine === 'duckduckgo') {
		// DuckDuckGo: URL is in h2 > a
		const link = resultElement.querySelector('h2 > a')
		if (link) {
			url = link.href
			title = link.textContent?.trim()
		}
	} else if (searchEngine === 'google') {
		// Google: URL is in :is(.yuRUbf, .xe8e1b) a, title in h3
		const link = resultElement.querySelector(':is(.yuRUbf, .xe8e1b) a')
		if (link) {
			url = link.href
		}
		const h3 = resultElement.querySelector('h3')
		if (h3) {
			title = h3.textContent?.trim()
		}
	} else if (searchEngine === 'brave') {
		// Brave: URL is in a, title in .title
		const link = resultElement.querySelector('a')
		if (link) {
			url = link.href
		}
		const titleEl = resultElement.querySelector('.title')
		if (titleEl) {
			title = titleEl.textContent?.trim()
		}
	}

	return {
		url,
		title,
	}
}

function getSearchEngine() {
	const hostname = window.location.hostname
	if (hostname.includes('google.com')) {
		return 'google'
	}
	if (hostname.includes('duckduckgo.com')) {
		return 'duckduckgo'
	}
	if (hostname.includes('search.brave.com')) {
		return 'brave'
	}
	return null
}

function sendToBackground(
	/** @type {Record<PropertyKey, unknown> & { type: 'add' }} */ message,
) {
	chrome.runtime.sendMessage(message, (response) => {
		if (chrome.runtime.lastError) {
			console.error(
				'[ublacklist-add] Error sending message:',
				chrome.runtime.lastError,
			)
		}
	})
}
