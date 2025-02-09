import { Sprite, Texture, Container } from "pixi.js";
import { gsap } from "gsap";

export class Symbol extends Container {
	static states = {
		Idle: 0,
		Win: 1,
	}

	constructor(id) {
		super();
		this.sprite = new Sprite();
		this.sprite.anchor.set(0.5);
		this.changeTo(id);
		this.addChild(this.sprite);
		this.winResolve = null;
		this.state = Symbol.states.Idle;
	}

	changeTo(id) {
		this.id = id;
		this.sprite.texture = Texture.from(id);
	}

	playWin() {
		return new Promise(resolve => {
			this.state = Symbol.states.Win;
			this.winResolve = resolve;
			gsap.to(this.sprite.scale, {
				duration: 0.35,
				x: 1.25,
				y: 1.25,
				yoyo: true,
				repeat: 3,
				ease: "power1.out",
				onComplete: () => {
					this.state = Symbol.states.Idle;
					this.winResolve();
					this.winResolve = null;
				}
			})
		})
	}

	playStatic() {
		if (this.state === Symbol.states.Win) {
			gsap.killTweensOf(this.sprite.scale);
			this.sprite.scale.set(1);
			this.winResolve();
			this.state = Symbol.states.Idle;
		}
	}
}
