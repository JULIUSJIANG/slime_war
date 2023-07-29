import IndexDataModule from "../../IndexDataModule";
import BCType from "../basic/BCType";
import ComponentNodeEventer from "../component/ComponentNodeEventer";
import jiang from "../global/Jiang";
import UINodeInstEnterRS from "../ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../ui/UINodeInstHideRS";
import UINodeType from "../ui/UINodeType";
import UIViewComponent from "../ui/UIViewComponent";
import DebugViewDefine from "./DebugViewDefine";
import DebugViewState from "./DebugViewState";

const {ccclass, property} = cc._decorator;

const APP = `DebugViewGroupMessageBtn`;

@ccclass
export default class DebugViewGroupMessageBtn extends UIViewComponent {
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

    static nodeType: UINodeType<DebugViewGroupMessageBtn, DebugViewState, number> = UINodeType.Pop<DebugViewGroupMessageBtn, DebugViewState, number>(
        APP,
        {
            prefabPath: `DebugViewGroupMessageBtn`,
            componentGetter: node => node.getComponent(DebugViewGroupMessageBtn),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<DebugViewGroupMessageBtn, DebugViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.DEBUG_VIEW
                        ],
                        propsFilter: (com, state, props) => {
                            let match = DebugViewDefine.msgList[props];
                            com.txt.string = match._name;
                            com.btn.node.active = props != state.msgIdx;
                            com.btn.evterTouchEnd.On(() => {
                                state.msgIdx = props;
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