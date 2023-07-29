import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import BCType from "../../../frame/basic/BCType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import CfgBackpackProp from "../../../frame/config/src/CfgBackpackProp";
import CfgStore from "../../../frame/config/src/CfgStore";
import jiang from "../../../frame/global/Jiang";
import MgrSdk from "../../../frame/sdk/MgrSdk";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import gameMath from "../../GameMath";
import GameStateReward from "../../game_element/GameStateReward";
import GameCfgBodyCacheDropRS from "../../game_element/body/GameCfgBodyCacheDropRS";
import EquipmentPreviewView from "../equipment_preview_view/EquipmentPreviewView";
import EquipmentPreviewViewState from "../equipment_preview_view/EquipmentPreviewViewState";
import EquipmentViewEquip from "../equipment_view/EquipmentViewEquip";
import IndexViewState from "../index_view/IndexViewState";
import RewardViewState from "../reward_view/RewardViewState";
import TipsViewState from "../tips_view/TipsViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";

const {ccclass, property} = cc._decorator;

const APP = `StoreViewItem`;

/**
 * 商店界面 - 物品单元 - 武器
 */
@ccclass
export default class StoreViewItemEquipment extends UIViewComponent {
    /**
     * 文本 - 当前等级
     */
    @property (cc.Label)
    txtLvCurrent: cc.Label = null;

    /**
     * 容器 - 物品
     */
    @property (cc.Node)
    containerItem: cc.Node = null;

    /**
     * 按钮 - 购买
     */
    @property (ComponentNodeEventer)
    btnBought: ComponentNodeEventer = null;

    /**
     * 按钮 - 查看
     */
    @property (ComponentNodeEventer)
    btnWatch: ComponentNodeEventer = null;

    /**
     * 节点 - 遮罩
     */
    @property (cc.Node)
    nodeMask: cc.Node = null;

    /**
     * 节点 - 等级提升
     */
    @property (cc.Node)
    nodeLvUp: cc.Node = null;

    static nodeType = UINodeType.Pop <StoreViewItemEquipment, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/item_equipment_store_view_item_bought`,
            componentGetter: node => node.getComponent (StoreViewItemEquipment),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<StoreViewItemEquipment, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_STORE
                        ],
                        propsFilter: (com, state, props) => {
                            state.stateStore.layout.SetElePos (com.node, props);
                            let cfgStoreItem = jiang.mgrCfg.cfgStore.select (CfgStore.idGetter, props)._list[0];
                            // 将要获得的强度
                            let powerGot = 0;
                            // 当前等级
                            let levCurrent = 0;
                            // 已拥有，计算提升量
                            if (state.stateStore.mapIdToEquipRec.has (cfgStoreItem.item_id)) {
                                let rec: indexDataStorageItem.EquipmentRecord = state.stateStore.mapIdToEquipRec.get (cfgStoreItem.item_id);
                                // 当前等级
                                let powerCurrent = gameMath.equip.ParseCountToPower (rec.count);
                                levCurrent = gameMath.ParsePowerToLev (powerCurrent);
                                powerGot = gameMath.ParseLevToPower (state.stateStore.levMax) - powerCurrent;
                                // 保底为 0
                                powerGot = Math.max (powerGot, 0);
                            }
                            // 
                            else {
                                powerGot = gameMath.ParseLevToPower (state.stateStore.levMax);
                            };
                            let countGot: number = gameMath.equip.ParsePowerToCount (powerGot);
                            com.txtLvCurrent.string = `+${state.stateStore.levMax - levCurrent}级`;
                            com.nodeMask.active = false;
                            com.btnWatch.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnWatch.evterTouchEnd.On (() => {
                                jiang.mgrUI.Open(
                                    EquipmentPreviewView.nodeType,
                                    EquipmentPreviewViewState.Pop(
                                        APP,
                                        cfgStoreItem.item_id,
                                        countGot
                                    )
                                );
                            });
                            com.btnBought.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnBought.evterTouchEnd.On (() => {
                                if (levCurrent == state.stateStore.levMax) {
                                    TipsViewState.inst.Tip (`背包中该武器等级最大，不可视频升级`);
                                    return;
                                };
                                jiang.mgrSdk.core.WXVideo ()
                                    .then ((ctx) => {
                                        if (ctx.isRewardAble) {
                                            // 奖励列表
                                            let listReward: Array<GameStateReward> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                                            let rewardProps = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                                            rewardProps.push (cfgStoreItem.item_id, countGot); 
                                            listReward.push ({
                                                rs: GameCfgBodyCacheDropRS.xlsxEquipment,
                                                props: rewardProps
                                            });
                                            RewardViewState.GotRewardOrdinary (gameCommon.TITLE_REWARD, listReward);
                                            // 刷新画面
                                            jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_EQUIP)
                                            jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_STORE);
                                        };
                                    });
                            });
                            com.nodeLvUp.active = levCurrent < state.stateStore.levMax;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<StoreViewItemEquipment, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerItem;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let cfgStoreItem = jiang.mgrCfg.cfgStore.select (CfgStore.idGetter, props)._list[0];
                            listNode.push (
                                EquipmentViewEquip.GetNodeTypeForIconUI (
                                    cfgStoreItem.item_id
                                )
                                    .CreateNode (
                                        state,
                                        null,
                                        cfgStoreItem.item_id
                                    )
                            );
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.localScale0,
            enterRS: UINodeInstEnterRS.opacityInForPrefab200
        }
    )
}