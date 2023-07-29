import indexBuildConfig from "../../../IndexBuildConfig";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import BCType from "../../../frame/basic/BCType";
import utilMath from "../../../frame/basic/UtilMath";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import CfgBackpackProp from "../../../frame/config/src/CfgBackpackProp";
import CfgLottery from "../../../frame/config/src/CfgLottery";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import gameMath from "../../GameMath";
import GameStateReward from "../../game_element/GameStateReward";
import DefineVoice from "../../game_element/body/DefineVoice";
import GameCfgBodyCacheDropRS from "../../game_element/body/GameCfgBodyCacheDropRS";
import IndexViewState from "../index_view/IndexViewState";
import RewardViewState from "../reward_view/RewardViewState";
import TipsViewState from "../tips_view/TipsViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import LotteryTipsView from "./LotteryTipsView";
import LotteryTipsViewState from "./LotteryTipsViewState";
import LotteryViewBubble from "./LotteryViewBubble";
import LotteryViewState from "./LotteryViewState";

const {ccclass, property} = cc._decorator;

const APP = `LotteryView`;

/**
 * 材质参数 - 炼金贴图
 */
const MAT_PROPERTY_TEX = `textureAlchemy`;

/**
 * 乐透界面 - 样式
 */
@ccclass
export default class LotteryView extends UIViewComponent {
    /**
     * 文本 - 当前数量 - 可用
     */
    @property (cc.Label)
    txtCurrentEnable: cc.Label = null;

    /**
     * 文本 - 当前数量 - 不可用
     */
    @property (cc.Label)
    txtCurrentDisable: cc.Label = null;

    /**
     * 文本 - 要消耗的数量
     */
    @property (cc.Label)
    txtOwn: cc.Label = null;

    /**
     * 按钮 - 进行抽奖
     */
    @property (ComponentNodeEventer)
    btnGo: ComponentNodeEventer = null;

    /**
     * 容器 - 气泡
     */
    @property (cc.Node)
    containerBubble: cc.Node = null;

    /**
     * 精灵 - 炼金
     */
    @property (cc.Sprite)
    sprAlchemy: cc.Sprite = null;

    /**
     * 相机 - 炼金物品
     */
    @property (cc.Camera)
    cameraAlchemy: cc.Camera = null;

    /**
     * 节点 - 闪烁
     */
    @property (cc.Node)
    nodeBubble: cc.Node = null;

    /**
     * 按钮 - 规则
     */
    @property (ComponentNodeEventer)
    btnRegular: ComponentNodeEventer = null;

    /**
     * 容器 - 物品
     */
    @property (cc.Node)
    containerItem: cc.Node = null;

    protected onLoad(): void {
        let PREMULTIPLY_ALPHA = true;
        let rt = new cc.RenderTexture ();
        rt.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR);
        rt.initWithSize(jiang.mgrUI._containerUI.width, jiang.mgrUI._containerUI.height, cc.RenderTexture.DepthStencilFormat.RB_FMT_D24S8);
        rt.setPremultiplyAlpha(PREMULTIPLY_ALPHA);
        this.cameraAlchemy.targetTexture = rt;
        this.sprAlchemy.getMaterial(0).setProperty(MAT_PROPERTY_TEX, rt);
        this.sprAlchemy.node.width = jiang.mgrUI._containerUI.width;
        this.sprAlchemy.node.height = jiang.mgrUI._containerUI.height;
    }

    static nodeType = UINodeType.Pop<LotteryView, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/lottery_view`,
            componentGetter: node => node.getComponent (LotteryView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<LotteryView, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_LOTTO
                        ],
                        propsFilter: (com, state, props) => {
                            if (state.stateLottery.stateLvUpBatch.recCoin == null) {
                                return;
                            };

                            com.txtCurrentEnable.string = `${utilMath.ParseNumToKMBTAABB (state.stateLottery.stateLvUpBatch.countCost, Math.ceil)}`;
                            com.txtCurrentEnable.node.active = state.stateLottery.stateLvUpBatch.countCost <= state.stateLottery.stateLvUpBatch.recCoin.count;
                            com.txtCurrentDisable.string = `${utilMath.ParseNumToKMBTAABB (state.stateLottery.stateLvUpBatch.countCost, Math.ceil)}`;
                            com.txtCurrentDisable.node.active = state.stateLottery.stateLvUpBatch.recCoin.count < state.stateLottery.stateLvUpBatch.countCost;

                            com.txtOwn.string = `${utilMath.ParseNumToKMBTAABB (state.stateLottery.stateLvUpBatch.recCoin.count, Math.floor)}`;
                            com.btnGo.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet (DefineVoice.VOICE_MONEY);
                            });
                            com.btnGo.evterTouchEnd.On (() => {
                                state.stateLottery.stateLvUpBatch.Go ();
                            });
                            com.btnRegular.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
                            });
                            com.btnRegular.evterTouchEnd.On (() => {
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
                UINodeType.ChildrenGeneration.Pop<LotteryView, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerBubble;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < state.stateLottery.listBubbleData.length; i++) {
                                listNode.push (LotteryViewBubble.nodeType.CreateNode (
                                    state,
                                    i,
                                    i
                                ));
                            };
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    );
}