import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import CfgScene from "../../../frame/config/src/CfgScene";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import CfgCacheScene from "../../cfg_cache/CfgCacheScene";
import ChapterUnlockViewCard from "./ChapterUnlockViewCard";
import ChapterUnlockViewState from "./ChapterUnlockViewState";

const {ccclass, property} = cc._decorator;

const APP = `ChapterUnlockView`;

/**
 * 章节解锁界面
 */
@ccclass
export default class ChapterUnlockView extends UIViewComponent {
    /**
     * 文本 - 大标题
     */
    @property (cc.Label)
    txtTitle: cc.Label = null;

    /**
     * 容器 - 卡片
     */
    @property (cc.Node)
    containerCard: cc.Node = null;

    /**
     * 集合 - 亮的节点
     */
    @property ([cc.Node])
    listNodeLight: Array <cc.Node> = [];
    /**
     * 集合 - 暗的节点
     */
    @property ([cc.Node])
    listNodeDark: Array <cc.Node> = [];

    static nodeType = UINodeType.Pop<ChapterUnlockView, ChapterUnlockViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/chapter_unlock_view`,
            componentGetter: node => node.getComponent (ChapterUnlockView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<ChapterUnlockView, ChapterUnlockViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.CHAPTER_UNLOCK
                        ],
                        propsFilter: (com, state, props) => {
                            let cfgScene = jiang.mgrCfg.cfgScene.select (CfgScene.idGetter, state.idCfgScene)._list [0];
                            com.txtTitle.string = `已到达${cfgScene.name}！`;
                            let cfgCache = CfgCacheScene.GetCache (cfgScene);
                            for (let i = 0; i < com.listNodeLight.length; i++) {
                                let node = com.listNodeLight [i];
                                node.color = cfgCache.colorLight;
                            };
                            for (let i = 0; i < com.listNodeDark.length; i++) {
                                let node = com.listNodeDark [i];
                                node.color = cfgCache.colorDark;
                            };
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<ChapterUnlockView, ChapterUnlockViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerCard;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            listNode.push (ChapterUnlockViewCard.GetNodeTypeByChapterIdCfg (state.idCfgScene).CreateNode (
                                state,
                                state.idCfgScene,
                                state.idCfgScene
                            ));
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.scaleInForTemp200
        }
    )
}