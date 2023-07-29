import IndexLayer from "../../../IndexLayer";
import BCPromiseCtrl from "../../../frame/basic/BCPromiseCtrl";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";

const APP = `LoadingViewState`;

/**
 * 加载界面的状态中心
 */
export default class LoadingViewState extends ViewState {

    private constructor () {
        super (
            IndexLayer.GAME,
            ViewState.BG_TYPE.MASK,
            true
        );
    }

    private static _t = new UtilObjPoolType<LoadingViewState>({
        instantiate: () => {
            return new LoadingViewState ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, loadingList: Array<Promise<any>>) {
        let val = UtilObjPool.Pop (LoadingViewState._t, apply);
        val._listLoading.push (...loadingList);
        val._listLoading.push ((new Promise ((resolve) => {
            setTimeout (resolve, 200 );
        })));
        return val;
    }

    OnInit(): void {
        Promise.all (this._listLoading)
            .then (() => {
                jiang.mgrUI.Close (this._idView);
                this.ctrl.resolve (null);
            });
    }

    /**
     * 当前要加载的列表
     */
    private _listLoading: Array<Promise<any>> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

    /**
     * 进程控制器
     */
    ctrl: BCPromiseCtrl <any> = BCPromiseCtrl.Pop (APP);
};