import MgrBodyDir from "./MgrBodyDir";

const APP = `MgrBodyDirStatus`;

/**
 * 朝向状态机 - 状态
 */
export default abstract class MgrBodyDirStatus {
    /**
     * 归属的状态机
     */
    machine: MgrBodyDir;

    OnEnter () {

    }

    OnExit () {

    }

    /**
     * 发生朝向 - 左
     */
    OnLeft () {

    }

    /**
     * 发生朝向 - 右
     */
    OnRight () {

    }
}