import UtilObjPool from "../basic/UtilObjPool";
import UIViewComponent from "./UIViewComponent";
import UINodeType from "./UINodeType";
import UtilObjPoolType from "../basic/UtilObjPoolType";

const APP = `UINode`;

let idGen = 0;
/**
 * 虚拟的 ui 节点
 */
class UINode {

    private constructor () {
        this._id = ++idGen;
    }

    /**
     * 对应的对象池类型
     */
    static _t = new UtilObjPoolType({
        instantiate: () => {
            return new UINode();
        },
        onPop: (t) => {
            t.listStyleVersion = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
            t.listChildrenNode = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
        },
        onPush: (t) => {
            // 释放参数
            t.nodeType._propsType._release(t.props);
            t.nodeType = null;
            UtilObjPool.Push(t.listStyleVersion);
            t.listStyleVersion = null;
            t.state = null;
            t.props = null;
            for (let i = 0; i < t.listChildrenNode.length; i++) {
                let children = t.listChildrenNode[i];
                for (let j = 0; j < children.length; j++) {
                    let child = children[j];
                    UtilObjPool.Push(child);
                };
                UtilObjPool.Push(children);
            };
            UtilObjPool.Push(t.listChildrenNode);
            t.listChildrenNode = null;
            t.id = null;
            t.match = null;
            t.com = null;
        },
        tag: APP
    })

    static Pop (apply: string) {
        return UtilObjPool.Pop(UINode._t, apply);
    }

    /**
     * 实例标识
     */
    _id: number;

    /**
     * 节点类型
     */
    nodeType: UINodeType<UIViewComponent, any, any>;
    /**
     * 样式版本记录
     */
    listStyleVersion: Array<number>;
    /**
     * 公共内容
     */
    state: any;
    /**
     * 私有内容
     */
    props: any;
    /**
     * 子节点
     */
    listChildrenNode: Array<Array<UINode>>;
    /**
     * 标识
     */
    id: number;

    /**
     * 匹配映射到当前节点
     */
    match: UINode;
    /**
     * 实体组件
     */
    com: UIViewComponent;

    /**
     * 同步属性
     * @param uiNode 
     */
    MapPropsTo (uiNode: UINode) {
        if (uiNode.props != null) {
            uiNode.nodeType._propsType._release(uiNode.props);
        };
        uiNode.nodeType = this.nodeType;
        uiNode.listStyleVersion.length = 0;
        uiNode.listStyleVersion.push(...this.listStyleVersion);
        uiNode.state = this.state;
        uiNode.props = uiNode.nodeType._propsType._clone(this.props);
        uiNode.id = this.id;
    }

    /**
     * 浅拷贝
     */
    CopyShallow () {
        let uiNode = UtilObjPool.Pop(UINode._t, APP);
        this.MapPropsTo(uiNode);
        for (let i = 0; i < this.listChildrenNode.length; i++) {
            uiNode.listChildrenNode.push(UtilObjPool.Pop(UtilObjPool.typeArray, APP));
        };
        return uiNode;
    }
}

export default UINode;