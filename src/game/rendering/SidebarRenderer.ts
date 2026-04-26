import * as PIXI from 'pixi.js';
import {GameModeName, GameState} from '../types';
import {GameConfig} from '../GameConfig';

export interface ISidebarRenderer {
    updateScore(score: number, bestScore: number): void;
    updateState(state: GameState, selectedMode: GameModeName): void;
}

export interface SidebarCallbacks {
    readonly onPlay: () => void;
    readonly onMenu: () => void;
    readonly onResume: () => void;
    readonly onExit: () => void;
    readonly onModeSelect: (mode: GameModeName) => void;
}

export class SidebarRenderer implements ISidebarRenderer {
    private readonly _container: PIXI.Container;
    private readonly _scoreText: PIXI.Text;
    private readonly _bestScoreText: PIXI.Text;
    private readonly _playButton: PIXI.Container;
    private readonly _menuButton: PIXI.Container;
    private readonly _resumeButton: PIXI.Container;
    private readonly _exitButton: PIXI.Container;
    private readonly _modeRadios: Map<GameModeName, PIXI.Container>;

    constructor(
        app: PIXI.Application,
        modes: ReadonlyArray<GameModeName>,
        callbacks: SidebarCallbacks,
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

    updateScore(score: number, bestScore: number): void {
        this._scoreText.text = `Score: ${score}`;
        this._bestScoreText.text = `Best Score: ${bestScore}`;
    }

    updateState(state: GameState, selectedMode: GameModeName): void {
        this._playButton.visible = state === GameState.MENU;
        this._menuButton.visible = state === GameState.PLAYING;
        this._resumeButton.visible = state === GameState.PAUSED;
        this._exitButton.visible = state === GameState.PAUSED;

        this._modeRadios.forEach((radio, modeName) => {
            radio.visible = state === GameState.MENU;
            this._drawRadioBox(radio.getChildAt(0) as PIXI.Graphics, modeName === selectedMode);
        });
    }

    private _drawRadioBox(box: PIXI.Graphics, selected: boolean): void {
        box.clear();
        box.rect(0, 0, 20, 20).fill({color: 0xffffff});
        if (selected) box.rect(4, 4, 12, 12).fill({color: 0x0000ff});
    }

    private _buildTitle(): PIXI.Text {
        const title = new PIXI.Text({
            text: 'Snake Game',
            style: {fontFamily: 'Arial', fontSize: 32, fontWeight: 'bold', fill: GameConfig.COLORS.TEXT_ACCENT},
        });
        title.x = 20;
        title.y = 30;
        return title;
    }

    private _createText(text: string, x: number, y: number, fontSize: number): PIXI.Text {
        const t = new PIXI.Text({text, style: {fill: GameConfig.COLORS.TEXT_MAIN, fontSize}});
        t.x = x;
        t.y = y;
        return t;
    }

    private _buildModeRadios(
        modes: ReadonlyArray<GameModeName>,
        onModeSelect: (mode: GameModeName) => void,
    ): Map<GameModeName, PIXI.Container> {
        const map = new Map<GameModeName, PIXI.Container>();

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

    private _buildButton(label: string, x: number, y: number, onClick: () => void): PIXI.Container {
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
