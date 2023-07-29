import TipsViewState from "../../game/view/tips_view/TipsViewState";
import UtilObjPool from "../basic/UtilObjPool";
import utilString from "../basic/UtilString";
import MgrSdk from "./MgrSdk";

const APP = `MgrSdkEnterRS`;

/**
 * 入口函数
 */
class MgrSdkEnterRS<Args> {
    /**
     * 代号
     */
    code: string;
    /**
     * 初始化
     */
    init: (args: Args) => void;

    constructor (args: {
        code: string,
        init: (args: Args) => void
    }) 
    {
        this.code = args.code;
        this.init = args.init;
        MgrSdkEnterRS.mapCodeToRS.set (this.code, this);
    }

    private _listQuery: Array <string> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

    /**
     * 转为可解析的键值对字符串
     * @param props 
     * @returns 
     */
    ToQueryStr (props: Args) {
        this._listQuery.length = 0;
        this._listQuery.push (`_code=${this.code}`);
        for (let key in props) {
            this._listQuery.push (`${key}=${props[key]}`);
        };
        let txtQuery = this._listQuery.join (`&`);
        return txtQuery;
    }
}

namespace MgrSdkEnterRS {
    /**
     * 代号到具体逻辑的映射
     */
    export const mapCodeToRS: Map <string, MgrSdkEnterRS<any>>= UtilObjPool.Pop (UtilObjPool.typeMap, APP);
    /**
     * 空
     */
    export const none = new MgrSdkEnterRS<unknown> ({
        code: null,
        init: (args) => {
            MgrSdk.inst.core.WXHelpCommit (
                `self_init`,
                0
            )
        }
    });

    /**
     * 分享方要提供的参数
     */
    export interface InvitedArgs {
        /**
         * 分享方的标识
         */
        open_id: string;
        /**
         * 想要的物品
         */
        id_prop: string;
    };
    /**
     * 邀请新玩家以获得道具
     */
    export const invited = new MgrSdkEnterRS<InvitedArgs> ({
        code: `10001`,
        init: (args) => {
            MgrSdk.inst.Log (`wx: invited`, args);
            MgrSdk.inst.core.WXHelpCommit (
                args.open_id,
                Number.parseInt (args.id_prop)
            )
                .then ((msg) => {
                    // 不为空的话，均要提示
                    if (!utilString.CheckIsNullOrEmpty (msg)) {
                        TipsViewState.inst.Tip (msg);
                    };
                });
        }
    });
}

export default MgrSdkEnterRS;