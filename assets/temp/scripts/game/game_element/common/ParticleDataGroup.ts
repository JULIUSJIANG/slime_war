import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import ParticleData from "./ParticleData";

const APP = `ParticleDataGroup`;

/**
 * 粒子组
 */
export default class ParticleDataGroup {

    private constructor () {}

    private static _t = new UtilObjPoolType <ParticleDataGroup> ({
        instantiate: () => {
            return new ParticleDataGroup ();
        },
        onPop: (t) => {
            
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop(ParticleDataGroup._t, apply);
        return val;
    }

    /**
     * 用于生成 id
     */
    private _idGen = 0;
    /**
     * 存储所有粒子数据的集合
     */
    public listParticleData: Array <ParticleData<any>> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
    /**
     * 标识到具体数据的映射
     */
    public mapIdToData: Map <number, ParticleData <any>> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);
    /**
     * 构造粒子数据
     * @param msTotal 
     * @param t 
     */
    public CreateParticle<T> (msTotal: number, t: T) {
        let id = ++this._idGen;
        let particleData = ParticleData.Pop (APP, msTotal, id, t);
        this.mapIdToData.set (id, particleData);
        this.listParticleData.push (particleData);
    }

    /**
     * 时间推进
     * @param ms 
     */
    public onStep (ms: number) {
        for (let i = 0; i < this.listParticleData.length;) {
            let particleData = this.listParticleData [i];
            particleData.onStep (ms);
            // 生命周期过期
            if (particleData.rate == 1) {
                this.listParticleData.splice (i, 1);
                this.mapIdToData.delete (particleData.id);
                // 回收该粒子数据
                UtilObjPool.Push (particleData);
            }
            // 否则处理下一个
            else {
                i++
            };
        };
    }
}