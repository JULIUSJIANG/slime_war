import BCPromiseCtrl from "../../../frame/basic/BCPromiseCtrl";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import ViewState from "../../../frame/ui/ViewState";
import IndexLayer from "../../../IndexLayer";

const APP = `ConfirmViewState`;

/**
 * 确认界面-状态
 */
export default class ConfirmViewState extends ViewState {
    
    private constructor () {
        super(
            IndexLayer.GAME,
            ViewState.BG_TYPE.MASK,
            true,
        );
    }

    private static _t = new UtilObjPoolType<ConfirmViewState>({
        instantiate: () => {
            return new ConfirmViewState();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, txt: string) {
        let val = UtilObjPool.Pop(ConfirmViewState._t, apply);
        val.txt = txt;
        return val;
    }

    /**
     * 具体控制器
     */
    ctrl: BCPromiseCtrl<boolean> = BCPromiseCtrl.Pop<boolean>(APP);

    /**
     * 要展示的文本
     */
    txt: string;
}