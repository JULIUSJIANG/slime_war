import IndexLayer from "../../../IndexLayer";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import ViewState from "../../../frame/ui/ViewState";

const APP = `FontViewState`;

/**
 * 字体界面的状态
 */
export default class FontViewState extends ViewState {
    
    private constructor () {
        super (
            IndexLayer.SYSTEM,
            ViewState.BG_TYPE.NONE,
            false
        );
    }

    private static _t = new UtilObjPoolType<FontViewState> ({
        instantiate: () => {
            return new FontViewState ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop (FontViewState._t, apply);
        return val;
    }
}