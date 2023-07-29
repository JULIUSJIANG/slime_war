import ScrollStop from "./ScrollStop";


const APP = `ScrollStopStatus`;

/**
 * 滚动视图辅助 - 停止滚动 - 状态
 */
export default abstract class ScrollStopStatus {
    /**
     * 归属的状态机
     */
    relMachine: ScrollStop;

    /**
     * 事件派发 - 进入
     */
    OnEnter () {

    }

    /**
     * 事件派发 - 离开
     */
    OnExit () {

    }

    /**
     * 事件派发 - 已应用值
     */
    OnApply () {

    }

    /**
     * 事件派发 - 停止
     */
    OnStop () {
        
    }

    /**
     * 滚动许可
     */
    OnScrollAble () {
        return true;
    }
}