import * as PIXI from 'pixi.js';
import {GameModeName, GameState} from './types';
import {GameConfig} from './GameConfig';
import {Snake} from './entities/Snake';
import {GameModeFactory} from './modes/GameModeFactory';
import {InputService} from './services/InputService';
import {ScoreService} from './services/ScoreService';
import {SpawnService} from './services/SpawnService';
import {CollisionService} from './services/CollisionService';
import {FieldRenderer} from './rendering/FieldRenderer';
import {SidebarRenderer} from './rendering/SidebarRenderer';

export class GameEngine {
    constructor(
        _snake,
        _input,
        _score,
        _spawn,
        _collision,
    ) {
        this._snake = _snake;
        this._input = _input;
        this._score = _score;
        this._spawn = _spawn;
        this._collision = _collision;

        this._app = null;
        this._fieldRenderer = null;
        this._sidebarRenderer = null;

        this._mode = GameModeFactory.create(GameModeName.CLASSIC);
        this._state = GameState.MENU;
        this._foods = [];
        this._walls = [];
        this._tickRate = this._mode.getInitialTickRate();
        this._tickTimer = 0;
        this._isDestroyed = false;
    }

    static async create(parent) {
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

    destroy() {
        this._isDestroyed = true;
        this._input.destroy();
        try {
            this._app?.destroy({removeView: true});
        } catch {
            // Ignore if PIXI was not fully initialized before destroy() was called
        }
    }

    async _init(parent) {
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

    _startGame() {
        this._score.reset();
        this._walls = [];
        this._tickRate = this._mode.getInitialTickRate();
        this._tickTimer = 0;
        this._snake.reset();
        this._foods = this._spawn.spawnFood(this._mode.getFoodCount(), this._snake.body);
        this._setState(GameState.PLAYING);
    }

    _setMode(modeName) {
        if (this._state === GameState.PLAYING) return;
        this._mode = GameModeFactory.create(modeName);
        this._sidebarRenderer?.updateState(this._state, this._mode.name);
    }

    _setState(state) {
        this._state = state;
        if (state === GameState.MENU) this._score.reset();
        this._sidebarRenderer?.updateScore(this._score.score, this._score.bestScore);
        this._sidebarRenderer?.updateState(state, this._mode.name);
        this._render();
    }

    _update(deltaMS) {
        if (this._state !== GameState.PLAYING) return;

        this._tickTimer += deltaMS;
        if (this._tickTimer >= this._tickRate) {
            this._tickTimer = 0;
            this._tick();
        }

        this._render();
    }

    _tick() {
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

    _hasCollision() {
        const {head} = this._snake;

        if (this._mode.isBoundaryLethal() && this._collision.isOutOfBounds(head))
            return true;

        if (this._mode.isBodyCollisionLethal() && this._snake.collidesWithOwnBody())
            return true;

        if (this._collision.hitsCustomWall(head, this._walls))
            return true;

        return false;
    }

    _eatFood(foodIndex) {
        this._score.increment();
        this._sidebarRenderer?.updateScore(this._score.score, this._score.bestScore);
        this._snake.grow();

        this._mode.onFoodEaten(foodIndex, this._buildModeContext());

        this._foods = this._spawn.spawnFood(
            this._mode.getFoodCount(),
            [...this._snake.body, ...this._walls],
        );
    }

    _triggerGameOver() {
        this._setState(GameState.GAME_OVER);
        setTimeout(() => {
            if (!this._isDestroyed) this._setState(GameState.MENU);
        }, GameConfig.GAME_OVER_DELAY_MS);
    }

    _buildModeContext() {
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

    _render() {
        this._fieldRenderer?.render({
            snakeBody: this._snake.body,
            foods: this._foods,
            walls: this._walls,
            modeName: this._mode.name,
            state: this._state,
        });
    }
}
