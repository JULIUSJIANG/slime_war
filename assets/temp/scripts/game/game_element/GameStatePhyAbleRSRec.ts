import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import GameElement from "./GameElement";

const APP = `GameStatePhyAbleRSRec`;

/**
 * 物理许可的相对记录
 */
class GameStatePhyAbleRSRec<T extends GameElement, V extends GameElement> {
    /**
     * 物理许可
     */
    phyAble: (a: T, b: V) => boolean;

    private constructor () {}

    private static _t = new UtilObjPoolType<GameStatePhyAbleRSRec<any, any>>({
        instantiate: () => {
            return new GameStatePhyAbleRSRec();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: `GameStatePhyAbleRSRec`
    });

    static Pop<T extends GameElement, V extends GameElement> (
        apply: string,
        phyAble: (a: T, b: V) => boolean
    ) 
    {
        let val = UtilObjPool.Pop(GameStatePhyAbleRSRec._t, apply);
        val.phyAble = phyAble;
        return val;
    }
}

namespace GameStatePhyAbleRSRec {
    /**
     * 物理许可-字典
     */
    export const phyAbleMap: Map<{prototype: GameElement}, Map<{prototype: GameElement}, GameStatePhyAbleRSRec<GameElement, GameElement>>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);
}

export default GameStatePhyAbleRSRec;