import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import MgrHealth from "./MgrHealth";
import MgrHealthMachineStatus from "./MgrHealthMachineStatus";
import MgrHealthMachineStatusDeath from "./MgrHealthMachineStatusDeath";
import MgrHealthMachineStatusHurted from "./MgrHealthMachineStatusHurted";
import MgrHealthMachineStatusOrdinary from "./MgrHealthMachineStatusOrdinary";

const APP = `MgrHealthMachine`;

/**
 * npc 生命管理-状态机
 */
export default class MgrHealthMachine {
    
    private constructor () {}

    private static _t = new UtilObjPoolType<MgrHealthMachine>({
        instantiate: () => {
            return new MgrHealthMachine();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relNpcHealth: MgrHealth) {
        let val = UtilObjPool.Pop(MgrHealthMachine._t, apply);
        val.relMgrHealth = relNpcHealth;

        val.statusOrdinary = MgrHealthMachineStatusOrdinary.Pop (APP, val);
        val.statusHurted = MgrHealthMachineStatusHurted.Pop (APP, val);
        val.statusDeath = MgrHealthMachineStatusDeath.Pop (APP, val);

        val.Enter(val.statusOrdinary)
        return val;
    }

    /**
     * 归属的生命管理
     */
    relMgrHealth: MgrHealth;
    /**
     * 当前状态
     */
    currStatus: MgrHealthMachineStatus;
    
    /**
     * 状态 - 常态
     */
    statusOrdinary: MgrHealthMachineStatusOrdinary;
    /**
     * 状态 - 已受伤
     */
    statusHurted: MgrHealthMachineStatusHurted;
    /**
     * 状态 - 死亡
     */
    statusDeath: MgrHealthMachineStatusDeath;

    /**
     * 进入某个状态
     * @param status 
     */
    Enter (status: MgrHealthMachineStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec != null) {
            rec.OnExit();
        };
        if (this.currStatus != null) {
            this.currStatus.OnEnter();
        };
    }
}