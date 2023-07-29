import UtilObjPool from "./UtilObjPool";

const STRING_NULL = "null";
const STRING_UNDEFINED = "undefined";
const STRING_NAN = "NaN";
const STRING_EMPTY = "";
const APP = `utilString`;
namespace utilString {
    /**
     * 维持长度
     * @param txt 
     * @param len 
     * @param fill 
     * @returns 
     */
    export function KeepLen (txt: string, len: number, fill: string) {
        let listSplit = txt.split (``);
        while (listSplit.length < len) {
            listSplit.unshift (fill);
        };
        return listSplit.join (``);
    }

    /**
     * 把 16 进制数据转换为颜色
     * @param val 
     * @returns 
     */
    export function ParseSharpStrToCCColor (val: string) {
        val = val.replace (`#`, ``);
        let split = val.split (``);
        return new cc.Color (
            ParseCharToNum (split [0]) * 16 + ParseCharToNum (split [1]),
            ParseCharToNum (split [2]) * 16 + ParseCharToNum (split [3]),
            ParseCharToNum (split [4]) * 16 + ParseCharToNum (split [5]),
            ParseCharToNum (split [6]) * 16 + ParseCharToNum (split [7])
        );
    }
    /**
     * 字符转数字
     * @param char 
     * @returns 
     */
    function ParseCharToNum (char: string) {
        char = char.toLowerCase ();
        switch (char) {
            case `a`: {
                return 10;
            };
            case `b`: {
                return 11;
            };
            case `c`: {
                return 12;
            };
            case `d`: {
                return 13;
            };
            case `e`: {
                return 14;
            };
            case `f`: {
                return 15;
            };
            default: {
                return Number.parseFloat (char);
            };
        };
    }

    /**
     * 检查字符串是否为空
     * @param val 
     * @returns 
     */
    export function CheckIsNullOrEmpty (val: string) {
        if (val == null || val == STRING_EMPTY || val == STRING_NULL || val == STRING_UNDEFINED || val == STRING_NAN) {
            return true
        };
        return false;
    }

    /**
     * 10 进制字符串转颜色
     * @param str 
     * @returns 
     */
    export function ParseStrToCCColor (str: string) {
        if (utilString.CheckIsNullOrEmpty (str)) {
            return UtilObjPool.PopCCColor(
                APP,
                255,
                255,
                255,
                255
            ); 
        };
        let split = str.split(`,`);
        return UtilObjPool.PopCCColor(
            APP,
            Number.parseFloat(split[0]),
            Number.parseFloat(split[1]),
            Number.parseFloat(split[2]),
            Number.parseFloat(split[3])
        );
    }

    /**
     * 字符串转数字
     * @param str 
     * @returns 
     */
    export function ParseStrToNum (str: string) {
        if (CheckIsNullOrEmpty (str)) {
            return 0;
        };
        return Number.parseFloat (str);
    }

    /**
     * 字符串转数字集合
     * @param str 
     * @returns 
     */
    export function ParseStrToListNum (str: string) {
        if (utilString.CheckIsNullOrEmpty (str)) {
            return UtilObjPool.Pop (UtilObjPool.typeArray, APP);
        };
        str = str.replace (/\[/g, ``);
        str = str.replace (/\]/g, ``);
        str = str.replace (/，/g, ``);
        let split = str.split(`,`);
        return split.map ((val) => {
            return Number.parseInt (val);
        });
    }
}

export default utilString;