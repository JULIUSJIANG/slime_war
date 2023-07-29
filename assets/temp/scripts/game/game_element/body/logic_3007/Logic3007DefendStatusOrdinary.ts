import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GameDisplayTxt from "../../../display/GameDisplayTxt";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementTxt from "../../common/GameElementTxt";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3007 from "./Logic3007";
import Logic3007DefendStatus from "./Logic3007DefendStatus";

const APP = `Logic3007DefendStatusOrdinary`;

/**
 * 防御状态机 - 常态
 */
export default class Logic3007DefendStatusOrdinary extends Logic3007DefendStatus {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<Logic3007DefendStatusOrdinary>({
        instantiate: () => {
            return new Logic3007DefendStatusOrdinary();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3007) {
        let val = UtilObjPool.Pop (Logic3007DefendStatusOrdinary._t, apply);
        val.relMachine = machine;
        return val;
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
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
            this.relMachine.HMEnterStatus (this.relMachine.hmStatusCD);
            return;
        };
        this.relMachine.relBody.relState.RemEle(this.relMachine.relBody);
    }
}