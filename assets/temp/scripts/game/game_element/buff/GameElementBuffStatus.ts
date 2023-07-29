import GameElementBuff from "./GameElementBuff";
import GameElementMgrBuff from "./GameElementMgrBuff";

/**
 * buff 状态
 */
abstract class GameElementBuffStatus {
    /**
     * 初始化
     */
    Init (relBuff: GameElementBuff) {
        this._relBuff = relBuff;
    }

    /**
     * 归属的 buff
     */
    _relBuff: GameElementBuff;

    /**
     * 时间推进
     */
    OnStep (ms: number) {
        
    }

    /**
     * 事件派发 - 离开状态
     */
    OnExit () {

    }

    /**
     * 事件派发 - 进入状态
     */
    OnEnter () {

    }

    /**
     * 获取动画名字
     */
    abstract ActGetAnimName (): string;
}

export default GameElementBuffStatus;