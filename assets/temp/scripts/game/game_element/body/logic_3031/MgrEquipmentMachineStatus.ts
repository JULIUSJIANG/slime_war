import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GraphicsDrawer from "../../../../frame/extend/graphics_drawer/GraphicsDrawer";
import MgrEquipmentMachine from "./MgrEquipmentMachine";

const APP = `MgrEquipmentMachineStatus`;

/**
 * 武器状态机-状态
 */
export default abstract class MgrEquipmentMachineStatus {
    /**
     * 归属的状态机
     */
    relMachine: MgrEquipmentMachine;

    /**
     * 事件派发-进入该状态
     */
    OnEnter () {

    }

    /**
     * 事件派发-离开该状态
     */
    OnExit () {

    }

    /**
     * 开火
     */
    OnFire (firePosX: number, firePosY: number) {

    }

    /**
     * 上弹
     */
    OnArmo () {

    }

    /**
     * 时间步进
     */
    OnStep (ms: number) {

    }

    /**
     * 进行图形绘制的时候
     * @param drawer 
     */
    OnDraw (drawer: GraphicsDrawer) {

    }
}