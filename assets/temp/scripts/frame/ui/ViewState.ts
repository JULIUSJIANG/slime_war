import IndexDataModule from "../../IndexDataModule";
import IndexLayer from "../../IndexLayer";
import BCEventer from "../basic/BCEventer";

const APP = `ViewState`;

/**
 * 界面状态
 */
abstract class ViewState {
    /**
     * 归属的层
     */
    _layer: IndexLayer;
    /**
     * 背景状态
     * 0: 不进行任何影响
     * 1: 自带背景
     * 2: 需要遮罩掩护
     */
    _bgStatus: ViewState.BG_TYPE;
    /**
     * 该窗口能否被关闭
     */
    _isCloseAble: boolean;

    constructor (
        layer: IndexLayer,
        bgStatus: ViewState.BG_TYPE,
        isCloseAble: boolean
    )
    {
        this._layer = layer;
        this._bgStatus = bgStatus;
        this._isCloseAble = isCloseAble;

        this._evterInit.On(() => {
            this.OnInit();
        });

        this._evterDestory.On(() => {
            this.OnDestory();
        });
    }

    /**
     * 标识 - 窗口
     */
    _idView: number;

    /**
     * 初始化
     */
    Init (idView: number) {
        this._idView = idView;
        this._evterInit.Call(null);
    }

    /**
     * 事件派发 - 销毁
     */
     _evterInit = BCEventer.Pop(APP);
    OnInit () {

    }

    /**
     * 模块发生变化的时候
     */
    OnChange (module: IndexDataModule) {

    }

    /**
     * 遮罩发生交互
     */
    OnMaskTouch () {

    }

    /**
     * 事件派发 - 销毁
     */
    _evterDestory = BCEventer.Pop(APP);

    /**
     * 事件派发 - 销毁
     */
    OnDestory () {

    }

    /**
     * 已经显示过了
     */
    _displayed = false;
    /**
     * 事件派发 - 得到展示
     */
    OnDisplay () {

    }
}

namespace ViewState {
    /**
     * 背景类型
     */
    export enum BG_TYPE {
        /**
         * 没有背景，也不需要额外处理
         */
        NONE = 0,
        /**
         * 自带背景
         */
        SELF = 1,
        /**
         * 没有背景，需要补充遮罩
         */
        MASK = 2
    }
}

export default ViewState;