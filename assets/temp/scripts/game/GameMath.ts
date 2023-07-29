import CfgGameElement from "../frame/config/src/CfgGameElement";
import CfgLevel from "../frame/config/src/CfgLevel";
import jiang from "../frame/global/Jiang";

const APP = `gameMath`;

namespace gameMath {
    /**
     * 最大的挂机时长
     */
    export const GOLD_MS_MAX = 24 * 3600 * 1000;
    /**
     * 挂机满了以后最大的等级提升 - 开启激励视频后
     */
    export const HOOK_LV_UP = 4;
    /**
     * 挂机模块，直接通过视频获得奖励的话，奖励占最大值的比率
     */
    export const AD_GOT_IMM = 0.2;
    /**
     * 领取奖励时候观看视频后的倍数
     */
    export const REWARD_SCALE = 3;

    /**
     * 金币
     */
    export namespace coin {
        /**
         * 数量转化为强度
         * @param count 
         * @returns 
         */
        export function ParseCountToPower (count) {
            return count * jiang.mgrCfg.cfgCommon._list [0].coin_count_to_power;
        }
        /**
         * 强度转化为数量
         * @param power 
         * @returns 
         */
        export function ParsePowerToCount (power) {
            return power / jiang.mgrCfg.cfgCommon._list [0].coin_count_to_power;
        }
    }

    /**
     * 装备的数量缩放
     */
    export namespace equip {
        /**
         * 数量转化为强度
         * @param count 
         * @returns 
         */
        export function ParseCountToPower (count) {
            return count * jiang.mgrCfg.cfgCommon._list [0].equip_count_to_power;
        }
        /**
         * 强度转化为数量
         * @param power 
         * @returns 
         */
        export function ParsePowerToCount (power) {
            return power / jiang.mgrCfg.cfgCommon._list [0].equip_count_to_power;
        }
    }

    /**
     * 通过数量获取等级
     * @param count 
     */
    export function ParsePowerToLev (count: number) {
        let lev = 1;
        let val = 1;
        // 还有机会
        while (val <= count) {
            val *= jiang.mgrCfg.cfgCommon._list [0].inc_for_level;
            // 要求的数量超标，终止
            if (count < val) {
                break;
            }
            // 否则等级提高
            else {
                lev++;
            };
        };
        return lev;
    }

    /**
     * 获取强度
     * @param power 
     */
    export function ParseLevToPower (lev: number) {
        if (lev <= 0) {
            return 0;
        };
        return jiang.mgrCfg.cfgCommon._list [0].inc_for_level ** (lev - 1);
    }
    /**
     * 获取应用强度（抹除未达下一等级的强度）
     * @param power 
     * @returns 
     */
    export function GetAppPower (power: number) {
        return ParseLevToPower (ParsePowerToLev (power));
    }

    /**
     * 获取掉落概率
     * @param idCfgMonster 
     */
    export function GetDropRate (idCfgMonster: number) {
        return 1;
    }
    
    /**
     * 怪物强度转为掉落
     * @param bodyPower 
     * @returns 
     */
    export function ParseBodyPowerToCount (bodyPower: number) {
        // 掉落膨胀
        return coin.ParsePowerToCount (bodyPower * jiang.mgrCfg.cfgCommon._list [0].monster_power_to_drop);
    }
    
    /**
     * 不胜利也可领取奖励
     * @param idChapter 
     * @returns 
     */
    export function IsStandardRewardScene (idScene: number) {
        return 2 < idScene;
    }
};

export default gameMath;