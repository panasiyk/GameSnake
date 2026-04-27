import * as PIXI from 'pixi.js';
import {GameState} from '../types';
import {GameConfig} from '../GameConfig';

export class SidebarRenderer {
    constructor(
        app,
        modes,
        callbacks,
    ) {
        this._container = new PIXI.Container();
        this._container.x = GameConfig.FIELD_SIZE + 40;
        this._container.y = 0;

        this._container.addChild(
            new PIXI.Graphics()
                .rect(0, 0, GameConfig.SIDEBAR_WIDTH, GameConfig.APP_HEIGHT)
                .fill({color: GameConfig.COLORS.SIDEBAR}),
        );
        this._container.addChild(this._buildTitle());

        this._bestScoreText = this._createText('Best Score: 0', 20, 100, 24);
        this._scoreText = this._createText('Score: 0', 20, 140, 24);
        this._container.addChild(this._bestScoreText);
        this._container.addChild(this._scoreText);

        this._modeRadios = this._buildModeRadios(modes, callbacks.onModeSelect);

        this._playButton = this._buildButton('Play', 100, 500, callbacks.onPlay);
        this._menuButton = this._buildButton('Menu', 100, 500, callbacks.onMenu);
        this._resumeButton = this._buildButton('Resume', 40, 500, callbacks.onResume);
        this._exitButton = this._buildButton('Exit', 160, 500, callbacks.onExit);
        this._container.addChild(this._playButton);
        this._container.addChild(this._menuButton);
        this._container.addChild(this._resumeButton);
        this._container.addChild(this._exitButton);

        app.stage.addChild(this._container);
    }

    updateScore(score, bestScore) {
        this._scoreText.text = `Score: ${score}`;
        this._bestScoreText.text = `Best Score: ${bestScore}`;
    }

    updateState(state, selectedMode) {
        this._playButton.visible = state === GameState.MENU;
        this._menuButton.visible = state === GameState.PLAYING;
        this._resumeButton.visible = state === GameState.PAUSED;
        this._exitButton.visible = state === GameState.PAUSED;

        this._modeRadios.forEach((radio, modeName) => {
            radio.visible = state === GameState.MENU;
            this._drawRadioBox(radio.getChildAt(0), modeName === selectedMode);
        });
    }

    _drawRadioBox(box, selected) {
        box.clear();
        box.rect(0, 0, 20, 20).fill({color: 0xffffff});
        if (selected) box.rect(4, 4, 12, 12).fill({color: 0x0000ff});
    }

    _buildTitle() {
        const title = new PIXI.Text({
            text: 'Snake Game',
            style: {fontFamily: 'Arial', fontSize: 32, fontWeight: 'bold', fill: GameConfig.COLORS.TEXT_ACCENT},
        });
        title.x = 20;
        title.y = 30;
        return title;
    }

    _createText(text, x, y, fontSize) {
        const t = new PIXI.Text({text, style: {fill: GameConfig.COLORS.TEXT_MAIN, fontSize}});
        t.x = x;
        t.y = y;
        return t;
    }

    _buildModeRadios(
        modes,
        onModeSelect,
    ) {
        const map = new Map();

        modes.forEach((modeName, index) => {
            const radio = new PIXI.Container();
            radio.x = 20;
            radio.y = 210 + index * 40;

            const box = new PIXI.Graphics();
            box.rect(0, 0, 20, 20).fill({color: 0xffffff});

            const label = new PIXI.Text({text: modeName, style: {fill: 0xffffff, fontSize: 18}});
            label.x = 30;
            label.y = -2;

            radio.addChild(box);
            radio.addChild(label);
            radio.eventMode = 'static';
            radio.cursor = 'pointer';
            radio.on('pointerdown', () => onModeSelect(modeName));

            this._container.addChild(radio);
            map.set(modeName, radio);
        });

        return map;
    }

    _buildButton(label, x, y, onClick) {
        const container = new PIXI.Container();
        container.x = x;
        container.y = y;

        container.addChild(
            new PIXI.Graphics()
                .rect(0, 0, 100, 50)
                .fill({color: 0x2c3e50})
                .stroke({width: 2, color: 0x000000}),
        );

        const text = new PIXI.Text({text: label, style: {fill: 0xffffff, fontSize: 20, fontWeight: 'bold'}});
        text.x = (100 - text.width) / 2;
        text.y = (50 - text.height) / 2;
        container.addChild(text);

        container.eventMode = 'static';
        container.cursor = 'pointer';
        container.on('pointerdown', onClick);

        return container;
    }
}
