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

const APP = `DebugViewGroupMessageTxt`;

@ccclass
export default class DebugViewGroupMessageTxt extends UIViewComponent {
    /**
     * 文本
     */
    @property(cc.Label)
    txt: cc.Label = null;

    static nodeType: UINodeType<DebugViewGroupMessageTxt, DebugViewState, number> = UINodeType.Pop<DebugViewGroupMessageTxt, DebugViewState, number>(
        APP,
        {
            prefabPath: `DebugViewGroupMessageTxt`,
            componentGetter: node => node.getComponent(DebugViewGroupMessageTxt),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<DebugViewGroupMessageTxt, DebugViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.DEBUG_VIEW
                        ],
                        propsFilter: (com, state, props) => {
                            if (com.txt.string != state.msgListTxt[props]) {
                                com.txt.string = state.msgListTxt[props];
                            };
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