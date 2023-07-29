import BCType from "../../../frame/basic/BCType";
import CfgChapter from "../../../frame/config/src/CfgChapter";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import ViewState from "../../../frame/ui/ViewState";
import IndexDataModule from "../../../IndexDataModule";


const {ccclass, property} = cc._decorator;

const APP = `ChallengeSelectViewBgLeft`;

/**
 * 选择界面主题左
 */
@ccclass
export default class ChallengeSelectViewBgLeft extends UIViewComponent {

    private static _mapResToNodeType: Map <string, UINodeType <ChallengeSelectViewBgLeft, ViewState, number>> = new Map();

    static GetNodeTypeByRes (res: string) {
        if (!this._mapResToNodeType.has (res)) {
            this._mapResToNodeType.set (
                res,
                UINodeType.Pop <ChallengeSelectViewBgLeft, ViewState, number> (
                    APP,
                    {
                        prefabPath: res,
                        componentGetter: node => node.getComponent (ChallengeSelectViewBgLeft),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop <ChallengeSelectViewBgLeft, ViewState, number> (
                                APP,
                                {
                                    listRefModule: [
                                        IndexDataModule.DEFAULT,
                                        IndexDataModule.INDEXVIEW_CHALLENGE
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
                        hideRS: UINodeInstHideRS.setParentNull,
                        enterRS: UINodeInstEnterRS.opacityInForPrefab200
                    }
                )
            );
        };
        return this._mapResToNodeType.get (res);
    }

    /**
     * 通过配表 id 获取节点类型
     * @param idCfg 
     * @returns 
     */
    static GetNodeTypeByIdCfg (idCfg: number) {
        let cfg = jiang.mgrCfg.cfgChapter.select (CfgChapter.idGetter, idCfg)._list [0];
        return this.GetNodeTypeByRes (cfg.bg_left);
    }
}