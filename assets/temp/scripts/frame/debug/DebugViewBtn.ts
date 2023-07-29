import IndexDataModule from "../../IndexDataModule";
import BCType from "../basic/BCType";
import ComponentNodeEventer from "../component/ComponentNodeEventer";
import { Index } from "../global/Index";
import jiang from "../global/Jiang";
import UINodeInstEnterRS from "../ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../ui/UINodeInstHideRS";
import UINodeType from "../ui/UINodeType";
import UIViewComponent from "../ui/UIViewComponent";
import DebugViewDefine from "./DebugViewDefine";
import DebugViewState from "./DebugViewState";

const {ccclass, property} = cc._decorator;

const APP = `DebugViewBtn`;

/**
 * 模块界面-按钮
 */
@ccclass
export default class DebugViewBtn extends UIViewComponent {
    /**
     * 文本
     */
    @property(cc.Label)
    txt: cc.Label = null;
 
    /**
     * 按钮
     */
    @property(ComponentNodeEventer)
    btn: ComponentNodeEventer = null;
 
    /**
     * 节点-遮罩
     */
    @property(cc.Node)
    nodeMask: cc.Node = null;
 
    /**
     * 节点类型
     */
    static nodeType: UINodeType<DebugViewBtn, DebugViewState, number> = UINodeType.Pop(
        APP,
        {
            prefabPath: `DebugViewBtn`,
            componentGetter: node => node.getComponent(DebugViewBtn),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<DebugViewBtn, DebugViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.DEBUG_VIEW
                        ],
                        propsFilter: (com, state, props) => {
                            let idx = DebugViewDefine.groupList.findIndex((group) => {
                                return group.id == props;
                            });
                            let match = DebugViewDefine.groupList[idx];
                            com.node.name =
                            com.txt.string = `${match.name}`;
                            com.nodeMask.active = state.moduleIndex != idx;
                            com.btn.evterTouchEnd.On(() => {
                                state.moduleIndex = idx;
                                jiang.mgrUI.ModuleRefresh(IndexDataModule.DEBUG_VIEW);
                            });
                        }
                    }
                )
            ],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    )
}