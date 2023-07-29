import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import MgrActionMachine from "./MgrActionMachine";

const APP = `MgrActionMachineStatus`;

/**
 * 状态机-状态
 */
export default abstract class MgrActionMachineStatus {
    /**
     * 归属的状态机
     */
    machine: MgrActionMachine;

    /**
     * 事件派发-进入
     */
    OnEnter () {

    }

    /**
     * 事件派发-离开
     */
    OnExit () {

    }

    /**
     * 时间步进完成了的时候
     */
    OnStep (ms: number) {

    }

    /**
     * 前进 - 按下
     */
    OnForwardPress () {

    }
    /**
     * 前进 - 抬起
     */
    OnForwardRelease () {

    }

    /**
     * 跳跃 - 按下
     */
    OnJumpPress () {

    }
    /**
     * 跳跃 - 抬起
     */
    OnJumpRelease () {

    }

    /**
     * 后退 - 按下
     */
    OnBackPress () {

    }
    /**
     * 后退 - 抬起
     */
    OnBackRelease () {

    }

    /**
     * 死亡
     */
    OnDeath () {

    }

    /**
     * 与地面接触
     */
    OnConcatWithGround () {

    }
}