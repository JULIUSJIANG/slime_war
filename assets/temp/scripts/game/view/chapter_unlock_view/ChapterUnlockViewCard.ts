import BCType from "../../../frame/basic/BCType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import CfgChapter from "../../../frame/config/src/CfgChapter";
import CfgScene from "../../../frame/config/src/CfgScene";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import ChapterUnlockViewState from "./ChapterUnlockViewState";

const {ccclass, property} = cc._decorator;

const APP = `ChapterUnlockViewCard`;

/**
 * 章节解锁界面 - 卡片
 */
@ccclass
export default class ChapterUnlockViewCard extends UIViewComponent {
    /**
     * 资源路径到节点类型的映射
     */
    private static _mapPathToNodeType: Map <string, UINodeType<ChapterUnlockViewCard, ChapterUnlockViewState, number>> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);

    /**
     * 通过配表 id 获取卡片的资源节点类型
     * @param id 
     * @returns 
     */
    static GetNodeTypeByChapterIdCfg (id: number) {
        let cfg = jiang.mgrCfg.cfgScene.select (CfgScene.idGetter, id)._list [0];
        if (!ChapterUnlockViewCard._mapPathToNodeType.has (cfg.card)) {
            ChapterUnlockViewCard._mapPathToNodeType.set (
                cfg.card,
                UINodeType.Pop <ChapterUnlockViewCard, ChapterUnlockViewState, number> (
                    APP,
                    {
                        prefabPath: cfg.card,
                        componentGetter: node => node.getComponent (ChapterUnlockViewCard),
                        listModuleStyle: [],
                        childrenCreator: [],
                        propsType: BCType.typeNumber,
                        hideRS: UINodeInstHideRS.setParentNull,
                        enterRS: UINodeInstEnterRS.none
                    }
                )
            )
        };
        return ChapterUnlockViewCard._mapPathToNodeType.get (cfg.card);
    }
}