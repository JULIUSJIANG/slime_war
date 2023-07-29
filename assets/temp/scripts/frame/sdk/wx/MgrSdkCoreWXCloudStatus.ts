import MgrSdkCoreWX from "./MgrSdkCoreWX";

/**
 * sdk 核心 - 微信 - 云状态
 */
export default abstract class MgrSdkCoreWXCloudStatus {
    /**
     * 归属的状态机
     */
    public relMachine: MgrSdkCoreWX;

    public constructor (relMachine: MgrSdkCoreWX) {
        this.relMachine = relMachine;
    }

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
     * 事件派发 - 云初始化完毕
     */
    public OnCloudInited () {

    }
}