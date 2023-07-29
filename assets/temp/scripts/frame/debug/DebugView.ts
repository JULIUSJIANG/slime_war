import IndexDataModule from "../../IndexDataModule";
import BCType from "../basic/BCType";
import ComponentNodeEventer from "../component/ComponentNodeEventer";
import UINodeInstEnterRS from "../ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../ui/UINodeInstHideRS";
import UINodeType from "../ui/UINodeType";
import UIViewComponent from "../ui/UIViewComponent";
import DebugViewBtn from "./DebugViewBtn";
import DebugViewDefine from "./DebugViewDefine";
import DebugViewGraphics from "./DebugViewGraphics";
import DebugViewState from "./DebugViewState";

const {ccclass, property} = cc._decorator;

const APP = `DebugView`;

/**
 * 调试界面
 */
@ccclass
export default class DebugView extends UIViewComponent {
    /**
     * 节点-内容
     */
    @property(cc.Node)
    nodeContent: cc.Node = null;

    /**
     * 按钮-调试内容开关
     */
    @property(ComponentNodeEventer)
    btnToggle: ComponentNodeEventer = null;

    /**
     * 按钮-关闭
     */
    @property(ComponentNodeEventer)
    btnClose: ComponentNodeEventer = null;

    /**
     * 按钮-背景，防止点击穿透
     */
    @property(ComponentNodeEventer)
    btnBg: ComponentNodeEventer = null;

    /**
     * 容器-按钮
     */
    @property(cc.Node)
    containerBtn: cc.Node = null;

    /**
     * 容器-当前内容
     */
    @property(cc.Node)
    containerCurrent: cc.Node = null;

    /**
     * 容器-b2 绘制
     */
    @property(cc.Node)
    containerB2Graphics: cc.Node = null;

    /**
     * 节点类型
     */
    static nodeType: UINodeType<DebugView, DebugViewState, number> = UINodeType.Pop(
        APP,
        {
            prefabPath: `DebugView`,
            componentGetter: node => node.getComponent(DebugView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<DebugView, DebugViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.DEBUG_VIEW
                        ],
                        propsFilter: (com, state, props) => {
                            com.nodeContent.active = state.contentEnable;
                            com.btnToggle.evterTouchEnd.On(() => {
                                state.Open();
                            });
                            com.btnToggle.node.opacity = state.btnEnterOpacity;
                        
                            com.btnClose.evterTouchEnd.On(() => {
                                state.Close();
                            });
                        
                            com.btnBg.evterTouchEnd.On(() => {
                            
                            });
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<DebugView, DebugViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerB2Graphics;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            listNode.push(DebugViewGraphics.nodeType.CreateNode(state, null, 0))
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<DebugView, DebugViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerBtn;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            if (!state.contentEnable) {
                                return;
                            };
                            for (let i = 0; i < DebugViewDefine.groupList.length; i++) {
                                let val = DebugViewDefine.groupList[i];
                                listNode.push(DebugViewBtn.nodeType.CreateNode(state, val.id, val.id));
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<DebugView, DebugViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerCurrent;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            if (!state.contentEnable) {
                                return;
                            };
                            let currModule = DebugViewDefine.groupList[state.moduleIndex];
                            listNode.push(currModule.nodeType.CreateNode(state, null, 0));
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }    
    )
}