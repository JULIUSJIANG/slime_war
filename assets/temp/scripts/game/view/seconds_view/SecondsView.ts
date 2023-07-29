import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import SecondsViewState from "./SecondsViewState";

const {ccclass, property} = cc._decorator;

const APP = `SecondsView`;

/**
 * 倒计时界面
 */
@ccclass
export default class SecondsView extends UIViewComponent {
    /**
     * 文本
     */
    @property (cc.Label)
    txt: cc.Label = null;

    static nodeType = UINodeType.Pop <SecondsView, SecondsViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/seconds_view`,
            componentGetter: node => node.getComponent (SecondsView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <SecondsView, SecondsViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.SECONDS
                        ],
                        propsFilter: (com, state, props) => {
                            com.txt.node.scale = state.currStatus.GetTxtScale ();
                            com.txt.node.opacity = state.currStatus.GetTxtOpacity () * 255;
                            com.txt.string = state.currStatus.GetTxtCtx ();
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