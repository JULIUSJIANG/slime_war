import IndexLayer from "../../../IndexLayer";
import IndexDataModule from "../../../IndexDataModule";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";

const APP = `ExitViewState`;

/**
 * 退出界面的状态中心
 */
export default class ExitViewState extends ViewState {
    private constructor () {
        super (
            IndexLayer.CTRL,
            ViewState.BG_TYPE.MASK,
            false
        );
    }

    private static _t = new UtilObjPoolType <ExitViewState> ({
        instantiate: () => {
            return new ExitViewState ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop (ExitViewState._t, apply);
        return val;
    }
}