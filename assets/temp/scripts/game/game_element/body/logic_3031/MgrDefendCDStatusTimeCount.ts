import utilMath from "../../../../frame/basic/UtilMath";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import gameCommon from "../../../GameCommon";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import MgrDefendCD from "./MgrDefendCD";
import MgrDefendCDStatus from "./MgrDefendCDStatus";

const APP = `MgrDefendCDStatusTimeCount`;

/**
 * 防御管理 - 状态 - 冷却中
 */
export default class MgrDefendCDStatusTimeCount extends MgrDefendCDStatus {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType <MgrDefendCDStatusTimeCount>({
        instantiate: () => {
            return new MgrDefendCDStatusTimeCount ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrDefendCD) {
        let val = UtilObjPool.Pop (MgrDefendCDStatusTimeCount._t, apply);
        val.relMachine = machine;
        return val;
    }

    msWait: number = 0;

    OnEnter(): void {
        this.msWait = 0;
    }

    OnStep(ms: number): void {
        this.msWait += ms;
        this.msWait = Math.min (this.msWait, gameCommon.CD_DEFEND);
        if (this.msWait == gameCommon.CD_DEFEND) {
            this.relMachine.Enter (this.relMachine.statusReady);
        };
        this.relMachine.opacitySkill += ms / gameCommon.BTN_SKILL_OPACITY_TRANSITION_COST * 255;
        this.relMachine.opacitySkill = utilMath.Clamp (this.relMachine.opacitySkill, 0, 255);
    }

    OnDefend(): void {
        VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
    }
}