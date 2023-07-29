import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";

const APP = `RewardViewParticleData`;

/**
 * 奖励界面的粒子数据
 */
export default class RewardViewParticleData {

    private constructor () {}

    private static _t = new UtilObjPoolType <RewardViewParticleData> ({
        instantiate: () => {
            return new RewardViewParticleData ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, angle: number, posHor: number, posVer: number, sizeScale: number) {
        let val = UtilObjPool.Pop (RewardViewParticleData._t, apply);
        val.angle = angle;
        val.posHor = posHor;
        val.posVer = posVer;
        val.sizeScale = sizeScale;
        return val;
    }

    /**
     * 角度
     */
    angle: number;
    /**
     * 位置 - 水平
     */
    posHor: number;
    /**
     * 位置 - 垂直
     */
    posVer: number;
    /**
     * 尺寸缩放
     */
    sizeScale: number;
}