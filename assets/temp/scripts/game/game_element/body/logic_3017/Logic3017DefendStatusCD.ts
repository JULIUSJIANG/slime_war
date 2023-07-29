import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3017 from "./Logic3017";
import Logic3017DefendStatus from "./Logic3017DefendStatus";

const APP = `Logic3017DefendStatusCD`;

/**
 * 防御状态机 - CD
 */
export default class Logic3017DefendStatusCD extends Logic3017DefendStatus {
    
    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<Logic3017DefendStatusCD>({
        instantiate: () => {
            return new Logic3017DefendStatusCD();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3017) {
        let val = UtilObjPool.Pop (Logic3017DefendStatusCD._t, apply);
        val.relMachine = machine;
        return val;
    }

    cd: number = 0;

    enteredMS: number = 0;

    public OnEnter(): void {
        this.relMachine.relBody.commonCD.Enter (this.relMachine.relBody.commonCD.statusIng);
        this.enteredMS = 0;
        this.cd = this.relMachine.args.defendCD;
    }

    public OnTimeStep(ms: number): void {
        this.enteredMS += ms;
        this.cd -= ms;
        // 冷却完毕的话，回到防御状态
        if (this.cd <= 0) {
            this.relMachine.HMEnterStatus (this.relMachine.hmStatusOrdinary);
            return;
        };
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        this.relMachine.relBody.commonCD.Enter (this.relMachine.relBody.commonCD.statusIng);
        this.cd = this.relMachine.args.defendCD;
    }
}