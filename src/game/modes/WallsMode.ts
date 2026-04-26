import {GameModeName, Position, Vector2} from '../types';
import {GameConfig} from '../GameConfig';
import {IGameMode, IModeContext} from './IGameMode';

export class WallsMode implements IGameMode {
    readonly name = GameModeName.WALLS;

    getInitialTickRate(): number {
        return GameConfig.INITIAL_TICK_RATE;
    }

    calculateNextHead(head: Position, direction: Vector2): Position {
        return {x: head.x + direction.x, y: head.y + direction.y};
    }

    isBoundaryLethal(): boolean {
        return true;
    }

    isBodyCollisionLethal(): boolean {
        return true;
    }

    getFoodCount(): number {
        return 1;
    }

    onFoodEaten(_foodIndex: number, context: IModeContext): void {
        context.addWall();
    }
}
