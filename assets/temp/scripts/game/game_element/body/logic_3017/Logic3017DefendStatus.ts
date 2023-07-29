import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3017 from "./Logic3017";

/**
 * 防御状态机
 */
export default abstract class Logic3017DefendStatus {
    /**
     * 归属的状态机
     */
    public relMachine: Logic3017;

    public OnEnter () {

    }

    public OnExit () {
        
    }

    public OnDmg (ctx: GameElementBodyCtxDmg): void {

    }

    public OnTimeStep (ms: number) {

    }
}