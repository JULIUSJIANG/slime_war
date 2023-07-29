import BCEventer from "../../../../frame/basic/BCEventer";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import MBPlayer from "./MBPlayer";
import GameElementNpcPlayerActStatus from "./MgrActionMachineStatus";
import MgrActionMachineStatusJumpFloat from "./MgrActionMachineStatusJumpFloat";
import MgrActionMachineStatusJump from "./MgrActionMachineStatusJump";
import MgrActionMachineStatusJumpUp from "./MgrActionMachineStatusJumpUp";
import MgrActionMachineStatusWalk from "./MgrActionMachineStatusWalk";
import MgrActionMachineStatusForwardUp from "./MgrActionMachineStatusForwardUp";
import MgrActionMachineStatusForwardFloat from "./MgrActionMachineStatusForwardFloat";
import MgrActionMachineStatusBackUp from "./MgrActionMachineStatusBackUp";
import MgrActionMachineStatusBackFloat from "./MgrActionMachineStatusBackFloat";

const APP = `MgrActionMachine`;

/**
 * 状态机
 */
export default class MgrActionMachine {

    private constructor () {}

    private static _t = new UtilObjPoolType<MgrActionMachine>({
        instantiate: () => {
            return new MgrActionMachine();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, npc: MBPlayer) {
        let val = UtilObjPool.Pop(MgrActionMachine._t, apply);
        val.npc = npc;
        val.statusWalk = MgrActionMachineStatusWalk.Pop(APP, val);

        val.statusForwardUp = MgrActionMachineStatusForwardUp.Pop(APP, val);
        val.statusForwardFloat = MgrActionMachineStatusForwardFloat.Pop(APP, val);

        val.statusJump = MgrActionMachineStatusJump.Pop(APP, val);
        val.statusJumpUp = MgrActionMachineStatusJumpUp.Pop(APP, val);
        val.statusJumpFloat = MgrActionMachineStatusJumpFloat.Pop(APP, val);

        val.statusBackUp = MgrActionMachineStatusBackUp.Pop(APP, val);
        val.statusBackFloat = MgrActionMachineStatusBackFloat.Pop(APP, val);

        val.EnterStatus(val.statusWalk);
        return val;
    }

    /**
     * 对应的单位
     */
    npc: MBPlayer;

    /**
     * 当前状态
     */
    currStatus: GameElementNpcPlayerActStatus;

    /**
     * 状态 - 行走
     */
    statusWalk: MgrActionMachineStatusWalk;

    /**
     * 状态 - 冲刺 - 上升
     */
    statusForwardUp: MgrActionMachineStatusForwardUp;
    /**
     * 状态 - 冲刺 - 下落
     */
    statusForwardFloat: MgrActionMachineStatusForwardFloat;

    /**
     * 状态 - 跳跃
     */
    statusJump: MgrActionMachineStatusJump;
    /**
     * 状态 - 跳跃 - 上升
     */
    statusJumpUp: MgrActionMachineStatusJumpUp;
    /**
     * 状态 - 跳跃 - 下落
     */
    statusJumpFloat: MgrActionMachineStatusJumpFloat;
    
    /**
     * 状态 - 后退 - 上升
     */
    statusBackUp: MgrActionMachineStatusBackUp;
    /**
     * 状态 - 后退 - 下落
     */
    statusBackFloat: MgrActionMachineStatusBackFloat;

    /**
     * 事件派发-死亡
     */
    evterDeath: BCEventer<number> = BCEventer.Pop(APP);

    /**
     * 进入某个状态
     * @param status 
     */
    EnterStatus (status: GameElementNpcPlayerActStatus) {
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