import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import CfgBuffProps from "../../../frame/config/src/CfgBuffProps";
import { GameElementBuffBehaviour } from "./GameElementBuffBehaviour";

const APP = `GameElementBuffRS`;

/**
 * 注册信息
 */
class GameElementBuffRS<T> {

    private constructor () {}

    private static _t = new UtilObjPoolType<GameElementBuffRS<any>>({
        instantiate: () => {
            return new GameElementBuffRS();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop<T> (
        apply: string,
        args: {
            logicCode: number,
            instantiate: () => GameElementBuffBehaviour<T>,
            argsCreate: (cfg: CfgBuffProps) => T
        }
    )
    {
        let val = UtilObjPool.Pop(GameElementBuffRS._t, apply);
        val.logicCode = args.logicCode;
        val.instantiate = args.instantiate;
        val.cfgToArgs = args.argsCreate;
        GameElementBuffRS.instMap.set(val.logicCode, val);
        return val;
    }

    /**
     * 逻辑号
     */
    logicCode: number;

    /**
     * 策略的实例化
     */
    instantiate: () => GameElementBuffBehaviour<any>;

    /**
     * 参数构造
     */
    cfgToArgs: (cfg: CfgBuffProps) => any;
}

namespace GameElementBuffRS {
    /**
     * 映射
     */
    export const SYM_REC = Symbol(APP);

    /**
     * 实例映射
     */
    export const instMap: Map<number, GameElementBuffRS<any>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);
}

export default GameElementBuffRS;