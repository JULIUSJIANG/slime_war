import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import DefineVoice from "../../game_element/body/DefineVoice";
import gameCommon from "../../GameCommon";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import IndexViewRS from "./IndexViewRS";
import IndexViewState from "./IndexViewState";

const {ccclass, property} = cc._decorator;

const APP = `IndexViewBtn`;

/**
 * 首页的切分页按钮
 */
@ccclass
export default class IndexViewBtn extends UIViewComponent {
    /**
     * 文本
     */
    @property (cc.Label)
    txt: cc.Label = null;

    /**
     * 按钮 - 选择
     */
    @property (ComponentNodeEventer)
    btnSelect: ComponentNodeEventer = null;

    @property (cc.Node)
    nodeRed: cc.Node = null;

    static nodeType = UINodeType.Pop<IndexViewBtn, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/index_view_btn`,
            componentGetter: node => node.getComponent(IndexViewBtn),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<IndexViewBtn, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_MAIN,
                            IndexDataModule.RED_DOT
                        ],
                        propsFilter: (com, state, props) => {
                            let rs = IndexViewRS.mapInst.get(props);
                            com.nodeRed.active = rs.redCheck ();
                            com.txt.string = rs.name;
                            com.btnSelect.evterTouchStart.On(() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                                // 去重
                                if (state.currStatus == state.statusIdle && state.statusIdle.currRS == rs) {
                                    return;
                                };
                                VoiceOggViewState.inst.BgmSet (DefineVoice.BGM_TITLE);
                                state.currStatus.OnToggle (rs);
                                jiang.mgrUI.ModuleRefresh(IndexDataModule.INDEXVIEW_MAIN);
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