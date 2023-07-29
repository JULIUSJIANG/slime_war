import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import gameCommon from "../../../GameCommon";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementEff from "../../common/GameElementEff";
import DefineVoice from "../DefineVoice";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import MgrHealthMachine from "./MgrHealthMachine";
import MgrHealthMachineStatus from "./MgrHealthMachineStatus"

const APP = `MgrHealthMachineStatusHurted`;

/**
 * npc 生命管理-状态机-状态-已受伤
 */
export default class MgrHealthMachineStatusHurted extends MgrHealthMachineStatus {
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MgrHealthMachineStatusHurted>({
        instantiate: () => {
            return new MgrHealthMachineStatusHurted();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMachine: MgrHealthMachine) {
        let val = UtilObjPool.Pop(MgrHealthMachineStatusHurted._t, apply);
        val.relMachine = relMachine;
        return val;
    }

    /**
     * 总累计时间
     */
    _totalMS: number = 0;
    
    OnEnter(): void {
        this._totalMS = 0;
    }

    OnStep(ms: number): void {
        this._totalMS += ms;
        // 受伤后无敌一秒
        if (gameCommon.HURTED_CD < this._totalMS) {
            this.relMachine.Enter(this.relMachine.statusOrdinary);
        };
    }

    OnDmg (ctxDmg: GameElementBodyCtxDmg): void {
        VoiceOggViewState.inst.VoiceSet (DefineVoice.ATK_HITTED);
    }
}