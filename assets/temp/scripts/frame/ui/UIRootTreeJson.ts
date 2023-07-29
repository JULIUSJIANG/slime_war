import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";

const APP = `UIRootTreeJson`;

/**
 * ui 节点树的 json 结构
 */
class UIRootTreeJson {

    private constructor () {}

    private static _t = new UtilObjPoolType<UIRootTreeJson>({
        instantiate: () => {
            return new UIRootTreeJson();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            for (let i = 0; i < t.children.length; i++) {
                let child = t.children[i];
                UtilObjPool.Push( child );
            };
            UtilObjPool.Push(t.children);
            t.res = null;
            t.children = null;
        },
        tag: APP
    });

    /**
     * 提取实例
     * @param apply 
     * @param res 
     * @param children 
     * @returns 
     */
    static Pop (
        apply: string,
        res: string,
        children: Array<Array<UIRootTreeJson>>
    )
    {
        let val = UtilObjPool.Pop(UIRootTreeJson._t, apply);
        val.res = res;
        val.children = children;
        return val;
    }

    /**
     * 资源名
     */
    res: string;
    /**
     * 子节点
     */
    children: Array<Array<UIRootTreeJson>>;
}

export default UIRootTreeJson;