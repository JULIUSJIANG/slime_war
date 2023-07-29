import BCType from "../basic/BCType";
import ComponentNodeEventer from "../component/ComponentNodeEventer";
import jiang from "../global/Jiang";
import indexDebugModuleConsole from "../../IndexDebugModuleConsole";
import IndexDataModule from "../../IndexDataModule";
import UINodeType from "../ui/UINodeType";
import UIViewComponent from "../ui/UIViewComponent";
import DebugViewGroupFastBtn from "./DebugViewGroupFastBtn";
import DebugViewState from "./DebugViewState";
import DebugViewDefine from "./DebugViewDefine";
import UINodeInstHideRS from "../ui/UINodeInstHideRS";
import UINodeInstEnterRS from "../ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `DebugViewGroupFast`;

/**
 * 快捷方式界面
 */
@ccclass
export default class DebugViewGroupFast extends UIViewComponent {
    /**
     * 容器-按钮
     */
    @property(cc.Node)
    containerBtn: cc.Node = null;
    /**
     * 编辑框-参数
     */
    @property(ComponentNodeEventer)
    editProp: ComponentNodeEventer = null;

    /**
     * 节点类型
     */
    static nodeType: UINodeType<DebugViewGroupFast, DebugViewState, number> = UINodeType.Pop<DebugViewGroupFast, DebugViewState, number>(
        APP,
        {
            prefabPath: `DebugViewGroupFast`,
            componentGetter: node => node.getComponent(DebugViewGroupFast),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<DebugViewGroupFast, DebugViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.DEBUG_VIEW
                        ],
                        propsFilter: (com, state, props) => {
                            com.editProp.editBox.string = `${state.txt}`;
                            com.editProp.evterEditDidChanged.On((args) => {
                                state.txt = com.editProp.editBox.string;
                                jiang.mgrUI.ModuleRefresh(IndexDataModule.DEBUG_VIEW);
                            });
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<DebugViewGroupFast, DebugViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerBtn;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < DebugViewDefine.fastGroupList.length; i++) {
                                let group = DebugViewDefine.fastGroupList[i];
                                listNode.push(DebugViewGroupFastBtn.nodeType.CreateNode(state, i, i));
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