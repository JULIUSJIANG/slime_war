import CfgStore from "../../frame/config/src/CfgStore";
import StoreViewState from "../view/store_view/StoreViewState";
import CfgCacheStore from "./CfgCacheStore";

/**
 * 商店缓存数据的注册信息
 */
class CfgCacheStoreUnlockRS<T> {
    /**
     * 代号
     */
    code: number;

    /**
     * 缓存生成器
     */
    propsCreator: (cfg: CfgStore) => T;

    /**
     * 检查是否已解锁
     */
    checkIsUnlocked: (cfg: CfgStore, state: StoreViewState, args: T) => boolean;

    constructor (args: {
        code: number,
        propsCreator: (cfg: CfgStore) => T,
        checkIsUnlocked: (cfg: CfgStore, state: StoreViewState, args: T) => boolean
    }) 
    {
        this.code = args.code;
        this.propsCreator = args.propsCreator;
        this.checkIsUnlocked = args.checkIsUnlocked;

        CfgCacheStoreUnlockRS.mapIdToRS.set (args.code, this);
    }
}

namespace CfgCacheStoreUnlockRS {
    /**
     * 代号到实例的缓存
     */
    export const mapIdToRS: Map<number, CfgCacheStoreUnlockRS<any>> = new Map ();

    /**
     * 通过阶段解锁 - 参数
     */
    export interface UnlockByStepProps {
        step: number;
    }
    /**
     * 通过阶段解锁 - 策略
     */
    export const unlockByStep = new CfgCacheStoreUnlockRS <UnlockByStepProps> ({
        code: 1,
        propsCreator: (cfg) => {
            return {
                step: cfg.unlock_val_0
            };
        },
        checkIsUnlocked: (cfg, state, args) => {
            return args.step <= state.challengeChapter;
        }
    });
}

export default CfgCacheStoreUnlockRS;