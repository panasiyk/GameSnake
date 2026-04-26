export class GameConfig {
    static readonly GRID_SIZE = 20;
    static readonly CELL_SIZE = 30;
    static readonly FIELD_SIZE = GameConfig.GRID_SIZE * GameConfig.CELL_SIZE;
    static readonly SIDEBAR_WIDTH = 300;
    static readonly APP_WIDTH = GameConfig.FIELD_SIZE + GameConfig.SIDEBAR_WIDTH + 40;
    static readonly APP_HEIGHT = GameConfig.FIELD_SIZE + 40;
    static readonly INITIAL_TICK_RATE = 150;
    static readonly MIN_TICK_RATE = 50;
    static readonly GAME_OVER_DELAY_MS = 2000;
    static readonly SCORE_STORAGE_KEY = 'snake_best_score';

    static readonly COLORS = {
        BACKGROUND: 0x2c2c2c,
        FIELD: 0x4a4a4a,
        BORDER: 0x8b5a2b,
        SNAKE_HEAD: 0xffffff,
        SNAKE_BODY: 0xaaaaaa,
        FOOD_CLASSIC: 0x2e8b57,
        FOOD_PORTAL: 0xffd700,
        WALL: 0x8b0000,
        SIDEBAR: 0x008080,
        TEXT_MAIN: 0xffffff,
        TEXT_ACCENT: 0x90ee90,
    } as const;
}
