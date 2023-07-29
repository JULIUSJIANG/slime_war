import CfgLottery from "../../frame/config/src/CfgLottery";
import LotteryViewState from "../view/lottery_view/LotteryViewState";

/**
 * 乐透缓存数据的注册信息
 */
class CfgCacheLotteryUnlockRS<T> {
    /**
     * 代号
     */
    code: number;

    /**
     * 缓存生成器
     */
    propsCreator: (cfg: CfgLottery) => T;

    /**
     * 检查是否已解锁
     */
    checkIsUnlocked: (cfg: CfgLottery, challengeChapter: number, args: T) => boolean;

    constructor (args: {
        code: number,
        propsCreator: (cfg: CfgLottery) => T,
        checkIsUnlocked: (cfg: CfgLottery, challengeChapter: number, args: T) => boolean
    })
    {
        this.code = args.code;
        this.propsCreator = args.propsCreator;
        this.checkIsUnlocked = args.checkIsUnlocked;

        CfgCacheLotteryUnlockRS.mapIdToRS.set (args.code, this);
    }
}

namespace CfgCacheLotteryUnlockRS {
    /**
     * 代号到实例的缓存
     */
    export const mapIdToRS: Map<number, CfgCacheLotteryUnlockRS<any>> = new Map ();

    /**
     * 通过阶段解锁 - 参数
     */
    export interface UnlockByStepProps {
        step: number;
    }

    export const unlockByStep = new CfgCacheLotteryUnlockRS <UnlockByStepProps> ({
        code: 1,
        propsCreator: (cfg) => {
            return {
                step: cfg.unlock_val_0
            };
        },
        checkIsUnlocked: (cfg, challengeChapter, args) => {
            return args.step <= challengeChapter;
        }
    });
}

export default CfgCacheLotteryUnlockRS;