import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import gameCommon from "../../../GameCommon";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementEff from "../../common/GameElementEff";
import GameElementTxt from "../../common/GameElementTxt";
import DefineVoice from "../DefineVoice";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import MgrHealthMachine from "./MgrHealthMachine";
import MgrHealthMachineStatus from "./MgrHealthMachineStatus";

const APP = `MgrHealthMachineStatusOrdinary`;

/**
 * npc 生命管理 - 状态机 - 状态 - 未受伤
 */
export default class MgrHealthMachineStatusOrdinary extends MgrHealthMachineStatus {
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MgrHealthMachineStatusOrdinary>({
        instantiate: () => {
            return new MgrHealthMachineStatusOrdinary();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMachine: MgrHealthMachine) {
        let val = UtilObjPool.Pop(MgrHealthMachineStatusOrdinary._t, apply);
        val.relMachine = relMachine;
        return val;
    }

    OnDmg (ctxDmg: GameElementBodyCtxDmg): void {
        this.relMachine.relMgrHealth.relNpc.relBody.commonHpCurrent -= 1;
        this.relMachine.relMgrHealth.relNpc.relBody.commonHpCurrent = Math.max(0, this.relMachine.relMgrHealth.relNpc.relBody.commonHpCurrent);
        this.relMachine.relMgrHealth.relNpc.animDmgedFlash.currStatus.OnFlash ();
        
        if (this.relMachine.relMgrHealth.relNpc.relBody.commonHpCurrent == 0) {
            this.relMachine.relMgrHealth.relNpc.playerMgrAction.currStatus.OnDeath();
            this.relMachine.Enter(this.relMachine.statusDeath);
        }
        else {
            this.relMachine.Enter(this.relMachine.statusHurted);
            if (gameCommon.FORWARD_WHILE_SUFFERED_DMG) {
                this.relMachine.relMgrHealth.relNpc.playerMgrAction.currStatus.OnForwardPress ();
            };
        };

        if (this.relMachine.currStatus == this.relMachine.statusDeath) {
            VoiceOggViewState.inst.VoiceSet (DefineVoice.FAIL_1);
        }
        else {
            VoiceOggViewState.inst.VoiceSet (DefineVoice.HURTED);
        };
    }
}