import BCType from "../basic/BCType";
import indexDebugModuleConsole from "../../IndexDebugModuleConsole";
import IndexDataModule from "../../IndexDataModule";
import UINodeType from "../ui/UINodeType";
import UIViewComponent from "../ui/UIViewComponent";
import DebugViewState from "./DebugViewState";
import DebugViewDefine from "./DebugViewDefine";
import DebugViewGroupMessageBtn from "./DebugViewGroupMessageBtn";
import DebugViewGroupMessageTxt from "./DebugViewGroupMessageTxt";
import UINodeInstHideRS from "../ui/UINodeInstHideRS";
import UINodeInstEnterRS from "../ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `DebugViewGroupMessage`;

/**
 * 信息展示界面
 */
@ccclass
export default class DebugViewGroupMessage extends UIViewComponent {
    /**
     * 容器 - 文本
     */
    @property(cc.Node)
    containerTxt: cc.Node = null;

    /**
     * 容器 - 按钮
     */
    @property(cc.Node)
    containerBtn: cc.Node = null;

    /**
     * 节点类型
     */
    static nodeType: UINodeType<DebugViewGroupMessage, DebugViewState, number> = UINodeType.Pop<DebugViewGroupMessage, DebugViewState, number>(
        APP,
        {
            prefabPath: `DebugViewGroupMessage`,
            componentGetter: node => node.getComponent(DebugViewGroupMessage),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<DebugViewGroupMessage, DebugViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.DEBUG_VIEW
                        ],
                        propsFilter: (com, state, props) => {

                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<DebugViewGroupMessage, DebugViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerTxt;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < state.msgListTxt.length; i++) {
                                listNode.push(DebugViewGroupMessageTxt.nodeType.CreateNode(state, i, i));
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<DebugViewGroupMessage, DebugViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerBtn;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < DebugViewDefine.msgList.length; i++) {
                                listNode.push(DebugViewGroupMessageBtn.nodeType.CreateNode(state, i, i));
                            };
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    );
}