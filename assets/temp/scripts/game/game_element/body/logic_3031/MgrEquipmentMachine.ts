import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import MgrEquipment from "./MgrEquipment";
import MgrEquipmentMachineStatus from "./MgrEquipmentMachineStatus";
import MgrEquipmentMachineStatusArmo from "./MgrEquipmentMachineStatusArmo";
import MgrEquipmentMachineStatusFired from "./MgrEquipmentMachineStatusFired";

const APP = `MgrEquipmentMachine`;

/**
 * 武器状态机
 */
export default class MgrEquipmentMachine {
    
    private constructor () {}

    private static _t = new UtilObjPoolType<MgrEquipmentMachine>({
        instantiate: () => {
            return new MgrEquipmentMachine();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, equip: MgrEquipment) {
        let val = UtilObjPool.Pop(MgrEquipmentMachine._t, apply);
        val.equip = equip;

        val.statusFired = MgrEquipmentMachineStatusFired.Pop(APP, val);
        val.statusArmo = MgrEquipmentMachineStatusArmo.Pop(APP, val);

        val.EnterStatus(val.statusArmo);
        return val;
    }

    /**
     * 归属的装备
     */
    equip: MgrEquipment;

    /**
     * 状态-当前状态
     */
    currStatus: MgrEquipmentMachineStatus;

    /**
     * 状态-开火中
     */
    statusFired: MgrEquipmentMachineStatusFired;

    /**
     * 状态-上弹
     */
    statusArmo: MgrEquipmentMachineStatusArmo;

    /**
     * 进入状态
     * @param status 
     */
    EnterStatus (status: MgrEquipmentMachineStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec != null) {
            rec.OnExit();
        };
        this.currStatus.OnEnter();
    }
}