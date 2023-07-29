import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import AnimKeep from "./AnimKeep";

const APP = `AnimKeepStatus`;

/**
 * 动画 - 状态维持 - 状态
 */
export default abstract class AnimKeepStatus {
    /**
     * 归属的渐变管理器
     */
    relGameFade: AnimKeep;

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
     * 渐入
     */
    OnFadeIn () {

    }

    /**
     * 渐出
     */
    OnFadeOut () {

    }
}