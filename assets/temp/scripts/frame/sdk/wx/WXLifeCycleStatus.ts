import WXLifeCycle from "./WXLifeCycle";

/**
 * 微信生命周期 - 状态
 */
abstract class WXLifeCycleStatus {

    /**
     * 状态名字
     */
    name: string;

    /**
     * 归属的生命周期
     */
    relMachine: WXLifeCycle;

    constructor (
        name: string,
        relMachine: WXLifeCycle
    ) 
    {
        this.name = name;
        this.relMachine = relMachine;
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
     * 要求退出程序
     */
    OnAppQuit () {

    }
}

export default WXLifeCycleStatus;