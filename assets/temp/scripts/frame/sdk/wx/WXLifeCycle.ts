import MgrSdk from "../MgrSdk";
import MgrSdkCoreWX from "./MgrSdkCoreWX";
import WXLifeCycleStatus from "./WXLifeCycleStatus";
import WXLifeCycleStatusExitTips from "./WXLifeCycleStatusExitTips";
import WXLifeCycleStatusExited from "./WXLifeCycleStatusExited";
import WXLifeCycleStatusIdle from "./WXLifeCycleStatusIdle";

/**
 * 微信生命周期
 */
class WXLifeCycle {
    /**
     * 归属的管理器
     */
    relMgr: MgrSdkCoreWX;

    constructor (args: {
        relMgr: MgrSdkCoreWX
    })
    {
        this.relMgr = args.relMgr;

        this.statusIdle = new WXLifeCycleStatusIdle (`WXLifeCycleStatusIdle`, this);
        this.statusExitTips = new WXLifeCycleStatusExitTips (`WXLifeCycleStatusExitTips`, this);
        this.statusExited = new WXLifeCycleStatusExited (`WXLifeCycleStatusExited`, this);
        this.EnterStatus (this.statusIdle);
    }

    /**
     * 当前状态
     */
    currStatus: WXLifeCycleStatus;

    /**
     * 状态 - 待机
     */
    statusIdle: WXLifeCycleStatusIdle;
    /**
     * 状态 - 进行告知
     */
    statusExitTips: WXLifeCycleStatusExitTips;
    /**
     * 状态 - 已退出
     */
    statusExited: WXLifeCycleStatusExited;

    /**
     * 进入状态
     * @param status 
     */
    EnterStatus (
        status: WXLifeCycleStatus
    )
    {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }
};

export default WXLifeCycle;