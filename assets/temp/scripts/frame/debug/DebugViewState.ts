import jiang from "../global/Jiang";
import IndexDataModule from "../../IndexDataModule";
import IndexLayer from "../../IndexLayer";
import ViewState from "../ui/ViewState";
import DebugViewDefine from "./DebugViewDefine";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import UtilObjPool from "../basic/UtilObjPool";
import DebugViewGroupMessage from "./DebugViewGroupMessage";

const APP = `DebugViewState`;

/**
 * 调试界面状态
 */
export default class DebugViewState extends ViewState {

    private constructor () {
        super(
            IndexLayer.SYSTEM,
            ViewState.BG_TYPE.NONE,
            false,
        );
        jiang.mgrEvter.evterUpdate.On(() => {
            // 信息展示窗口正在开启，逐帧更新
            if (this.contentEnable && DebugViewDefine.groupList[this.moduleIndex].nodeType == DebugViewGroupMessage.nodeType) {
                let txt = DebugViewDefine.msgList[this.msgIdx]._act();
                let listLine = txt.split(/\n/g);
                this.msgListTxt.length = 0;
                while (0 < listLine.length) {
                    this.msgListTxt.push(listLine.splice(0, 100).join(`\n`));
                };
                jiang.mgrUI.ModuleRefresh(IndexDataModule.DEBUG_VIEW);
            };
            // 有 b2 世界，那么进行绘制刷新
            if (0 < DebugViewDefine.b2wList.length) {
                jiang.mgrUI.ModuleRefresh(IndexDataModule.DEBUG_VIEW);
            };
        });
    }

    private static _t = new UtilObjPoolType<DebugViewState>({
        instantiate: () => {
            return new DebugViewState();
        },
        onPop: (t) => {
            
        },
        onPush: (t) => {
            
        },
        tag: APP
    });

    static Pop (apply: string) {
        return UtilObjPool.Pop(DebugViewState._t, apply);
    }

    /**
     * 全局实例
     */
    static inst: DebugViewState;

    /**
     * 初始化
     */
    static Init () {
        DebugViewState.inst = DebugViewState.Pop(APP);
    }

    /**
     * 入口按钮的不透明度
     */
    btnEnterOpacity: number = 255;
    /**
     * 设置入口按钮的不透明度
     */
    public SetBtnEnterOpacity (opacity: number) {
        this.btnEnterOpacity = opacity;
        jiang.mgrUI.ModuleRefresh (IndexDataModule.DEBUG_VIEW);
    }

    /**
     * 是否开启内容
     */
    contentEnable: boolean = false;

    /**
     * 当前模块索引
     */
    moduleIndex: number = 0;

    /**
     * 当前参数
     */
    txt: string = `请输入参数`;

    /**
     * 信息展示的索引
     */
    msgIdx: number = 0;

    /**
     * 打开
     */
    Open () {
        this.contentEnable = true;
        jiang.mgrUI.ModuleRefresh(IndexDataModule.DEBUG_VIEW);
    }

    /**
     * 关闭
     */
    Close () {
        this.contentEnable = false;
        jiang.mgrUI.ModuleRefresh(IndexDataModule.DEBUG_VIEW);
    }

    /**
     * 信息组的文本
     */
    msgListTxt: string[] = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 检查某个模块是否开启
     * @param module 
     * @returns 
     */
    static CheckModuleActive (module: DebugViewDefine.ModuleInfo) {
        return jiang.mgrData.Get(module.dataItem);
    }
}