import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import CfgLevel from "../../../frame/config/src/CfgLevel";
import CfgChapter from "../../../frame/config/src/CfgChapter";
import jiang from "../../../frame/global/Jiang";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import EquipmentPreviewView from "../equipment_preview_view/EquipmentPreviewView";
import EquipmentPreviewViewState from "../equipment_preview_view/EquipmentPreviewViewState";
import EquipmentViewEquip from "../equipment_view/EquipmentViewEquip";
import IndexViewState from "../index_view/IndexViewState";
import TipsViewState from "../tips_view/TipsViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";

const APP = `ChallengeSelectViewChapterUnlock`;

const {ccclass, property} = cc._decorator;

/**
 * 挑战界面的章节 - 解锁内容
 */
@ccclass
export default class ChallengeSelectViewChapterUnlock extends UIViewComponent {
    
    /**
     * 容器 - 武器
     */
    @property (cc.Node)
    containerEquip: cc.Node = null;

    /**
     * 详情按钮
     */
    @property (ComponentNodeEventer)
    evterDetail: ComponentNodeEventer = null;

    static nodeType = UINodeType.Pop<ChallengeSelectViewChapterUnlock, IndexViewState, Array<number>> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/challenge_select_view_chapter_unlock`,
            componentGetter: node => node.getComponent (ChallengeSelectViewChapterUnlock),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <ChallengeSelectViewChapterUnlock, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_CHALLENGE
                        ],
                        propsFilter: (com, state, props) => {
                            com.node.x = 0;
                            com.node.y = 0;
                            let idChapter = props [0];
                            let idx = props [1];
                            let cfgChapter = jiang.mgrCfg.cfgChapter.select (CfgChapter.idGetter, idChapter)._list [0];
                            let cfgChapterUnlock = cfgChapter.list_equip_unlock [idx];
                            let isUnlocked = idChapter <= state.stateChallenge.challengeChapter;
                            com.evterDetail.evterTouchStart.On(() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.evterDetail.evterTouchEnd.On (() => {
                                if (!isUnlocked) {
                                    TipsViewState.inst.Tip(`完成上一章节以解锁`);
                                    return;
                                };
                                jiang.mgrUI.Open(
                                    EquipmentPreviewView.nodeType,
                                    EquipmentPreviewViewState.Pop(
                                        APP,
                                        cfgChapterUnlock,
                                        0
                                    )
                                );
                            });
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop <ChallengeSelectViewChapterUnlock, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerEquip;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let idChapter = props [0];
                            let idx = props [1];
                            let cfgChapter = jiang.mgrCfg.cfgChapter.select (CfgChapter.idGetter, idChapter)._list [0];
                            let cfgChapterUnlock = cfgChapter.list_equip_unlock [idx];
                            listNode.push (
                                EquipmentViewEquip.GetNodeTypeForIconUI (cfgChapterUnlock).CreateNode (
                                    state,
                                    null,
                                    idx
                                )
                            );
                        }
                    }
                )
            ],
            propsType: BCType.typeArray,
            hideRS: UINodeInstHideRS.localScale0,
            enterRS: UINodeInstEnterRS.opacityInForPrefab200
        },
    );
}