import BCEventer from "../basic/BCEventer";
import BCIdGeneration from "../basic/BCIdGeneration";
import UtilObjPool from "../basic/UtilObjPool";
import UIViewComponent from "./UIViewComponent";
import UINodeType from "./UINodeType";
import ViewState from "./ViewState";
import IndexDataModule from "../../IndexDataModule";
import UtilObjPoolType from "../basic/UtilObjPoolType";

const APP = `MgrUI`;

/**
 * ui 管理器
 */
class MgrUI {

    private constructor () {}

    private static _t = new UtilObjPoolType<MgrUI>({
        instantiate: () => {
            return new MgrUI();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        return UtilObjPool.Pop(MgrUI._t, apply);
    }

    /**
     * ui 的相机
     */
    private _cameraUI: cc.Camera;
    /**
     * 容器 - ui
     */
    _containerUI: cc.Node;
    /**
     * 窗口 id 生成器
     */
    _idGenView = BCIdGeneration.Pop(APP);

    /**
     * 每像素的尺寸
     */
    _sizePerPixel: number;

    /**
     * 进行初始化
     * @param containerUI 
     */
    Init (
        cameraUI: cc.Camera,
        containerUI: cc.Node
    )
    {
        this._cameraUI = cameraUI;
        this._containerUI = containerUI;
        // 每像素对应多少物理单位
        this._sizePerPixel = 10 / Math.min(this._containerUI.width, this._containerUI.height) / 4;
    }

    /**
     * 列表 - 当前所有窗口信息
     */
    _listViewInfo: Array<MgrUI.ViewInfo> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 列表 - 当前要展示的窗口信息
     */
    _listViewDisplay: Array<MgrUI.ViewInfo> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 窗口数据的版本
     */
    versionListViewInfo = 0;

    /**
     * 打开界面
     * @param tState 
     * @param nodeType 
     */
    Open<TCom extends UIViewComponent, TState extends ViewState, TProps> (
        nodeType: UINodeType<TCom, TState, TProps>,
        tState: TState
    )
    {
        let viewInfo = UtilObjPool.Pop(MgrUI.poolType, APP);
        viewInfo.nodeType = nodeType;
        viewInfo.tState = tState;
        viewInfo.tProps = null;
        viewInfo.id = this._idGenView.GenId();
        tState.Init(viewInfo.id);
        this._listViewInfo.push(viewInfo);
        this.versionListViewInfo++;
        // this.OnListViewChanged();
        return viewInfo.id;
    }

    /**
     * 关闭某个界面
     */
    Close (idView: number) {
        let idx = this._listViewInfo.findIndex((info) => {
            return info.id == idView;
        });
        if (idx < 0) {
            return;
        };
        let info = this._listViewInfo[idx];
        info.tState._evterDestory.Call(null);
        this._listViewInfo.splice(idx, 1);
        this.versionListViewInfo++;
        // this.OnListViewChanged();
    }

    /**
     * 遮罩的索引
     */
    _maskIdx: number;

    /**
     * 上一次展示出来的界面
     */
    private _setDisplay: Set<number> = UtilObjPool.Pop(UtilObjPool.typeSet, APP) as Set<number>;

    /**
     * 当列表发生了变化的时候
     */
    OnListViewChanged () {
        this._listViewInfo.sort((a, b) => {
            if (a.tState._layer != b.tState._layer) {
                return a.tState._layer - b.tState._layer;
            };
            return a.id - b.id;
        });

        // 剔除注定展示不出来的界面
        let breaked = false;
        for (let i = this._listViewInfo.length - 1; 0 <= i; i--) {
            let info = this._listViewInfo[i];
            // 已经开始了遮挡
            if (breaked) {
                this._listViewInfo.splice(i, 1);
                info.tState._evterDestory.Call(null);
                continue;
            };
            if (info.tState._bgStatus != ViewState.BG_TYPE.SELF) {
                continue;
            };
            if (info.tState._isCloseAble) {
                continue;
            };
            breaked = true;
        };

        // 已经有需要遮罩的界面
        let masked = false;
        // 只保留能看见的界面
        this._listViewDisplay.length = 0;
        for (let i = this._listViewInfo.length - 1; 0 <= i; i--) {
            let info = this._listViewInfo[i];

            // 是一个需要征用遮罩的界面
            if (info.tState._bgStatus == ViewState.BG_TYPE.MASK) {
                // 此前还没有该情况，更正标记
                if (!masked) {
                    masked = true;
                }
                // 否则要忽略该界面
                else {
                    continue;
                };
            };

            this._listViewDisplay.unshift(info);
            if (info.tState._bgStatus != ViewState.BG_TYPE.SELF) {
                continue;
            };
            break;
        };

        // 查找遮罩索引
        this._maskIdx = null;
        for (let i = this._listViewDisplay.length - 1; 0 <= i; i--) {
            let info = this._listViewDisplay[i];
            // 如果有内容的背景遮挡全部，那么不用显示遮罩
            if (info.tState._bgStatus == ViewState.BG_TYPE.SELF) {
                break;
            };
            // 最后一个要求遮罩的界面得到了遮罩
            if (info.tState._bgStatus == ViewState.BG_TYPE.MASK) {
                this._maskIdx = i;
                break;
            };
        };

        for (let i = 0; i < this._listViewDisplay.length; i++) {
            let info = this._listViewDisplay[i];
            if (this._setDisplay.has(info.id)) {
                continue;
            };
            // 已经显示过了
            if (info.tState._displayed) {
                continue;
            };
            info.tState._displayed = true;
            info.tState.OnDisplay();
        };
        this._setDisplay.clear();
        for (let i = 0; i < this._listViewDisplay.length; i++) {
            let info = this._listViewDisplay[i];
            this._setDisplay.add(info.id);
        };
    }

    /**
     * 模块 id 到版本的记录
     */
    _moduleToVersionMap: Map<IndexDataModule, number> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 获取模块版本
     * @param module 
     */
    ModuleGetVersion (module: IndexDataModule) {
        this.Promise(module);
        return this._moduleToVersionMap.get(module);
    }

    /**
     * 刷新模块内容
     * @param module 
     */
    ModuleRefresh (module: IndexDataModule) {
        this.Promise(module);
        this._moduleToVersionMap.set(module, this._moduleToVersionMap.get(module) + 1);
    }

    /**
     * 确保某个模块存在
     * @param module 
     * @returns 
     */
    private Promise (module: IndexDataModule) {
        if (this._moduleToVersionMap.has(module)) {
            return;
        };
        this._moduleToVersionMap.set(module, 0);
    }
}

namespace MgrUI {
    /**
     * 矮屏幕的尺寸-宽
     */
    export const FAT_WIDTH = 640;
    /**
     * 矮屏幕的尺寸-高
     */
    export const FAT_HEIGHT = 1136;

    /**
     * 高屏幕的尺寸-宽
     */
    export const TALL_WIDTH = 750;
    /**
     * 高屏幕的尺寸-高
     */
    export const TALL_HEIGHT = 1624;

    /**
     * 实例
     */
    export const inst = MgrUI.Pop(APP);

    /**
     * 界面信息
     */
    export class ViewInfo {
        /**
         * 节点类型
         */
        nodeType: UINodeType<UIViewComponent, ViewState, any>
        /**
         * 界面状态
         */
        tState: ViewState;
        /**
         * 界面参数
         */
        tProps: any;
        /**
         * 标识
         */
        id: number;
    }

    export const poolType = new UtilObjPoolType<ViewInfo>({
        instantiate: () => {
            return new ViewInfo();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            t.nodeType = null;
            t.tState = null;
            t.tProps = null;
            t.id = null;
        },
        tag: `ViewInfo`
    });
}

export default MgrUI;