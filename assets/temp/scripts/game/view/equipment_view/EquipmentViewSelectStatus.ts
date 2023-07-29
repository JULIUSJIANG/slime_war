import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import UINode from "../../../frame/ui/UINode";
import IndexViewState from "../index_view/IndexViewState";
import EquipmentView from "./EquipmentView";
import EquipmentViewState from "./EquipmentViewState";

/**
 * 装备界面选择状态
 */
export default abstract class EquipmentViewSelectStatus {
    /**
     * 归属的界面
     */
    public relMachine: EquipmentViewState;

    /**
     * 事件派发 - 进入状态
     */
    public OnEnter () {

    }

    /**
     * 事件派发 - 离开状态
     */
    public OnExit () {

    }

    /**
     * 事件派发 - 选择物品
     */
    public OnBackpackProp (idCfg: number) {

    }

    /**
     * 事件派发 - 选择装备
     */
    public OnEquipment (idCfg: number) {

    }

    /**
     * 获取当前正在查看内容的索引
     */
    public abstract OnIdxGlobal (): number;
    /**
     * 衍生子节点
     * @param state 
     * @param listNode 
     */
    public abstract OnChildren (state: IndexViewState, listNode: Array<UINode>);
}