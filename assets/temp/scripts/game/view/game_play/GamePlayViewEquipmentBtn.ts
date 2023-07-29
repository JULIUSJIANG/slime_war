import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import gameCommon from "../../GameCommon";
import MBPlayer from "../../game_element/body/logic_3031/MBPlayer";
import EquipmentViewEquip from "../equipment_view/EquipmentViewEquip";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import GamePlayViewState from "./GamePlayViewState";
import GuideMgr from "../guide_view/GuideMgr";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import MgrSdk from "../../../frame/sdk/MgrSdk";

const {ccclass, property} = cc._decorator;

const APP = `GamePlayViewEquipmentBtn`;

/**
 * 战斗界面的武器按钮
 */
@ccclass
export default class GamePlayViewEquipmentBtn extends UIViewComponent {
    /**
     * 节点 - 已选择
     */
    @property (cc.Node)
    nodeSelected: cc.Node = null;

    /**
     * 按钮 - 选择
     */
    @property (ComponentNodeEventer)
    btnSelect: ComponentNodeEventer = null;

    /**
     * 容器 - 装备
     */
    @property (cc.Node)
    containerEquip: cc.Node = null;

    /**
     * 节点 - 数字
     */
    @property (cc.Node)
    nodeNum: cc.Node = null;

    /**
     * 文本 - 索引
     */
    @property (cc.Label)
    txtIdx: cc.Label = null;

    /**
     * 文本 - 等级
     */
    @property (cc.Label)
    txtLv: cc.Label = null;

    static nodeType = UINodeType.Pop<GamePlayViewEquipmentBtn, GamePlayViewState, number>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/game_play_view_container_equipment`,
            componentGetter: node => node.getComponent (GamePlayViewEquipmentBtn),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<GamePlayViewEquipmentBtn, GamePlayViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.PLAYING
                        ],
                        propsFilter: (com, state, props) => {
                            let npcEle = state.playMachine.gameState.player;
                            let mbPlayer = npcEle.commonBehaviour as MBPlayer;
                            com.nodeSelected.active = 1 < mbPlayer.playerMgrEquipment.listEquipmentInst.length && props == mbPlayer.playerMgrEquipment.currEquipIdx;
                            com.btnSelect.evterTouchStart.On(() => {
                                GuideMgr.inst.currStatus.P1U5OnBtnEquipmentTouched ();
                                VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
                                mbPlayer.playerMgrEquipment.SetEquipmentIdx (props);
                            });
                            let equipInst = mbPlayer.playerMgrEquipment.listEquipmentInst [props];
                            // com.nodeMask.y = com.nodeMask.height * equipInst.OnCD ();
                            GuideMgr.inst.CatchGamePlayViewEquipmentBtn (com);
                            com.nodeNum.active = MgrSdk.inst.IsPc ();
                            com.txtIdx.string = `${props + 1}`;
                            com.txtLv.string = `${equipInst.lev}级`;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop <GamePlayViewEquipmentBtn, GamePlayViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerEquip;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let npcEle = state.playMachine.gameState.player;
                            let mbPlayer = npcEle.commonBehaviour as MBPlayer;
                            let equipInst = mbPlayer.playerMgrEquipment.listEquipmentInst[props];
                            listNode.push(
                                EquipmentViewEquip.GetNodeTypeForIconPlayView(
                                    equipInst.cfgProps.id
                                )
                                    .CreateNode(
                                        state,
                                        props,
                                        props
                                    )
                            );
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    );
}