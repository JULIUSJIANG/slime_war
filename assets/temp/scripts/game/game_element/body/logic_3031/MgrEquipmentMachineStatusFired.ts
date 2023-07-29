import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GraphicsDrawer from "../../../../frame/extend/graphics_drawer/GraphicsDrawer";
import MgrEquipmentMachine from "./MgrEquipmentMachine";
import MgrEquipmentMachineStatus from "./MgrEquipmentMachineStatus";

const APP = `MgrEquipmentMachineStatusFired`;

/**
 * 武器状态机-状态-开火中
 */
export default class MgrEquipmentMachineStatusFired extends MgrEquipmentMachineStatus {   
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MgrEquipmentMachineStatusFired>({
        instantiate: () => {
            return new MgrEquipmentMachineStatusFired();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrEquipmentMachine) {
        let val = UtilObjPool.Pop(MgrEquipmentMachineStatusFired._t, apply);
        val.relMachine = machine;
        return val;
    }

    OnEnter(): void {
        this.relMachine.equip.equipInst.OnFireEnter();
    }

    OnFire(firePosX: number, firePosY: number): void {
        this.relMachine.equip.firePos.x = firePosX;
        this.relMachine.equip.firePos.y = firePosY;

        this.relMachine.equip.aimVec.x = this.relMachine.equip.firePos.x - this.relMachine.equip.npc.playerEquipPos.x;
        this.relMachine.equip.aimVec.y = this.relMachine.equip.firePos.y - this.relMachine.equip.npc.playerEquipPos.y;
    }

    OnExit(): void {
        this.relMachine.equip.equipInst.OnFireExit();
    }

    OnArmo(): void {
        this.relMachine.EnterStatus(this.relMachine.statusArmo);
    }
    
    OnStep(): void {
        // 已阵亡
        if (this.relMachine.equip.npc.playerMgrHealth.machine.currStatus == this.relMachine.equip.npc.playerMgrHealth.machine.statusDeath) {
            this.OnArmo();
            return;
        };
        // 进行事件派发
        this.relMachine.equip.equipInst.OnFireStep();
    }

    OnDraw(drawer: GraphicsDrawer): void {
        this.relMachine.equip.equipInst.OnDraw(drawer);
    }
}