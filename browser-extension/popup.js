document.addEventListener('DOMContentLoaded', () => {
	const buttons = document.querySelectorAll('.color-button')

	buttons.forEach((button) => {
		button.addEventListener('click', () => {
			const color = button.getAttribute('data-color')

			// Send message to background script
			chrome.runtime.sendMessage({
				type: 'popup_color_selection',
				color: color,
			})

			// Close popup
			window.close()
		})
	})
})
