document.addEventListener('DOMContentLoaded', () => {
	const buttons = document.querySelectorAll('.color-button')

	for (const button of buttons) {
		button.addEventListener('click', () => {
			const color = button.getAttribute('data-color')

			chrome.runtime.sendMessage({
				type: 'popup_color_selection',
				color: color,
			})

			window.close()
		})
	}
})
