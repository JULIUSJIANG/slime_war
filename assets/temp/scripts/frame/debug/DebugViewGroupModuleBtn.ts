import BCType from "../basic/BCType";
import ComponentNodeEventer from "../component/ComponentNodeEventer";
import jiang from "../global/Jiang";
import IndexDataModule from "../../IndexDataModule";
import UINodeType from "../ui/UINodeType";
import UIViewComponent from "../ui/UIViewComponent";
import DebugViewDefine from "./DebugViewDefine";
import DebugViewState from "./DebugViewState";
import UINodeInstHideRS from "../ui/UINodeInstHideRS";
import UINodeInstEnterRS from "../ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `DebugViewGroupModuleBtn`;

/**
 * 模块界面-按钮
 */
@ccclass
export default class DebugViewGroupModuleBtn extends UIViewComponent {
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
    static nodeType: UINodeType<DebugViewGroupModuleBtn, DebugViewState, number> = UINodeType.Pop<DebugViewGroupModuleBtn, DebugViewState, number>(
        APP,
        {
            prefabPath: `DebugViewGroupModuleBtn`,
            componentGetter: node => node.getComponent(DebugViewGroupModuleBtn),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<DebugViewGroupModuleBtn, DebugViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.DEBUG_VIEW
                        ],
                        propsFilter: (com, state, props) => {
                            let storageItem = DebugViewDefine.moduleList[props];
                            com.txt.string = `${storageItem.name}`;
                            com.nodeMask.active = !jiang.mgrData.Get(storageItem.dataItem);
                            com.btn.evterTouchEnd.On(() => {
                                jiang.mgrData.Set(storageItem.dataItem, !jiang.mgrData.Get(storageItem.dataItem));
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
    );
}