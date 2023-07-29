import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import VideoCertainViewState from "./VideoCertainViewState";

const {ccclass, property} = cc._decorator;

const APP = `VideoCertainView`;

/**
 * 视频确认
 */
@ccclass
export default class VideoCertainView extends UIViewComponent {
    /**
     * 按钮 - 确认
     */
    @property (ComponentNodeEventer)
    btnYes: ComponentNodeEventer = null;

    /**
     * 按钮 - 取消
     */
    @property (ComponentNodeEventer)
    btnNo: ComponentNodeEventer = null;

    /**
     * 文本 - 标题
     */
    @property (cc.Label)
    txtTitle: cc.Label = null;

    static nodeType = UINodeType.Pop <VideoCertainView, VideoCertainViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/video_certain_view`,
            componentGetter: node => node.getComponent (VideoCertainView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <VideoCertainView, VideoCertainViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT
                        ],
                        propsFilter: (com, state, props) => {
                            com.btnYes.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
                            });
                            com.btnYes.evterTouchEnd.On (() => {
                                state.OnYes ();
                            });

                            com.btnNo.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
                            });
                            com.btnNo.evterTouchEnd.On (() => {
                                state.OnNo ();
                            });

                            com.txtTitle.string = state.title;
                        }
                    }
                )
            ],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.scaleInForTemp200
        }
    )
}