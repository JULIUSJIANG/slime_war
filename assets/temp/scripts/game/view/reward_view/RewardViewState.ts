import BCPromiseCtrl from "../../../frame/basic/BCPromiseCtrl";
import utilMath from "../../../frame/basic/UtilMath";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import MgrSdk from "../../../frame/sdk/MgrSdk";
import MgrUI from "../../../frame/ui/MgrUI";
import ViewState from "../../../frame/ui/ViewState";
import IndexLayer from "../../../IndexLayer";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import ParticleDataGroup from "../../game_element/common/ParticleDataGroup";
import GameStateReward from "../../game_element/GameStateReward";
import gameCommon from "../../GameCommon";
import gameMath from "../../GameMath";
import EquipmentLvUpSumView from "../equipment_lv_up_sum_view/EquipmentLvUpSumView";
import EquipmentLvUpSumViewState from "../equipment_lv_up_sum_view/EquipmentLvUpSumViewState";
import EquipmentLvUpView from "../equipment_lv_up_view/EquipmentLvUpView";
import EquipmentLvUpViewState from "../equipment_lv_up_view/EquipmentLvUpViewState";
import FlashView from "../flash_view/FlashView";
import FlashViewState from "../flash_view/FlashViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import RewardView from "./RewardView";
import RewardViewParticleData from "./RewardViewParticleData";
import RewardViewStateReport from "./RewardViewStateReport";
import RewardViewStateReportEquipment from "./RewardViewStateReportEquipment";

const APP = `RewardViewState`;

/**
 * 粒子数量
 */
const PARTICLE_COUNT = 50;

/**
 * 粒子总时长
 */
const PARTICLE_MS_TOTAL = 1200;
/**
 * 粒子随机时长
 */
const PARTICLE_MS_RANDOM = 600;

/**
 * 粒子总偏移 - 水平
 */
const PARTICLE_POS_HOR_TOTAL = 250;
/**
 * 粒子随机偏移 - 水平
 */
const PARTICLE_POS_HOR_RANDOM = 200;

/**
 * 粒子总偏移 - 垂直
 */
const PARTICLE_POS_VER_TOTAL = PARTICLE_POS_HOR_TOTAL * MgrUI.FAT_WIDTH / MgrUI.FAT_HEIGHT;
/**
 * 粒子随机偏移 - 垂直
 */
const PARTICLE_POS_VER_RANDOM = PARTICLE_POS_HOR_RANDOM * MgrUI.FAT_WIDTH / MgrUI.FAT_HEIGHT;

/**
 * 粒子总缩放
 */
const PARTICLE_SIZE_SCALE_TOTAL = 1.0;
/**
 * 粒子随机缩放
 */
const PARTICLE_SIZE_SCALE_RANDOM = 0.35;

/**
 * 奖励界面的状态
 */
class RewardViewState extends ViewState {

    listRewardParticleData: Array<any>;

    private constructor () {
        super (
            IndexLayer.GAME,
            ViewState.BG_TYPE.MASK,
            true
        );
    }

    private static _t = new UtilObjPoolType<RewardViewState>({
        instantiate: () => {
            return new RewardViewState();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            
        },
        tag: APP
    });

    /**
     * 容器 - 宽
     */
    containerWidth: number;
    /**
     * 容器 - 高
     */
    containerHeight: number;

    static Pop (apply: string, title: string, listReward: Array<GameStateReward>) {
        let val = UtilObjPool.Pop(RewardViewState._t, apply);
        val.title = title;
        // 克隆
        for (let i = 0; i < listReward.length; i++) {
            let dataOrigin = listReward [i];
            let dataTarget: GameStateReward = {
                rs: dataOrigin.rs,
                props: UtilObjPool.Pop (UtilObjPool.typeArray, APP)
            };
            for (let j = 0; j < dataOrigin.props.length; j++) {
                dataTarget.props.push (dataOrigin.props [j]);
            };
            val.listReward.push (dataTarget);
        };
        // 排序
        val.listReward.sort ((a, b) => {
            if (a.rs != b.rs) {
                return a.rs.code - b.rs.code;
            };
            return a.props [0] - b.props [0];
        });

        let countHor: number;
        let countVer: number;
        if (listReward.length <= RewardViewState.LINE_MAX) {
            countHor = listReward.length;
            countVer = 1;
        }
        // 双行显示
        else if (listReward.length <= RewardViewState.LINE_MAX * 2) {
            countHor = Math.ceil (listReward.length / 2);
            countVer = 2;
        }
        // 3 行显示
        else {
            countHor = Math.ceil (listReward.length / 3);
            countVer = 3;
        };

        val.containerWidth = countHor * (RewardViewState.ITEM_SIZE + RewardViewState.SPACE_HOR) - RewardViewState.SPACE_HOR + RewardViewState.PADDING * 2;
        val.containerHeight = countVer * (RewardViewState.ITEM_SIZE + RewardViewState.SPACE_VER) - RewardViewState.SPACE_VER + RewardViewState.PADDING * 2;

        return val;
    }

    /**
     * 标题
     */
    title: string;
    /**
     * 奖励列表
     */
    listReward: Array<GameStateReward> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
    /**
     * 粒子组
     */
    particleGroup = ParticleDataGroup.Pop (APP);

    /**
     * 关于时间步进的监听
     */
    private _listenIdStep;

    override OnInit(): void {
        this._listenIdStep = jiang.mgrEvter.evterUpdate.On ((ms) => {
            this.particleGroup.onStep (ms);
            jiang.mgrUI.ModuleRefresh (IndexDataModule.REWARD);
        });
    }

    /**
     * 进展 - 销毁
     */
    public ctrlDestoried = BCPromiseCtrl.Pop (APP);

    override OnDestory(): void {
        jiang.mgrEvter.evterUpdate.Off (this._listenIdStep);
        this.ctrlDestoried.resolve (null);
    }

    /**
     * 升级界面的状态中心
     */
    _lvUpState: EquipmentLvUpSumViewState;

    override OnMaskTouch(): void {
        VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
        jiang.mgrUI.Close (this._idView);
    }

    override OnDisplay(): void {
        let angleDistance = 2 * Math.PI / PARTICLE_COUNT;
        // 构造 10 个粒子
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            let data = RewardViewParticleData.Pop (
                APP, 
                i * angleDistance, 
                PARTICLE_POS_HOR_TOTAL + utilMath.RandomLowerToUpper() * PARTICLE_POS_HOR_RANDOM,
                PARTICLE_POS_VER_TOTAL + utilMath.RandomLowerToUpper() * PARTICLE_POS_VER_RANDOM,
                PARTICLE_SIZE_SCALE_TOTAL + utilMath.RandomLowerToUpper() * PARTICLE_SIZE_SCALE_RANDOM
            );
            this.particleGroup.CreateParticle (PARTICLE_MS_TOTAL + utilMath.RandomLowerToUpper() * PARTICLE_MS_RANDOM, data);
        };
        VoiceOggViewState.inst.VoiceSet(1001001005);
    }

    /**
     * 获得奖励，并且自动弹窗
     * @param listReward 
     */
    public static GotRewardOrdinary (title: string, listReward: Array<GameStateReward>) {
        // 无实质奖励，忽略
        if (0 == listReward.length) {
            return Promise.resolve ();
        };

        let listEquip = jiang.mgrData.Get (indexDataStorageItem.listEquipment);
        // 记录下奖励进背包前的等级
        let mapIdCfgToLevBefore: Map <number, number> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);
        for (let i = 0; i < listEquip.length; i++) {
            let listEquipItem = listEquip [i];
            mapIdCfgToLevBefore.set (listEquipItem.idCfg, gameMath.ParsePowerToLev (gameMath.equip.ParseCountToPower (listEquipItem.count)));
        };
        for (let i = 0; i < listReward.length; i++) {
            let reward = listReward [i];
            reward.rs.onEnterBackpack (reward.props);
        };
        // 奖励报告
        let report = RewardViewStateReport.Pop (APP);
        for (let i = 0; i < listEquip.length; i++) {
            let listEquipItem = listEquip [i];
            // 先前没有的话，忽略
            if (!mapIdCfgToLevBefore.has (listEquipItem.idCfg)) {
                continue;
            };
            let lvBefore = mapIdCfgToLevBefore.get (listEquipItem.idCfg);
            let lvAfter = gameMath.ParsePowerToLev (gameMath.equip.ParseCountToPower (listEquipItem.count));
            // 等级没有发生变化，忽略
            if (lvBefore == lvAfter) {
                continue;
            };
            let listEquipItemRecord = RewardViewStateReportEquipment.Pop (APP);
            listEquipItemRecord.idCfg = listEquipItem.idCfg;
            listEquipItemRecord.lvBefore = lvBefore;
            listEquipItemRecord.lvAfter = lvAfter;
            report.listEquipmentInfo.push (listEquipItemRecord);
        };

        // 有升级内容，弹升级内容
        if (0 < report.listEquipmentInfo.length) {
            return Promise.resolve ()
                .then (() => {
                    let flashViewState = FlashViewState.Pop (APP);
                    jiang.mgrUI.Open (
                        FlashView.nodeType,
                        flashViewState
                    );
                    return flashViewState.promiseOut._promise;
                })
                .then (() => {
                    let lvUpState = EquipmentLvUpSumViewState.Pop (
                        APP,
                        report.listEquipmentInfo.map ((ele) => {
                            return ele.idCfg
                        })
                    );
                    jiang.mgrUI.Open (
                        EquipmentLvUpSumView.nodeType,
                        lvUpState
                    );
                    return new Promise ((resolve) => {
                        lvUpState._evterDestory.On (resolve);
                    });
                });
        };

        // 弹窗
        let rewardViewState = RewardViewState.Pop (
            APP, 
            title, 
            listReward
        );
        // 弹窗
        jiang.mgrUI.Open (
            RewardView.nodeType,
            rewardViewState
        );
        return rewardViewState.ctrlDestoried._promise;
    }
}

namespace RewardViewState {
    /**
     * 单行最大奖励数量
     */
    export const LINE_MAX = 6;

    /**
     * 内边距
     */
    export const PADDING = 10;

    /**
     * 元素尺寸
     */
    export const ITEM_SIZE = 100;

    /**
     * 水平间距
     */
    export const SPACE_HOR = 20;
    /**
     * 垂直间距
     */
    export const SPACE_VER = 20;
}

export default RewardViewState;