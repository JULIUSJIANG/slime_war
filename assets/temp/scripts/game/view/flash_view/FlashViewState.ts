import IndexLayer from "../../../IndexLayer";
import IndexDataModule from "../../../IndexDataModule";
import BCPromiseCtrl from "../../../frame/basic/BCPromiseCtrl";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import MgrSdk from "../../../frame/sdk/MgrSdk";
import ViewState from "../../../frame/ui/ViewState";
import AnimFlash from "../../game_element/common/AnimFlash";
import LockViewState from "../lock_view/LockViewState";

const APP = `FlashViewState`;

/**
 * 入场时间
 */
const MS_FADE_IN = 600;
/**
 * 出场时间
 */
const MS_FADE_OUT = 600;

/**
 * 闪屏界面的状态中心
 */
export default class FlashViewState extends ViewState {

    private constructor () {
        super (
            IndexLayer.SYSTEM,
            ViewState.BG_TYPE.NONE,
            true
        );
    }

    private static _t = new UtilObjPoolType<FlashViewState>({
        instantiate: () => {
            return new FlashViewState ();
        },
        onPop: () => {

        },
        onPush: () => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop (FlashViewState._t, apply);
        return val;
    }

    /**
     * 闪屏动画辅助
     */
    animFlash: AnimFlash;

    /**
     * 监听 id，帧刷新
     */
    listenIdUpdate: number;

    /**
     * 已到达淡出状态
     */
    promiseOut: BCPromiseCtrl<unknown> = BCPromiseCtrl.Pop (APP);

    OnInit(): void {
        this.animFlash = AnimFlash.Pop (APP, MS_FADE_IN, MS_FADE_OUT);
        this.animFlash.currStatus.OnFlash ();
        this.listenIdUpdate = jiang.mgrEvter.evterUpdate.On ((ms) => {
            this.animFlash.currStatus.OnStep (ms);
            jiang.mgrUI.ModuleRefresh (IndexDataModule.FLASH);

            if (this.animFlash.currStatus == this.animFlash.statusOut) {
                this.promiseOut.resolve (null);
            };

            if (this.animFlash.rateVisibility == 0) {
                jiang.mgrUI.Close (this._idView);
            };
        });
    }
    
    OnDestory(): void {
        jiang.mgrEvter.evterUpdate.Off (this.listenIdUpdate);
    }
}