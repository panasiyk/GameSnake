export interface Position {
  readonly x: number;
  readonly y: number;
}

export interface Vector2 {
  readonly x: number;
  readonly y: number;
}

export enum GameModeName {
  CLASSIC = 'Classic',
  GOD_MODE = 'God mode',
  WALLS = 'Walls',
  PORTAL = 'Portal',
  SPEED = 'Speed',
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
}
