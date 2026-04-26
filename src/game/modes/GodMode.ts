import {GameModeName, Position, Vector2} from '../types';
import {GameConfig} from '../GameConfig';
import {IGameMode, IModeContext} from './IGameMode';

export class GodMode implements IGameMode {
    readonly name = GameModeName.GOD_MODE;

    getInitialTickRate(): number {
        return GameConfig.INITIAL_TICK_RATE;
    }

    calculateNextHead(head: Position, direction: Vector2): Position {
        const wrap = (v: number) =>
            ((v % GameConfig.GRID_SIZE) + GameConfig.GRID_SIZE) % GameConfig.GRID_SIZE;
        return {x: wrap(head.x + direction.x), y: wrap(head.y + direction.y)};
    }

    isBoundaryLethal(): boolean {
        return false;
    }

    isBodyCollisionLethal(): boolean {
        return false;
    }

    getFoodCount(): number {
        return 1;
    }

    onFoodEaten(_foodIndex: number, _context: IModeContext): void {
    }
}
