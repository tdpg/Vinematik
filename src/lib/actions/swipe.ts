export interface SwipeOptions {
	threshold?: number;
	timeout?: number;
	onSwipeLeft?: () => void;
	onSwipeRight?: () => void;
	onSwipeUp?: () => void;
	onSwipeDown?: () => void;
}

export function swipe(node: HTMLElement, options: SwipeOptions = {}) {
	const threshold = options.threshold ?? 50;
	const timeout = options.timeout ?? 500;

	let xDown: number | null = null;
	let yDown: number | null = null;
	let timeDown: number | null = null;

	function handleTouchStart(e: TouchEvent) {
		const touch = e.touches[0];
		xDown = touch.clientX;
		yDown = touch.clientY;
		timeDown = Date.now();
	}

	function handleTouchEnd(e: TouchEvent) {
		if (xDown === null || yDown === null || timeDown === null) return;

		const touch = e.changedTouches[0];
		const xUp = touch.clientX;
		const yUp = touch.clientY;
		const timeDiff = Date.now() - timeDown;

		const xDiff = xDown - xUp;
		const yDiff = yDown - yUp;

		// Check if swipe was fast enough
		if (timeDiff > timeout) {
			reset();
			return;
		}

		// Determine swipe direction
		if (Math.abs(xDiff) > Math.abs(yDiff)) {
			// Horizontal swipe
			if (Math.abs(xDiff) > threshold) {
				if (xDiff > 0) {
					options.onSwipeLeft?.();
				} else {
					options.onSwipeRight?.();
				}
			}
		} else {
			// Vertical swipe
			if (Math.abs(yDiff) > threshold) {
				if (yDiff > 0) {
					options.onSwipeUp?.();
				} else {
					options.onSwipeDown?.();
				}
			}
		}

		reset();
	}

	function reset() {
		xDown = null;
		yDown = null;
		timeDown = null;
	}

	node.addEventListener('touchstart', handleTouchStart, { passive: true });
	node.addEventListener('touchend', handleTouchEnd, { passive: true });

	return {
		update(newOptions: SwipeOptions) {
			Object.assign(options, newOptions);
		},
		destroy() {
			node.removeEventListener('touchstart', handleTouchStart);
			node.removeEventListener('touchend', handleTouchEnd);
		}
	};
}

