import BCType from "../../frame/basic/BCType";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import GameElementBuff from "../game_element/buff/GameElementBuff";
import GamePlayViewState from "../view/game_play/GamePlayViewState";
import GameDisplayBuffItem from "./GameDisplayBuffItem";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayBuff`;

/**
 * 增减益的可视化
 */
@ccclass
export default class GameDisplayBuff extends UIViewComponent {

    /**
     * 动画组件
     */
    @property(cc.Animation)
    anim: cc.Animation = null;

    /**
     * 容器 - 图标
     */
    @property(cc.Node)
    containerIcon: cc.Node = null;

    /**
     * 文本 - 数量
     */
    @property(cc.Label)
    txtCount: cc.Label = null;

    /**
     * 当前动画名字
     */
    currAnimName: string;

    /**
     * 载入动画
     * @param animName 
     * @returns 
     */
    LoadAnim (animName: string) {
        if (animName == this.currAnimName) {
            return;
        };
        this.currAnimName = animName;
        this.anim.play(this.currAnimName);
    }

    protected onDisable(): void {
        this.currAnimName = null;
    }

    // static nodeType = UINodeType.Pop<GameDisplayBuff, GamePlayViewState, number>(
    //     APP,
    //     {
    //         prefabPath: `prefab_ui/prefab_buff`,
    //         componentGetter: node => node.getComponent(GameDisplayBuff),
    //         listModuleStyle: [
    //             UINodeType.ModuleStyle.Pop<GameDisplayBuff, GamePlayViewState, number>(
    //                 APP,
    //                 {
    //                     listRefModule: [
    //                         IndexDataModule.DEFAULT,
    //                         IndexDataModule.PLAYING
    //                     ],
    //                     propsFilter: (com, state, props) => {
    //                         let eleBuff = state.playMachine.gameState.GetEleById<GameElementBuff>(props);
    //                         com.node.x = eleBuff.buffX;
    //                         com.node.y = eleBuff.buffY;
    //                         com.LoadAnim(eleBuff._currStatus.ActGetAnimName());
    //                         com.txtCount.node.active = true;
    //                         if (0 < eleBuff._cfg.layer_max) {
    //                             com.txtCount.string = `${eleBuff._layer}/${eleBuff._cfg.layer_max}`;
    //                         }
    //                         else {
    //                             com.txtCount.string = `x${eleBuff._layer}`;
    //                         };
    //                     }
    //                 }
    //             )
    //         ],
    //         childrenCreator: [
    //             UINodeType.ChildrenGeneration.Pop<GameDisplayBuff, GamePlayViewState, number>(
    //                 APP,
    //                 {
    //                     containerGetter: (tCom) => {
    //                         return tCom.containerIcon;
    //                     },
    //                     uiNodeCreator: (state, props, listNode) => {
    //                         let eleBuff = state.playMachine.gameState.GetEleById<GameElementBuff>(props);
    //                         let children = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
    //                         children.push(props);
    //                         children.push(eleBuff._cfg.layer_max - 0 - 1);
    //                         listNode.push(GameDisplayBuffItem.GetNodeTypeByRes(eleBuff._cfg.res_display).CreateNode(
    //                             state,
    //                             children,
    //                             0
    //                         ));
    //                     }
    //                 }
    //             )
    //         ],
    //         propsType: BCType.typeNumber,
    //         hideRS: UINodeInstHideRS.setParentNull
    //     }
    // );
}