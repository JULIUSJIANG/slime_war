import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import utilMath from "../../../frame/basic/UtilMath";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import utilString from "../../../frame/basic/UtilString";
import CfgGameElement from "../../../frame/config/src/CfgGameElement";
import CfgLottery from "../../../frame/config/src/CfgLottery";
import CfgStore from "../../../frame/config/src/CfgStore";
import jiang from "../../../frame/global/Jiang";
import UINode from "../../../frame/ui/UINode";
import UINodeType from "../../../frame/ui/UINodeType";
import ViewState from "../../../frame/ui/ViewState";
import gameCommon from "../../GameCommon";
import gameMath from "../../GameMath";
import GameDisplayReward from "../../display/GameDisplayReward";
import BookViewDropBackpackProp from "../../view/book_view/BookViewDropBackpackProp";
import BookViewDropEquipment from "../../view/book_view/BookViewDropEquipment";
import RewardGrid from "../../view/common/RewardGrid";
import RewardGridArgs from "../../view/common/RewardGridArgs";
import EquipmentLvUpView from "../../view/equipment_lv_up_view/EquipmentLvUpView";
import EquipmentLvUpViewState from "../../view/equipment_lv_up_view/EquipmentLvUpViewState";
import EquipmentViewBackpackProp from "../../view/equipment_view/EquipmentViewBackpackProp";
import EquipmentViewEquip from "../../view/equipment_view/EquipmentViewEquip";
import EquipmentViewItem from "../../view/equipment_view/EquipmentViewItem";
import EquipmentViewItemBackpackProp from "../../view/equipment_view/EquipmentViewItemBackpackProp";
import GamePlayViewState from "../../view/game_play/GamePlayViewState";
import IndexViewState from "../../view/index_view/IndexViewState";
import StoreViewItemEquipment from "../../view/store_view/StoreViewItemEquipment";
import VoiceOggViewState from "../../view/voice_ogg/VoiceOggViewState";
import GameStateReward from "../GameStateReward";
import GameElementReward from "../common/GameElementReward";
import DefineVoice from "./DefineVoice";
import GameCfgBodyCacheDrop from "./GameCfgBodyCacheDrop";
import GameElementBody from "./GameElementBody";

const APP = `APP`;

/**
 * 掉落缓存的注册信息
 */
class GameCfgBodyCacheDropRS<T> {
    /**
     * 代号
     */
    code: number;
    /**
     * 纯 ui 展示
     */
    onBubleDisplay: (state: ViewState, listNode: Array<UINode>, idCfg: number) => void;
    /**
     * 构造奖励
     */
    onLotteryCreateReward: (cfg: CfgLottery, lev: number) => GameStateReward;
    /**
     * 商店界面中的展示
     */
    onStoreDisplay: (state: IndexViewState, listNode: Array<UINode>, idCfgBody: number) => void;
    /**
     * 装备商店界面中的展示
     */
    onEquipmentViewDisplay: (state: IndexViewState, listNode: Array<UINode>, idCfgBody: number) => void;

    /**
     * 奖励 - 场景
     */
    onGetSceneRewardNodeType: () => UINodeType<GameDisplayReward, GamePlayViewState, number>;
    /**
     * 奖励 - ui
     */
    onGetUIRewardNodeType: () => UINodeType<RewardGrid, ViewState, RewardGridArgs>;

    /**
     * 概率成功触发
     */
    onTrigger: (cache: GameCfgBodyCacheDrop, ele: GameElementBody) => void;
    /**
     * 获得
     */
    onGot: (ele: GameElementReward) => void;
    /**
     * 放入背包
     */
    onEnterBackpack: (props: Array<number>) => void;

    constructor (args: {
        code: number,
        onBubleDisplay: (state: ViewState, listNode: Array<UINode>, idCfg: number) => void,
        onLotteryCreateReward: (cfg: CfgLottery, count: number) => GameStateReward,
        onStoreDisplay: (state: IndexViewState, listNode: Array<UINode>, idCfgBody: number) => void,
        onEquipmentViewDisplay: (state: IndexViewState, listNode: Array<UINode>, idCfgBody: number) => void,

        onGetSceneRewardNodeType: () => UINodeType<GameDisplayReward, GamePlayViewState, number>,
        onGetUIRewardNodeType: () => UINodeType<RewardGrid, ViewState, RewardGridArgs>,

        onTrigger: (cache: GameCfgBodyCacheDrop, ele: GameElementBody) => void,
        onGot: (ele: GameElementReward) => void,
        onEnterBackpack: (props: Array<number>) => void
    }) 
    {
        this.code = args.code;
        this.onBubleDisplay = args.onBubleDisplay;
        this.onLotteryCreateReward = args.onLotteryCreateReward;
        this.onStoreDisplay = args.onStoreDisplay;
        this.onEquipmentViewDisplay = args.onEquipmentViewDisplay;

        this.onGetSceneRewardNodeType = args.onGetSceneRewardNodeType;
        this.onGetUIRewardNodeType = args.onGetUIRewardNodeType;

        this.onTrigger = args.onTrigger;
        this.onGot = args.onGot;
        this.onEnterBackpack = args.onEnterBackpack;
        GameCfgBodyCacheDropRS.mapCodeToRS.set (this.code, this);
    }
}

namespace GameCfgBodyCacheDropRS {
    /**
     * 代号到注册信息的映射
     */
    export const mapCodeToRS: Map<number, GameCfgBodyCacheDropRS<any>> = new Map();

    /**
     * 武器表内容
     */
    export const xlsxEquipment = new GameCfgBodyCacheDropRS<number>({
        code: 1,
        onBubleDisplay: (state, listNode, idCfg) => {
            listNode.push (
                EquipmentViewEquip.GetNodeTypeForIconUI (
                    idCfg
                )
                    .CreateNode (
                        state,
                        idCfg,
                        idCfg
                    )
            );
        },
        onLotteryCreateReward: (cfg: CfgStore, count: number) => {
            let props = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
            props.push (cfg.item_id, count);
            return {
                rs: xlsxEquipment,
                props: props
            };
        },
        onStoreDisplay: (state, listNode, idCfg) => {
            listNode.push (StoreViewItemEquipment.nodeType.CreateNode (
                state,
                idCfg,
                idCfg
            ));
        },
        onEquipmentViewDisplay: (state, listNode, idCfg) => {
            listNode.push (EquipmentViewItem.nodeType.CreateNode (
                state,
                idCfg,
                idCfg
            ));
        },

        onGetSceneRewardNodeType: () => {
            return GameDisplayReward.nodeTypeForEquipment;
        },
        onGetUIRewardNodeType: () => {
            return RewardGrid.nodeTypeForEquipment;
        },

        onTrigger: (cache, ele) => {
            VoiceOggViewState.inst.VoiceSet(DefineVoice.EQUIPMENT_DROP_TRIGGER);
            let props = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
            let gotCount = gameMath.ParseBodyPowerToCount (ele.commonArgsPower);
            props.push (cache.val, gotCount);
            // 正式掉落
            ele.relState.AddEle(GameElementReward.Pop(
                APP,
                ele.commonCenterPos.x,
                ele.commonCenterPos.y,

                cache,
                props,

                600,
                2000,
                200
            ));
        },
        onGot: (ele) => {
            VoiceOggViewState.inst.VoiceSet(DefineVoice.EQUIPMENT_DROP_GOT);
            let idCfg = ele.props [0];
            let count = ele.props [1];
            let rec: GameStateReward;
            for (let i = 0; i < ele.relState.listRewardIdCfg.length; i++) {
                let exist = ele.relState.listRewardIdCfg [i];
                if (exist.rs != xlsxEquipment) {
                    continue;
                };
                let existIdCfg = exist.props [0];
                if (existIdCfg != idCfg) {
                    continue;
                };
                rec = exist;
                break;
            };
            if (rec == null) {
                let props = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                props.push (idCfg, 0, 0);
                rec = {
                    rs: xlsxEquipment,
                    props: props
                };
                ele.relState.listRewardIdCfg.push(rec);
            };
            rec.props [1] += count;
            // 针对奖励预览的排序
            ele.relState.listRewardIdCfg.sort ((a, b) => {
                if (a.rs != b.rs) {
                    return a.rs.code - b.rs.code;
                };
                let idCfgA = a.props [0];
                let idCfgB = b.props [0];
                return idCfgA - idCfgB;
            });
        },
        onEnterBackpack: (props: Array<number>) => {
            let rewardIdCfg = props [0];
            let rewardCount = props [1];

            // 获取所有奖励缓存
            let listEquipRec = jiang.mgrData.Get(indexDataStorageItem.listEquipment);
            let rewardRec: indexDataStorageItem.EquipmentRecord;
            for (let j = 0; j < listEquipRec.length; j++) {
                let rec = listEquipRec[j];
                if (rec.idCfg != rewardIdCfg) {
                    continue;
                };
                rewardRec = rec;
                break;
            };
            // 先前无记录的话，临时新建
            if (rewardRec == null) {
                rewardRec = {
                    idCfg: rewardIdCfg,
                    count: 0,
                    isRead: false
                };
                listEquipRec.push(rewardRec);
            };
            rewardRec.count += rewardCount;
            rewardRec.count = Math.ceil (rewardRec.count);
            indexDataStorageItem.listEquipment.media.onSet ();
            jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_EQUIP);
            jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_LOTTO);
        }
    });

    /**
     * 物品表内容
     */
    export const xlsxBackpackProp = new GameCfgBodyCacheDropRS<number>({
        code: 2,
        onBubleDisplay: (state, listNode, idCfg) => {
            listNode.push (
                EquipmentViewBackpackProp.GetNodeTypeForUI (
                    idCfg
                )
                    .CreateNode (
                        state,
                        null,
                        null
                    )
            );
        },
        onLotteryCreateReward: (cfg: CfgStore, lev: number) => {
            let props = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
            props.push (cfg.item_id, 0);
            return {
                rs: xlsxBackpackProp,
                props: props
            };
        },
        onStoreDisplay: (state, listNode, idCfg) => {

        },
        onEquipmentViewDisplay: (state, listNode, idCfg) => {
            listNode.push (EquipmentViewItemBackpackProp.nodeType.CreateNode (
                state,
                idCfg,
                idCfg
            ));
        },
        onGetSceneRewardNodeType: () => {
            return GameDisplayReward.nodeTypeForParticle;
        },
        onGetUIRewardNodeType: () => {
            return RewardGrid.nodeTypeForBackpackProp;
        },

        onTrigger: (cache, ele) => {
            // 总量
            let count = gameMath.ParseBodyPowerToCount (ele.commonArgsPower) * ele.relState.dropScale;
            // 划分的数量
            let split = 1;
            let val = 1;
            // 还有机会
            while (val <= count) {
                val *= 3;
                // 要求的数量超标，终止
                if (count < val) {
                    break;
                }
                // 否则等级提高
                else {
                    split++;
                };
            };
            for (let i = 0; i < split; i++) {
                let props = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                props.push (cache.val, count / split);
                // 正式掉落
                ele.relState.AddEle(GameElementReward.Pop(
                    APP,
                    ele.commonCenterPos.x,
                    ele.commonCenterPos.y,
    
                    cache,
                    props,

                    600 + 200 * utilMath.RandomLowerToUpper(),
                    400,
                    0
                ));
            };
        },
        onGot: (ele) => {
            VoiceOggViewState.inst.VoiceSet(DefineVoice.ITEM_DROP_GOT);
            let idCfg = ele.props [0];
            let count = ele.props [1];
            let rec: GameStateReward;
            for (let i = 0; i < ele.relState.listRewardIdCfg.length; i++) {
                let exist = ele.relState.listRewardIdCfg [i];
                if (exist.rs != xlsxBackpackProp) {
                    continue;
                };
                let existIdCfg = exist.props [0];
                if (existIdCfg != idCfg) {
                    continue;
                };
                rec = exist;
                break;
            };
            if (rec == null) {
                let props = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                props.push (idCfg, 0);
                rec = {
                    rs: xlsxBackpackProp,
                    props: props
                };
                ele.relState.listRewardIdCfg.push (rec);
            };
            rec.props [1] += count;
            // 针对奖励预览的排序
            ele.relState.listRewardIdCfg.sort ((a, b) => {
                if (a.rs != b.rs) {
                    return a.rs.code - b.rs.code;
                };
                let idCfgA = a.props [0];
                let idCfgB = b.props [0];
                return idCfgA - idCfgB;
            });
        },
        onEnterBackpack: (props: Array<number>) => {
            let rewardIdCfg = props [0];
            let rewardCount = props [1];

            // 获取所有奖励缓存
            let listEquipRec = jiang.mgrData.Get(indexDataStorageItem.listBackpackProp);
            let rewardRec: indexDataStorageItem.BackpackPropRecord;
            for (let j = 0; j < listEquipRec.length; j++) {
                let rec = listEquipRec[j];
                if (rec.idCfg != rewardIdCfg) {
                    continue;
                };
                rewardRec = rec;
                break;
            };
            // 先前无记录的话，临时新建
            if (rewardRec == null) {
                rewardRec = {
                    idCfg: rewardIdCfg,
                    count: 0,
                    isRead: false
                };
                listEquipRec.push(rewardRec);
            };
            rewardRec.count += rewardCount;
            rewardRec.count = Math.ceil (rewardRec.count);
            indexDataStorageItem.listBackpackProp.media.onSet ();
            jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_EQUIP);
            jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_LOTTO);
        }
    })
}

export default GameCfgBodyCacheDropRS;