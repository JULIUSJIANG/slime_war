import utilMath from "../../../../frame/basic/UtilMath";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import gameCommon from "../../../GameCommon";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import MgrDefendCD from "./MgrDefendCD";
import MgrDefendCDStatus from "./MgrDefendCDStatus";

const APP = `MgrDefendCDStatusReady`;

/**
 * 防御管理 - 状态 - 已就绪
 */
export default class MgrDefendCDStatusReady extends MgrDefendCDStatus {
    
    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType <MgrDefendCDStatusReady>({
        instantiate: () => {
            return new MgrDefendCDStatusReady ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrDefendCD) {
        let val = UtilObjPool.Pop (MgrDefendCDStatusReady._t, apply);
        val.relMachine = machine;
        return val;
    }

    /**
     * 当前的变化方向
     */
    dir = -1;

    OnStep(ms: number): void {
        this.relMachine.opacitySkill += ms / gameCommon.BTN_SKILL_OPACITY_TRANSITION_COST * 255 * this.dir;
        // 到达边界后方向改变
        if (this.relMachine.opacitySkill < 0 || 255 < this.relMachine.opacitySkill) {
            this.dir *= -1;
        };
        this.relMachine.opacitySkill = utilMath.Clamp (this.relMachine.opacitySkill, 0, 255);
    }

    OnEnter(): void {
        this.relMachine.relMBPlayer.animFlashReady.currStatus.OnFlash ();
        this.relMachine.relMBPlayer.animShieldReady.currStatus.OnFadeIn ();
    }

    OnExit(): void {
        this.relMachine.relMBPlayer.animShieldReady.currStatus.OnFadeOut ();
    }

    OnDefend(): void {
        this.relMachine.Enter (this.relMachine.statusTimeCount);
        this.relMachine.relMBPlayer.playerMgrDefendAct.currStatus.OnDefend ();
    }
}