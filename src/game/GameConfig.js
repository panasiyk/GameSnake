export class GameConfig {
    static GRID_SIZE = 20;
    static CELL_SIZE = 30;
    static FIELD_SIZE = GameConfig.GRID_SIZE * GameConfig.CELL_SIZE;
    static SIDEBAR_WIDTH = 300;
    static APP_WIDTH = GameConfig.FIELD_SIZE + GameConfig.SIDEBAR_WIDTH + 40;
    static APP_HEIGHT = GameConfig.FIELD_SIZE + 40;
    static INITIAL_TICK_RATE = 150;
    static MIN_TICK_RATE = 50;
    static GAME_OVER_DELAY_MS = 2000;
    static SCORE_STORAGE_KEY = 'snake_best_score';

    static COLORS = {
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
    };
}
