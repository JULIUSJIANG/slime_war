import GameCD from "./GameCD";

const APP = `GameCDStatus`;

/**
 * cd 计时器 - 状态
 */
export default abstract class GameCDStatus {
    /**
     * 归属的冷却管理
     */
    relGameCD: GameCD;

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
     * 事件派发 - 时间
     * @param ms 
     */
    OnStep (ms: number) {

    }

    /**
     * 事件派发 - 调用
     */
    abstract OnTryCall (): boolean;
}