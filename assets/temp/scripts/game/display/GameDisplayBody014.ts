import BCType from "../../frame/basic/BCType";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import CfgGameElement from "../../frame/config/src/CfgGameElement";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import GamePlayViewState from "../view/game_play/GamePlayViewState";
import GameElementBody from "../game_element/body/GameElementBody";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import Logic3022 from "../game_element/body/logic_3022/Logic3022";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayBody014`;

const MAT_PROPERTY_ENABLED_TIME = `enabledTime`;

/**
 * 旋转角锁住，脚底位置对齐，自动同步动画 + 3022 定制
 */
@ccclass
export default class GameDisplayBody014 extends UIViewComponent {
    /** 
     * 列表 - 需要时间的节点
    */
    @property ([cc.RenderComponent])
    listRenderEnabledTime: Array<cc.RenderComponent> = [];

    /**
     * 节点 - 治愈特效
     */
    @property (cc.Node)
    nodeCure: cc.Node = null;

    /**
     * 动画组件
     */
    @property(cc.Animation)
    private _anim: cc.Animation = null;

    protected override onLoad(): void {
        this._anim = this.getComponentInChildren(cc.Animation);
    }

    /**
     * 当前动画
     */
    private _currAnim: string;

    Status (anim: string) {
        if (this._currAnim == anim) {
            return;
        };
        this._currAnim = anim;
        this._anim.play (this._currAnim, 0);
    }

    protected onDisable(): void {
        this._currAnim = null;
    }

    protected onEnable(): void {
        this.AnimTimeScale (1.0);
        this.Status (this._anim.defaultClip.name);
    }

    /**
     * 节点缓存
     */
    static _nodeTypeCacheMap = UtilObjPool.Pop(UtilObjPool.typeMap, APP) as Map<number, UINodeType<GameDisplayBody014, GamePlayViewState, number>>;
     /**
      * 获取对应的节点类型
      * @param res 
      * @returns 
      */
    static GetNodeType (cfg: CfgGameElement) {
        let res = cfg.res_scene;
        if (!GameDisplayBody014._nodeTypeCacheMap.has(cfg.id)) {
            GameDisplayBody014._nodeTypeCacheMap.set(
                cfg.id,
                UINodeType.Pop<GameDisplayBody014, GamePlayViewState, number>(
                    APP,
                    {
                        prefabPath: res,
                        componentGetter: node => node.getComponent(GameDisplayBody014),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<GameDisplayBody014, GamePlayViewState, number>(
                                APP,
                                {
                                    listRefModule: [
                                        IndexDataModule.DEFAULT,
                                        IndexDataModule.PLAYING
                                    ],
                                    propsFilter: (com, state, props) => {
                                        let npcELe = state.playMachine.gameState.GetEleById<GameElementBody>(props);
                                        com.AnimTimeScale(state.playMachine.gameState._timeScale * npcELe.commonTimeScaleSelf);
                                        let pos = npcELe.commonFootPos;
                                        com.node.x = pos.x;
                                        com.node.y = pos.y;
                                        com.Status(npcELe.commonAnim);

                                        for (let i = 0; i < com.listRenderEnabledTime.length; i++) {
                                            let render = com.listRenderEnabledTime [i];
                                            render.getMaterial(0).setProperty(MAT_PROPERTY_ENABLED_TIME, npcELe.commonEnabledMS);
                                        };

                                        let logic3022 = npcELe.commonBehaviour as Logic3022;
                                        com.nodeCure.opacity = 255 * Math.pow (logic3022.animKeep.rateVisibility, 0.5);
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
        return this._nodeTypeCacheMap.get(cfg.id);
    }
}