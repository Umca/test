import { Assets } from "pixi.js"
import { Logic } from "./Logic";
import { WinLinesLogic } from "./WinLinesLogic";

export class Game {
    constructor() {
		this.states = {
			Idle: 0,
			Spin: 1,
			NewScreenReceived: 2,
			ShowWinSymbols: 3,
			ShowWinLines: 4
		};
		this.scene = null;
		this.state = this.states.Idle;
		this.logic = new Logic(this);
		this.screenData = [];
	}

    async initialize(app, urls) {
        this.app = app;
        await Assets.load(urls);
    }

    setScene(scene) {
		this.scene = scene;
        this.app.stage = scene;
    }

	onNewScreenReceived({rawScreen, gameScreen}) {
		this.state = this.states.NewScreenReceived;
		this.screenData = rawScreen;
		this.scene.setResultScreen(gameScreen);
	}

	onShowWinSymbolComplete() {
		this.state = this.states.ShowWinLines;
		const lines = [];
		for (let s in this.winLines) {
			this.winLines[s].forEach(l => {
				lines.push(l);
			});
		}
		this.scene.loopThroughWinLines(lines);
	}
	
	async onSpinEnd() {
		this.winLines = WinLinesLogic.getWinLines(this.screenData);
		if (Object.keys(this.winLines).length > 0) {
			this.state = this.states.ShowWinSymbols;
			const winSymbols = WinLinesLogic.getUniqueWinSymbols(this.winLines);
			this.scene.showWinSymbols(winSymbols);
		} else {
			this.scene.onNoWinSpinEnd();
			this.state = this.states.Idle;
		}
	}

	async onButtonClick(e) {
		if (e === "spin") {
			switch(this.state) {
				case this.states.Idle:
				case this.states.ShowWinLines: {
					this.state = this.states.Spin;
					this.scene.startSpin();
					this.logic.sendRequest();
				}
				break;
			}
		}
	}
}