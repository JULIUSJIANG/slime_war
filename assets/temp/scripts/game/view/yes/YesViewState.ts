import BCPromiseCtrl from "../../../frame/basic/BCPromiseCtrl";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import ViewState from "../../../frame/ui/ViewState";
import IndexLayer from "../../../IndexLayer";

const APP = `YesViewState`;

/**
 * 确认界面-状态
 */
export default class YesViewState extends ViewState {
    
    private constructor () {
        super(
            IndexLayer.GAME,
            ViewState.BG_TYPE.MASK,
            true
        );
    }

    private static _t = new UtilObjPoolType<YesViewState>({
        instantiate: () => {
            return new YesViewState();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, txt: string) {
        let val = UtilObjPool.Pop(YesViewState._t, apply);
        val.txt = txt;
        return val;
    }
    
    /**
     * 具体控制器
     */
    ctrl: BCPromiseCtrl<number> = BCPromiseCtrl.Pop(APP);

    /**
     * 要展示的文本
     */
    txt: string;
}