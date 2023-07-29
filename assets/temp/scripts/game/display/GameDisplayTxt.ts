import BCType from "../../frame/basic/BCType";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import GameElementTxt from "../game_element/common/GameElementTxt";
import gameCommon from "../GameCommon";
import GamePlayViewState from "../view/game_play/GamePlayViewState";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayTxt`;

/**
 * 特效
 */
 @ccclass
export default class GameDisplayTxt extends UIViewComponent {
    /**
     * 文本标签
     */
    @property(cc.Label)
    lab: cc.Label = null;

    private static _map: Map<string, UINodeType<GameDisplayTxt, GamePlayViewState, number>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    private static GetNodeTypeByPath (res: string) {
        if (!this._map.has(res)) {
            this._map.set(
                res,
                UINodeType.Pop<GameDisplayTxt, GamePlayViewState, number>(
                    APP,
                    {
                        prefabPath: res,
                        componentGetter: node => node.getComponent(GameDisplayTxt),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<GameDisplayTxt, GamePlayViewState, number>(
                                APP,
                                {
                                    listRefModule: [
                                        IndexDataModule.DEFAULT,
                                        IndexDataModule.PLAYING
                                    ],
                                    propsFilter: (com, state, props) => {
                                        let eleTxt = state.playMachine.gameState.GetEleById<GameElementTxt>(props);
                                        com.node.x = eleTxt.posCurrent.x;
                                        com.node.y = eleTxt.posCurrent.y;
                                    
                                        if (com.lab.string != eleTxt.txt) {
                                            com.lab.string = eleTxt.txt;
                                        };
                                    }
                                }
                            )
                        ],
                        childrenCreator: [],
                        propsType: BCType.typeNumber,
                        hideRS: UINodeInstHideRS.setParentNull,
                        enterRS: UINodeInstEnterRS.none
                    }
                )
            )
        };
        return this._map.get(res);
    }

    /**
     * 普通伤害
     */
    static nodeTypeDmg = GameDisplayTxt.GetNodeTypeByPath (`${gameCommon.SUB_MAIN}/prefab_ui/txt_dmg_ordinary`);
    /**
     * 除去伪装
     */
    static nodeTypeAppear = GameDisplayTxt.GetNodeTypeByPath (`${gameCommon.SUB_MAIN}/prefab_ui/txt_tips`);
    /**
     * 治疗
     */
    static nodeTypeRecovery = GameDisplayTxt.GetNodeTypeByPath (`${gameCommon.SUB_MAIN}/prefab_ui/txt_recovery`);
}