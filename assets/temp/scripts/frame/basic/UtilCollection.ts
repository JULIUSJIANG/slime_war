namespace utilCollection {
    /**
     * 取出集合中随机的一个
     * @param coll 
     * @returns 
     */
    export function Random<T> (coll: Array<T>) {
        return coll[Math.floor(Math.random() * coll.length)];
    }

    /**
     * 所有内容都匹配
     * @param a 
     * @param b 
     * @returns 
     */
    export function AllMatch<T> (a: Array<T>, b: Array<T>) {
        if (a == null && b == null) {
            return true;
        };
        if (a == null && b != null) {
            return false;
        }
        if (a != null && b == null) {
            return false;
        };
        if (a.length != b.length) {
            return false;
        };
        for (let i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            };
        };
        return true;
    }

    /**
     * 拷贝集合
     * @param set 
     */
    export function CloneSet<T> (set: Set<T>, cloned: Set<T>) {
        set.forEach(( item ) => {
            cloned.add( item );
        });
        return cloned;
    }

    /**
     * 获取字典所包含的元素集合
     * @param map 
     */
    export function GetMapCollection<V> (map: Map<unknown,V>, coll: Array<V>) {
        map.forEach((val) => {
            coll.push( val );
        });
        return coll;
    }

    /**
     * 获取元素
     * @param set 
     */
    export function GetSetCollection<T> (set: Set<T>, coll: Array<T>) {
        set.forEach((val) => {
            coll.push(val);
        });
        return coll;
    }

    /**
     * 获取列表的集合
     * @param coll 
     */
    export function GetCollSet <T> (coll: Array<T>, set: Set<T>) {
        coll.forEach((ele) => {
            set.add(ele);
        });
        return set;
    }
}

export default utilCollection;