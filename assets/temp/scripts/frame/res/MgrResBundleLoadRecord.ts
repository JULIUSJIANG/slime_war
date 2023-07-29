import BCPromiseCtrl from "../basic/BCPromiseCtrl";
import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";

const APP = `MgrResBundleLoadRecord`;

/**
 * 资源包加载记录
 */
export default class MgrResBundleLoadRecord {
    /**
     * 路径
     */
    path: string;
    /**
     * 具体资源包
     */
    content: cc.AssetManager.Bundle;
    /**
     * 进度
     */
    process: BCPromiseCtrl<cc.AssetManager.Bundle> = BCPromiseCtrl.Pop (APP);

    private constructor () {}
    private static _t = new UtilObjPoolType<MgrResBundleLoadRecord>({
        instantiate: () => {
            return new MgrResBundleLoadRecord ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, path: string) {
        let val = UtilObjPool.Pop (MgrResBundleLoadRecord._t, apply);
        val.path = path;
        val.process._promise.then ((t) => {
            val.content = t;
        });
        return val;
    }
}