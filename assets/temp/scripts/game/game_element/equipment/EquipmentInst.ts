import CfgEquipmentProps from "../../../frame/config/src/CfgEquipmentProps";
import GraphicsDrawer from "../../../frame/extend/graphics_drawer/GraphicsDrawer";
import MgrEquipment from "../body/logic_3031/MgrEquipment";
import EquipmentInstRS from "./EquipmentInstRS";

const APP = `EquipmentInst`;

/**
 * 装备实例的虚拟类
 */
export default abstract class EquipmentInst {
    /**
     * 归属的控制状态机
     */
    relEquip: MgrEquipment;
    /**
     * 配置 - 属性
     */
    cfgProps: CfgEquipmentProps;
    /**
     * 逻辑的注册信息
     */
    rs: EquipmentInstRS<any>;
    /**
     * 弹药的重力缩放
     */
    bulletGravityScale = 1;
    /**
     * 强度
     */
    power: number;
    /**
     * 等级
     */
    lev: number;
    /**
     * 时间推进
     * @param ms 
     */
    OnStep (ms: number) {
        
    }

    /**
     * 进入开火的时候
     */
    OnFireEnter () {
        
    }
    
    /**
     * 当开火的时候
     * @param firePos 
     */
    OnFireStep () 
    {
        
    }

    /**
     * 脱离开火的时候
     */
    OnFireExit () {

    }

    /**
     * 初始化
     */
    OnInit () {

    }

    /**
     * 绘制
     * @param drawer 
     */
    OnDraw (drawer: GraphicsDrawer) {

    }

    /**
     * 放入背包
     */
    OnBackPack (): void {

    }

    /**
     * 拿出到手上
     */
    OnHand (): void {

    }

    /**
     * 获取消耗需要
     * @returns 
     */
    OnCostNeed () {
        return 0;
    }

    /**
     * 能够释放
     */
    OnAble (): boolean {
        return this.OnCostNeed () <= this.relEquip.npc.mpCurrent;
    }

    /**
     * 冷却
     * @returns 
     */
    OnCD () {
        return 1.0;
    }

    /**
     * 能量恢复许可
     */
    OnMpRecoveryAble (): boolean {
        return true;
    }
}