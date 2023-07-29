import ShareViewRS from "../../game/view/share_view/ShareViewRS";
import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import MgrSdkCore from "./MgrSdkCore";
import MgrSdkEnterRS from "./MgrSdkEnterRS";

const APP = `MgrSdkCoreH5`;

/**
 * 本地键
 */
const KEY_LOCAL = `${APP}_local`;

/**
 * 服务器键
 */
const KEY_SERVER = `${APP}_server`;

/**
 * sdk 核心 - h5
 */
export default class MgrSdkCoreH5 extends MgrSdkCore {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<MgrSdkCoreH5>({
        instantiate: () => {
            return new MgrSdkCoreH5();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        return UtilObjPool.Pop(MgrSdkCoreH5._t, apply);
    }

    Init(): Promise<unknown> {
        return Promise.resolve ();
    }

    Author(): Promise<unknown> {
        return Promise.resolve ();
    }

    LocalSet(val: object): Promise<unknown> {
        localStorage.setItem (KEY_LOCAL, JSON.stringify (val));
        return Promise.resolve();
    }
    LocalGet (): Promise<object> {
        return Promise.resolve(JSON.parse (localStorage.getItem(KEY_LOCAL)));
    }

    ServerSet(val: object): Promise<unknown> {
        localStorage.setItem (KEY_SERVER, JSON.stringify (val));
        return Promise.resolve();
    }
    ServerGet (): Promise<object> {
        return Promise.resolve(JSON.parse (localStorage.getItem(KEY_SERVER)));
    }
    ServerClear () {
        localStorage.clear ();
        return Promise.resolve();
    }
    DateNow () {
        return Promise.resolve (Date.now ());
    }
    FillSprByUrl (spr: cc.Sprite, url: string) {
        spr.spriteFrame = null;
    }

    private _listCtxJoined: Array <MgrSdkCore.JoinedCtx> = [
        {
            id_prop: ShareViewRS.heart.idProp,
            url: null
        },
        {
            id_prop: ShareViewRS.star.idProp,
            url: null
        }
    ];
    WXGetPlayerHeadUrl() {
        return null;
    }
    WXVideo () {
        return Promise.resolve({
            isRewardAble: true
        });
    }
    WXGetListCtxJoined(): MgrSdkCore.JoinedCtx[] {
         return this._listCtxJoined;
    }
    WXRefreshListCtxJoined(): Promise<unknown> {
        return Promise.resolve ();
    }
    WXShare<S, C>(title: string, rs: MgrSdkEnterRS<S>, props: S, imgId: string, imgUrl: string) {
        
    }
    WXGetOpenId() {
        return null;
    }
    WXHelpCommit(openId: string, idProp: number) {
        return Promise.resolve (null);
    }
}