import BCType from "../basic/BCType";
import ComponentNodeEventer from "../component/ComponentNodeEventer";
import IndexDataModule from "../../IndexDataModule";
import UINodeType from "../ui/UINodeType";
import UIViewComponent from "../ui/UIViewComponent";
import DebugViewDefine from "./DebugViewDefine";
import DebugViewState from "./DebugViewState";
import UINodeInstHideRS from "../ui/UINodeInstHideRS";
import UINodeInstEnterRS from "../ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `DebugViewGroupFastBtn`;

/**
 * 快捷方式-按钮
 */
@ccclass
export default class DebugViewGroupFastBtn extends UIViewComponent {
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
     * 节点类型
     */
    static nodeType: UINodeType<DebugViewGroupFastBtn, DebugViewState, number> = UINodeType.Pop<DebugViewGroupFastBtn, DebugViewState, number>(
        APP,
        {
            prefabPath: `DebugViewGroupFastBtn`,
            componentGetter: node => node.getComponent(DebugViewGroupFastBtn),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<DebugViewGroupFastBtn, DebugViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.DEBUG_VIEW
                        ],
                        propsFilter: (com, state, props) => {
                            let match = DebugViewDefine.fastGroupList[props];
                            com.txt.string = match._name;
                            com.btn.evterTouchEnd.On(() => {
                                match._act(state.txt);
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