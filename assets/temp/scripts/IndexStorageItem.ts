import MgrDataItem from "./frame/data/MgrDataItem";
import MgrDataType from "./frame/data/MgrDataType";
import MgrDataItemMediaRS from "./frame/data/MgrDateItemMediaRS";
import jiang from "./frame/global/Jiang";
import gameMath from "./game/GameMath";
import PlayOrdinaryEnemyCall from "./game/play_ordinary/PlayOrdinaryEnemyCall";

/**
 * 初始化的难度
 */
const INIT_CYCLE = 0;

/**
 * 默认面对的关卡
 */
const INIT_UNLOCKED_LEV = 1;

/**
 * 基础的已读单位
 */
const BASE_VIEWED_MONSTER = 4001001;

/**
 * 基础装备
 */
const BASE_EQUIPMENT = [
    200001,
    200002

    // 200001,
    // 200002,
    // 200201,
    // 200202,
    // 200301,
    // 200302,
    // 200401,
    // 200402,
    // 200501,
    // 200502,
    // 200601,
    // 200602,
    // 200701,
    // 200702,
    // 200801,
    // 200802,
    // 200901,
    // 200902,
    // 201001,
    // 201002,
    // 201101,
    // 201102,
    // 201201,
    // 201202,
    // 201301,
    // 201302,
    // 201401,
    // 201402,
    // 201501,
    // 201502,
    // 201601,
    // 201602
];

for (let i = 0; i < BASE_EQUIPMENT.length; i++) {
    let ele = BASE_EQUIPMENT[i];
    if (ele == null) {
        BASE_EQUIPMENT.splice (i, 1);
    };
};

const APP = `indexDataStorageItem`;
namespace indexDataStorageItem {
    /**
     * 数据版本，只应该在调试阶段改这个值
     */
    export const version = 122;

    /**
     * 存取数据的凭据，每次取得存档时（登录），服务端该值++，提交存档时候若该值过时，那么终止该客户端的运行
     */
    export const storageKey = MgrDataItem.Pop (
        APP,
        `storage_key`,
        MgrDataType.typeNumber,
        () => 0,
        MgrDataItemMediaRS.server
    );

    /**
     * 挑战界面 - 当前选择的章节
     */
    export const selectedChapter = MgrDataItem.Pop(
        APP,
        `selectedChapter_${version}`,
        MgrDataType.typeNumber,
        () => 1,
        MgrDataItemMediaRS.local
    );

    /**
     * 当前挑战的关卡
     */
    export const challengeLev = MgrDataItem.Pop (
        APP,
        `challengeLev_${version}`,
        MgrDataType.typeNumber,
        () => INIT_UNLOCKED_LEV,
        MgrDataItemMediaRS.server
    );
    
    /**
     * 物品的记录
     */
    export interface BackpackPropRecord {
        /**
         * 配表 id
         */
        idCfg: number;
        /**
         * 数量
         */
        count: number;
        /**
         * 是否已读
         */
        isRead: boolean;
    };
    /**
     * 当前拥有的物品记录
     */
    export const listBackpackProp = MgrDataItem.Pop<Array<BackpackPropRecord>>(
        APP,
        `listBackpackProp_${version}`,
        MgrDataType.typeObject as any,
        () => [
            {
                idCfg: 10001,
                count: 1,
                isRead: true
            },
            {
                idCfg: 20001,
                count: 0,
                isRead: true
            }
        ],
        MgrDataItemMediaRS.server
    );
    /**
     * 装备的记录
     */
    export interface EquipmentRecord {
        /**
         * 配表 id
         */
        idCfg: number;
        /**
         * 数量
         */
        count: number;
        /**
         * 是否已读
         */
        isRead: boolean;
    };
    /**
     * 列表 - 装备
     */
    export const listEquipment = MgrDataItem.Pop<Array<EquipmentRecord>>(
        APP,
        `listEquipment_${version}`,
        MgrDataType.typeObject as any,
        () => BASE_EQUIPMENT.map ((val, idx) => {
            return {
                idCfg: val,
                // 等级 1 的数量
                count: Math.ceil (gameMath.equip.ParsePowerToCount( gameMath.ParseLevToPower (1))),
                isRead: true
            }
        }),
        MgrDataItemMediaRS.server
    );
    /**
     * 列表 - 当前已装备内容
     */
    export const listCurrentEquiped = MgrDataItem.Pop<Array<number>> (
        APP,
        `listCurrentEquiped_${version}`,
        MgrDataType.typeObject as any,
        () => [
            BASE_EQUIPMENT [0],
            BASE_EQUIPMENT [1]
        ],
        MgrDataItemMediaRS.server
    );
    /**
     * 音乐音量
     */
    export const volumeMusic = MgrDataItem.Pop(
        APP,
        `volumeMusic_${version}`,
        MgrDataType.typeNumber,
        () => 1,
        MgrDataItemMediaRS.local
    );

    /**
     * 音效音量
     */
    export const volumeVoice = MgrDataItem.Pop(
        APP,
        `volumeVoice_${version}`,
        MgrDataType.typeNumber,
        () => 1,
        MgrDataItemMediaRS.local
    );

    /**
     * 当前引导的步骤
     */
    export const guideStep = MgrDataItem.Pop<number> (
        APP,
        `guideStep_${version}`,
        MgrDataType.typeNumber as any,
        () => 0,
        MgrDataItemMediaRS.server
    );

    /**
     * 当前祭坛数据 - 等级
     */
    export const altarInitLev = MgrDataItem.Pop<number> (
        APP,
        `altarInitLev_${version}`,
        MgrDataType.typeNumber as any,
        () => -1,
        MgrDataItemMediaRS.server
    );
    /**
     * 当前祭坛数据 - 物体
     */
    export const altarInitListBody = MgrDataItem.Pop<Array<PlayOrdinaryEnemyCall>> (
        APP,
        `altarInitListBody_${version}`,
        MgrDataType.typeObject as any,
        () => [],
        MgrDataItemMediaRS.server
    );

    /**
     * 挂机 - 收益等级
     */
    export const goldEquipLev = MgrDataItem.Pop<number> (
        APP,
        `goldEquipLev_${version}`,
        MgrDataType.typeNumber,
        () => 1,
        MgrDataItemMediaRS.server
    );
    /**
     * 挂机 - 上次收益的时间戳
     */
    export const goldLastDate = MgrDataItem.Pop<number> (
        APP,
        `goldLastDate_${version}`,
        MgrDataType.typeNumber,
        () => {
            return jiang.mgrDateNow.DateNow ();
        },
        MgrDataItemMediaRS.server
    );
}

export default indexDataStorageItem;