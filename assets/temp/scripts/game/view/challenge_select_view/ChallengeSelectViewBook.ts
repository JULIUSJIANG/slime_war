import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import BCType from "../../../frame/basic/BCType";
import CfgGameElement from "../../../frame/config/src/CfgGameElement";
import jiang from "../../../frame/global/Jiang";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import gameMath from "../../GameMath";
import BookViewMonster from "../book_view/BookViewMonster";
import IndexViewState from "../index_view/IndexViewState";
import CfgScene from "../../../frame/config/src/CfgScene";
import CfgCacheScene from "../../cfg_cache/CfgCacheScene";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `ChallengeSelectViewBook`;

/**
 * 挑战界面 - 图鉴
 */
@ccclass
export default class ChallengeSelectViewBook extends UIViewComponent {
    /**
     * 容器 - 怪物
     */
    @property (cc.Node)
    containerMonster: cc.Node = null;

    /**
     * 文本 - 名字
     */
    @property (cc.Label)
    txtName: cc.Label = null;

    /**
     * 文本 - 生命
     */
    @property (cc.Label)
    txtMsg: cc.Label = null;

    /**
     * 文本 - 描述
     * @param cc 
     * @param RichText 
     */
    @property (cc.Label)
    txtInfo: cc.Label = null;

    /**
     * 节点 - 亮着色
     */
    @property (cc.Node)
    nodeLight: cc.Node = null;

    /**
     * 节点 - 暗着色
     */
    @property (cc.Node)
    nodeDark: cc.Node = null;

    static nodeType = UINodeType.Pop <ChallengeSelectViewBook, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/challenge_select_view_book`,
            componentGetter: node => node.getComponent (ChallengeSelectViewBook),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<ChallengeSelectViewBook, IndexViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_CHALLENGE
                        ],
                        propsFilter: (com, state, props) => {
                            let cfgScene = jiang.mgrCfg.cfgScene.select (CfgScene.idGetter, jiang.mgrData.Get(indexDataStorageItem.selectedChapter))._list [0];
                            let cache = CfgCacheScene.GetCache (cfgScene);
                            com.nodeDark.color = cache.colorDark;
                            state.stateChallenge.bookLayout.SetElePos (com.node, props);
                            let monsterCfg = jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, props)._list [0];
                            com.txtName.string = monsterCfg.name;
                            com.txtMsg.string = `等级: ${gameMath.ParsePowerToLev (monsterCfg.power)}`;
                            com.txtInfo.string = monsterCfg.txt_info;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<ChallengeSelectViewBook, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (com) => {
                            return com.containerMonster;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let monsterCfg = jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, props)._list [0];
                            listNode.push (BookViewMonster.GetNodeTypeByRes(monsterCfg.res_ui).CreateNode(
                                state,
                                null,
                                null
                            ));
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.localScale0,
            enterRS: UINodeInstEnterRS.opacityInForPrefab200
        }
    )
}