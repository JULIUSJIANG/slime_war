import CfgStore from "../../frame/config/src/CfgStore";
import StoreViewState from "../view/store_view/StoreViewState";
import CfgCacheStoreUnlockRS from "./CfgCacheStoreUnlockRS";

const APP = `CfgCacheStore`;

interface CfgCacheStore {
    /**
     * 解锁相关的注册信息
     */
    unlockRS: CfgCacheStoreUnlockRS<any>;
    /**
     * 解锁相关的注册信息 - 缓存
     */
    unlockRSProps: any;
}

namespace CfgCacheStore {
    /**
     * 存取缓存数据的键
     */
    const SYM = Symbol (`CfgCacheStore`);

    /**
     * 设置缓存数据
     * @param cfgStore 
     */
    export function SetCache (cfgStore: CfgStore, cache: CfgCacheStore) {
        cfgStore [SYM] = cache;
    }

    /**
     * 提取缓存数据
     * @param cfgStore 
     */
    export function GetCache (cfgStore: CfgStore) {
        if (cfgStore == null) {
            return null;
        };
        return cfgStore [SYM] as CfgCacheStore;
    }

    /**
     * 检查是否已经解锁
     */
    export function CheckIsUnlocked (
        state: StoreViewState,
        cfg: CfgStore
    ) 
    {
        let cache = GetCache (cfg);
        return cache.unlockRS.checkIsUnlocked (cfg, state, cache.unlockRSProps);
    }
}

export default CfgCacheStore;