import {GameModeName} from '../types';
import {IGameMode} from './IGameMode';
import {ClassicMode} from './ClassicMode';
import {GodMode} from './GodMode';
import {WallsMode} from './WallsMode';
import {PortalMode} from './PortalMode';
import {SpeedMode} from './SpeedMode';

type ModeConstructor = new () => IGameMode;

export class GameModeFactory {
    private static readonly _registry = new Map<GameModeName, ModeConstructor>([
        [GameModeName.CLASSIC, ClassicMode],
        [GameModeName.GOD_MODE, GodMode],
        [GameModeName.WALLS, WallsMode],
        [GameModeName.PORTAL, PortalMode],
        [GameModeName.SPEED, SpeedMode],
    ]);

    static register(name: GameModeName, ctor: ModeConstructor): void {
        this._registry.set(name, ctor);
    }

    static create(name: GameModeName): IGameMode {
        const Ctor = this._registry.get(name);
        if (!Ctor) throw new Error(`Unknown game mode: ${name}`);
        return new Ctor();
    }

    static getAll(): GameModeName[] {
        return Array.from(this._registry.keys());
    }
}
