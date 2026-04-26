import * as PIXI from 'pixi.js';
import { Position, GameModeName, GameState } from '../types';
import { GameConfig } from '../GameConfig';

export interface FieldRenderData {
  readonly snakeBody: ReadonlyArray<Position>;
  readonly foods: ReadonlyArray<Position>;
  readonly walls: ReadonlyArray<Position>;
  readonly modeName: GameModeName;
  readonly state: GameState;
}

export interface IFieldRenderer {
  render(data: FieldRenderData): void;
}

export class FieldRenderer implements IFieldRenderer {
  private readonly _container: PIXI.Container;
  private readonly _snakeGraphics: PIXI.Graphics;
  private readonly _foodGraphics: PIXI.Graphics;
  private readonly _wallGraphics: PIXI.Graphics;
  private readonly _gameOverText: PIXI.Text;

  constructor(app: PIXI.Application) {
    this._container = new PIXI.Container();
    this._container.x = 20;
    this._container.y = 20;

    this._container.addChild(this._buildBorder());
    this._container.addChild(this._buildFieldBackground());
    this._container.addChild(this._buildGrid());

    this._wallGraphics = new PIXI.Graphics();
    this._foodGraphics = new PIXI.Graphics();
    this._snakeGraphics = new PIXI.Graphics();
    this._container.addChild(this._wallGraphics);
    this._container.addChild(this._foodGraphics);
    this._container.addChild(this._snakeGraphics);

    this._gameOverText = this._buildGameOverText();
    this._container.addChild(this._gameOverText);

    app.stage.addChild(this._container);
  }

  render(data: FieldRenderData): void {
    this._renderWalls(data.walls);
    this._renderFood(data.foods, data.modeName);
    this._renderSnake(data.snakeBody, data.state);
    this._gameOverText.visible = data.state === GameState.GAME_OVER;
  }

  private _renderSnake(body: ReadonlyArray<Position>, state: GameState): void {
    this._snakeGraphics.clear();
    this._snakeGraphics.alpha = state === GameState.GAME_OVER ? 0.5 : 1;
    body.forEach((pos, i) => {
      this._snakeGraphics
        .rect(pos.x * GameConfig.CELL_SIZE, pos.y * GameConfig.CELL_SIZE, GameConfig.CELL_SIZE, GameConfig.CELL_SIZE)
        .fill({ color: i === 0 ? GameConfig.COLORS.SNAKE_HEAD : GameConfig.COLORS.SNAKE_BODY })
        .stroke({ width: 1, color: 0x000000 });
    });
  }

  private _renderFood(foods: ReadonlyArray<Position>, modeName: GameModeName): void {
    this._foodGraphics.clear();
    const color = modeName === GameModeName.PORTAL
      ? GameConfig.COLORS.FOOD_PORTAL
      : GameConfig.COLORS.FOOD_CLASSIC;
    foods.forEach(pos => {
      this._foodGraphics
        .rect(pos.x * GameConfig.CELL_SIZE, pos.y * GameConfig.CELL_SIZE, GameConfig.CELL_SIZE, GameConfig.CELL_SIZE)
        .fill({ color })
        .stroke({ width: 1, color: 0x000000 });
    });
  }

  private _renderWalls(walls: ReadonlyArray<Position>): void {
    this._wallGraphics.clear();
    walls.forEach(pos => {
      this._wallGraphics
        .rect(pos.x * GameConfig.CELL_SIZE, pos.y * GameConfig.CELL_SIZE, GameConfig.CELL_SIZE, GameConfig.CELL_SIZE)
        .fill({ color: GameConfig.COLORS.WALL })
        .stroke({ width: 1, color: 0x000000 });
    });
  }

  private _buildBorder(): PIXI.Graphics {
    return new PIXI.Graphics()
      .rect(-2, -2, GameConfig.FIELD_SIZE + 4, GameConfig.FIELD_SIZE + 4)
      .fill({ color: GameConfig.COLORS.BORDER });
  }

  private _buildFieldBackground(): PIXI.Graphics {
    return new PIXI.Graphics()
      .rect(0, 0, GameConfig.FIELD_SIZE, GameConfig.FIELD_SIZE)
      .fill({ color: GameConfig.COLORS.FIELD });
  }

  private _buildGrid(): PIXI.Graphics {
    const grid = new PIXI.Graphics();
    grid.alpha = 0.1;
    for (let i = 0; i <= GameConfig.GRID_SIZE; i++) {
      grid
        .moveTo(i * GameConfig.CELL_SIZE, 0)
        .lineTo(i * GameConfig.CELL_SIZE, GameConfig.FIELD_SIZE)
        .stroke({ width: 1, color: 0x000000 });
      grid
        .moveTo(0, i * GameConfig.CELL_SIZE)
        .lineTo(GameConfig.FIELD_SIZE, i * GameConfig.CELL_SIZE)
        .stroke({ width: 1, color: 0x000000 });
    }
    return grid;
  }

  private _buildGameOverText(): PIXI.Text {
    const text = new PIXI.Text({
      text: 'GAME OVER',
      style: {
        fontFamily: 'Arial',
        fontSize: 64,
        fontWeight: 'bold',
        fill: 0xff0000,
        stroke: { color: 0x000000, width: 4 },
      },
    });
    text.x = GameConfig.FIELD_SIZE / 2 - text.width / 2;
    text.y = GameConfig.FIELD_SIZE / 2 - text.height / 2;
    text.visible = false;
    return text;
  }
}
