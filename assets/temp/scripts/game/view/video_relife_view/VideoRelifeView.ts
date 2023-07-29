import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import CfgScene from "../../../frame/config/src/CfgScene";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import CfgCacheScene from "../../cfg_cache/CfgCacheScene";
import PlayOrdinaryRS from "../../play_ordinary/PlayOrdinaryRS";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import VideoRelifeViewState from "./VideoRelifeViewState";

const {ccclass, property} = cc._decorator;

const APP = `VideoRelifeView`;

/**
 * 视频重生
 */
@ccclass
export default class VideoRelifeView extends UIViewComponent {
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
     * 列表 - 暗节点
     */
    @property ([cc.Node])
    listNodeDark: Array <cc.Node> = [];

    static nodeType = UINodeType.Pop<VideoRelifeView, VideoRelifeViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/video_relife_view`,
            componentGetter: node => node.getComponent (VideoRelifeView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <VideoRelifeView, VideoRelifeViewState, number> (
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

                            let playMachineRS = PlayOrdinaryRS.GetRS (state.playOrdinary.idCfgLev);
                            let cfgScene = jiang.mgrCfg.cfgScene.select (CfgScene.idGetter, playMachineRS.getterSceneId (state.playOrdinary.idCfgLev))._list [0];
                            let themeCache = CfgCacheScene.GetCache (cfgScene);
                            for (let i = 0; i < com.listNodeDark.length; i++) {
                                com.listNodeDark [i].color = themeCache.colorDark;
                            };
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