// import { Application, Assets, Sprite, Container } from 'pixi.js';
import * as PIXI from 'pixi.js';

import { urls } from "./img";
import {Game} from "./src/Game";
import {MainScene} from "./src/MainScene";

const screen = {
    width: 1920,
    height: 1080
};

(async () => {
    const app = new PIXI.Application();
    await app.init({width: screen.width, height: screen.height});
    document.body.appendChild(app.canvas);

    const game = new Game();
    await game.initialize(app, urls);

    const main = new MainScene(game);
    game.setScene(main);

    app.ticker.add(({deltaTime}) => {
        main.update(deltaTime);
    });

	globalThis.__PIXI_APP__ = app;
})();