import { Container } from "pixi.js";
import { Utils } from "./Utils";
import { Symbol } from "./Symbol";

export class Reel extends Container {
	constructor(settings) {
		super();
		this.settings = settings;
		this.symbols = [];
		this.posY = 0;
		this.pool = [];
		this.tweens = [];
		this.resultSymbols = [];
		this.symbolNames = settings.symbols;
		this.rollResolve = null;
		this.spinCounter = 0;
		this.isDone = false;
		this._createSymbolsPool();
		this._createSymbols(settings.symbol);
	}

	_createSymbols(symbol) {
		const { size } = symbol;
		for (let j = 0; j < symbol.amount; j++) {
			const s = new Symbol(this._getRandomSymbol());
			s.position.set(-5, -size + (j * size));
			this.symbols.push(s);
			this.addChild(s);
		}
	}

	_createSymbolsPool() {
		this.pool = [];
		for (let i = 0; i < this.settings.symbol.amount; i++) {
			this.pool.push(this._getRandomSymbol());
		}
	}

	_getRandomSymbol() {
		return Utils.getRandom(this.symbolNames);
	}

	_checkSymbols() {
		const { size } = this.settings.symbol;
		for (let j = 0; j < this.symbols.length; j++) {
			const s = this.symbols[j];
			const prevy = s.y;

			s.y = ((this.posY + j) % this.symbols.length) * size - size;
			if (s.y < 0 && prevy > size) {
				const t = this.pool.pop();
				s.changeTo(t);
			}
		}
	}

	_needMoreTweens() {
		if (this.spinCounter < this.settings.tween.spins || !this.resultSymbols.length) {
			const target = this.posY + this.settings.symbol.amount;
			this._createSymbolsPool();
			this._addTween(target, Utils.easeNone, this.settings.tween.speed, null);
		} else if (this.resultSymbols.length && !this.isDone) {
			this.pool = [...this.resultSymbols];
			this.isDone = true;
			const target = this.posY + this.settings.symbol.amount;
			this._addTween(target, Utils.easeBackout(0.5), this.settings.tween.speed * 6, this.rollResolve);
		}
	}

	_addTween(target, easing, time, onComplete) {
		this.tweens.push({
			object: this,
			propertyBeginValue: this.posY,
			target,
			time,
			easing,
			onComplete,
			start: Date.now()
		})
	}

	_clear() {
		this.isDone = false;
		this.spinCounter = 0;
		this.symbols.forEach(s => s.playStatic());
	}

	setResultElements(symbols) {
		this.resultSymbols = symbols;
	}

	roll(delay) {
		return new Promise(resolve => {
			this._clear();
			this.rollResolve = resolve;
			const target = this.posY + this.settings.symbol.amount; // 1 circle
			this._createSymbolsPool();
			setTimeout(() => {
				this._addTween(target, Utils.easeNone, this.settings.tween.speed, null);
			}, delay);
		})
	}

	getSymbol(i) {
		return this.symbols[i];
	}

	update() {
		const remove = [];
		const now = Date.now();
        for (let i = 0; i < this.tweens.length; i++) {
            const t = this.tweens[i];
            const phase = Math.min(1, (now - t.start) / t.time);

			const e = t.easing(phase);
			const nextPos = Utils.lerp(t.propertyBeginValue, t.target, e);
            t.object.posY = nextPos;
			this._checkSymbols();
            if (phase === 1) {
				t.object.posY = 0;
                remove.push(t);
				this.spinCounter++;
				if (t.onComplete) {
					t.onComplete(1);
				}
				this._needMoreTweens();
            } 			
        }
        for (let i = 0; i < remove.length; i++) {
            this.tweens.splice(this.tweens.indexOf(remove[i]), 1);
        }
	}
}