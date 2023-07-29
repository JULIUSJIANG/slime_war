import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import MgrBodyDir from "./MgrBodyDir";
import MgrBodyDirStatus from "./MgrBodyDirStatus";

const APP = `MgrBodyDirStatusLeft`;

/**
 * 状态机 - 状态 - 左朝向
 */
export default class MgrBodyDirStatusLeft extends MgrBodyDirStatus {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MgrBodyDirStatusLeft>({
        instantiate: () => {
            return new MgrBodyDirStatusLeft();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrBodyDir) {
        let val = UtilObjPool.Pop(MgrBodyDirStatusLeft._t, apply);
        val.machine = machine;
        return val;
    }

    OnRight(): void {
        this.machine.EnterStatus(this.machine.statusRight);
    }
}