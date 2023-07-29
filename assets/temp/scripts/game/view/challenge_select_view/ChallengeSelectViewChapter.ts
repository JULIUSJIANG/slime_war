import BCType from "../../../frame/basic/BCType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import CfgLevel from "../../../frame/config/src/CfgLevel";
import CfgChapter from "../../../frame/config/src/CfgChapter";
import jiang from "../../../frame/global/Jiang";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import gameCommon from "../../GameCommon";
import IndexViewState from "../index_view/IndexViewState";
import TipsViewState from "../tips_view/TipsViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import ChallengeSelectViewChapterUnlock from "./ChallengeSelectViewChapterUnlock";
import CfgScene from "../../../frame/config/src/CfgScene";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";

const APP = `ChallengeSelectViewChapter`;

const {ccclass, property} = cc._decorator;

/**
 * 挑战界面的章节
 */
@ccclass
export default class ChallengeSelectViewChapter extends UIViewComponent {
    /**
     * 文本 - 标题
     */
    @property([cc.Label])
    listTxtInfo: cc.Label[] = [];

    /**
     * 按钮 - 选择
     */
    @property(ComponentNodeEventer)
    btnSelect: ComponentNodeEventer = null;

    /**
     * 节点 - 已选择
     */
    @property(cc.Node)
    nodeSelected: cc.Node = null;

    /**
     * 集合 - 解锁
     */
    @property (cc.Node)
    containerUnlock: cc.Node = null;

    /**
     * 节点 - 遮罩 - 背景
     */
    @property (cc.Node)
    nodeMaskBg: cc.Node = null;

    /**
     * 节点 - 遮罩 - 前景
     */
    @property (cc.Node)
    nodeMaskPrevious: cc.Node = null;

    static nodeType = UINodeType.Pop<ChallengeSelectViewChapter, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/challenge_select_view_chapter`,
            componentGetter: node => node.getComponent(ChallengeSelectViewChapter),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<ChallengeSelectViewChapter, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_CHALLENGE
                        ],
                        propsFilter: (com, state, props) => {
                            let cfgChapter = jiang.mgrCfg.cfgChapter.select (CfgChapter.idGetter, props)._list [0];
                            let cfgTheme = jiang.mgrCfg.cfgScene.select (CfgScene.idGetter, props)._list [0];
                            state.stateChallenge.chapterLayout.SetElePos(com.node, props);
                            let isUnlocked = props <= state.stateChallenge.challengeChapter;
                            let txt: string;
                            if (isUnlocked) {
                                txt = `${cfgTheme.name}`;
                            }
                            else {
                                txt = `章节 ${props} 解锁:`;
                            };
                            for (let i = 0; i < com.listTxtInfo.length; i++) {
                                let info = com.listTxtInfo[i];
                                info.string = txt;
                            };
                            com.nodeSelected.scale = jiang.mgrData.Get(indexDataStorageItem.selectedChapter) == props ? 1 : 0;
                            com.btnSelect.evterTouchStart.On(() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnSelect.evterTouchEnd.On(() => {
                                if (isUnlocked) {
                                    if (jiang.mgrData.Get(indexDataStorageItem.selectedChapter) == props) {
                                        return;
                                    };
                                    VoiceOggViewState.inst.BgmSet (cfgTheme.bgm);
                                    // 打开战斗
                                    state.stateChallenge.SelectChapter(props);
                                }
                                else {
                                    TipsViewState.inst.Tip(`完成上一章节以解锁`);
                                };
                            });
                            com.nodeMaskBg.scale = isUnlocked ? 1 : 0;
                            com.nodeMaskPrevious.scale = isUnlocked ? 0 : 1;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<ChallengeSelectViewChapter, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerUnlock;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let cfgChapter = jiang.mgrCfg.cfgChapter.select (CfgChapter.idGetter, props)._list [0];
                            for (let i = 0; i < cfgChapter.list_equip_unlock.length; i++) {
                                let unlockItemProps = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                                unlockItemProps.push (props, i);
                                listNode.push (ChallengeSelectViewChapterUnlock.nodeType.CreateNode (
                                    state,
                                    unlockItemProps,
                                    i
                                ));
                            };
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.localScale0,
            enterRS: UINodeInstEnterRS.opacityInForPrefab200
        }
    );

    static nodeTypeForNoUnlock = UINodeType.Pop<ChallengeSelectViewChapter, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/challenge_select_view_chapter_plus`,
            componentGetter: node => node.getComponent(ChallengeSelectViewChapter),
            listModuleStyle: [
                ...ChallengeSelectViewChapter.nodeType._listModuleStyle
            ],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.localScale0,
            enterRS: UINodeInstEnterRS.opacityInForPrefab200
        }
    );
}