import MgrDateNowStatus from "./MgrDateNowStatus";
import MgrDateNowStatusGetting from "./MgrDateNowStatusGetting";
import MgrDateNowStatusIdle from "./MgrDateNowStatusIdle";

/**
 * 时间戳管理器
 */
export default class MgrDateNow {

    public constructor () {
        this.statusIdle = new MgrDateNowStatusIdle (this);
        this.statusGetting = new MgrDateNowStatusGetting (this);
        this.EnterStatus (this.statusIdle);
    }

    /**
     * 当前状态
     */
    public currStatus: MgrDateNowStatus;
    /**
     * 状态 - 待机
     */
    public statusIdle: MgrDateNowStatusIdle;
    /**
     * 状态 - 正在同步时间
     */
    public statusGetting: MgrDateNowStatusGetting;

    /**
     * 进入状态
     * @param status 
     */
    public EnterStatus (status: MgrDateNowStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }

    /**
     * 时间差距
     */
    public timeSpace: number = 0;

    /**
     * 获取当前日期
     * @returns 
     */
    public DateNow () {
        return Date.now () + this.timeSpace;
    }

    /**
     * 全局单例
     */
    public static inst = new MgrDateNow ();
}