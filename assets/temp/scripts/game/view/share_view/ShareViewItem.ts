import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import CfgBackpackProp from "../../../frame/config/src/CfgBackpackProp";
import jiang from "../../../frame/global/Jiang";
import MgrSdk from "../../../frame/sdk/MgrSdk";
import MgrSdkCore from "../../../frame/sdk/MgrSdkCore";
import MgrSdkEnterRS from "../../../frame/sdk/MgrSdkEnterRS";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import BackpackPropPreviewView from "../backpack_prop_preview_view/BackpackPropPreviewView";
import BackpackPropPreviewViewState from "../backpack_prop_preview_view/BackpackPropPreviewViewState";
import RewardGridArgs from "../common/RewardGridArgs";
import IndexViewState from "../index_view/IndexViewState";
import RewardViewState from "../reward_view/RewardViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import ShareViewState from "./ShareViewState";


const {ccclass, property} = cc._decorator;

const APP = `ShareViewItem`;

/**
 * 分享界面 - 具体的奖励单元
 */
@ccclass
export default class ShareViewItem extends UIViewComponent {
    /**
     * 容器 - 奖励
     */
    @property (cc.Node)
    containerReward: cc.Node = null;

    /**
     * 节点 - 光亮
     */
    @property (cc.Node)
    nodeLight: cc.Node = null;
    /**
     * 节点 - 已领取
     */
    @property (cc.Node)
    nodeGotted: cc.Node = null;
    /**
     * 按钮 - 分享
     */
    @property (ComponentNodeEventer)
    evterShare: ComponentNodeEventer = null;
    /**
     * 按钮 - 领取
     */
    @property (ComponentNodeEventer)
    evterGot: ComponentNodeEventer = null;
    /**
     * 图片 - 助力者
     */
    @property (cc.Sprite)
    sprHelper: cc.Sprite = null;
    /**
     * 节点 - 已加入
     */
    @property (cc.Node)
    nodeHelped: cc.Node = null;
    /**
     * 按钮 - 详情
     */
    @property (ComponentNodeEventer)
    evterDetail: ComponentNodeEventer = null;

    static nodeType = UINodeType.Pop <ShareViewItem, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/share_view_item`,
            componentGetter: node => node.getComponent (ShareViewItem),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <ShareViewItem, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_SHARE,
                            IndexDataModule.INDEXVIEW_EQUIP,
                            IndexDataModule.SDK
                        ],
                        propsFilter: (com, state, props) => {
                            let group = state.stateShare.listGroup [props];
                            // 助力状态
                            let joined: boolean = state.stateShare.mapIdxToJoinItem.has (group.rs.idProp);
                            // 领取状态
                            let gotted: boolean = state.stateShare.mapIdCfgToBackPackPropRecord.has (group.rs.idProp);
                            // 物品配置
                            let cfgProp = jiang.mgrCfg.cfgBackpackProp.select (CfgBackpackProp.idGetter, group.rs.idProp)._list [0];

                            com.nodeLight.active = !gotted;
                            com.nodeGotted.active = gotted;
                            com.evterGot.node.active = joined && !gotted;
                            com.evterGot.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
                            });
                            com.evterGot.evterTouchEnd.On (() => {
                                let listRewad = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                                listRewad.push (group.reward);
                                RewardViewState.GotRewardOrdinary (gameCommon.TITLE_REWARD, listRewad);
                            });
                            com.evterShare.node.active = !joined;
                            com.evterShare.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
                            });
                            com.evterShare.evterTouchEnd.On (() => {
                                MgrSdk.inst.core.WXShare (
                                    `我想要${cfgProp.name}，快来帮帮我`,
                                    MgrSdkEnterRS.invited,
                                    {
                                        open_id: MgrSdk.inst.core.WXGetOpenId (),
                                        id_prop: `${group.rs.idProp}`
                                    },
                                    group.rs.imgId,
                                    group.rs.imgUrl
                                )
                            });
                            com.nodeHelped.active = joined;
                            // 展示加入者的头像
                            if (joined) {
                                let joinedMsg = state.stateShare.mapIdxToJoinItem.get (group.rs.idProp);
                                MgrSdk.inst.core.FillSprByUrl (com.sprHelper, joinedMsg.url);
                            };
                            com.evterDetail.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
                            });
                            com.evterDetail.evterTouchEnd.On (() => {
                                jiang.mgrUI.Open(
                                    BackpackPropPreviewView.nodeType,
                                    BackpackPropPreviewViewState.Pop(
                                        APP,
                                        group.rs.idProp,
                                        1
                                    )
                                );
                            });
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop <ShareViewItem, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerReward;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let group = state.stateShare.listGroup [props];
                            listNode.push (group.reward.rs.onGetUIRewardNodeType().CreateNode (
                                state,
                                RewardGridArgs.Pop (group.reward.rs, group.reward.props),
                                null
                            ));
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.opacityInForPrefab200
        }
    )
}