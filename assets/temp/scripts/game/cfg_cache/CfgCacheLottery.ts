import CfgLottery from "../../frame/config/src/CfgLottery";
import LotteryViewState from "../view/lottery_view/LotteryViewState";
import CfgCacheLotteryUnlockRS from "./CfgCacheLotteryUnlockRS";

const APP = `CfgCacheLottery`;

interface CfgCacheLottery {
    /**
     * 解锁相关的注册信息
     */
    unlockRS: CfgCacheLotteryUnlockRS<any>;
    /**
     * 解锁相关的注册信息 - 缓存
     */
    unlockRSProps: any;
}

namespace CfgCacheLottery {
    /**
     * 存取缓存数据的键
     */
    const SYM = Symbol (`CfgCacheLottery`);

    /**
     * 设置缓存数据
     * @param CfgLottery 
     * @param cache 
     */
    export function SetCache (CfgLottery: CfgLottery, cache: CfgCacheLottery) {
        CfgLottery [SYM] = cache;
    }

    /**
     * 获取缓存数据
     * @param cfgLottery 
     * @returns 
     */
    export function GetCache (cfgLottery: CfgLottery) {
        if (cfgLottery == null) {
            return null;
        };
        return cfgLottery [SYM] as CfgCacheLottery;
    }

    /**
     * 检查是否已经解锁
     * @param state 
     * @param cfg 
     * @returns 
     */
    export function CheckUsUnlocked (
        challengeChapter: number,
        cfg: CfgLottery
    )
    {
        let cache = GetCache (cfg);
        return cache.unlockRS.checkIsUnlocked (cfg, challengeChapter, cache.unlockRSProps);
    }
}

export default CfgCacheLottery;