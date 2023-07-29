import AnimFlash from "./AnimFlash";

const APP = `AnimFlashStatus`;

/**
 * 动画 - 闪现 - 状态
 */
export default abstract class AnimFlashStatus {
    /**
     * 归属的动画管理器
     */
    relAnimFlash: AnimFlash;

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
     * 事件派发 - 时间
     * @param ms 
     */
    OnStep (ms: number) {

    }

    /**
     * 时间派发 - 闪烁
     */
    OnFlash () {

    }
}