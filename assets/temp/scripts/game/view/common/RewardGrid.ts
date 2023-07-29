import utilMath from "../../../frame/basic/UtilMath";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import jiang from "../../../frame/global/Jiang";
import MgrSdk from "../../../frame/sdk/MgrSdk";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import ViewState from "../../../frame/ui/ViewState";
import IndexDataModule from "../../../IndexDataModule";
import gameCommon from "../../GameCommon";
import BackpackPropPreviewView from "../backpack_prop_preview_view/BackpackPropPreviewView";
import BackpackPropPreviewViewState from "../backpack_prop_preview_view/BackpackPropPreviewViewState";
import EquipmentPreviewView from "../equipment_preview_view/EquipmentPreviewView";
import EquipmentPreviewViewState from "../equipment_preview_view/EquipmentPreviewViewState";
import EquipmentViewBackpackProp from "../equipment_view/EquipmentViewBackpackProp";
import EquipmentViewEquip from "../equipment_view/EquipmentViewEquip";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import RewardGridArgs from "./RewardGridArgs";


const {ccclass, property} = cc._decorator;

const APP = `RewardGrid`;

/**
 * 选项界面的空格子
 */
@ccclass
class RewardGrid extends UIViewComponent {

    /**
     * 容器 - 武器
     */
    @property (cc.Node)
    containerEquipment: cc.Node = null;

    /**
     * 按钮 - 查看详情
     */
    @property (ComponentNodeEventer)
    btnInfo: ComponentNodeEventer = null;

    /**
     * 文本 - 数量
     */
    @property (cc.Label)
    txtCount: cc.Label = null;

    /**
     * 节点 - 数量
     */
    @property (cc.Node)
    nodeCount: cc.Node = null;

    /**
     * 可点开 ui 详情界面的节点类型
     */
    static nodeTypeForEquipment = UINodeType.Pop<RewardGrid, ViewState, RewardGridArgs>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/item_equipment_reward`,
            componentGetter: node => node.getComponent(RewardGrid),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<RewardGrid, ViewState, RewardGridArgs>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.PLAYING
                        ],
                        propsFilter: (com, state, props) => {
                            let idCfg = props.props [0];
                            let count = props.props [1];
                            // 点击打开详情
                            com.btnInfo.evterTouchStart.On(() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnInfo.evterTouchEnd.On(() => {
                                jiang.mgrUI.Open(
                                    EquipmentPreviewView.nodeType,
                                    EquipmentPreviewViewState.Pop(
                                        APP,
                                        idCfg,
                                        count
                                    )
                                );
                            });
                            com.txtCount.string = `${utilMath.ParseNumToKMBTAABB (count, Math.floor)}`;
                            com.nodeCount.active = count != 1;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<RewardGrid, ViewState, RewardGridArgs> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerEquipment;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let idCfg = props.props [0];
                            let count = props.props [1];
                            listNode.push(
                                EquipmentViewEquip.GetNodeTypeForIconUI (
                                    idCfg
                                )
                                    .CreateNode (
                                        state,
                                        idCfg,
                                        idCfg
                                    )
                            );
                        }
                    }
                )
            ],
            propsType: RewardGridArgs.bcType,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.opacityInForIdx16A200
        }
    );

    /**
     * 可点开 ui 详情界面的节点类型
     */
    static nodeTypeForBackpackProp = UINodeType.Pop<RewardGrid, ViewState, RewardGridArgs>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/item_backpack_prop_reward`,
            componentGetter: node => node.getComponent(RewardGrid),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<RewardGrid, ViewState, RewardGridArgs>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.PLAYING
                        ],
                        propsFilter: (com, state, props) => {
                            let idCfg = props.props [0];
                            let count = props.props [1];
                            // 点击打开详情
                            com.btnInfo.evterTouchStart.On(() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnInfo.evterTouchEnd.On(() => {
                                jiang.mgrUI.Open(
                                    BackpackPropPreviewView.nodeType,
                                    BackpackPropPreviewViewState.Pop(
                                        APP,
                                        idCfg,
                                        count
                                    )
                                );
                            });
                            com.txtCount.string = `${utilMath.ParseNumToKMBTAABB (count, Math.floor)}`;
                            com.nodeCount.active = count != 1;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<RewardGrid, ViewState, RewardGridArgs> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerEquipment;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            if (props == null) {
                                return;
                            };
                            let idCfg = props.props [0];
                            let count = props.props [1];
                            listNode.push(
                                EquipmentViewBackpackProp.GetNodeTypeForUI (
                                    idCfg
                                )
                                    .CreateNode (
                                        state,
                                        null,
                                        idCfg
                                    )
                            );
                        }
                    }
                )
            ],
            propsType: RewardGridArgs.bcType,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.opacityInForIdx16A200
        }
    );
}

export default RewardGrid;