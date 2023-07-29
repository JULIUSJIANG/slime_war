import CfgEquipmentProps from "../../frame/config/src/CfgEquipmentProps";
import CfgGameElement from "../../frame/config/src/CfgGameElement";

interface CfgCacheEquipment {
    /**
     * 不同策略，要求缓存的数据
     */
    args: any;

    /**
     * 附加物体
     */
    aditionalBody: Array <number>;
    /**
     * 附加特效
     */
    aditionalEff: Array <number>;
    /**
     * 附加音效
     */
    aditionalVoice: Array <number>;
}

namespace CfgCacheEquipment {
    /**
     * 存取缓存数据的键
     */
    export const SYM_REC = Symbol (`CfgCacheEquipment`);

    /**
     * 设置缓存
     * @param cfg 
     * @param cache 
     */
    export function SetCache (cfg: CfgEquipmentProps, cache: CfgCacheEquipment) {
        cfg [SYM_REC] = cache;
    }

    /**
     * 读取缓存
     * @param cfg 
     */
    export function GetCache (cfg: CfgEquipmentProps) {
        if (cfg == null) {
            return null;
        };
        return cfg [SYM_REC] as CfgCacheEquipment;
    }
}

export default CfgCacheEquipment;