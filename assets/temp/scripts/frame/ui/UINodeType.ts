import UtilObjPool from "../basic/UtilObjPool";
import UIViewComponent from "./UIViewComponent";
import MgrUI from "./MgrUI";
import UINode from "./UINode";
import ViewState from "./ViewState";
import BCType from "../basic/BCType";
import IndexDataModule from "../../IndexDataModule";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import UINodeInstHideRS from "./UINodeInstHideRS";
import utilString from "../basic/UtilString";
import UINodeInstEnterRS from "./UINodeInstEnterRS";

const APP = `UINodeType`;

/**
 * 节点类型
 */
class UINodeType<TComponent extends UIViewComponent, TState, TProps> {

    private constructor () {}

    private static _t = new UtilObjPoolType<UINodeType<any, any, any>>({
        instantiate: () => {
            return new UINodeType();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop<TComponent extends UIViewComponent, TState, TProps> (
        apply: string,
        args: {
            prefabPath: string,
            componentGetter: (uiInst: cc.Node) => TComponent,
            listModuleStyle: Array<UINodeType.ModuleStyle<TComponent, TState, TProps>>,
            childrenCreator: Array<UINodeType.ChildrenGeneration<UIViewComponent, TState, TProps>>,
            propsType: BCType<TProps>,
            hideRS: UINodeInstHideRS,
            enterRS: UINodeInstEnterRS
        }
    ): UINodeType <TComponent, TState, TProps>
    {
        if (utilString.CheckIsNullOrEmpty (args.prefabPath)) {
            console.error (`不该存在空地址的节点类型！`);
        };
        let val = UtilObjPool.Pop(UINodeType._t, apply);
        val._prefabPath = args.prefabPath;
        val._componentGetter = args.componentGetter;
        val._listModuleStyle = args.listModuleStyle;
        val._childrenCreator = args.childrenCreator;
        val._propsType = args.propsType;
        val._hideRS = args.hideRS;
        val._enterRS = args.enterRS;
        if (val._enterRS == null) {
            console.error (`[${args.prefabPath}] val._enterRS == null`);
        };
        
        UINodeType.totalPrefabPathList.push(val._prefabPath);
        return val;
    }

    /**
     * 所有的预制体集合
     */
    static totalPrefabPathList: Array<string> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 预制体资源路径
     */
    _prefabPath: string;
    /**
     * 组件获取器
     */
    _componentGetter: (uiInst: cc.Node) => TComponent;
    /**
     * 模块刷新器
     */
    _listModuleStyle: Array<UINodeType.ModuleStyle<TComponent, TState, TProps>>;
    /**
     * 子节点衍生清单
     */
    _childrenCreator: Array<UINodeType.ChildrenGeneration<TComponent, any, any>>;
    /**
     * 参数类型
     */
    _propsType: BCType<TProps>;
    /**
     * 隐藏途径
     */
    _hideRS: UINodeInstHideRS;
    /**
     * 入场途径
     */
    _enterRS: UINodeInstEnterRS;

    /**
     * 创建节点
     * @param tState 
     * @param tProps 
     * @param id 
     */
    CreateNode (tState: TState, tProps: TProps, id: number) {
        let uiNode = UtilObjPool.Pop(UINode._t, APP);
        uiNode.nodeType = this;
        for (let i = 0; i < this._listModuleStyle.length; i++) {
            let moduleStyle = this._listModuleStyle[i];
            let moduleVersion = 0;
            for (let j = 0; j < moduleStyle._listRefModule.length; j++) {
                moduleVersion += MgrUI.inst.ModuleGetVersion(moduleStyle._listRefModule[j]);
            };
            uiNode.listStyleVersion.push(moduleVersion);
        };
        uiNode.state = tState;
        uiNode.props = tProps;
        for (let i = 0; i < this._childrenCreator.length; i++) {
            let childCreator = this._childrenCreator[i];
            let listChildren = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
            childCreator._uiNodeCreator(tState, tProps, listChildren)
            uiNode.listChildrenNode.push(listChildren);
        };
        uiNode.id = id;

        return uiNode;
    }
}

namespace UINodeType {
    /**
     * 模块刷新器
     */
    export class ModuleStyle<TComponent extends UIViewComponent, TState, TProps> {

        private constructor () {}

        private static _t = new UtilObjPoolType<ModuleStyle<any, any, any>>({
            instantiate: () => {
                return new ModuleStyle();
            },
            onPop: (t) => {

            },
            onPush: (t) => {

            },
            tag: `ModuleStyle`
        });

        static Pop<TComponent extends UIViewComponent, TState, TProps> (
            apply: string,
            args: {
                listRefModule: Array<IndexDataModule>,
                propsFilter: (uiCom: TComponent, tState: TState, tProps: TProps) => void
            }
        ) 
        {
            let val = UtilObjPool.Pop(ModuleStyle._t, apply);
            val._listRefModule = args.listRefModule;
            val._propsFilter = args.propsFilter;
            return val;
        }

        /**
         * 关心的模块
         */
        _listRefModule: Array<IndexDataModule>;
         /**
          * 样式填充器
          */
        _propsFilter: (uiCom: TComponent, tState: TState, tProps: TProps) => void;
    }

    /**
     * 子节点生成器
     */
    export class ChildrenGeneration<TComponent extends UIViewComponent, TState, TProps> {
        
        private constructor () {}

        private static _t = new UtilObjPoolType<ChildrenGeneration<any, any, any>>({
            instantiate: () => {
                return new ChildrenGeneration();
            },
            onPop: (t) => {

            },
            onPush: (t) => {

            },
            tag: `ChildrenGeneration`
        });

        static Pop<TComponent extends UIViewComponent, TState, TProps> (
            apply: string,
            args: {
                containerGetter: (uiCom: TComponent) => cc.Node,
                uiNodeCreator: (tState: TState, tProps: TProps, listNode: Array<UINode>) => void
            }
        ) 
        {
            let val = UtilObjPool.Pop(ChildrenGeneration._t, apply);
            val._containerGetter = args.containerGetter;
            val._uiNodeCreator = args.uiNodeCreator;
            return val;
        }

        /**
         * 容器获取器
         */
        _containerGetter: (uiCom: TComponent) => cc.Node;
        /**
         * 子节点衍生器
         */
        _uiNodeCreator: (tState: TState, tProps: TProps, listNode: Array<UINode>) => void;
    }
}

export default UINodeType;