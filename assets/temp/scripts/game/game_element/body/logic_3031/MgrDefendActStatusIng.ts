import utilMath from "../../../../frame/basic/UtilMath";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import MgrSdk from "../../../../frame/sdk/MgrSdk";
import gameCommon from "../../../GameCommon";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementEff from "../../common/GameElementEff";
import DefineVoice from "../DefineVoice";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import MgrDefendAct from "./MgrDefendAct";
import MgrDefendActStatus from "./MgrDefendActStatus";
import MgrDefendCDStatus from "./MgrDefendCDStatus";

const APP = `MgrDefendActStatusIng`;

/**
 * 防御执行 - 状态 - 防御中
 */
export default class MgrDefendActStatusIng extends MgrDefendActStatus {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType <MgrDefendActStatusIng> ({
        instantiate: () => {
            return new MgrDefendActStatusIng ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrDefendAct) {
        let val = UtilObjPool.Pop (MgrDefendActStatusIng._t, apply);
        val.relMachine = machine;
        return val;
    }

    /**
     * 总累计时间
     */
    enteredMS: number = 0;

    OnEnter(): void {
        this.enteredMS = 0;
        VoiceOggViewState.inst.VoiceSet (DefineVoice.DEFENDING);
        this.relMachine.relMBPlayer.animKeepDefend.currStatus.OnFadeIn ();
    }

    OnExit(): void {
        this.relMachine.relMBPlayer.animKeepDefend.currStatus.OnFadeOut ();
    }

    OnStep(ms: number): void {
        this.enteredMS += ms;
        // 受伤后无敌一秒
        if (gameCommon.DEFEND_KEEP <= this.enteredMS) {
            this.relMachine.Enter(this.relMachine.statusOrdinary);
        };

        // 有接触到敌对单位，且接触合理的话，切换形态
        for (let i = 0; i < this.relMachine.relMBPlayer.relBody.listConcatedBodyEnemy.length; i++) {
            let concat = this.relMachine.relMBPlayer.relBody.listConcatedBodyEnemy [i];
            if (this.relMachine.CheckConcatValid (concat)) {
                this.relMachine.Enter (this.relMachine.statusSuccessed);
                VoiceOggViewState.inst.VoiceSet (DefineVoice.DEFENDED);
                break;
            };
        };
    }

    OnDefend(): void {
        // 重进防御状态
        this.relMachine.Enter (this.relMachine.statusIng);
    }
}