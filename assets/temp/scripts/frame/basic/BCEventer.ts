import BCIdGeneration from "./BCIdGeneration";
import UtilObjPool from "./UtilObjPool";
import UtilObjPoolType from "./UtilObjPoolType";

const APP = `BCEventer`;

/**
 * 有参数事件
 */
export default class BCEventer<T> {

    private constructor () {}

    private static _t = new UtilObjPoolType<BCEventer<any>> ({
        instantiate: () => {
            return new BCEventer();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            t.listenMap.clear();
        },
        tag: APP
    });

    static Pop<T> (apply: string) {
        return UtilObjPool.Pop(BCEventer._t, apply) as BCEventer<T>;
    }

    /**
     * 标识生成器
     */
    private idGen = BCIdGeneration.Pop(APP)

    /**
     * 监听的记录
     */
    private listenMap: Map<number, (t: T) => void> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 单词监听
     * @param callBack 
     */
    Once (callBack: (t: T) => void) {
        let onId: number;
        let wrap = (t: T) => {
            this.Off(onId);
            callBack(t);
        };
        onId = this.On(wrap);
    }

    /**
     * 开始监听
     * @param callBack 
     */
    On (callBack: (t: T) => void) {
        let genId = this.idGen.GenId();
        this.listenMap.set(genId, callBack);
        return genId;
    }

    /**
     * 取消监听
     * @param id 
     */
    Off (id: number) {
        this.listenMap.delete(id);
    }

    /**
     * 通知
     */
    Call (t: T) {
        this.listenMap.forEach(( callback ) => {
            callback(t);
        });
    }
    
    /**
     * 清除所有记录
     */
    Clear () {
        this.listenMap.clear();
    }
}