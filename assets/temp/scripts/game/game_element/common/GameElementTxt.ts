import utilMath from "../../../frame/basic/UtilMath";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import UINodeType from "../../../frame/ui/UINodeType";
import GameDisplayTxt from "../../display/GameDisplayTxt";
import GamePlayViewState from "../../view/game_play/GamePlayViewState";
import GameElementBody from "../body/GameElementBody";
import GameElementBodyCtxDmg from "../body/GameElementBodyCtxDmg";
import GameElement from "../GameElement";
import GameState from "../GameState";

const APP = `GameElementTxt`;

/**
 * 元素-冒字-伤害
 */
export default class GameElementTxt extends GameElement {
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<GameElementTxt>({
        instantiate: () => {
            return new GameElementTxt();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    /**
     * 进行常规的信息提示
     */
    static PopForTips (
        apply: string,
        txt: string,
        posX: number,
        posY: number,
        ele: GameElementBody
    )
    {
        GameElementTxt.PopForXYBindElement (
            apply,
            posX,
            posY,
            txt,
            ele.relState,
            ele.id,
            GameDisplayTxt.nodeTypeAppear
        );
    }

    /**
     * 生成治疗文本
     * @param apply 
     * @param countCure 
     * @param state 
     * @param idEle 
     * @returns 
     */
    static PopForCure (
        apply: string,
        countCure: number,
        ele: GameElementBody
    )
    {
        GameElementTxt.PopForXYBindElement (
            apply,
            ele.commonHeadPos.x + (-1 + Math.random () * 2) * 10,
            ele.commonHeadPos.y,
            `${utilMath.ParseNumToKMBTAABB (countCure, Math.ceil)}`,
            ele.relState,
            ele.id,
            GameDisplayTxt.nodeTypeRecovery
        );
    }

    /**
     * 生成绑定元素位置的冒字
     * @param apply 
     * @param posX 
     * @param posY 
     * @param txt 
     * @param idEle 
     * @param nodeType 
     */
    static PopForXYBindElement (
        apply: string,
        posX: number,
        posY: number,
        txt: string,
        state: GameState,
        idEle: number,

        nodeType: UINodeType<GameDisplayTxt, GamePlayViewState, number>
    )
    {
        let val = UtilObjPool.Pop (GameElementTxt._t, apply);
        val.posCurrent.x = posX;
        val.posCurrent.y = posY;
        val.txt = txt;
        val.nodeType = nodeType;
        val.evterAdded.On(() => {
            let ele = val.relState.GetEleById (idEle) as GameElementBody;

            let relX = posX - ele.commonFootPos.x;
            let relY = posY - ele.commonFootPos.y;

            val.posCurrent.x = posX;
            val.posCurrent.y = posY;

            let totalMS = 0;
            val.listenIdStep = val.relState.evterSteped.On((ms) => {
                // 目标还在
                if (val.relState.GetEleById (idEle) != null) {
                    val.posCurrent.x = ele.commonFootPos.x + relX;
                    val.posCurrent.y = ele.commonFootPos.y + relY;
                };

                totalMS += ms;
                if (2000 < totalMS) {
                    val.relState.RemEle(val);
                };
            });
        });
        val.evterRem.On(() => {
            val.relState.evterSteped.Off( val.listenIdStep );
        });
        state.AddEle (val);
    }

    /**
     * 生成伤害文本
     * @param apply 
     * @param ctxDmg 
     * @returns 
     */
    static PopForDmg (
        apply: string,
        ctxDmg: GameElementBodyCtxDmg,
        state: GameState
    )
    {
        GameElementTxt.PopForXRelativeToPlayer (
            apply,
            ctxDmg.posX,
            ctxDmg.posY,
            `${utilMath.ParseNumToKMBTAABB (ctxDmg.dmg, Math.floor)}`,
            state,
            GameDisplayTxt.nodeTypeDmg
        );
    }

    /**
     * 生成相对镜头位置不动的文本
     * @param apply 
     * @param posX 
     * @param posY 
     * @param txt 
     * @param nodeType 
     * @returns 
     */
    static PopForXRelativeToPlayer (
        apply: string,
        posX: number,
        posY: number,
        txt: string,
        state: GameState,

        nodeType: UINodeType<GameDisplayTxt, GamePlayViewState, number>
    )
    {
        let val = UtilObjPool.Pop (GameElementTxt._t, apply);
        val.posCurrent.x = posX;
        val.posCurrent.y = posY;
        val.txt = txt;
        val.nodeType = nodeType;
        val.evterAdded.On(() => {

            let relX = posX - val.relState.player.commonFootPos.x;

            val.posCurrent.x = posX;

            let totalMS = 0;
            val.listenIdStep = val.relState.evterSteped.On((ms) => {
                val.posCurrent.x = val.relState.player.commonFootPos.x + relX;

                totalMS += ms;
                if (2000 < totalMS) {
                    val.relState.RemEle(val);
                };
            });
        });
        val.evterRem.On(() => {
            val.relState.evterSteped.Off( val.listenIdStep );
        });
        state.AddEle (val);
    }

    /**
     * 初始化时候位置
     */
    posCurrent: cc.Vec2 = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
    
    /**
     * 要展示的文本
     */
    txt: string;
    
    /**
     * 时间步进的监听
     */
    listenIdStep: number;

    /**
     * 样式
     */
    nodeType: UINodeType<GameDisplayTxt, GamePlayViewState, number>;
}