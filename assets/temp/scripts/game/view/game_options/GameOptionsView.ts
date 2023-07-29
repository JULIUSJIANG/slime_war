import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import jiang from "../../../frame/global/Jiang";
import MgrSdk from "../../../frame/sdk/MgrSdk";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import IndexView from "../../../IndexView";
import IndexViewState from "../index_view/IndexViewState";
import GamePlayViewState from "../game_play/GamePlayViewState";
import RewardViewState from "../reward_view/RewardViewState";
import TipsViewState from "../tips_view/TipsViewState";
import GameOptionsViewState from "./GameOptionsViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import gameCommon from "../../GameCommon";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import RewardGridArgs from "../common/RewardGridArgs";
import CfgLevel from "../../../frame/config/src/CfgLevel";
import CfgScene from "../../../frame/config/src/CfgScene";
import CfgCacheScene from "../../cfg_cache/CfgCacheScene";
import PlayOrdinaryRS from "../../play_ordinary/PlayOrdinaryRS";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import indexBuildConfig from "../../../IndexBuildConfig";
import gameMath from "../../GameMath";

const {ccclass, property} = cc._decorator;

const APP = `GameOptionsView`;

/**
 * 按钮-关闭
 */
@ccclass
export default class GameOptionsView extends UIViewComponent {
    /**
     * 文本 - 音乐
     */
    @property(cc.Label)
    txtMusic: cc.Label = null;
     
    /**
     * 滑条 - 音乐
     */
    @property(ComponentNodeEventer)
    sliderMusic: ComponentNodeEventer = null;
     
    /**
     * 文本 - 音效
     */
    @property(cc.Label)
    txtVoice: cc.Label = null;
     
    /**
     * 滑条 - 音效
     */
    @property(ComponentNodeEventer)
    sliderVoice: ComponentNodeEventer = null;

    /**
     * 按钮 - 返回主界面
     */
    @property(ComponentNodeEventer)
    btnHome: ComponentNodeEventer = null;

    /**
     * 按钮 - 重新开始
     */
    @property(ComponentNodeEventer)
    btnRestart: ComponentNodeEventer = null;

    /**
     * 按钮 - 恢复
     */
    @property(ComponentNodeEventer)
    btnResume: ComponentNodeEventer = null;

    /**
     * 奖励内容的节点
     */
    @property(cc.Node)
    nodeReward: cc.Node = null;

    /**
     * 容器 - 奖励
     */
    @property(cc.Node)
    containerReward: cc.Node = null;

    /**
     * 列表 - 暗节点
     */
    @property ([cc.Node])
    listNodeDark: Array <cc.Node> = [];

    /**
     * 列表 - 亮节点
     */
    @property ([cc.Node])
    listNodeLight: Array <cc.Node> = [];

    /**
     * 按钮 - 音乐
     */
    @property (ComponentNodeEventer)
    btnMusic: ComponentNodeEventer = null;
    /**
     * 按钮 - 音量
     */
    @property (ComponentNodeEventer)
    btnVoice: ComponentNodeEventer = null;

    /**
     * 文本 - 奖励信息
     */
    @property (cc.Label)
    txtRewardTips: cc.Label = null;

    protected onEnable(): void {
        this.nodeReward.active = false;
    }

    static nodeType = UINodeType.Pop<GameOptionsView, GameOptionsViewState, number>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/game_options_view`,
            componentGetter: node => node.getComponent(GameOptionsView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<GameOptionsView, GameOptionsViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.PLAYING
                        ],
                        propsFilter: (com, state, props) => {
                            com.btnMusic.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnVoice.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            let playMachineRS = PlayOrdinaryRS.GetRS (state.idCfgLev);
                            let cfgScene = jiang.mgrCfg.cfgScene.select (CfgScene.idGetter, playMachineRS.getterSceneId (state.idCfgLev))._list [0];
                            let themeCache = CfgCacheScene.GetCache (cfgScene);
                            for (let i = 0; i < com.listNodeDark.length; i++) {
                                com.listNodeDark [i].color = themeCache.colorDark;
                            };
                            for (let i = 0; i < com.listNodeLight.length; i++) {
                                com.listNodeLight [i].color = themeCache.colorLight;
                            };

                            com.txtMusic.string = `音乐音量 ${Math.ceil(100 * jiang.mgrData.Get(indexDataStorageItem.volumeMusic))}%`;
                            com.sliderMusic.slider.progress = jiang.mgrData.Get(indexDataStorageItem.volumeMusic);
                            com.sliderMusic.evterSlide.On((args) => {
                                jiang.mgrData.Set(indexDataStorageItem.volumeMusic, com.sliderMusic.slider.progress);
                                jiang.mgrUI.ModuleRefresh(IndexDataModule.PLAYING);
                                jiang.mgrUI.ModuleRefresh(IndexDataModule.VOLUME_CHANGE);
                            });

                            com.txtVoice.string = `音效音量 ${Math.ceil(100 * jiang.mgrData.Get(indexDataStorageItem.volumeVoice))}%`;
                            com.sliderVoice.slider.progress = jiang.mgrData.Get(indexDataStorageItem.volumeVoice);
                            com.sliderVoice.evterSlide.On((args) => {
                                jiang.mgrData.Set(indexDataStorageItem.volumeVoice, com.sliderVoice.slider.progress);
                                jiang.mgrUI.ModuleRefresh(IndexDataModule.PLAYING);
                                jiang.mgrUI.ModuleRefresh(IndexDataModule.VOLUME_CHANGE);
                            });

                            // 奖励文本的提示信息
                            com.txtRewardTips.string = (`当前奖励${(gameMath.IsStandardRewardScene (state.gameState.cfgSceneCache.idCfg) ? `，“退出”、“重开” 时自动获得` : `，胜利后可获得`)}`)

                            com.btnHome.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnHome.evterTouchEnd.On(() => {
                                Promise.resolve ()
                                    .then (() => {
                                        // 无需胜利也可获得奖励的话，把奖励领取了再说
                                        if (gameMath.IsStandardRewardScene (state.gameState.cfgSceneCache.idCfg)) {
                                            return RewardViewState.GotRewardOrdinary (gameCommon.TITLE_REWARD, state.gameState.listRewardIdCfg);
                                        };
                                        return Promise.resolve ();
                                    })
                                    .then (() => {
                                        jiang.mgrUI.Open(
                                            IndexView.nodeType,
                                            IndexViewState.Pop(APP)
                                        );
                                    });
                            });
                            com.btnRestart.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnRestart.evterTouchEnd.On(() => {
                                Promise.resolve ()
                                    .then (() => {
                                        // 无需胜利也可获得奖励的话，把奖励领取了再说
                                        if (gameMath.IsStandardRewardScene (state.gameState.cfgSceneCache.idCfg)) {
                                            return RewardViewState.GotRewardOrdinary (gameCommon.TITLE_REWARD, state.gameState.listRewardIdCfg);
                                        };
                                        return Promise.resolve ();
                                    })
                                    .then (() => {
                                        // 打开战斗
                                        GamePlayViewState.Fight (state.idCfgLev);
                                    });
                            });
                            com.btnResume.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnResume.evterTouchEnd.On(() => {
                                jiang.mgrUI.Close(state._idView);
                            });
                            // 有奖励的话，让玩家预览到
                            com.nodeReward.active = state.gameState.listRewardIdCfg.length != 0;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<GameOptionsView, GameOptionsViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerReward;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < state.gameState.listRewardIdCfg.length; i++) {
                                let rec = state.gameState.listRewardIdCfg[i];
                                listNode.push (rec.rs.onGetUIRewardNodeType().CreateNode (
                                    state,
                                    RewardGridArgs.Pop (rec.rs, rec.props),
                                    i
                                ));
                            };
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.scaleInForTemp200
        }
    );
}