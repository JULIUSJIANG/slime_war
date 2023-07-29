import DebugView from '../debug/DebugView';
import DebugViewBtn from '../debug/DebugViewBtn';
import DebugViewGraphics from '../debug/DebugViewGraphics';
import DebugViewGroupFast from '../debug/DebugViewGroupFast';
import DebugViewGroupFastBtn from '../debug/DebugViewGroupFastBtn';
import DebugViewGroupMessage from '../debug/DebugViewGroupMessage';
import DebugViewGroupModule from '../debug/DebugViewGroupModule';
import DebugViewGroupModuleBtn from '../debug/DebugViewGroupModuleBtn';
import DebugViewState from '../debug/DebugViewState';
import IndexView from '../../IndexView';
import IndexViewState from '../../game/view/index_view/IndexViewState';
import UIMask from '../ui/UIMask';
import jiang from './Jiang';
import DebugViewGroupMessageBtn from '../debug/DebugViewGroupMessageBtn';
import indexLoading from '../../IndexLoading';
import DebugViewGroupMessageTxt from '../debug/DebugViewGroupMessageTxt';
import gameCommon from '../../game/GameCommon';
import MgrSdk from '../sdk/MgrSdk';
import indexBuildConfig from '../../IndexBuildConfig';
const { ccclass, property } = cc._decorator;

const APP = `Index`;

/**
 * 程序初始化入口
 */
@ccclass 
export class Index extends cc.Component {
    /**
     * 全局实例
     */
    static inst: Index;

    /**
     * ui 相机
     */
    @property({displayName: `UI 相机`, type: cc.Node})
    cameraUI: cc.Camera = null;

    /**
     * ui 容器
     */
    @property({displayName: `UI 容器`, type: cc.Node})
    nodeUIContainer: cc.Node = null;

    /**
     * loading 界面的预制体
     */
    @property({displayName: `通用的 ui 遮罩`, type: cc.Prefab})
    prefabLoading: cc.Prefab = null;

    /**
     * ui 遮罩
     */
    @property({displayName: `通用的 ui 遮罩`, type: cc.Prefab})
    prefabMask: cc.Prefab = null;

    /**
     * debug 工具-快捷方式-按钮
     */
    @property({displayName: `debug 工具-快捷方式-按钮`, type: cc.Prefab})
    prefabDebugGroupFastBtn: cc.Prefab = null;

    /**
     * debug 工具-快捷方式
     */
    @property({displayName: `debug 工具-快捷方式`, type: cc.Prefab})
    prefabDebugGroupFast: cc.Prefab = null;

    /**
     * debug 工具-模块开关-按钮
     */
    @property({displayName: `debug 工具-模块开关-按钮`, type: cc.Prefab})
    prefabDebugGroupModuleBtn: cc.Prefab = null;

    /**
     * debug 工具-模块开关
     */
    @property({displayName: `debug 工具-模块开关`, type: cc.Prefab})
    prefabDebugGroupModule: cc.Prefab = null;

    /**
     * debug 工具-画笔工具
     */
    @property({displayName: `debug 工具-画笔`, type: cc.Prefab})
    prefabDebugGroupGraphics: cc.Prefab = null;

    /**
     * debug 工具-信息展示
     */
    @property({displayName: `debug 工具-信息`, type: cc.Prefab})
    prefabDebugGroupMessage: cc.Prefab = null;

    /**
     * debug 工具-信息按钮
     */
     @property({displayName: `debug 工具-信息按钮`, type: cc.Prefab})
    prefabDebugGroupMessageBtn: cc.Prefab = null;

    /**
     * debug 工具-信息按钮
     */
     @property({displayName: `debug 工具-信息文本`, type: cc.Prefab})
    prefabDebugGroupMessageTxt: cc.Prefab = null;

    /**
     * debug 工具-快捷方式
     */
    @property({displayName: `debug 工具-按钮`, type: cc.Prefab})
    prefabDebugViewBtn: cc.Prefab = null;

    /**
     * debug 工具
     */
    @property({displayName: `debug 工具`, type: cc.Prefab})
    prefabDebug: cc.Prefab = null;

    onLoad () {
        Index.inst = this;
        Promise.resolve()
            .then(() => {
                // UI 模块初始化
                jiang.mgrUI.Init(
                    this.cameraUI,
                    this.nodeUIContainer
                );

                // 绑定框架依赖的预制体
                jiang.mgrRes._staticPrefabCache.set(IndexView.nodeType._prefabPath, this.prefabLoading);
                jiang.mgrRes._staticPrefabCache.set(UIMask.nodeType._prefabPath, this.prefabMask);
                jiang.mgrRes._staticPrefabCache.set(DebugViewGroupFastBtn.nodeType._prefabPath, this.prefabDebugGroupFastBtn);
                jiang.mgrRes._staticPrefabCache.set(DebugViewGroupFast.nodeType._prefabPath, this.prefabDebugGroupFast);
                jiang.mgrRes._staticPrefabCache.set(DebugViewGroupModuleBtn.nodeType._prefabPath, this.prefabDebugGroupModuleBtn);
                jiang.mgrRes._staticPrefabCache.set(DebugViewGroupModule.nodeType._prefabPath, this.prefabDebugGroupModule);
                jiang.mgrRes._staticPrefabCache.set(DebugViewGraphics.nodeType._prefabPath, this.prefabDebugGroupGraphics);
                jiang.mgrRes._staticPrefabCache.set(DebugViewGroupMessage.nodeType._prefabPath, this.prefabDebugGroupMessage);
                jiang.mgrRes._staticPrefabCache.set(DebugViewGroupMessageBtn.nodeType._prefabPath, this.prefabDebugGroupMessageBtn);
                jiang.mgrRes._staticPrefabCache.set(DebugViewGroupMessageTxt.nodeType._prefabPath, this.prefabDebugGroupMessageTxt);
                jiang.mgrRes._staticPrefabCache.set(DebugViewBtn.nodeType._prefabPath, this.prefabDebugViewBtn);
                jiang.mgrRes._staticPrefabCache.set(DebugView.nodeType._prefabPath, this.prefabDebug);

                // 调试模式
                if (indexBuildConfig.IS_DEBUG) {
                    // 调试工具初始化
                    DebugViewState.Init();

                    // 打开调试界面
                    jiang.mgrUI.Open(
                        DebugView.nodeType,
                        DebugViewState.inst
                    );
                };

                // 打开根界面
                jiang.mgrUI.Open(
                    IndexView.nodeType,
                    IndexViewState.Pop(APP),
                );

                // 根加载内容初始化
                indexLoading.Init ();
            });
    }
}