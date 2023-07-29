import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";

const APP = `ParticleData`;

/**
 * 粒子数据
 */
export default class ParticleData<T> {

    private constructor () {}

    private static _t = new UtilObjPoolType <ParticleData<any>> ({
        instantiate: () => {
            return new ParticleData ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    /**
     * 提取实例
     * @param apply 
     * @param msTotal 
     * @param t 
     * @returns 
     */
    static Pop<T> (apply: string, msTotal: number, id: number, t: T) {
        let val = UtilObjPool.Pop (ParticleData._t, apply);
        val.msTotal = msTotal;
        val.id = id;
        val.t = t;

        val.msSteped = 0;
        val.rate = 0;
        return val;
    }

    /**
     * 已步进的时长
     */
    public msSteped: number;
    /**
     * 总进度
     */
    public rate: number;
    /**
     * 步进的总时长
     */
    public msTotal: number;
    /**
     * 标识
     */
    public id: number;
    /**
     * 存储了的参数
     */
    public t: T;

    /**
     * 时间推进了的时候
     * @param ms 
     */
    public onStep (ms: number) {
        this.msSteped += ms;
        this.msSteped = Math.min (this.msSteped, this.msTotal);
        this.rate = this.msSteped / this.msTotal;
    }
}