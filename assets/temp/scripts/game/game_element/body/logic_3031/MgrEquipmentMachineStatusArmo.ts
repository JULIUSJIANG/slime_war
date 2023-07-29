import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GraphicsDrawer from "../../../../frame/extend/graphics_drawer/GraphicsDrawer";
import MgrEquipmentMachine from "./MgrEquipmentMachine";
import MgrEquipmentMachineStatus from "./MgrEquipmentMachineStatus";

const APP = `MgrEquipmentMachineStatusArmo`;

/**
 * 武器状态机-状态-玩家没有开火
 */
export default class MgrEquipmentMachineStatusArmo extends MgrEquipmentMachineStatus {
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MgrEquipmentMachineStatusArmo>({
        instantiate: () => {
            return new MgrEquipmentMachineStatusArmo();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrEquipmentMachine) {
        let val = UtilObjPool.Pop(MgrEquipmentMachineStatusArmo._t, apply);
        val.relMachine = machine;
        return val;
    }

    OnFire (firePosX: number, firePosY: number): void {
        // 已阵亡
        if (this.relMachine.equip.npc.playerMgrHealth.machine.currStatus == this.relMachine.equip.npc.playerMgrHealth.machine.statusDeath) {
            return;
        };
        this.relMachine.EnterStatus(this.relMachine.statusFired);
        this.relMachine.currStatus.OnFire(firePosX, firePosY);
    }

    OnStep(ms: number): void {
        this.relMachine.equip.firePos.x = this.relMachine.equip.aimVec.x + this.relMachine.equip.npc.playerEquipPos.x;
        this.relMachine.equip.firePos.y = this.relMachine.equip.aimVec.y + this.relMachine.equip.npc.playerEquipPos.y;
    }

    OnDraw(drawer: GraphicsDrawer): void {
        this.relMachine.equip.equipInst.OnDraw(drawer);
    }
}