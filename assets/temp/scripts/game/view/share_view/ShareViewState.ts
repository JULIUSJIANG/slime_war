import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import MgrSdk from "../../../frame/sdk/MgrSdk";
import MgrSdkCore from "../../../frame/sdk/MgrSdkCore";
import LoadingView from "../loading_view/LoadingView";
import LoadingViewState from "../loading_view/LoadingViewState";
import ShareViewGroup from "./ShareViewGroup";
import ShareViewRS from "./ShareViewRS";

const APP = `ShareViewState`;

const MS_FAKE = 200;

/**
 * 分享界面 - 状态
 */
export default class ShareViewState {

    private constructor () {

    }

    private static _t = new UtilObjPoolType <ShareViewState> ({
        instantiate: () => {
            return new ShareViewState ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop (ShareViewState._t, apply);
        for (let i = 0; i < ShareViewRS.listShareViewRS.length; i++) {
            let rs = ShareViewRS.listShareViewRS [i];
            val.listGroup.push (new ShareViewGroup ({
                idx: i,
                rs: rs
            }));
        };
        val.OnChange (IndexDataModule.INDEXVIEW_SHARE);
        return val;
    }

    /**
     * 集合 - 分组
     */
    listGroup: Array <ShareViewGroup> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
    /**
     * 子节点许可
     */
    childrenAble: boolean = false;

    /**
     * 索引到具体加入信息的记录
     */
    mapIdxToJoinItem: Map <number, MgrSdkCore.JoinedCtx> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);
    /**
     * 配表 id 到背包物品记录的映射
     */
    mapIdCfgToBackPackPropRecord: Map <number, indexDataStorageItem.BackpackPropRecord> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);

    OnChange (module: IndexDataModule) {
        if (
            module != IndexDataModule.DEFAULT 
            && module != IndexDataModule.INDEXVIEW_SHARE 
            && module != IndexDataModule.INDEXVIEW_EQUIP
            && module != IndexDataModule.SDK
        ) 
        {
            return;
        };
        this.mapIdxToJoinItem.clear ();
        let listJoin = MgrSdk.inst.core.WXGetListCtxJoined ();
        for (let i = 0; i < listJoin.length; i++) {
            let listJoinItem = listJoin [i];
            // 各种助力，只取首个
            if (this.mapIdxToJoinItem.has (listJoinItem.id_prop)) {
                continue
            };
            this.mapIdxToJoinItem.set (listJoinItem.id_prop, listJoinItem);
        };

        this.mapIdCfgToBackPackPropRecord.clear ();
        let listBackpackProp = jiang.mgrData.Get (indexDataStorageItem.listBackpackProp);
        for (let i = 0; i < listBackpackProp.length; i++) {
            let listBackpackPropItem = listBackpackProp [i];
            this.mapIdCfgToBackPackPropRecord.set (listBackpackPropItem.idCfg, listBackpackPropItem);
        };
    }

    /**
     * 请求刷新数据
     * @returns 
     */
    RequestJoinData () {
        // 真正的刷新许可
        let refreshAble = false;
        for (let i = 0; i < this.listGroup.length; i++) {
            let group = this.listGroup [i];
            // 助力状态
            let joined: boolean = this.mapIdxToJoinItem.has (group.rs.idProp);
            // 领取状态
            let gotted: boolean = this.mapIdCfgToBackPackPropRecord.has (group.rs.idProp);
            // 已邀请，也已领取的话，没有刷新必要
            if (joined && gotted) {
                continue;
            };
            refreshAble = true;
            break;
        };
        let listPromise: Array <Promise <any>> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
        // 有刷新需要，那就真请求，而且内置延时
        if (refreshAble) {
            listPromise.push (new Promise ((resolve) => {
                setTimeout(() => {
                    resolve (null);
                }, MS_FAKE );
            }));
            listPromise.push (MgrSdk.inst.core.WXRefreshListCtxJoined ());
        };
        return listPromise;
    }

    /**
     * 刷新邀请数据
     */
    RefreshJoinData () {
        let listPromise: Array <Promise <any>> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
        listPromise.push (new Promise ((resolve) => {
            setTimeout(() => {
                resolve (null);
            }, MS_FAKE );
        }));
        // 把正式的请求考虑进去
        listPromise.push (...this.RequestJoinData ());
        // 正式打开加载界面
        jiang.mgrUI.Open (
            LoadingView.nodeType,
            LoadingViewState.Pop (APP, listPromise)
        );
    }
}