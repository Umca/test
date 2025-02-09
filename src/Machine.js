import { Container, Graphics } from "pixi.js";
import { Reel } from "./Reel.js";

export class Machine extends Container {
    constructor(settings) {
        super();
		this.settings = settings;
		this.reels = [];
		this._createReels(settings.reel);
		this._createMask(settings);
    }

	_createReels(reel) {
		const shift = 24;
		for (let i = 0; i < reel.amount; ++i) {
			const r = new Reel(reel);
			r.position.set(i * reel.size + reel.symbol.size - shift, reel.symbol.size - shift);
			this.reels.push(r);
			this.addChild(r);
		}
	}

	_createMask(settings) {
		const gr = new Graphics();
		const w = settings.reel.amount * settings.reel.size; 
		const h = settings.reel.symbol.size * (settings.reel.symbol.amount - 2);
		gr.rect(56, 70, w, h);
		gr.fill(0xde3249);
		this.mask = gr;
		this.addChild(gr);
	}

	setResultScreen(screen) {
		this.reels.forEach((r, i) => r.setResultElements(screen[i]));
	}

	async showWinSymbols(positions) {
		const symbols = [];
		positions.forEach(({x, y}) => {
			symbols.push(this.reels[x].getSymbol(y));
		})
		const promises = [];
		symbols.forEach(s => promises.push(s.playWin()));
		await Promise.all(promises);
	}

	async start() {
		let promises = [];
		for (let i = 0; i < this.reels.length; i++) {
			const r = this.reels[i];
			const delay = this.settings.reel.delay * i;
			promises.push(r.roll(delay));
		}
		await Promise.all(promises);
	}

    update(dt) { 
		this.reels.forEach(r => r.update(dt))
	}
}