import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3017 from "./Logic3017";
import Logic3017DefendStatus from "./Logic3017DefendStatus";

const APP = `Logic3017DefendStatusOrdinary`;

/**
 * 防御状态机 - 常态
 */
export default class Logic3017DefendStatusOrdinary extends Logic3017DefendStatus {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<Logic3017DefendStatusOrdinary>({
        instantiate: () => {
            return new Logic3017DefendStatusOrdinary();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3017) {
        let val = UtilObjPool.Pop (Logic3017DefendStatusOrdinary._t, apply);
        val.relMachine = machine;
        return val;
    }

    enteredMS: number = 0;

    public OnEnter(): void {
        this.enteredMS = 0;
        this.relMachine.relBody.commonShield += this.relMachine.relBody.commonArgsPower * this.relMachine.args.shieldCount;
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        this.relMachine.HMEnterStatus(this.relMachine.hmStatusCD);
    }

    public OnTimeStep(ms: number): void {
        this.enteredMS += ms;
    }
}