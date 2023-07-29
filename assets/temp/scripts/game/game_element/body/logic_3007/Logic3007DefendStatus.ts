import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3007 from "./Logic3007";

/**
 * 防御状态机
 */
export default abstract class Logic3007DefendStatus {
    /**
     * 归属的状态机
     */
    public relMachine: Logic3007;

    public OnEnter () {

    }

    public OnExit () {
        
    }

    public OnDmg (ctx: GameElementBodyCtxDmg): void {

    }

    public OnTimeStep (ms: number) {

    }
}