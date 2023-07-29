import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import utilString from "../../../../frame/basic/UtilString";
import jiang from "../../../../frame/global/Jiang";
import MgrUI from "../../../../frame/ui/MgrUI";
import GameElementBody from "../GameElementBody";
import GameElementBodyBehaviour from "../GameElementBodyBehaviour";
import GameElementBodyBehaviourRS from "../GameElementBodyBehaviourRS";
import Logic3001 from "../logic_3001/Logic3001";
import Logic3002Args from "./Logic3002Args";

const APP = `Logic3002`;

/**
 * 3001 的基础上，附加死亡分裂
 */
export default class Logic3002 extends Logic3001 {

    private static _logic3002t = new UtilObjPoolType<Logic3002>({
        instantiate: () => {
            return new Logic3002 ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            
        },
        tag: APP
    });

    static Pop (apply: string, ge: GameElementBody, args: Logic3002Args) {
        let val = UtilObjPool.Pop(Logic3002._logic3002t, apply);
        val.logic3002Args = args;
        val.relBody = ge;
        val.args = args;
        val.EnterStatus(val.statusOrdinary);
        return val;
    }

    /**
     * 针对自身类型的参数
     */
    private logic3002Args: Logic3002Args;

    protected Logic3001OnDestory(): void {
        let angelDistance = Math.PI / 6 / this.logic3002Args.listSplit.length;
        let speedLen = - this.relBody.relState.b2Gravity * Logic3001.GRAVITY_SCALE / jiang.mgrUI._sizePerPixel / 1000 / 4;
        for (let i = 0; i < this.logic3002Args.listSplit.length; i++) {
            let angle = Math.PI / 2 - i * angelDistance;
            let eleBody = GameElementBody.PopForCall (
                APP,

                {
                    posX: this.relBody.commonFootPos.x,
                    posY: this.relBody.commonFootPos.y,

                    vecX: Math.cos (angle) * speedLen,
                    vecY: Math.sin (angle) * speedLen,
                    cfgId: this.logic3002Args.listSplit [i],
                    camp: this.relBody.commonArgsCamp,
                    caller: this.relBody
                }
            );
            this.relBody.relState.AddEle (eleBody);
        };
    }

    static rs = GameElementBodyBehaviourRS.Pop<Logic3002Args>(
        APP,
        {
            logicCode: 3002,
            cfgToArgs: (cfg) => {
                return {
                    ...Logic3001.rs.cfgToArgs (cfg),
                    listSplit: utilString.ParseStrToListNum (cfg.prop_10)
                };
            },
            init: (ge, t) => {
                ge.commonBehaviour = Logic3002.Pop (APP, ge, t);
            },
            instDisplay: Logic3001.rs.instDisplay,
            boardDisplay: Logic3001.rs.boardDisplay,
            atkGetter: Logic3001.rs.atkGetter,
            hpGetter: Logic3001.rs.hpGetter,
            sizeGetter: Logic3001.rs.sizeGetter,

            aditionalBody: (cfg, t) => {
                let list: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                list.push (...t.listSplit);
                return list;
            },
            aditionalEff: (cfg, t) => {
                let list: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                return list;
            },
            aditionalVoice: (cfg, t) => {
                let list: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                list.push (
                    t.hurtedOgg,
                    t.deathOgg,    
                );
                return list;
            }
        }
    )
}

