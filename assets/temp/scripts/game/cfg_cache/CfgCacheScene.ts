import CfgScene from "../../frame/config/src/CfgScene";

const APP = `CfgCacheScene`;

/**
 * 配置缓存 - 场景
 */
interface CfgCacheScene {
    /**
     * 配表 id
     */
    idCfg: number;
    /**
     * 亮颜色
     */
    colorLight: cc.Color;
    /**
     * 暗颜色
     */
    colorDark: cc.Color;
}

namespace CfgCacheScene {
    /**
     * 存取缓存数据的键
     */
    const SYM = Symbol (`CfgCacheScene`);

    /**
     * 设置缓存
     * @param cfgScene 
     * @param cache 
     */
    export function SetCache (cfgScene: CfgScene, cache: CfgCacheScene) {
        cfgScene [SYM] = cache;
    }

    /**
     * 获取缓存
     * @param cfgScene 
     * @returns 
     */
    export function GetCache (cfgScene: CfgScene) {
        if (cfgScene == null) {
            return null;
        };
        return cfgScene [SYM];
    }
}

export default CfgCacheScene;