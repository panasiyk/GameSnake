import { GameModeName, Position, Vector2 } from '../types';


export interface IModeContext {
  readonly foods: ReadonlyArray<Position>;
  readonly currentTickRate: number;
  addWall(): void;
  setTickRate(rate: number): void;
  teleportSnakeHead(to: Position): void;
}


export interface IGameMode {
  readonly name: GameModeName;
  getInitialTickRate(): number;
  calculateNextHead(head: Position, direction: Vector2): Position;
  isBoundaryLethal(): boolean;
  isBodyCollisionLethal(): boolean;
  getFoodCount(): number;
  onFoodEaten(foodIndex: number, context: IModeContext): void;
}
