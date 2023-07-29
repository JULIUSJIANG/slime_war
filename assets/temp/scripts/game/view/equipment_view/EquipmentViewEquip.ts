import BCType from "../../../frame/basic/BCType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import CfgEquipmentProps from "../../../frame/config/src/CfgEquipmentProps";
import jiang from "../../../frame/global/Jiang";
import MgrSdk from "../../../frame/sdk/MgrSdk";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import ViewState from "../../../frame/ui/ViewState";
import IndexDataModule from "../../../IndexDataModule";


const {ccclass, property} = cc._decorator;

const APP = `GameOptionsViewReward`;

/**
 * 选项界面的奖励
 */
@ccclass
export default class EquipmentViewEquip extends UIViewComponent {
    /**
     * 节点 - 光亮
     */
    @property (cc.Node)
    nodeLight: cc.Node = null;

    /**
     * 标准的光照颜色
     */
    private static _colorLight = new cc.Color (255, 230, 0, 255);

    /**
     * 灰黑色
     */
    private static _colorGrey = new cc.Color (200, 200, 200, 255);

    /**
     * 获取 ui 专用 icon
     * @param idCfg 
     * @returns 
     */
    static GetNodeTypeForIconUI (idCfg: number) {
        let cfg = jiang.mgrCfg.cfgEquipmentProps.select(CfgEquipmentProps.idGetter, idCfg)._list[0];
        return EquipmentViewEquip.GetNodeTypeByRes (cfg.icon_ui);
    }

    /**
     * 获取场景专用 icon
     * @param idCfg 
     * @returns 
     */
    static GetNodeTypeForIconScene (idCfg: number) {
        let cfg = jiang.mgrCfg.cfgEquipmentProps.select(CfgEquipmentProps.idGetter, idCfg)._list[0];
        return EquipmentViewEquip.GetNodeTypeByRes (cfg.icon_scene);
    }

    /**
     * 获取场景专用 icon
     * @param idCfg 
     * @returns 
     */
    static GetNodeTypeForIconPlayView (idCfg: number) {
        let cfg = jiang.mgrCfg.cfgEquipmentProps.select(CfgEquipmentProps.idGetter, idCfg)._list[0];
        return EquipmentViewEquip.GetNodeTypeByResForToggle (cfg.icon_play_view);
    }

    /**
     * 节点类型的实例缓存
     */
    private static _map0: Map<string, UINodeType<EquipmentViewEquip, ViewState, number>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);
    /**
     * 通过资源路径获取 ui 节点
     * @param res 
     * @returns 
     */
    static GetNodeTypeByRes (res: string) {
        if (!EquipmentViewEquip._map0.has (res)) {
            EquipmentViewEquip._map0.set (
                res, 
                UINodeType.Pop<EquipmentViewEquip, ViewState, number>(
                    APP,
                    {
                        prefabPath: res,
                        componentGetter: node => node.getComponent(EquipmentViewEquip),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<EquipmentViewEquip, ViewState, number>(
                                APP,
                                {
                                    listRefModule: [
                                        IndexDataModule.DEFAULT
                                    ],
                                    propsFilter: (com, state, props) => {
                                        com.node.x = 0;
                                        com.node.y = 0;
                                        if (com.nodeLight != null) {
                                            switch (props) {
                                                // 置为灰色
                                                case 1: {
                                                    com.nodeLight.active = true;
                                                    com.nodeLight.color = EquipmentViewEquip._colorGrey;
                                                    break;
                                                };
                                                // 隐藏
                                                case 2: {
                                                    com.nodeLight.active = false;
                                                    break;
                                                };
                                                // 光亮
                                                default: {
                                                    com.nodeLight.active = true;
                                                    com.nodeLight.color = EquipmentViewEquip._colorLight;
                                                };
                                            }
                                        }
                                        else {
                                            MgrSdk.inst.Log (`com.node.name[${com.node.name}]异常`);
                                        };
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
        return EquipmentViewEquip._map0.get (res);
    }

    /**
     * 节点类型的实例缓存
     */
    private static _map1: Map<string, UINodeType<UIViewComponent, ViewState, number>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);
    /**
     * 通过资源路径获取 ui 节点
     * @param res 
     * @returns 
     */
    static GetNodeTypeByResForToggle (res: string) {
        if (!EquipmentViewEquip._map1.has (res)) {
            EquipmentViewEquip._map1.set (
                res, 
                UINodeType.Pop<UIViewComponent, ViewState, number>(
                    APP,
                    {
                        prefabPath: res,
                        componentGetter: node => node.getComponent(UIViewComponent),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<UIViewComponent, ViewState, number>(
                                APP,
                                {
                                    listRefModule: [
                                        IndexDataModule.DEFAULT
                                    ],
                                    propsFilter: (com, state, props) => {
                                        com.node.x = 0;
                                        com.node.y = 0;
                                    }
                                }
                            )
                        ],
                        childrenCreator: [],
                        propsType: BCType.typeNumber,
                        hideRS: UINodeInstHideRS.localScale0,
                        enterRS: UINodeInstEnterRS.none
                    }
                )
            );
        };
        return EquipmentViewEquip._map1.get (res);
    }
}