namespace utilMath {
    /**
     * 坐标
     */
    export interface Position {
        /**
         * x 坐标
         */
        x: number;
        /**
         * y 坐标
         */
        y: number;
    }

    /**
     * 返回 -1 到 1 的随机数
     */
    export function RandomLowerToUpper () {
        return (Math.random() - 0.5) * 2;
    }

    /**
     * 返回 -1 到 1 的随机数
     */
    export function RandomLowerToUpperSqrt () {
        let ran = RandomLowerToUpper ();
        let abs = Math.abs (ran);
        return ran / abs;
    }

    /**
     * 把 val 限制在 min - max 里面
     * @param val 
     * @param min 
     * @param max 
     */
    export function Clamp (val: number, min: number, max: number) {
        if (max < min) {
            return val;
        };
        if (val < min) {
            return min;
        };
        if (max < val) {
            return max;
        };
        return val;
    }

    /**
     * 取正模
     * @param curr 
     * @param mod 
     * @returns 
     */
    export function Mod(curr: number, mod: number) {
        curr %= mod;
        curr += mod;
        curr %= mod;
        return curr;
    }

    /**
     * a < b 的话返回 0，否则返回 1
     * @param a 
     * @param b 
     * @returns 
     */
    export function Step (a: number, b: number) {
        return a < b ? 1 : 0;
    }

    /**
     * 使用权重在 a 和 b 中间插值
     * @param a 
     * @param b 
     * @param w 
     * @returns 
     */
    export function Lerp (a: number, b: number, w: number) {
        return (1 - w) * a + w * b;
    }

    /**
     * 使 curr 趋于 target，该次偏移距离为 distance
     * @param curr 
     * @param target 
     * @param distance 
     */
    export function Close (curr: number, target: number, distance: number) {
        // 本身位移足够，直接设置为 target
        if (Math.abs(curr - target) <= distance) {
            return target;
        };
        if (curr < target) {
            return curr + distance;
        };
        if (target < curr) {
            return curr - distance;
        };
        return target;
    }

    /**
     * 归一化
     * @param num 
     */
    export function Normalize (num: number) {
        if (0 < num) {
            return 1;
        };
        if (num < 0) {
            return -1;
        };
        return 0;
    }

    /**
     * 获取一个数字的正整数位数
     * @param num 
     */
    export function GetNumIdxCount (num: number) {
        let idx = 0;
        let val = 1;
        while (val <= num) {
            val *= 10;
            idx++;
        };
        return idx;
    }
    /**
     * 数字转大数字
     * @param num 
     */
    export function ParseNumToKMBTAABB (num: number, numFix: (num: number) => number) {
        let numIdxCount = GetNumIdxCount (num);
        let numRec: ParseNumToKMBTAABBStruct;
        // 查找合适的符号
        for (let i = 0; i < listParseNumToKMBTAABBStruct.length; i++) {
            let listParseNumToKMBTAABBStructItem = listParseNumToKMBTAABBStruct [i];
            if (listParseNumToKMBTAABBStructItem.idxCountBorder <= numIdxCount) {
                numRec = listParseNumToKMBTAABBStructItem;
            }
            // 由于要求是逐渐提升的，如果不符合，后续肯定也不符合
            else {
                break;
            };
        };
        // 没有合适的数，说明太小，原样返回得了
        if (numRec == null) {
            return `${numFix (num)}`;
        };
        // 要显示的数字
        let displayNum = num / numRec.count;
        // 位数
        let displayNumIdxCount = GetNumIdxCount (displayNum);
        // 超过 COUNT_E 位的话，采纳科学计数法
        if (COUNT_E_BORDER < displayNumIdxCount) {
            // 前面留 COUNT_E 位，后面用科学计数法替代
            let base = 10 ** (numIdxCount - COUNT_E_KEEP);
            let baseCount = num / base;
            return `${numFix (baseCount)}E${numIdxCount - COUNT_E_KEEP}`;
        };
        return `${numFix (num / numRec.count)}${numRec.name}`;
    }
    /**
     * 科学计数法针对的位数
     */
    export const COUNT_E_BORDER = 5;
    /**
     * 展示的时候保留的数字位数
     */
    export const COUNT_E_KEEP = 3;
    /**
     * 数字显示起码保留的位数
     */
    export const COUNT_NUM_KEEP = 3;

    interface ParseNumToKMBTAABBStruct {
        /**
         * 符号
         */
        name: string;
        /**
         * 指数值
         */
        num: number;
        /**
         * 数量
         */
        count: number;
        /**
         * 采纳该单位的位数边界值
         */
        idxCountBorder: number;
    }
    export const listParseNumToKMBTAABBStruct: Array<ParseNumToKMBTAABBStruct> = [
        {
            name: `K`,
            num: 3,
            count: null,
            idxCountBorder: null
        },
        {
            name: `M`,
            num: 6,
            count: null,
            idxCountBorder: null
        },
        {
            name: `B`,
            num: 9,
            count: null,
            idxCountBorder: null
        },
        {
            name: `T`,
            num: 12,
            count: null,
            idxCountBorder: null
        }
        // ,
        // {
        //     name: `AA`,
        //     num: 15,
        //     count: null,
        //     idxCountBorder: null
        // },
        // {
        //     name: `BB`,
        //     num: 18,
        //     count: null,
        //     idxCountBorder: null
        // },
    ]
}

for (let i = 0; i < utilMath.listParseNumToKMBTAABBStruct.length; i++) {
    let rec = utilMath.listParseNumToKMBTAABBStruct [i];
    // 该单位表示的数量
    rec.count = 10 ** rec.num;
    // 单位前面，起码要有 2 位数
    rec.idxCountBorder = utilMath.COUNT_NUM_KEEP + rec.num;
};

// for (let i = 1; i <= 30; i++) {
//     let val = (1 - 10**i) / (1 - 10) * 0.01;
//     console.log (`++++`);
//     let kmbtaabb = utilMath.ParseNumToKMBTAABB (val, Math.ceil);
//     let txt = `${kmbtaabb}`;
//     console.log (`val[${val}] kmbtaabb[${kmbtaabb}] length[${txt.length}]`);
//     console.log (`----`);
// };

export default utilMath;