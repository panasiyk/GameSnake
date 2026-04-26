import * as PIXI from 'pixi.js';
import {GameModeName, GameState, Position} from './types';
import {GameConfig} from './GameConfig';
import {ISnake, Snake} from './entities/Snake';
import {IGameMode, IModeContext} from './modes/IGameMode';
import {GameModeFactory} from './modes/GameModeFactory';
import {IInputService, InputService} from './services/InputService';
import {IScoreService, ScoreService} from './services/ScoreService';
import {ISpawnService, SpawnService} from './services/SpawnService';
import {CollisionService, ICollisionService} from './services/CollisionService';
import {FieldRenderer, IFieldRenderer} from './rendering/FieldRenderer';
import {ISidebarRenderer, SidebarRenderer} from './rendering/SidebarRenderer';

export class GameEngine {
    private _app: PIXI.Application | null = null;
    private _fieldRenderer: IFieldRenderer | null = null;
    private _sidebarRenderer: ISidebarRenderer | null = null;

    private _mode: IGameMode;
    private _state: GameState = GameState.MENU;
    private _foods: Position[] = [];
    private _walls: Position[] = [];
    private _tickRate: number;
    private _tickTimer = 0;
    private _isDestroyed = false;

    private constructor(
        private readonly _snake: ISnake,
        private readonly _input: IInputService,
        private readonly _score: IScoreService,
        private readonly _spawn: ISpawnService,
        private readonly _collision: ICollisionService,
    ) {
        this._mode = GameModeFactory.create(GameModeName.CLASSIC);
        this._tickRate = this._mode.getInitialTickRate();
    }

    static async create(parent: HTMLElement): Promise<GameEngine> {
        const engine = new GameEngine(
            new Snake(),
            new InputService(),
            new ScoreService(),
            new SpawnService(),
            new CollisionService(),
        );
        await engine._init(parent);
        return engine;
    }

    destroy(): void {
        this._isDestroyed = true;
        this._input.destroy();
        try {
            this._app?.destroy({removeView: true});
        } catch {
            // Ignore if PIXI was not fully initialized before destroy() was called
        }
    }

    private async _init(parent: HTMLElement): Promise<void> {
        const app = new PIXI.Application();
        await app.init({
            width: GameConfig.APP_WIDTH,
            height: GameConfig.APP_HEIGHT,
            backgroundColor: GameConfig.COLORS.BACKGROUND,
            antialias: true,
        });

        if (this._isDestroyed) {
            app.destroy({removeView: true});
            return;
        }

        this._app = app;
        parent.appendChild(app.canvas);

        this._fieldRenderer = new FieldRenderer(app);
        this._sidebarRenderer = new SidebarRenderer(app, GameModeFactory.getAll(), {
            onPlay: () => this._startGame(),
            onMenu: () => this._setState(GameState.PAUSED),
            onResume: () => this._setState(GameState.PLAYING),
            onExit: () => this._setState(GameState.MENU),
            onModeSelect: (mode) => this._setMode(mode),
        });

        this._input.onDirectionChange((dir) => {
            if (this._state === GameState.PLAYING) this._snake.setDirection(dir);
        });

        app.ticker.add((ticker) => this._update(ticker.deltaMS));
        this._setState(GameState.MENU);
    }

    private _startGame(): void {
        this._score.reset();
        this._walls = [];
        this._tickRate = this._mode.getInitialTickRate();
        this._tickTimer = 0;
        this._snake.reset();
        this._foods = this._spawn.spawnFood(this._mode.getFoodCount(), this._snake.body);
        this._setState(GameState.PLAYING);
    }

    private _setMode(modeName: GameModeName): void {
        if (this._state === GameState.PLAYING) return;
        this._mode = GameModeFactory.create(modeName);
        this._sidebarRenderer?.updateState(this._state, this._mode.name);
    }

    private _setState(state: GameState): void {
        this._state = state;
        if (state === GameState.MENU) this._score.reset();
        this._sidebarRenderer?.updateScore(this._score.score, this._score.bestScore);
        this._sidebarRenderer?.updateState(state, this._mode.name);
        this._render();
    }

    private _update(deltaMS: number): void {
        if (this._state !== GameState.PLAYING) return;

        this._tickTimer += deltaMS;
        if (this._tickTimer >= this._tickRate) {
            this._tickTimer = 0;
            this._tick();
        }

        this._render();
    }

    private _tick(): void {
        this._snake.applyDirection();
        const newHead = this._mode.calculateNextHead(this._snake.head, this._snake.direction);
        this._snake.moveHead(newHead);

        if (this._hasCollision()) {
            this._triggerGameOver();
            return;
        }

        const foodIndex = this._foods.findIndex(f => f.x === newHead.x && f.y === newHead.y);
        if (foodIndex !== -1) this._eatFood(foodIndex);
    }

    private _hasCollision(): boolean {
        const {head} = this._snake;

        if (this._mode.isBoundaryLethal() && this._collision.isOutOfBounds(head))
            return true;

        if (this._mode.isBodyCollisionLethal() && this._snake.collidesWithOwnBody())
            return true;

        if (this._collision.hitsCustomWall(head, this._walls))
            return true;

        return false;
    }

    private _eatFood(foodIndex: number): void {
        this._score.increment();
        this._sidebarRenderer?.updateScore(this._score.score, this._score.bestScore);
        this._snake.grow();

        this._mode.onFoodEaten(foodIndex, this._buildModeContext());

        this._foods = this._spawn.spawnFood(
            this._mode.getFoodCount(),
            [...this._snake.body, ...this._walls],
        );
    }

    private _triggerGameOver(): void {
        this._setState(GameState.GAME_OVER);
        setTimeout(() => {
            if (!this._isDestroyed) this._setState(GameState.MENU);
        }, GameConfig.GAME_OVER_DELAY_MS);
    }

    private _buildModeContext(): IModeContext {
        return {
            foods: this._foods,
            currentTickRate: this._tickRate,
            addWall: () => {
                const wall = this._spawn.spawnWall([...this._snake.body, ...this._foods, ...this._walls]);
                if (wall) this._walls = [...this._walls, wall];
            },
            setTickRate: (rate) => {
                this._tickRate = rate;
            },
            teleportSnakeHead: (to) => {
                this._snake.teleportHead(to);
            },
        };
    }

    private _render(): void {
        this._fieldRenderer?.render({
            snakeBody: this._snake.body,
            foods: this._foods,
            walls: this._walls,
            modeName: this._mode.name,
            state: this._state,
        });
    }
}
