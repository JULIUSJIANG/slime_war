import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";
import WXImgLoaderStatus from "./WXImgLoaderStatus";
import WXImgLoaderStatusLoaded from "./WXImgLoaderStatusLoaded";
import WXImgLoaderStatusLoading from "./WXImgLoaderStatusLoading";

const APP = `WXImgLoader`;

/**
 * 微信图片加载器
 */
export default class WXImgLoader {

    private constructor () {}

    private static _t = new UtilObjPoolType<WXImgLoader>({
        instantiate: () => {
            return new WXImgLoader ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, url: string) {
        let val = UtilObjPool.Pop (WXImgLoader._t, apply);
        val.url = url;

        val.statusLoading = new WXImgLoaderStatusLoading (val);
        val.statusLoaded = new WXImgLoaderStatusLoaded (val);
        val.EnterStatus (val.statusLoading);

        return val;
    }

    /**
     * 地址
     */
    url: string;

    /**
     * 具体贴图
     */
    sprf: cc.SpriteFrame;

    /**
     * 当前状态
     */
    currStatus: WXImgLoaderStatus;
    /**
     * 状态 - 加载中
     */
    statusLoading: WXImgLoaderStatusLoading;
    /**
     * 状态 - 加载完成
     */
    statusLoaded: WXImgLoaderStatusLoaded;

    /**
     * 进入状态
     * @param status 
     */
    EnterStatus (status: WXImgLoaderStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }
}