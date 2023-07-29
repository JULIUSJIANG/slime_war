class UtilObjPoolType<T> {
    /**
     * 实际容器
     */
    _coll: Array<T> = new Array();

    /**
     * 实例化了的数量
     */
    instantiatedCount: number = 0;

    /**
     * 实例化
     */
    instantiate: () => T;

    /**
     * 事件派发 - 提取
     */
    onPop: (t: T) => void;

    /**
     * 事件派发 - 存储
     */
    onPush: (t: T) => void;

    /**
     * 标识
     */
     tag: string;

    constructor (args: {
        instantiate: () => T,
        onPop: (t: T) => void,
        onPush: (t: T) => void,
        tag: string
    }) 
    {
        this.instantiate = args.instantiate;
        this.onPop = args.onPop;
        this.onPush = args.onPush;
        this.tag = args.tag;
        if (UtilObjPoolType.mapTagToPoolType.has(args.tag)) {
            console.error(`tag 冲突 [${args.tag}]`)
        };
        UtilObjPoolType.mapTagToPoolType.set(args.tag, this);
    }
}

namespace UtilObjPoolType {
    /**
     * 标识到具体类型实例的记录
     */
    export const mapTagToPoolType = new Map();
}

export default UtilObjPoolType;