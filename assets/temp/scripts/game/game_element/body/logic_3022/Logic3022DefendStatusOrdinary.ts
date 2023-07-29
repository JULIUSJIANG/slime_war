import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GameDisplayTxt from "../../../display/GameDisplayTxt";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementTxt from "../../common/GameElementTxt";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3022 from "./Logic3022";
import Logic3022DefendStatus from "./Logic3022DefendStatus";

const APP = `Logic3022DefendStatusOrdinary`;

/**
 * 防御状态机 - 常态
 */
export default class Logic3022DefendStatusOrdinary extends Logic3022DefendStatus {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<Logic3022DefendStatusOrdinary>({
        instantiate: () => {
            return new Logic3022DefendStatusOrdinary();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3022) {
        let val = UtilObjPool.Pop (Logic3022DefendStatusOrdinary._t, apply);
        val.relMachine = machine;
        return val;
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        this.relMachine.HMEnterStatus (this.relMachine.hmStatusCD);
    }
}