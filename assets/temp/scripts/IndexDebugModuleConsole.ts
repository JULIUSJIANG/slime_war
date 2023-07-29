import UtilObjPool from "./frame/basic/UtilObjPool";
import UtilObjPoolType from "./frame/basic/UtilObjPoolType";
import DebugViewDefine from "./frame/debug/DebugViewDefine";
import jiang from "./frame/global/Jiang";
import UIRoot from "./frame/ui/UIRoot";
import VoiceOggViewState from "./game/view/voice_ogg/VoiceOggViewState";

const APP = `indexCommon`;

interface AppRec {
    app: string;
    type: string;
    num: number;
};
let listAppRec: Array<AppRec> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

interface CountRec {
    type: string;
    num: number;
}
let listCountRec: Array<CountRec> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

namespace indexDebugModuleConsole {
    export const tree = DebugViewDefine.MsgGroup.Pop(
        APP,
        `ui 节点树`,
        () => {
            return UIRoot.GetTreeTxt(UIRoot.inst.viewListCurrent);
        }
    );
    export const prefabInstantiateCount = DebugViewDefine.MsgGroup.Pop(
        APP,
        `资源实例化`,
        () => {
            listCountRec.length = 0;
            UIRoot.inst._map.forEach((collection, prefabPath) => {
                listCountRec.push({
                    type: prefabPath,
                    num: collection.length
                });
            });
            listCountRec.sort((a, b) => {
                return - (a.num - b.num);
            });
            return JSON.stringify(listCountRec, null, 4);
        }
    );
    export const poolCount = DebugViewDefine.MsgGroup.Pop(
        APP,
        `提取统计`,
        () => {
            listAppRec.length = 0;
            UtilObjPool.mapAppRefCount.forEach((map, app) => {
                map.forEach((num, type) => {
                    listAppRec.push({
                        app: app,
                        type: type.tag,
                        num: num
                    });
                });
            });
            listAppRec.sort((a, b) => {
                return - (a.num - b.num);
            });
            return JSON.stringify(listAppRec, null, 4);
        }
    );

    export const instantiatedCount = DebugViewDefine.MsgGroup.Pop(
        APP,
        `构造统计`,
        () => {
            listCountRec.length = 0;
            UtilObjPoolType.mapTagToPoolType.forEach((type, tag) => {
                listCountRec.push({
                    type: type.tag,
                    num: type.instantiatedCount
                });
            });
            listCountRec.sort((a, b) => {
                return - (a.num - b.num);
            });
            return JSON.stringify(listCountRec, null, 4);
        }
    );

    export let aMax = 0;

    export let bMax = 0;

    export const common = DebugViewDefine.MsgGroup.Pop(
        APP,
        `常规数据`,
        () => {
            return `aMax[${aMax}] bMax[${bMax}]`;
        }
    )
}

export default indexDebugModuleConsole;