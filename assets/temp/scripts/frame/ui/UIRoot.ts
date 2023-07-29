import UtilObjPool from "../basic/UtilObjPool";
import UIViewComponent from "./UIViewComponent";
import MgrUI from "./MgrUI";
import UINode from "./UINode";
import MgrRes from "../res/MgrRes";
import UINodeType from "./UINodeType";
import jiang from "../global/Jiang";
import UIMask from "./UIMask";
import utilNode from "../basic/UtilNode";
import UIRootTreeJson from "./UIRootTreeJson";
import IndexDataModule from "../../IndexDataModule";
import UINodeInstHideRS from "./UINodeInstHideRS";
import MgrEvter from "../evter/MgrEvter";
import UtilArray from "../basic/UtilArray";
import UINodePrefabRecord from "./UINodePrefabRecord";

const APP = `UIRoot`;

const {ccclass, property} = cc._decorator;

/**
 * 起码帧率 30
 */
const RENDER_COST_MAX = 1000 / 30;

/**
 * ui 根界面
 */
@ccclass
export default class UIRoot extends UIViewComponent {
    /**
     * ui 根界面
     */
    static inst: UIRoot;

    constructor () {
        super();
        UIRoot.inst = this;
    }

    /**
     * 模块到最新版本的记录
     */
    private _moduleToVersion: Map<IndexDataModule, number> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);
    /**
     * 刷新判断 - 模块数据变化
     */
    private _listChangedModule: Array<IndexDataModule> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
    /**
     * 刷新判断 - 新的界面打开
     */
    private _currViewRefreshedId: number;
    /**
     * 刷新判断 - 旧的界面关闭
     */
    private _currViewRefreshedCount: number;

    /**
     * 帧 id 生成器
     */
    static _frameIdGen = 0;
    /**
     * 帧 id
     */
    _frameId = 0;

    /**
     * 当前用于画面刷新的迭代器
     */
    private renderIterator: IterableIterator<any>;
    /**
     * 迭代器结果
     */
    private renderIteratorResult: IteratorResult<any>;

    /**
     * 上次更新时候的窗口数据列表
     */
    private versionListViewInfo: number;

    update (dt: number): void {
        let startMS = Date.now();

        // 注意刷新窗口数据列表
        if (this.versionListViewInfo != MgrUI.inst.versionListViewInfo) {
            this.versionListViewInfo = MgrUI.inst.versionListViewInfo;
            MgrUI.inst.OnListViewChanged ();
        };

        this._frameId = ++UIRoot._frameIdGen;
        MgrEvter.inst.evterUpdate.Call(dt * 1000);

        // 状态 - 是否有新的窗口打开
        let viewGened = this._currViewRefreshedId != MgrUI.inst._idGenView._genId;
        this._currViewRefreshedId = MgrUI.inst._idGenView._genId;

        // 状态 - 是否有旧的窗口关闭
        let viewClosed = this._currViewRefreshedCount != MgrUI.inst._listViewDisplay.length;
        this._currViewRefreshedCount = MgrUI.inst._listViewDisplay.length;

        // 检测哪些模块发生了变化
        this._listChangedModule.length = 0;
        MgrUI.inst._moduleToVersionMap.forEach((version, module) => {
            // 和最新记录的版本一致，忽略
            if (this._moduleToVersion.get(module) == version) {
                return;
            };
            // 更正为该模块的最新版本
            this._moduleToVersion.set(module, version);
            // 记录下来该模块
            this._listChangedModule.push(module);
        });
        let versionChanged = 0 < this._listChangedModule.length;

        // 广播给所有模块，告诉他们哪些模块发生了变化，这个过程主要是让 ui 需要的数据在真正要用到前有一个统一缓存的机会
        for (let i = 0; i < MgrUI.inst._listViewInfo.length; i++) {
            for (let j = 0; j < this._listChangedModule.length; j++) {
                MgrUI.inst._listViewInfo[i].tState.OnChange(this._listChangedModule[j]);
            };
        };

        // 3 种情况有其中一种涉及，那么进行节点比对
        if (
            viewGened
            || viewClosed
            || versionChanged
        ) 
        {
            // 否则正式进行刷新
            this.Refresh();
        };

        // 推进节点比对
        while (!this.renderIteratorResult.done) {
            this.renderIteratorResult = this.renderIterator.next();
            // 超时的话，下一帧再说
            if (RENDER_COST_MAX <= Date.now() - startMS) {
                break;
            };
        };

        // 入场动画
        let msPassed = dt * 1000;
        msPassed = Math.min (msPassed, 1000 / 60);
        this._listPrefab.length = 0;
        // 提取预制体信息
        this.AnimEnterPrefabUpdate (
            this.node,
            this.viewListCurrent,
            msPassed
        );
        // 移除重复的
        UtilArray.RemRepeat (this._listPrefab);
        // 正式更新预制体信息
        for (let i = 0; i < this._listPrefab.length; i++) {
            let prefab = this._listPrefab [i];
            let record = UINodePrefabRecord.GetCache (prefab);
            record.msDisplayed += msPassed;
        };
        // 更新实例信息
        this.AnimEnterInstUpdate (
            this.node,
            this.viewListCurrent,
            msPassed,
            0
        );
    }

    /**
     * 集合，目前展示用到的所有预制体
     */
    _listPrefab: Array <cc.Prefab> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
    /**
     * 入场动画刷新
     * @param node 
     * @param listVirtural 
     */
    AnimEnterPrefabUpdate (
        node: cc.Node,
        listVirtural: Array <UINode>,
        passedMS: number
    ) 
    {
        for (let i = 0; i < listVirtural.length; i++) {
            let nodeVirtural = listVirtural [i];
            let nodeInst = node.children [i];
            let nodeInstCom = nodeVirtural.nodeType._componentGetter (nodeInst);
            let prefab = jiang.mgrRes.GetPrefab (nodeVirtural.nodeType._prefabPath);
            this._listPrefab.push (prefab);
            for (let j = 0; j < nodeVirtural.nodeType._childrenCreator.length; j++) {
                let childrenCreator = nodeVirtural.nodeType._childrenCreator [j];
                let nodeInstContainer = childrenCreator._containerGetter (nodeInstCom);
                let nodeVirturalChildren = nodeVirtural.listChildrenNode [j];
                this.AnimEnterPrefabUpdate (
                    nodeInstContainer,
                    nodeVirturalChildren,
                    passedMS
                );
            };
        };
    }

    /**
     * 入场动画刷新
     * @param node 
     * @param listVirtural 
     */
    AnimEnterInstUpdate (
        node: cc.Node,
        listVirtural: Array <UINode>,
        passedMS: number,
        idxLocal: number
    ) 
    {
        for (let i = 0; i < listVirtural.length; i++) {
            let nodeVirtural = listVirtural [i];
            let nodeInst = node.children [i];
            let nodeInstCom = nodeVirtural.nodeType._componentGetter (nodeInst);
            nodeInstCom._msDisplayed += passedMS;
            nodeInstCom._msDisplayedTemp += passedMS;

            let prefab = jiang.mgrRes.GetPrefab (nodeVirtural.nodeType._prefabPath);
            let prefabMsg = UINodePrefabRecord.GetCache (prefab);
            nodeVirtural.nodeType._enterRS.Update (prefabMsg, nodeInstCom, i);
            for (let j = 0; j < nodeVirtural.nodeType._childrenCreator.length; j++) {
                let childrenCreator = nodeVirtural.nodeType._childrenCreator [j];
                let nodeInstContainer = childrenCreator._containerGetter (nodeInstCom);
                let nodeVirturalChildren = nodeVirtural.listChildrenNode [j];
                this.AnimEnterInstUpdate (
                    nodeInstContainer,
                    nodeVirturalChildren,
                    passedMS,
                    j
                );
            };
        };
    }

    /**
     * 当前的虚拟节点集合
     */
    viewListCurrent: Array<UINode> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
    /**
     * 即将的虚拟节点集合
     */
    viewListWill: Array<UINode> = UtilObjPool.Pop(UtilObjPool.typeArray, APP)

    /**
     * 刷新画面
     */
    Refresh () {
        // 刷新前总是回收上一次的内容
        for (let i = 0; i < this.viewListWill.length; i++) {
            UtilObjPool.Push(this.viewListWill[i]);
        };
        this.viewListWill.length = 0;

        // 填充新的 ui 要求
        for (let i = 0; i < MgrUI.inst._listViewDisplay.length; i++) {
            let info = MgrUI.inst._listViewDisplay[i];
            this.viewListWill.push(
                info.nodeType.CreateNode(
                    info.tState,
                    info.tProps,
                    info.id
                )
            );
        };
        // 需要遮罩的话，从中插入遮罩
        if (jiang.mgrUI._maskIdx != null) {
            this.viewListWill.splice(jiang.mgrUI._maskIdx, 0, UIMask.nodeType.CreateNode(0, 0, 0));
        };
        
        // 清除一遍优先级
        for (let i = 0; i < MgrRes.inst.mgrAssets.listTask.length; i++) {
            let task = MgrRes.inst.mgrAssets.listTask [i];
            task.priorityForUI = 10000;
        };
        // 重置全局加载优先级
        this._loadPriority = 0;
        // 生成比对任务
        this.renderIterator = this.DisputeList (
            this.node,
            this.viewListCurrent,
            this.viewListWill
        );
        this.renderIteratorResult = this.renderIterator.next();
    }

    /**
     * 基准加载优先级
     */
    _loadPriority: number;

    /**
     * 获取完整的节点树
     * @param listNode 
     * @returns 
     */
    static GetTreeTxt (listNode: Array<UINode>) {
        let arr: Array<UIRootTreeJson> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
        for (let i = 0; i < listNode.length; i++) {
            arr.push(UIRoot.CreateTreeNode(listNode[i]));
        };
        let txt = JSON.stringify(arr, null, 4);
        for (let i = 0; i < arr.length; i++) {
            this.DestoryTreeNode(arr[i]);
        };
        UtilObjPool.Push(arr);
        return txt;
    }

    /**
     * 获取单个节点树
     * @param uiNode 
     * @returns 
     */
    private static CreateTreeNode (uiNode: UINode): UIRootTreeJson {
        let arrSelf = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
        for (let i = 0; i < uiNode.listChildrenNode.length; i++) {
            let children = uiNode.listChildrenNode[i];
            let arrChildren = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
            for (let j = 0; j < children.length; j++) {
                let child = children[j];
                arrChildren.push(UIRoot.CreateTreeNode( child ));
            };
            arrSelf.push(arrChildren);
        };
        return UIRootTreeJson.Pop(
            APP,
            `[${uiNode._id}]${uiNode.nodeType._prefabPath}`,
            arrSelf
        );
    }

    /**
     * 销毁树节点
     * @param node 
     */
    private static DestoryTreeNode (node: UIRootTreeJson) {
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            for (let j = 0; j < child.length; j++) {
                let kid = child[j];
                this.DestoryTreeNode(kid);
            };
        };
        UtilObjPool.Push(node);
    }

    /**
     * 解决列表争议
     * @param container 
     * @param listCurr 
     * @param listFresh 
     */
    *DisputeList (
        container: cc.Node, 
        listCurr: Array<UINode>, 
        listFresh: Array<UINode>
    ) 
    {
        // 不可以有空的
        for (let i = 0; i < listFresh.length;) {
            let ele = listFresh[i];
            // 空的话，不能留
            if (ele == null) {
                listFresh.splice(i, 1);
                continue;
            };
            // 该节点预制没有准备好的话，先忽略掉，准备好再刷新
            let prefabb = jiang.mgrRes.GetPrefab (ele.nodeType._prefabPath);
            if (prefabb == null) {
                listFresh.splice(i, 1);
                let loadTask = jiang.mgrRes.mgrAssets.GetLoadRecord (ele.nodeType._prefabPath);
                loadTask.priorityForUI = ++this._loadPriority;
                continue;
            };
            i++;
        };

        // 标识到具体旧节点的映射
        let idToCurrNodeDict: Map<number, UINode> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

        // 当前节点，全部用字典存储起来
        for (let i = 0; i < listCurr.length; i++) {
            let currNode = listCurr[i];
            currNode.match = null;
            if (currNode.id == null) {
                continue;
            };
            if (idToCurrNodeDict.has(currNode.id)) {
                console.error(`id 冲突 容器[${container.name}] 资源[${currNode.nodeType._prefabPath}]`);
                continue;
            };
            idToCurrNodeDict.set(currNode.id, currNode);
        };

        // 优先进行定向匹配
        for (let i = 0; i < listFresh.length; i++) {
            let freshNode = listFresh[i];
            freshNode.match = null;
            if (
                // 没有有定向匹配的需要
                freshNode.id == null
                // 没有有定向匹配的目标
                || !idToCurrNodeDict.has(freshNode.id)
            )
            {
                continue;
            };
            let currNode = idToCurrNodeDict.get(freshNode.id);
            if (
                // 已被其他节点匹配
                currNode.match != null
                // 资源不一致
                || currNode.nodeType._prefabPath != freshNode.nodeType._prefabPath
            )
            {
                continue;
            };
            freshNode.match = currNode;
            currNode.match = freshNode;
        };

        // 回收
        UtilObjPool.Push(idToCurrNodeDict);

        // 否则进行类型匹配
        for (let i = 0; i < listFresh.length; i++) {
            let freshNode = listFresh[i];
            // 已经有匹配目标，直接忽略
            if (freshNode.match != null) {
                continue;
            };
            // 否则尝试查找匹配的类型
            for (let j = 0; j < listCurr.length; j++) {
                let currNode = listCurr[j];
                // 已经有匹配的目标，直接忽略
                if (
                    // 已被其他节点匹配
                    currNode.match != null
                    // 资源不一致
                    || currNode.nodeType._prefabPath != freshNode.nodeType._prefabPath    
                ) 
                {
                    continue;
                };
                if (freshNode.id != null) {
                    for (let i = 0; i < currNode.com._animOnEnable.length; i++) {
                        currNode.com._animOnEnable[i].Reset();
                    };
                    for (let i = 0; i < currNode.com._audioOnEnable.length; i++) {
                        currNode.com._audioOnEnable[i].Reset();
                    };
                };

                freshNode.match = currNode;
                currNode.match = freshNode;
                break;
            };
        };

        // 删除 curr 当前无法复用的内容
        for (let deleteI = 0; deleteI < listCurr.length;) {
            let currNode = listCurr[deleteI];
            // 需要被复用的话，忽略
            if (currNode.match != null) {
                deleteI++;
                continue;
            };
            this.Delete(
                container,
                listCurr,
                deleteI
            );
        };

        // 按顺序进行比对
        for (let i = 0; i < listFresh.length; i++) {
            let freshNode = listFresh[i];
            // 有匹配的复用项
            if (freshNode.match != null) {
                // 如果对应位置的 ui 节点还不是自己打算复用的那个
                if (freshNode.match != listCurr[i]) {
                    // 查找匹配项的位置
                    let targetIdx = i;
                    for (; targetIdx < listCurr.length; targetIdx++) {
                        let currNode = listCurr[targetIdx];
                        if (currNode != freshNode.match) {
                            continue;
                        };
                        break;
                    };
                    // 把它迁移到对应的位置
                    this.Move(
                        container,
                        listCurr,

                        targetIdx,
                        i
                    );
                };
                // 进行比对
                yield* this.Modify(
                    container.children[i],
                    listCurr[i],
                    listFresh[i]
                );
            }
            else {
                yield* this.Insert(
                    container,
                    listCurr,

                    freshNode,
                    i
                );
                this.count++;
                yield;
            };
        };
    }

    count = 0;

    /**
     * 增加
     */
    *Insert (
        container: cc.Node,
        listCurr: Array<UINode>,

        freshNode: UINode,
        idx: number
    ) 
    {
        let currNode = freshNode.CopyShallow();
        listCurr.splice(idx, 0, currNode);

        let uiInst = this.Pop(currNode.nodeType);
        currNode.nodeType._hideRS.show (uiInst);
        if (uiInst.parent != container) {
            uiInst.setParent(container);
        };
        uiInst.scale = 1;
        uiInst.setSiblingIndex(idx);

        // 获取目标组件
        let uiCom = currNode.nodeType._componentGetter(uiInst);
        if (uiCom == null) {
            console.error (`[${uiInst.name}] 上挂载的组件不对`, currNode);
        };

        // 记录当前实例
        currNode.com = uiCom;

        // 每个模块都得到刷新
        for (let i = 0; i < currNode.nodeType._listModuleStyle.length; i++) {
            if (i == 0) {
                uiCom.OffAll();
            };
            let module = currNode.nodeType._listModuleStyle[i];
            module._propsFilter(
                uiCom,
                currNode.state,
                currNode.props
            );
        };

        // 解决子冲突
        yield* this.DisputeChildren(
            uiInst,
            currNode,
            freshNode
        );
    }

    /**
     * 删除
     */
    Delete (
        container: cc.Node,
        listUiNode: Array<UINode>,
        idx: number
    ) 
    {
        let inst = container.children[idx];
        let uiNode = listUiNode[idx];
        let com = uiNode.nodeType._componentGetter(inst);
        com._msDisplayedTemp = 0;
        // 先删除子节点
        for (let i = 0; i < uiNode.nodeType._childrenCreator.length; i++) {
            let childCreator = uiNode.nodeType._childrenCreator[i];
            let container = childCreator._containerGetter(com);
            let children = uiNode.listChildrenNode[i];
            for (let j = children.length - 1; 0 <= j; j--) {
                this.Delete(
                    container,
                    children,
                    j
                );
            };
        };
        // 回收实例
        uiNode.nodeType._hideRS.hide(inst);
        this.Push(uiNode.nodeType, inst);
        listUiNode.splice(idx, 1);
        UtilObjPool.Push(uiNode);
    }

    /**
     * 修改
     */
    *Modify (
        uiInst: cc.Node,
        currNode: UINode,
        freshNode: UINode
    ) 
    {
        let com = freshNode.nodeType._componentGetter(uiInst);
        let argsChanged = 
            // 核心逻辑已经发生了变化
            freshNode.nodeType != currNode.nodeType
            // 公共内容不一致
            || freshNode.state != currNode.state
            // 参数不一致
            || !freshNode.nodeType._propsType._equal(freshNode.props, currNode.props);

        // 穷举所有样式模块
        for (let i = 0; i < freshNode.nodeType._listModuleStyle.length; i++) {
            let moduleStyle = freshNode.nodeType._listModuleStyle[i];
            // 参数没变化，而且版本一致的话，什么也不用干
            if (!argsChanged && freshNode.listStyleVersion[i] == currNode.listStyleVersion[i]) {
                continue;
            };
            if (i == 0) {
                com.OffAll();
            };
            // 否则刷新一下
            moduleStyle._propsFilter(
                com,
                freshNode.state,
                freshNode.props
            );
        };

        // 同步参数
        freshNode.MapPropsTo(currNode);

        // 解决子争议
        yield* this.DisputeChildren(
            uiInst,
            currNode,
            freshNode
        );
    }

    /**
     * 移动节点
     * @param container 
     * @param listNode 
     * @param idxFrom 
     * @param idxTo 
     */
    Move (
        container: cc.Node,
        listNode: Array<UINode>,

        idxFrom: number,
        idxTo: number
    )
    {
        if (idxFrom == idxTo) {
            return;
        };
        let uiInst = container.children[idxFrom];
        uiInst.setSiblingIndex(idxTo);

        let uiNode = listNode[idxFrom];
        listNode.splice(idxFrom, 1);
        listNode.splice(idxTo, 0, uiNode);
    }

    /**
     * 解决子冲突
     * @param uiInst 
     * @param currNode 
     * @param freshNode 
     */
    *DisputeChildren (
        uiInst: cc.Node,
        currNode: UINode,
        freshNode: UINode
    )
    {
        // 当前子节点列表
        let currChildrenList = currNode.listChildrenNode;
        // 目标子节点列表
        let freshChildList = freshNode.listChildrenNode;

        let com = freshNode.nodeType._componentGetter(uiInst);
        let listModule = freshNode.nodeType._childrenCreator;
        for (let i = 0; i < listModule.length; i++) {
            let module = listModule[i];
            let container = module._containerGetter(com);

            // 确保数量一致，哪怕实际为空
            while (currChildrenList.length <= i) {
                currChildrenList.push(UtilObjPool.Pop(UtilObjPool.typeArray, APP));
            };
            let currChildren = currChildrenList[i];

            // 确保数量一致，哪怕实际为空
            while (freshChildList.length <= i) {
                freshChildList.push(UtilObjPool.Pop(UtilObjPool.typeArray, APP));
            };
            let freshChildren = freshChildList[i];

            // 解决该容器冲突
            yield* this.DisputeList(
                container,
                currChildren,
                freshChildren
            );
        };
    }

    /**
     * 实例记录
     */
    _map: Map<string, Array<cc.Node>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 从对象池提取 ui 实例
     * @param prefabPath 
     */
    Pop (nodeType: UINodeType<any, any, any>) {
        this.Promise(nodeType._prefabPath);
        let listStoraged = this._map.get(nodeType._prefabPath);
        // 实例
        let uiInst: cc.Node;
        // 没有库存
        if (listStoraged.length == 0) {
            let prefab = MgrRes.inst.GetPrefab(nodeType._prefabPath);
            if (prefab == null) {
                console.error(`路径[${nodeType._prefabPath}]对应的预制体为空`);
            };
            uiInst = cc.instantiate( prefab );

            let com = nodeType._componentGetter(uiInst);
            com._dateNowInstantiate = Date.now ();
            if (com == null) {
                console.error(`[${uiInst.name}]上挂载的组件不匹配`, nodeType);
            };
            com.Record();

            // 删除预制体中预览用的内容
            for (let i = 0; i < nodeType._childrenCreator.length; i++) {
                let children = nodeType._childrenCreator[i];
                let container = children._containerGetter(com);
                if (container == null) {
                    console.error (`资源[${nodeType._prefabPath}]上有容器为空`);
                };
                // 确保清空
                while (0 < container.children.length) {
                    let child = container.children[container.children.length - 1];
                    console.error(`${utilNode.GetPath(child)} 可提前删除`);
                    child.setParent(null);
                    child.destroy();
                };
            };
        }
        // 有库存
        else {
            uiInst = listStoraged.pop();
        };
        return uiInst;
    }

    /**
     * 从对象池回收 ui 实例
     * @param prefabPath 
     * @param uiInst 
     */
    Push (nodeType: UINodeType<any, any, any>, uiInst: cc.Node) {
        this.Promise(nodeType._prefabPath);
        this._map.get(nodeType._prefabPath).push(uiInst);
    }

    /**
     * 确保对象池记录存在
     * @param prefabPath 
     */
    Promise (prefabPath: string) {
        if (this._map.has(prefabPath)) {
            return;
        };
        this._map.set(prefabPath, UtilObjPool.Pop(UtilObjPool.typeArray, APP));
    }

    /**
     * 清空缓存
     */
    ClearCache () {
        UINodeInstHideRS.ClearScale0 ();
        this._map.forEach ((listNode, path) => {
            for (let i = 0; i < listNode.length; i++) {
                let listNodeI = listNode [i];
                listNodeI.destroy ();
            };
            listNode.length = 0;
        });
    }
}