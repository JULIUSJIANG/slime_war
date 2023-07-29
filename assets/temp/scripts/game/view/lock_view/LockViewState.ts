import IndexLayer from "../../../IndexLayer";
import IndexDataModule from "../../../IndexDataModule";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";

const APP = `LockViewState`;

/**
 * 锁定界面的状态中心
 */
export default class LockViewState extends ViewState {
    /**
     * 全局实例
     */
    static inst: LockViewState;

    private constructor () {
        super (
            IndexLayer.SYSTEM,
            ViewState.BG_TYPE.NONE,
            false
        );
        LockViewState.inst = this;
    }

    private static _t = new UtilObjPoolType<LockViewState>({
        instantiate: () => {
            return new LockViewState ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop (LockViewState._t, apply);
        return val;
    }

    /**
     * 用于生成锁的 id
     */
    private _idLockGen = 0;
    /**
     * 已经上的锁
     */
    private _setLocked: Set <number> = UtilObjPool.Pop (UtilObjPool.typeSet, APP);

    /**
     * 当前是否已锁定
     */
    get isLocking () {
        return 0 < this._setLocked.size
    }

    /**
     * 新增一个锁
     * @returns 
     */
    LockApp () {
        let id = ++this._idLockGen;
        this._setLocked.add (id);
        jiang.mgrUI.ModuleRefresh (IndexDataModule.LOCK);
        return id;
    }

    /**
     * 取消一个锁
     * @param id 
     */
    LockCancel (id: number) {
        this._setLocked.delete (id);
        jiang.mgrUI.ModuleRefresh (IndexDataModule.LOCK);
    }
}