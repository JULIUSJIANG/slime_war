import UtilObjPool from "./UtilObjPool";
import UtilObjPoolType from "./UtilObjPoolType";

const APP = `BCCollection`;

/**
 * 集合存储器
 */
class BCCollection<T> {

    private constructor () {}

    private static _t = new UtilObjPoolType<BCCollection<any>> ({
        instantiate: () => {
            return new BCCollection();
        },
        onPop: (t) => {
    
        },
        onPush: (t) => {
            
        },
        tag: APP
    });

    static Pop<T> (apply: string) {
        return UtilObjPool.Pop(BCCollection._t, apply) as BCCollection<T>;
    }

    /**
     * 总集合
     */
    _list: Array<T> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 分类集合
     */
    _map: Map<(inst: T) => any, Map<any, BCCollection<T>>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 增
     * @param inst 
     */
    add (inst: T) {
        this._list.push(inst);
        this._map.forEach((mapRec, func) => {
            mapRec.forEach((coll, key) => {
                if (func(inst) != key) {
                    return;
                };
                coll.add(inst);
            });
        });
    }

    /**
     * 删
     * @param inst 
     */
    rem (inst: T) {
        this._list.splice(this._list.indexOf(inst), 1);
        this._map.forEach((mapRec, func) => {
            mapRec.forEach((coll, key) => {
                if (func(inst) != key) {
                    return;
                };
                coll.rem(inst);
            });
        });
    }

    /**
     * 选择
     * @param func 
     * @param val 
     */
    select<K> (func: (inst: T) => K, val: K): BCCollection<T>  {
        if (!this._map.has(func)) {
            this._map.set(func, UtilObjPool.Pop(UtilObjPool.typeMap, APP));
            for (let i = 0; i < this._list.length; i++) {
                let ele = this._list[i];
                let key = func(ele);
                if (!this._map.get(func).get(key)) {
                    this._map.get(func).set(key, BCCollection.Pop(APP))
                };
                this._map.get(func).get(key).add(ele);
            };
        };
        if (!this._map.get(func).has(val)) {
            this._map.get(func).set(val, BCCollection.Pop(APP));
        };
        return this._map.get(func).get(val);
    }
}

export default BCCollection;