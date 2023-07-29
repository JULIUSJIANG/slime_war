import LvUpBatchMachineTouch from "./LvUpBatchMachineTouch";
import LvUpBatchViewState from "./LvUpBatchViewState";

/**
 * 装备批量强化界面 - 升级状态
 */
abstract class LvUpBatchMachineTouchStatus {
    /**
     * 归属的状态机
     */
    relMachine: LvUpBatchMachineTouch;
    /**
     * 状态名称
     */
    name: string;

    constructor (relMachine: LvUpBatchMachineTouch, name: string) {
        this.relMachine = relMachine;
        this.name = name;
    }

    /**
     * 事件派发 - 进入状态
     */
    OnEnter () {

    }

    /**
     * 事件派发 - 离开状态
     */
    OnExit () {

    }

    /**
     * 事件派发 - 时间推进
     * @param ms 
     */
    OnStep (ms: number) {
        
    }

    /**
     * 获取强化相关节点的不透明度
     * @returns 
     */
    GetNodeStrengthenOpacity (): number {
        return 0;
    }

    /**
     * 获取闪烁节点的不透明度
     */
    GetNodeLvUpOpacity (): number {
        return 0;
    }

    /**
     * 获取升级节点的不透明度
     * @returns 
     */
    GetNodeFlashOpacity (): number {
        return 0;
    }

    /**
     * 获取排序的比率
     */
    GetSortRate (): number {
        return 0;
    }
}

export default LvUpBatchMachineTouchStatus;