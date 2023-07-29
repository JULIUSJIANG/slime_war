import BCType from "../basic/BCType";
import IndexDataModule from "../../IndexDataModule";
import UINodeType from "../ui/UINodeType";
import UIViewComponent from "../ui/UIViewComponent";
import DebugViewDefine from "./DebugViewDefine";
import DebugViewGroupModuleBtn from "./DebugViewGroupModuleBtn";
import DebugViewState from "./DebugViewState";
import UINodeInstHideRS from "../ui/UINodeInstHideRS";
import UINodeInstEnterRS from "../ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `DebugViewGroupModule`;

/**
 * 模块开关界面
 */
@ccclass
export default class DebugViewGroupModule extends UIViewComponent {
    /**
     * 容器-按钮
     */
    @property(cc.Node)
    containerBtn: cc.Node = null;

    /**
     * 节点类型
     */
    static nodeType: UINodeType<DebugViewGroupModule, DebugViewState, number> = UINodeType.Pop<DebugViewGroupModule, DebugViewState, number>(
        APP,
        {
            prefabPath: `DebugViewGroupModule`,
            componentGetter: node => node.getComponent(DebugViewGroupModule),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<DebugViewGroupModule, DebugViewState, number>(
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
                UINodeType.ChildrenGeneration.Pop<DebugViewGroupModule, DebugViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerBtn;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < DebugViewDefine.moduleList.length; i++) {
                                listNode.push(DebugViewGroupModuleBtn.nodeType.CreateNode(state, i, i));
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