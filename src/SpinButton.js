import { Container, Sprite, Texture } from "pixi.js";

export class SpinButton extends Container {
    constructor(listener) {
		super();
		this.sprite = Sprite.from('spin_btn_normal');
		this.sprite.anchor.set(0.5);
		this.addChild(this.sprite);

		this.interactive = true;
		this.buttonMode = true;
		this.action = "spin";
		this.listener = listener;

		this.addListener('pointerdown', this.handlePointerDown.bind(this));
		this.addListener('pointerup', this.handlePointerUp.bind(this));
		this.addListener('mouseover', this.handleMouseOver.bind(this));
		this.addListener('mouseout', this.handleMouseOut.bind(this));
    }

	enable(isEnable) {
		this.interactive = isEnable;
		if (isEnable) {
			this.sprite.texture = Texture.from('spin_btn_normal');
		} else {
			this.sprite.texture = Texture.from('spin_btn_disabled');
		}
	}

	handlePointerDown() {
		if (this.interactive) {
			this.sprite.texture = Texture.from('spin_btn_down');
		}
	}

	handlePointerUp() {
		if (this.interactive) {
			this.listener.onButtonClick(this.action);
			this.sprite.texture = Texture.from('spin_btn_disabled');
		}
	}

	handleMouseOver() {
		if (this.interactive) {
			this.sprite.texture = Texture.from('spin_btn_over');
		}
	}

	handleMouseOut() {
		if (this.interactive) {
			this.sprite.texture = Texture.from('spin_btn_normal');
		}
	}
}