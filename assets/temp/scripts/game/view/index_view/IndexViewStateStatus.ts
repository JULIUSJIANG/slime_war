import IndexViewRS from "./IndexViewRS";
import IndexViewState from "./IndexViewState";

const APP = `IndexViewStateStatus`;

/**
 * 根界面游标状态管理
 */
export default abstract class IndexViewStateStatus {
    /**
     * 归属的界面状态
     */
    public relMachine: IndexViewState;

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
     * 事件派发 - 时间推进
     * @param ms 
     */
    public OnStep (ms: number) {

    }

    /**
     * 事件派发 - 切换
     * @param rs 
     */
    public OnToggle (rs: IndexViewRS) {

    }

    /**
     * 获取游标的 y 坐标
     */
    abstract OnGetTagY (): number;

    /**
     * 获取页面的 y 坐标
     */
    abstract OnGetPageY (): number;
}