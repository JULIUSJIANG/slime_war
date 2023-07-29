import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import MBPlayer from "./MBPlayer";
import MgrDefendCDStatus from "./MgrDefendCDStatus";
import MgrDefendCDStatusReady from "./MgrDefendCDStatusReady";
import MgrDefendCDStatusTimeCount from "./MgrDefendCDStatusTimeCount";

const APP = `MgrDefendCD`;

/**
 * 管理 - 防御
 */
export default class MgrDefendCD {
    private constructor () {}

    private static _t = new UtilObjPoolType <MgrDefendCD> ({
        instantiate: () => {
            return new MgrDefendCD ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, npc: MBPlayer) {
        let val = UtilObjPool.Pop (MgrDefendCD._t, apply);

        val.relMBPlayer = npc;
        
        val.statusTimeCount = MgrDefendCDStatusTimeCount.Pop (APP, val);
        val.statusReady = MgrDefendCDStatusReady.Pop (APP, val);

        val.Enter (val.statusTimeCount);
        return val;
    }

    relMBPlayer: MBPlayer;

    /**
     * 状态 - 正在计时
     */
    statusTimeCount: MgrDefendCDStatusTimeCount;
    /**
     * 状态 - 就绪
     */
    statusReady: MgrDefendCDStatusReady;

    /**
     * 当前状态
     */
    currStatus: MgrDefendCDStatus;

    /**
     * 技能按钮的不透明度
     */
    opacitySkill = 255;

    /**
     * 进入某个状态
     * @param status 
     */
    Enter (status: MgrDefendCDStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }
}