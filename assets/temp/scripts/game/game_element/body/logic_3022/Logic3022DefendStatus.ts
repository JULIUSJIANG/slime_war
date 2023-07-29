import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3022 from "./Logic3022";

/**
 * 防御状态机
 */
export default abstract class Logic3022DefendStatus {
    /**
     * 归属的状态机
     */
    public relMachine: Logic3022;

    public OnEnter () {

    }

    public OnExit () {
        
    }

    public OnDmg (ctx: GameElementBodyCtxDmg): void {

    }

    public OnTimeStep (ms: number) {

    }
}