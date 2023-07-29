import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GameDisplayTxt from "../../../display/GameDisplayTxt";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementTxt from "../../common/GameElementTxt";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3005 from "./Logic3005";
import Logic3005DefendStatus from "./Logic3005DefendStatus";

const APP = `Logic3005DefendStatusOrdinary`;

/**
 * 防御状态机 - 常态
 */
export default class Logic3005DefendStatusOrdinary extends Logic3005DefendStatus {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<Logic3005DefendStatusOrdinary>({
        instantiate: () => {
            return new Logic3005DefendStatusOrdinary();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3005) {
        let val = UtilObjPool.Pop (Logic3005DefendStatusOrdinary._t, apply);
        val.relMachine = machine;
        return val;
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        this.relMachine.amCurrStatus.OnDmg(ctx);
        GameElementTxt.PopForTips (
            APP,
            `显形`,
            ctx.posX,
            ctx.posY,
            this.relMachine.relBody
        );
        VoiceOggViewState.inst.VoiceSet (this.relMachine.args.hurtedOgg);
        this.relMachine.HMEnterStatus (this.relMachine.hmStatusCD);
    }
}