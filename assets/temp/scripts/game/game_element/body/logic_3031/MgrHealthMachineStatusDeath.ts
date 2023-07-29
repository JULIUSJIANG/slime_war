import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import DefineVoice from "../DefineVoice";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import MgrHealthMachine from "./MgrHealthMachine";
import MgrHealthMachineStatus from "./MgrHealthMachineStatus";


const APP = `MgrHealthMachineStatusDeath`;

/**
 * npc 生命管理器 - 状态机 - 状态 - 已死亡
 */
export default class MgrHealthMachineStatusDeath extends MgrHealthMachineStatus {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MgrHealthMachineStatusDeath>({
        instantiate: () => {
            return new MgrHealthMachineStatusDeath();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMachine: MgrHealthMachine) {
        let val = UtilObjPool.Pop(MgrHealthMachineStatusDeath._t, apply);
        val.relMachine = relMachine;
        return val;
    }

    OnDmg (ctxDmg: GameElementBodyCtxDmg): void {
        VoiceOggViewState.inst.VoiceSet (DefineVoice.ATK_HITTED);
    }
}