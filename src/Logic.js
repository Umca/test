import { Outcome } from "./Outcome";
import { Utils } from "./Utils";

export class Logic {
	constructor(listener) {
		this.symbols = ['high1', 'high2', 'high3', 'low1', 'low2', 'low3', 'low4'];
		this.listener = listener;
	}

	sendRequest() {
		const delay = 200;
		setTimeout(() => {
			let result = Outcome.resolve();
			const gameScreen = this._addHiddenSymbols(result);
			this.listener.onNewScreenReceived({
				rawScreen: result,
				gameScreen
			});
		}, delay);
	}

	_addHiddenSymbols(screen) {
		let copy = [];
		for(let i = 0; i < screen.length; ++i) {
			const s = Utils.getRandom(this.symbols);
			const reel = [...screen[i]];
			reel[0] = s;
			reel[reel.length - 1] = s;
			copy.push(reel);
		}
		return copy;
	}
}