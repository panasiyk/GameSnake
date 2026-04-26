import {GameModeName, Position, Vector2} from '../types';
import {GameConfig} from '../GameConfig';
import {IGameMode, IModeContext} from './IGameMode';

export class PortalMode implements IGameMode {
    readonly name = GameModeName.PORTAL;

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
        return 2;
    }

    onFoodEaten(foodIndex: number, context: IModeContext): void {
        const otherIndex = foodIndex === 0 ? 1 : 0;
        const destination = context.foods[otherIndex];
        if (destination) context.teleportSnakeHead(destination);
    }
}
