import {Position} from '../types';
import {GameConfig} from '../GameConfig';

export interface ISpawnService {
    spawnFood(count: number, occupied: ReadonlyArray<Position>): Position[];
    spawnWall(occupied: ReadonlyArray<Position>): Position | null;
}

export class SpawnService implements ISpawnService {
    spawnFood(count: number, occupied: ReadonlyArray<Position>): Position[] {
        const available = this._getAvailablePositions(occupied);
        return this._sampleN(available, Math.min(count, available.length));
    }

    spawnWall(occupied: ReadonlyArray<Position>): Position | null {
        const available = this._getAvailablePositions(occupied);
        if (available.length === 0) return null;
        return available[Math.floor(Math.random() * available.length)];
    }

    private _getAvailablePositions(occupied: ReadonlyArray<Position>): Position[] {
        const result: Position[] = [];
        for (let x = 0; x < GameConfig.GRID_SIZE; x++) {
            for (let y = 0; y < GameConfig.GRID_SIZE; y++) {
                if (!occupied.some(p => p.x === x && p.y === y))
                    result.push({x, y});
            }
        }
        return result;
    }

    private _sampleN(positions: Position[], n: number): Position[] {
        const copy = [...positions];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy.slice(0, n);
    }
}
