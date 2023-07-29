import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import GameElementBody from "./body/GameElementBody";
import GameElementPart from "./common/GameElementPart";
import GameElementScene from "./common/GameElementScene";
import GameElement from "./GameElement";
import GameStatePhyAbleRSRec from "./GameStatePhyAbleRSRec";
import GameElementParticle from "./particle/GameElementParticle";

const APP = `GameStatePhyAbleRS`;

/**
 * 物理许可的注册信息
 */
class GameStatePhyAbleRS<T extends GameElement, V extends GameElement> {
    /**
     * 类型 a
     */
    typeA: {prototype: T};

    /**
     * 类型 b
     */
    typeB: {prototype: V};

    /**
     * 物理许可
     */
    phyAble: (a: T, b: V) => boolean;

    private constructor () {}

    private static _t = new UtilObjPoolType<GameStatePhyAbleRS<any, any>>({
        instantiate: () => {
            return new GameStatePhyAbleRS();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: `PhyCfg`
    });

    static Pop<T extends GameElement, V extends GameElement> (
        apply: string,
        typeA: {prototype: T},
        typeB: {prototype: V},
        phyAble: (a: T, b: V) => boolean
    ) 
    {
        let val = UtilObjPool.Pop(GameStatePhyAbleRS._t, apply);
        val.typeA = typeA;
        val.typeB = typeB;
        val.phyAble = phyAble;

        if (!GameStatePhyAbleRSRec.phyAbleMap.has(typeA)) {
            GameStatePhyAbleRSRec.phyAbleMap.set(typeA, UtilObjPool.Pop(UtilObjPool.typeMap, APP));
        };
        GameStatePhyAbleRSRec.phyAbleMap.get(typeA).set(typeB, GameStatePhyAbleRSRec.Pop(
            APP,
            phyAble
        ));
    
        if (!GameStatePhyAbleRSRec.phyAbleMap.has(typeB)) {
            GameStatePhyAbleRSRec.phyAbleMap.set(typeB, UtilObjPool.Pop(UtilObjPool.typeMap, APP));
        };
        GameStatePhyAbleRSRec.phyAbleMap.get(typeB).set(typeA, GameStatePhyAbleRSRec.Pop(
            APP,
            (a, b) => {
                return phyAble(b as any, a as any);
            }
        ));
        return val;
    }
}

namespace GameStatePhyAbleRS {
    export const phyAbleRegist = [
        GameStatePhyAbleRS.Pop<GameElementScene, GameElementBody>(
            APP,
            GameElementScene,
            GameElementBody,
            (a, b) => {
                return true
            }
        ),
        GameStatePhyAbleRS.Pop<GameElementScene, GameElementPart>(
            APP,
            GameElementScene,
            GameElementPart,
            (a, b) => {
                return true;
            }
        ),
        GameStatePhyAbleRS.Pop<GameElementScene, GameElementParticle>(
            APP,
            GameElementScene,
            GameElementParticle,
            (a, b) => {
                return true;
            }
        )
    ];
}

export default GameStatePhyAbleRS;