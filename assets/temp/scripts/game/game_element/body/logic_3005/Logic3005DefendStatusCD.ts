import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementTxt from "../../common/GameElementTxt";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3005 from "./Logic3005";
import Logic3005DefendStatus from "./Logic3005DefendStatus";

const APP = `Logic3005DefendStatusCD`;

/**
 * 防御状态机 - CD
 */
export default class Logic3005DefendStatusCD extends Logic3005DefendStatus {
    
    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<Logic3005DefendStatusCD>({
        instantiate: () => {
            return new Logic3005DefendStatusCD();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3005) {
        let val = UtilObjPool.Pop (Logic3005DefendStatusCD._t, apply);
        val.relMachine = machine;
        return val;
    }

    cd: number = 0;

    public OnEnter(): void {
        this.cd = this.relMachine.args.defendCD;
    }

    public OnTimeStep(ms: number): void {
        this.cd -= ms;
        // 冷却完毕的话，回到防御状态
        if (this.cd <= 0) {
            this.relMachine.HMEnterStatus (this.relMachine.hmStatusOrdinary);
            return;
        };
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        this.cd = this.relMachine.args.defendCD;
        this.relMachine.amCurrStatus.OnDmg(ctx);
        GameElementTxt.PopForDmg(
            APP,
            ctx,
            this.relMachine.relBody.relState
        );
        VoiceOggViewState.inst.VoiceSet (this.relMachine.args.hurtedOgg);
        this.relMachine.relBody.commonHpCurrent -= ctx.dmg;
        this.relMachine.relBody.commonHpCurrent = Math.max(0, this.relMachine.relBody.commonHpCurrent);
        if (this.relMachine.relBody.commonHpCurrent != 0) {
            return;
        };
        this.relMachine.relBody.relState.RemEle(this.relMachine.relBody);
    }
}