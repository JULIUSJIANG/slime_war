import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import PlayOrdinary from "./PlayOrdinary";
import PlayOrdinaryStatus from "./PlayOrdinaryStatus";

const APP = `PlayOrdinaryStatusDestory`;

/**
 * 玩法 - 经典 - 状态 - 已销毁
 */
export default class PlayOrdinaryStatusDestory extends PlayOrdinaryStatus {

    private constructor () {super();}

    private static _t = new UtilObjPoolType<PlayOrdinaryStatusDestory>({
        instantiate: () => {
            return new PlayOrdinaryStatusDestory();
        },
        onPop: (t) => {
         
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMachine: PlayOrdinary) {
        let val = UtilObjPool.Pop(PlayOrdinaryStatusDestory._t, apply);
        val.relMachine = relMachine;
        return val;
    }
}