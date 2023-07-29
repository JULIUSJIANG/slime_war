import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import MgrBodyDir from "./MgrBodyDir";
import MgrBodyDirStatus from "./MgrBodyDirStatus";

const APP = `MgrBodyDirStatusRight`;

/**
 * 状态机 - 状态 - 右朝向
 */
export default class MgrBodyDirStatusRight extends MgrBodyDirStatus {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MgrBodyDirStatusRight>({
        instantiate: () => {
            return new MgrBodyDirStatusRight();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrBodyDir) {
        let val = UtilObjPool.Pop(MgrBodyDirStatusRight._t, apply);
        val.machine = machine;
        return val;
    }

    OnLeft(): void {
        this.machine.EnterStatus(this.machine.statusLeft);
    }
}