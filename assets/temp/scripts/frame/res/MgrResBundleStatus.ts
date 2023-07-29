import MgrRes from "./MgrRes";
import MgrResAssetsLoadRecord from "./MgrResAssetsLoadRecord";
import MgrResBundle from "./MgrResBundle";
import MgrResBundleLoadRecord from "./MgrResBundleLoadRecord";

/**
 * 资源管理器 - 状态
 */
export default abstract class MgrResBundleStatus {
    /**
     * 归属的状态机
     */
    public relMgr: MgrResBundle;

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
     * 事件派发 - 新增加载任务
     */
    public OnTaskAdd () {

    }
}