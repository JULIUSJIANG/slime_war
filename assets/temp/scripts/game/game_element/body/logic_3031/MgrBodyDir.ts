import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import MBPlayer from "./MBPlayer";
import MgrBodyDirStatus from "./MgrBodyDirStatus";
import MgrBodyDirStatusLeft from "./MgrBodyDIrStatusLeft";
import MgrBodyDirStatusRight from "./MgrBodyDirStatusRight";

const APP = `MgrAnimBodyDir`;

/**
 * 朝向状态机
 */
export default class MgrBodyDir {

    private constructor () {}

    private static _t = new UtilObjPoolType<MgrBodyDir>({
        instantiate: () => {
            return new MgrBodyDir();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, npc: MBPlayer) {
        let val = UtilObjPool.Pop(MgrBodyDir._t, apply);
        val.npc = npc;
        val.statusLeft = MgrBodyDirStatusLeft.Pop(APP, val);
        val.statusRight = MgrBodyDirStatusRight.Pop(APP, val);

        val.EnterStatus(val.statusLeft);
        return val;
    }

    /**
     * 归属单位
     */
    npc: MBPlayer;
    /**
     * 当前状态
     */
    currStatus: MgrBodyDirStatus;

    /**
     * 状态 - 左朝向
     */
    statusLeft: MgrBodyDirStatusLeft;
    /**
     * 状态 - 右朝向
     */
    statusRight: MgrBodyDirStatusRight;

    /**
     * 
     * @param status 
     */
    EnterStatus (status: MgrBodyDirStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec != null) {
            rec.OnExit();
        };
        if (this.currStatus != null) {
            this.currStatus.OnEnter();
        };
    }
}