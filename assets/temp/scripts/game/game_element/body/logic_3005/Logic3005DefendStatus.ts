import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3005 from "./Logic3005";

/**
 * 防御状态机
 */
export default abstract class Logic3005DefendStatus {
    /**
     * 归属的状态机
     */
    public relMachine: Logic3005;

    public OnEnter () {

    }

    public OnExit () {
        
    }

    public OnDmg (ctx: GameElementBodyCtxDmg): void {

    }

    public OnTimeStep (ms: number) {

    }
}