import CfgGameElement from "../../frame/config/src/CfgGameElement";
import GameCfgBodyCacheDrop from "../game_element/body/GameCfgBodyCacheDrop";

/**
 * 物体缓存
 */
interface CfgCacheGameElement {
    /**
     * 主颜色
     */
    colorMain: cc.Color;

    /**
     * 主不透明度
     */
    opacityMain: number;

    /**
     * 归属的章节
     */
    relChapter: number;

    /**
     * 逻辑参数
     */
    logicArgs: any;

    /**
     * 列表 - 掉落缓存
     */
    listDrop: Array<GameCfgBodyCacheDrop>;

    /**
     * 附加物体
     */
    listAditionBody: Array<number>;
    /**
     * 附加特效
     */
    listAditionEff: Array<number>;
    /**
     * 附加音效
     */
    listAditionVoice: Array<number>;
}

namespace CfgCacheGameElement {
    /**
     * 存取缓存数据的键
     */
    const SYM = Symbol (`CfgCacheGameElement`);

    /**
     * 设置缓存数据
     * @param cfgStore 
     */
    export function SetCache (cfgBody: CfgGameElement, cache: CfgCacheGameElement) {
        cfgBody [SYM] = cache;
    }

    /**
     * 提取缓存数据
     * @param cfgStore 
     */
    export function GetCache (cfgBody: CfgGameElement) {
        if (cfgBody == null) {
            return;
        };
        return cfgBody [SYM] as CfgCacheGameElement;
    }
}

export default CfgCacheGameElement;