import BCType from "../../frame/basic/BCType";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import CfgEff from "../../frame/config/src/CfgEff";
import jiang from "../../frame/global/Jiang";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import GameElementEff from "../game_element/common/GameElementEff";
import GamePlayViewState from "../view/game_play/GamePlayViewState";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayEff`;

const MAT_PROPERTY_ENABLED_TIME = `enabledTime`;

/**
 * 特效
 */
@ccclass
export default class GameDisplayEff extends UIViewComponent {

    /** 
     * 列表 - 需要时间的节点
    */
    @property ([cc.RenderComponent])
    listRenderEnabledTime: Array<cc.RenderComponent> = [];

    /**
     * 列表 - 需要着色的节点
     */
    @property ([cc.Node])
    listNodeTint: Array<cc.Node> = [];

    /**
     * 节点类型的缓存
     */
    static _nodeTypeCache: Map<number, UINodeType<GameDisplayEff, GamePlayViewState, number>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 获取节点类型
     * @param cfgId 
     * @returns 
     */
    static GetNodeType (cfgId: number) {
        if (!this._nodeTypeCache.get(cfgId)) {
            let cfg = jiang.mgrCfg.cfgEff.select(CfgEff.idGetter, cfgId)._list[0];
            this._nodeTypeCache.set(
                cfgId,
                UINodeType.Pop<GameDisplayEff, GamePlayViewState, number>(
                    APP,
                    {
                        prefabPath: cfg.res,
                        componentGetter: node => node.getComponent(GameDisplayEff),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<GameDisplayEff, GamePlayViewState, number>(
                                APP,
                                {
                                    listRefModule: [
                                        IndexDataModule.DEFAULT,
                                        IndexDataModule.PLAYING
                                    ],
                                    propsFilter: (com, state, props) => {
                                        let effEle = state.playMachine.gameState.GetEleById<GameElementEff>(props);
                                        com.node.x = effEle.pos.x;
                                        com.node.y = effEle.pos.y;
                                        com.node.angle = effEle.rotation;

                                        for (let i = 0; i < com.listRenderEnabledTime.length; i++) {
                                            let render = com.listRenderEnabledTime [i];
                                            render.getMaterial(0).setProperty(MAT_PROPERTY_ENABLED_TIME, effEle.totalMS);
                                        };
                                        com.AnimTimeScale (state.playMachine.gameState._timeScale);

                                        if (!effEle.tint) {
                                            return;
                                        };
                                        for (let i = 0; i < com.listNodeTint.length; i++) {
                                            com.listNodeTint [i].color = effEle.tint;
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
            );
        };
        return this._nodeTypeCache.get(cfgId);
    }
}