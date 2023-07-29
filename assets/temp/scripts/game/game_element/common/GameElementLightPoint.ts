import utilMath from "../../../frame/basic/UtilMath";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import gameCommon from "../../GameCommon";
import GameElement from "../GameElement";
import GameElementBody from "../body/GameElementBody";

const APP = `GameElementLigthPoint`;

const TRANSITION_SPEED = 200;

/**
 * 光点
 */
export default class GameElementLigthPoint extends GameElement {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<GameElementLigthPoint>({
        instantiate: () => {
            return new GameElementLigthPoint();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (
        apply: string,

        idBind: number,
        color: cc.Color,
        size: number
    )
    {
        let val = UtilObjPool.Pop(GameElementLigthPoint._t, apply);
        val.idBind = idBind;
        val.color = color;
        val.size = size * 4;
        let listenIdUpdate: number;
        
        let colorAvg = (color.r + color.g + color.b) / 2.0;
        // let opacityMax: number = 255 * utilMath.Clamp (gameCommon.LIGHT_POINT_OPACITY_MAX / colorAvg, 0, 1);
        let opacityMax: number = 255;

        val.evterAdded.On (() => {
            let onMsStep = (dt) => {
                let ele = val.relState.GetEleById (val.idBind) as GameElementBody;
                if (ele == null) {
                    val.dirInc = -1;
                }
                else {
                    val.currPos.x = ele.commonCenterPos.x;
                    val.currPos.y = ele.commonCenterPos.y;
                };
                // 不透明度发生变化
                val.opacity += val.dirInc * val.speedInc * dt;
                val.opacity = Math.min (val.opacity, opacityMax);
                // 已经小于 0 的话，消失
                if (val.opacity < 0) {
                    val.relState.RemEle (val);
                };
            };
            listenIdUpdate = val.relState.evterSteped.On (onMsStep);
            onMsStep (0);
        });
        val.evterRem.On (() => {
            val.relState.evterSteped.Off (listenIdUpdate);
        });

        return val;
    }

    /**
     * 绑定的单位
     */
    private idBind: number;
    /**
     * 当前透明度的提升速度
     */
    private dirInc: number = 1;
    /**
     * 不透明度的提升速度
     */
    private speedInc: number = 255 / TRANSITION_SPEED;
    /**
     * 透明度
     */
    opacity: number = 0;
    /**
     * 当前位置
     */
    currPos: cc.Vec2 = UtilObjPool.Pop (UtilObjPool.typeccVec2, APP);
    /**
     * 颜色
     */
    color: cc.Color;
    /**
     * 尺寸
     */
    size: number;
}