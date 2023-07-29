import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";
import IndexLayer from "../../../IndexLayer";

const APP = `SettingViewState`;

/**
 * 设置界面 - 状态
 */
export default class SettingViewState {
    
    private constructor () {

    }

    private static _t = new UtilObjPoolType<SettingViewState>({
        instantiate: () => {
            return new SettingViewState();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        return UtilObjPool.Pop(SettingViewState._t, apply);
    }

    /**
     * 子节点许可
     */
    childrenAble = false;
}