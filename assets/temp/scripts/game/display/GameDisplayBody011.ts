import BCType from "../../frame/basic/BCType";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import CfgGameElement from "../../frame/config/src/CfgGameElement";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import GamePlayViewState from "../view/game_play/GamePlayViewState";
import GameElementBody from "../game_element/body/GameElementBody";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import utilString from "../../frame/basic/UtilString";
import Logic3023 from "../game_element/body/logic_3023/Logic3023";
import { b2CircleShape } from "../../../box2d_ts/Box2D";
import jiang from "../../frame/global/Jiang";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayBody011`;

const MAT_PROPERTY_ENABLED_TIME = `enabledTime`;

/**
 * 旋转角锁住，脚底位置对齐，自动同步动画 + 3023 专用
 */
@ccclass
export default class GameDisplayBody011 extends UIViewComponent {
    /**
     * 动画组件
     */
    @property(cc.Animation)
    private _anim: cc.Animation = null;

    /** 
     * 列表 - 需要时间的节点
    */
    @property([cc.RenderComponent])
    listRenderEnabledTime: Array<cc.RenderComponent> = [];

    /**
     * 节点 - 守卫
     */
    @property(cc.Node)
    nodeDefender: cc.Node = null;

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
    static _nodeTypeCacheMap = UtilObjPool.Pop(UtilObjPool.typeMap, APP) as Map<number, UINodeType<GameDisplayBody011, GamePlayViewState, number>>;
     /**
      * 获取对应的节点类型
      * @param res 
      * @returns 
      */
    static GetNodeType (cfg: CfgGameElement) {
        let res = cfg.res_scene;
        if (!GameDisplayBody011._nodeTypeCacheMap.has(cfg.id)) {
            GameDisplayBody011._nodeTypeCacheMap.set(
                cfg.id,
                UINodeType.Pop<GameDisplayBody011, GamePlayViewState, number>(
                    APP,
                    {
                        prefabPath: res,
                        componentGetter: node => node.getComponent(GameDisplayBody011),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<GameDisplayBody011, GamePlayViewState, number>(
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

                                        let logic3023 = npcELe.commonBehaviour as Logic3023;
                                        let p = (logic3023.fixBall.b2Fixture.GetShape() as b2CircleShape).m_p;
                                        com.nodeDefender.x = p.x / jiang.mgrUI._sizePerPixel;
                                        com.nodeDefender.y = p.y / jiang.mgrUI._sizePerPixel;

                                        for (let i = 0; i < com.listRenderEnabledTime.length; i++) {
                                            let render = com.listRenderEnabledTime [i];
                                            render.getMaterial(0).setProperty(MAT_PROPERTY_ENABLED_TIME, npcELe.commonEnabledMS);
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
        return this._nodeTypeCacheMap.get(cfg.id);
    }
}