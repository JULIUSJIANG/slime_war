
const APP = `UINodePrefabRecord`;

interface UINodePrefabRecord {
    /**
     * 已显示的时间
     */
    msDisplayed: number;
}

namespace UINodePrefabRecord {
    /**
     * 存取缓存数据的键
     */
    const SYM = Symbol (APP);

    export function GetCache (prefab: cc.Prefab): UINodePrefabRecord {
        if (prefab == null) {
            return null;
        };
        if (prefab [SYM] == null) {
            prefab [SYM] = {
                msDisplayed: 0
            };
        };
        return prefab [SYM];
    }
}

export default UINodePrefabRecord;