import { Machine } from "./Machine";
import { SpinButton } from "./SpinButton";
import { Sprite, Container } from "pixi.js";

export class MainScene extends Container {
    constructor(listener) {
        super();
		this.listener = listener;

        const background = Sprite.from('background');
        this.addChild(background);

        const reels = Sprite.from('reels_base');
        reels.anchor.set(0.5);
        reels.position.set(screen.width * 0.5, screen.height * 0.5);
        this.addChild(reels);

		const machineSettings = {
			reel: {
				amount: 5,
				size: 200,
				delay: 100, //ms
				tween: {
					speed: 200, //ms
					spins: 5,
				},
				symbols: ['high1', 'high2', 'high3', 'low1', 'low2', 'low3', 'low4'],
				symbol: {
					amount: 5,
					size: 184 
				},
			}
		}
        const machine = new Machine(machineSettings);
        machine.position.set(screen.width * 0.5 - reels.width * 0.5, screen.height * 0.5 - reels.height * 0.5);
        this.addChild(machine);

        const spinButton = new SpinButton(listener);
        spinButton.position.set(screen.width * 0.85, screen.height * 0.85);
        this.addChild(spinButton);

        this._machine = machine;
        this._spinButton = spinButton;

		this.timeId = null;
    }

	async startSpin() {
		if (this.timeId) {
			clearInterval(this.timeId);
			this.timeId = null;
		}
		this._spinButton.enable(false);
		await this._machine.start();
		this.listener.onSpinEnd();
	}

	loopThroughWinLines(lines) {
		let counter = 0;
		let time = 1700;
		let first = true;
		this.timeId = setInterval(async () => {
			first = false;
			await this._machine.showWinSymbols(lines[counter]);
			counter++;
			if(counter >= lines.length) {
				counter = 0;
			}
		}, time);
	}

	onNoWinSpinEnd() {
		this._spinButton.enable(true);
	}

	setResultScreen(screen) {
		this._machine.setResultScreen(screen);
	}

	async showWinSymbols(symbols) {
		await this._machine.showWinSymbols(symbols);
		this._spinButton.enable(true);
		this.listener.onShowWinSymbolComplete();
	}

    update(dt) {
        this._machine.update(dt);
    }
}