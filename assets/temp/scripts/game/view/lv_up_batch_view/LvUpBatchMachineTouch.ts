import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import MgrSdk from "../../../frame/sdk/MgrSdk";
import ViewState from "../../../frame/ui/ViewState";
import LvUpBatchMachineTouchStatus from "./LvUpBatchMachineTouchStatus";
import LvUpBatchMachineTouchStatus1FadeIn from "./LvUpBatchMachineTouchStatus1FadeIn";
import LvUpBatchMachineTouchStatus2FlashIn from "./LvUpBatchMachineTouchStatus2FlashIn";
import LvUpBatchMachineTouchStatus3FlashOut from "./LvUpBatchMachineTouchStatus3FlashOut";
import LvUpBatchMachineTouchStatus4Sort from "./LvUpBatchMachineTouchStatus4Sort";
import LvUpBatchMachineTouchStatus5Idle from "./LvUpBatchMachineTouchStatus5Idle";
import LvUpBatchMachineTouchStatus6TipsOut from "./LvUpBatchMachineTouchStatus6TipsOut";
import LvUpBatchMachineTouchStatusEmpty from "./LvUpBatchMachineTouchStatusEmpty";
import LvUpBatchViewState from "./LvUpBatchViewState";

const APP = `LvUpBatchMachineTouch`;

/**
 * 升级状态机
 */
class LvUpBatchMachineTouch {

    private constructor () {

    }

    private static _t = new UtilObjPoolType <LvUpBatchMachineTouch> ({
        instantiate: () => {
            return new LvUpBatchMachineTouch ();
        },
        onPop: () => {

        },
        onPush: () => {

        },
        tag: APP
    });

    static Pop (apply: string, relState: LvUpBatchViewState) {
        let val = UtilObjPool.Pop (LvUpBatchMachineTouch._t, APP);
        val.relState = relState;

        val.statusEmpty = new LvUpBatchMachineTouchStatusEmpty (val, `LvUpBatchMachineTouchStatusEmpty`);
        val.status1FadeIn = new LvUpBatchMachineTouchStatus1FadeIn (val, `LvUpBatchMachineTouchStatus1FadeIn`);
        val.status2FlashIn = new LvUpBatchMachineTouchStatus2FlashIn (val, `LvUpBatchMachineTouchStatus2FlashIn`);
        val.status3FlashOut = new LvUpBatchMachineTouchStatus3FlashOut (val, `LvUpBatchMachineTouchStatus3FlashOut`);
        val.status4Sort = new LvUpBatchMachineTouchStatus4Sort (val, `LvUpBatchMachineTouchStatus4Sort`);
        val.status5Idle = new LvUpBatchMachineTouchStatus5Idle (val, `LvUpBatchMachineTouchStatus5Idle`);
        val.status6TipsOut = new LvUpBatchMachineTouchStatus6TipsOut (val, `LvUpBatchMachineTouchStatus6TipsOut`);

        val.Enter (val.statusEmpty);
        return val;
    }

    /**
     * 归属的界面状态
     */
    relState: LvUpBatchViewState;

    statusEmpty: LvUpBatchMachineTouchStatusEmpty;
    status1FadeIn: LvUpBatchMachineTouchStatus1FadeIn;
    status2FlashIn: LvUpBatchMachineTouchStatus2FlashIn;
    status3FlashOut: LvUpBatchMachineTouchStatus3FlashOut;
    status4Sort: LvUpBatchMachineTouchStatus4Sort;
    status5Idle: LvUpBatchMachineTouchStatus5Idle;
    status6TipsOut: LvUpBatchMachineTouchStatus6TipsOut;

    /**
     * 当前状态
     */
    currStatus: LvUpBatchMachineTouchStatus;
    /**
     * 进入某个状态
     * @param status 
     */
    Enter (status: LvUpBatchMachineTouchStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }

    /**
     * 锁屏 id
     */
    lockId: number;
}

export default LvUpBatchMachineTouch;