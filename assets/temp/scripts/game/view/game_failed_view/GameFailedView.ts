import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import jiang from "../../../frame/global/Jiang";
import MgrSdk from "../../../frame/sdk/MgrSdk";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import IndexView from "../../../IndexView";
import IndexViewState from "../index_view/IndexViewState";
import GamePlayViewState from "../game_play/GamePlayViewState";
import RewardViewState from "../reward_view/RewardViewState";
import TipsViewState from "../tips_view/TipsViewState";
import GameFailedViewState from "./GameFailedViewState";
import gameCommon from "../../GameCommon";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import RewardGridArgs from "../common/RewardGridArgs";
import CfgLevel from "../../../frame/config/src/CfgLevel";
import CfgScene from "../../../frame/config/src/CfgScene";
import CfgCacheScene from "../../cfg_cache/CfgCacheScene";
import PlayOrdinaryRS from "../../play_ordinary/PlayOrdinaryRS";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import indexBuildConfig from "../../../IndexBuildConfig";
import gameMath from "../../GameMath";
import utilMath from "../../../frame/basic/UtilMath";
import DefineVoice from "../../game_element/body/DefineVoice";
import LotteryViewState from "../lottery_view/LotteryViewState";
import LotteryTipsView from "../lottery_view/LotteryTipsView";
import LotteryTipsViewState from "../lottery_view/LotteryTipsViewState";
import IndexViewRS from "../index_view/IndexViewRS";

const {ccclass, property} = cc._decorator;

const APP = `GameFailedView`;

/**
 * 胜利界面
 */
@ccclass
export default class GameFailedView extends UIViewComponent {
    /**
     * 按钮 - 返回主页
     */
    @property(ComponentNodeEventer)
    btnHome: ComponentNodeEventer = null;

    /**
     * 按钮 - 再次挑战
     */
    @property(ComponentNodeEventer)
    btnAgain: ComponentNodeEventer = null;

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
     * 按钮 - 直接领取
     */
    @property(ComponentNodeEventer)
    btnGotImm: ComponentNodeEventer = null;

    /**
     * 按钮 - 双倍领取
     */
    @property (ComponentNodeEventer)
    btnGotDouble: ComponentNodeEventer = null;

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
     * 按钮 - 强化
     */
    @property (ComponentNodeEventer)
    btnStrengthen: ComponentNodeEventer = null;
    /**
     * 文本 - 当前金币拥有量
     */
    @property (cc.Label)
    txtCurrent: cc.Label = null;
    /**
     * 文本 - 当前金币消耗量，且可用
     */
    @property (cc.Label)
    txtCostEnable: cc.Label = null;
    /**
     * 文本 - 当前金币消耗量，且不可用
     */
    @property (cc.Label)
    txtCostDisable: cc.Label = null;

    /**
     * 按钮 - 问答
     */
    @property (ComponentNodeEventer)
    btnQa: ComponentNodeEventer = null;

    /**
     * 红点
     */
    @property (cc.Node)
    nodeRedEquipFresh: cc.Node = null;
    /**
     * 文本 - 奖励缩放
     */
    @property (cc.Label)
    txtRewardScale: cc.Label = null;

    protected onEnable(): void {
        this.nodeReward.active = false;
    }

    static nodeType = UINodeType.Pop<GameFailedView, GameFailedViewState, number>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/game_failed_view`,
            componentGetter: node => node.getComponent(GameFailedView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<GameFailedView, GameFailedViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_LOTTO
                        ],
                        propsFilter: (com, state, props) => {
                            com.txtRewardScale.string = `${gameMath.REWARD_SCALE} 倍领取`;
                            com.nodeRedEquipFresh.active = IndexViewRS.equip.redCheck ();
                            let playMachineRS = PlayOrdinaryRS.GetRS (state.idCfgLev);
                            let cfgScene = jiang.mgrCfg.cfgScene.select (CfgScene.idGetter, playMachineRS.getterSceneId (state.idCfgLev))._list [0];
                            let themeCache = CfgCacheScene.GetCache (cfgScene);
                            for (let i = 0; i < com.listNodeDark.length; i++) {
                                com.listNodeDark [i].color = themeCache.colorDark;
                            };
                            for (let i = 0; i < com.listNodeLight.length; i++) {
                                com.listNodeLight [i].color = themeCache.colorLight;
                            };
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
                            com.btnAgain.evterTouchStart.On(() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnAgain.evterTouchEnd.On(() => {
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

                            // 无需胜利也可以获得奖励的话，才显示出来
                            com.nodeReward.active = indexBuildConfig.VIDEO_ENABLE && state.gameState.listRewardIdCfg.length != 0 && gameMath.IsStandardRewardScene (state.gameState.cfgSceneCache.idCfg);
                            com.btnGotImm.evterTouchStart.On(() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnGotImm.evterTouchEnd.On(() => {
                                // 获得奖励
                                RewardViewState.GotRewardOrdinary (gameCommon.TITLE_REWARD, state.gameState.listRewardIdCfg);
                                // 清空奖励
                                state.gameState.listRewardIdCfg.length = 0;
                            });
                            com.btnGotDouble.evterTouchStart.On(() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnGotDouble.evterTouchEnd.On(() => {
                                jiang.mgrSdk.core.WXVideo()
                                    .then((ctx) => {
                                        if (ctx.isRewardAble) {
                                            // 双倍
                                            for (let i = 0; i < state.gameState.listRewardIdCfg.length; i++) {
                                                state.gameState.listRewardIdCfg [i].props [1] *= gameMath.REWARD_SCALE;
                                            };
                                            // 获得奖励
                                            RewardViewState.GotRewardOrdinary (gameCommon.TITLE_REWARD, state.gameState.listRewardIdCfg);
                                            // 清空奖励
                                            state.gameState.listRewardIdCfg.length = 0;
                                        };
                                    });
                            });
                            
                            com.txtCurrent.string = `${utilMath.ParseNumToKMBTAABB (state.stateLvUpBatch.recCoin.count, Math.floor)}`;
                            com.txtCostEnable.string = `${utilMath.ParseNumToKMBTAABB (state.stateLvUpBatch.countCost, Math.ceil)}`;
                            com.txtCostEnable.node.active = state.stateLvUpBatch.countCost <= state.stateLvUpBatch.recCoin.count;
                            com.txtCostDisable.string = `${utilMath.ParseNumToKMBTAABB (state.stateLvUpBatch.countCost, Math.ceil)}`;
                            com.txtCostDisable.node.active = state.stateLvUpBatch.recCoin.count < state.stateLvUpBatch.countCost;
                            com.btnStrengthen.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet (DefineVoice.VOICE_MONEY);
                            });
                            com.btnStrengthen.evterTouchEnd.On (() => {
                                state.stateLvUpBatch.Go ();
                            });
                            com.btnQa.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
                            });
                            com.btnQa.evterTouchEnd.On (() => {
                                jiang.mgrUI.Open (
                                    LotteryTipsView.nodeType,
                                    LotteryTipsViewState.Pop (APP)
                                );
                            });
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<GameFailedView, GameFailedViewState, number>(
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