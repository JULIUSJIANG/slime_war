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
import Logic3005 from "../game_element/body/logic_3005/Logic3005";
import utilMath from "../../frame/basic/UtilMath";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayBody003`;

/**
 * 旋转角锁住，脚底位置对齐，自动同步动画 + 怪物逻辑 3005 定制
 */
@ccclass
export default class GameDisplayBody003 extends UIViewComponent {
    /**
     * 列表 - 躯干节点
     */
    @property (cc.Node)
    listNodeBody: Array <cc.Node> = [];
    /**
     * 列表 - 扭曲节点
     */
    @property (cc.Node)
    listNodeAngulartion: Array <cc.Node> = [];

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
    static _nodeTypeCacheMap = UtilObjPool.Pop(UtilObjPool.typeMap, APP) as Map<number, UINodeType<GameDisplayBody003, GamePlayViewState, number>>;
     /**
      * 获取对应的节点类型
      * @param res 
      * @returns 
      */
    static GetNodeType (cfg: CfgGameElement) {
        let res = cfg.res_scene;
        if (!GameDisplayBody003._nodeTypeCacheMap.has(cfg.id)) {
            GameDisplayBody003._nodeTypeCacheMap.set(
                cfg.id,
                UINodeType.Pop<GameDisplayBody003, GamePlayViewState, number>(
                    APP,
                    {
                        prefabPath: res,
                        componentGetter: node => node.getComponent(GameDisplayBody003),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<GameDisplayBody003, GamePlayViewState, number>(
                                APP,
                                {
                                    listRefModule: [
                                        IndexDataModule.DEFAULT,
                                        IndexDataModule.PLAYING
                                    ],
                                    propsFilter: (com, state, props) => {
                                        com.AnimTimeScale(state.playMachine.gameState._timeScale);
                                        let npcELe = state.playMachine.gameState.GetEleById<GameElementBody>(props);
                                        let pos = npcELe.commonFootPos;
                                        com.node.x = pos.x;
                                        com.node.y = pos.y;
                                        com.Status(npcELe.commonAnim);

                                        let logic3005 = npcELe.commonBehaviour as Logic3005;
                                        let opacityAngulartion = utilMath.Clamp (1.0 - logic3005.hmStatusCD.cd / logic3005.args.defendCD, 0, 1) * 255;
                                        let opacityBody = 255 - opacityAngulartion;
                                        let enableBody = logic3005.hmCurrStatus == logic3005.hmStatusCD;
                                        for (let i = 0; i < com.listNodeBody.length; i++) {
                                            let nodeBody = com.listNodeBody [i];
                                            nodeBody.active = enableBody;
                                            nodeBody.opacity = opacityBody;
                                        };
                                        let enableAngulartion = logic3005.hmCurrStatus == logic3005.hmStatusOrdinary;
                                        for (let i = 0; i < com.listNodeAngulartion.length; i++) {
                                            let nodeAngulartion = com.listNodeAngulartion [i];
                                            nodeAngulartion.active = enableAngulartion;
                                            nodeAngulartion.opacity = opacityAngulartion;
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