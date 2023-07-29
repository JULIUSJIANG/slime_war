namespace UtilArray {

    const _set = new Set ();

    /**
     * 去重
     * @param arr 
     */
    export function RemRepeat (arr: Array <any>) {
        _set.clear ();
        for (let i = arr.length - 1; 0 <= i; i--) {
            let val = arr [i];
            if (_set.has (val)) {
                arr.splice (i, 1);
            }
            else {
                _set.add (val);
            };
        };
    }
}

export default UtilArray;