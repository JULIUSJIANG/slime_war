import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";

const APP = `UINodeInstHideRS`;

/**
 * ui 实例隐藏方式
 */
class UINodeInstHideRS {

    private constructor () {}

    private static _t = new UtilObjPoolType<UINodeInstHideRS>({
        instantiate: () => {
            return new UINodeInstHideRS();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (
        apply: string,
        args: {
            hide: (inst: cc.Node) => void,
            show: (inst: cc.Node) => void;
        }
    )
    {
        let val = UtilObjPool.Pop(UINodeInstHideRS._t, apply);
        val.hide = args.hide;
        val.show = args.show;
        return val;
    }

    /**
     * 隐藏的方式
     */
    hide: (inst: cc.Node) => void;

    /**
     * 发生显示
     */
    show: (inst: cc.Node) => void;
}

namespace UINodeInstHideRS {
    /**
     * 已经显示出来，但是缩放为 0
     */
    const setDisplayedButlocalScale0: Set<cc.Node> = UtilObjPool.Pop (UtilObjPool.typeSet, APP);
    /**
     * 穷举函数
     * @param val 
     * @param val2 
     * @param set 
     */
    function setDisplayedButlocalScale0Walk (val: cc.Node, val2: cc.Node, set: Set<cc.Node>) {
        val.setParent (null);
        // 反正不在本地了，恢复缩放
        val.scale = 1;
    }

    /**
     * 清除所有缩放为 0 的节点
     */
    export function ClearScale0 () {
        setDisplayedButlocalScale0.forEach (setDisplayedButlocalScale0Walk);
        setDisplayedButlocalScale0.clear ();
    }

    /**
     * 通过本地缩放为 0 以进行隐藏
     */
    export const localScale0 = UINodeInstHideRS.Pop(
        APP,
        {
            hide: (inst) => {
                inst.setSiblingIndex(inst.parent.children.length - 1);
                inst.scale = 0;
                setDisplayedButlocalScale0.add (inst);
            },
            show: (inst) => {
                setDisplayedButlocalScale0.delete (inst);
            }
        }
    );

    /**
     * 通过设置父节点为空进行隐藏
     */
    export const setParentNull = UINodeInstHideRS.Pop(
        APP,
        {
            hide: (inst) => {
                inst.setParent(null);
            },
            show: (inst) => {
                
            }
        }
    );
};

export default UINodeInstHideRS;