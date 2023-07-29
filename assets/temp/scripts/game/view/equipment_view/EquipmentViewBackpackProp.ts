import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import CfgBackpackProp from "../../../frame/config/src/CfgBackpackProp";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import ViewState from "../../../frame/ui/ViewState";

const {ccclass, property} = cc._decorator;

const APP = `EquipmentViewBackpackProp`;

/**
 * 背包界面的普通物品
 */
@ccclass
class EquipmentViewBackpackProp extends UIViewComponent {
    /**
     * 颜色 - 光亮
     */
    @property (cc.Node)
    nodeLight: cc.Node = null;

    /**
     * 标准颜色
     */
    static _colorLight = new cc.Color (255, 230, 0, 255);

    /**
     * 节点类型的实例缓存
     */
    private static _mapResToNodeType: Map<string, UINodeType<EquipmentViewBackpackProp, ViewState, number>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 获取 ui 专用的节点类型
     * @param idCfg 
     * @returns 
     */
    static GetNodeTypeForUI (idCfg: number) {
        let cfg = jiang.mgrCfg.cfgBackpackProp.select (CfgBackpackProp.idGetter, idCfg)._list [0];
        return EquipmentViewBackpackProp.GetNodeTypeRes (cfg.res_ui);
    }

    /**
     * 获取场景专用的节点类型
     * @param idCfg 
     * @returns 
     */
    static GetNodeTypeForScene (idCfg: number) {
        let cfg = jiang.mgrCfg.cfgBackpackProp.select (CfgBackpackProp.idGetter, idCfg)._list [0];
        return EquipmentViewBackpackProp.GetNodeTypeRes (cfg.res_scene);
    }

    /**
     * 通过资源路径获取节点类型
     * @param res 
     * @returns 
     */
    private static GetNodeTypeRes (res: string) {
        if (!EquipmentViewBackpackProp._mapResToNodeType.has (res)) {
            EquipmentViewBackpackProp._mapResToNodeType.set (
                res,
                UINodeType.Pop<EquipmentViewBackpackProp, ViewState, number>(
                    APP,
                    {
                        prefabPath: res,
                        componentGetter: node => node.getComponent(EquipmentViewBackpackProp),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<EquipmentViewBackpackProp, ViewState, number>(
                                APP,
                                {
                                    listRefModule: [
                                        IndexDataModule.DEFAULT
                                    ],
                                    propsFilter: (com, state, props) => {
                                        com.node.x = 0;
                                        com.node.y = 0;
                                        com.nodeLight.color = this._colorLight;
                                    }
                                }
                            )
                        ],
                        childrenCreator: [],
                        propsType: BCType.typeNumber,
                        hideRS: UINodeInstHideRS.localScale0,
                        enterRS: UINodeInstEnterRS.scaleInForPrefab200
                    }
                )
            );
        };
        return EquipmentViewBackpackProp._mapResToNodeType.get (res);
    }
}

namespace EquipmentViewBackpackProp {
    /**
     * 背包界面 - 物品 - 参数
     */
    export class Args {
        private constructor () {}

        private static _t = new UtilObjPoolType<Args> ({
            instantiate: () => {
                return new Args ();
            },
            onPop: (t) => {

            },
            onPush: (t) => {

            },
            tag: APP
        });

        static Pop (apply: string, grey: boolean) {
            let val = UtilObjPool.Pop (Args._t, apply);
            val.grey = grey;
            return val;
        }

        /**
         * 置为灰色
         */
        public grey: boolean;
    }

    /**
     * 参数类型
     */
    export const bcType = BCType.Pop<Args> (
        APP,
        (a, b) => {
            return a.grey == b.grey;
        },
        (inst) => {
            UtilObjPool.Push (inst);
        },
        (inst) => {
            let clone = Args.Pop (APP, inst.grey);
            return clone;
        }
    )
}

export default EquipmentViewBackpackProp;