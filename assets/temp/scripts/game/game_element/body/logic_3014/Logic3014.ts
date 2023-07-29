import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import utilString from "../../../../frame/basic/UtilString";
import jiang from "../../../../frame/global/Jiang";
import MgrUI from "../../../../frame/ui/MgrUI";
import GameElementBody from "../GameElementBody";
import GameElementBodyBehaviour from "../GameElementBodyBehaviour";
import GameElementBodyBehaviourRS from "../GameElementBodyBehaviourRS";
import Logic3001 from "../logic_3001/Logic3001";
import Logic3014Args from "./Logic3014Args";

const APP = `Logic3014`;

/**
 * 3001 的基础上，附加死亡分裂 + 角度带有攻击性
 */
export default class Logic3014 extends Logic3001 {

    private static _Logic3014t = new UtilObjPoolType<Logic3014>({
        instantiate: () => {
            return new Logic3014 ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            
        },
        tag: APP
    });

    static Pop (apply: string, ge: GameElementBody, args: Logic3014Args) {
        let val = UtilObjPool.Pop(Logic3014._Logic3014t, apply);
        val.Logic3014Args = args;
        val.relBody = ge;
        val.args = args;
        val.EnterStatus(val.statusOrdinary);
        return val;
    }

    /**
     * 针对自身类型的参数
     */
    private Logic3014Args: Logic3014Args;

    protected Logic3001OnDestory(): void {
        let angelDistance = Math.PI / 3 / this.Logic3014Args.listSplit.length;
        let speedLen = - this.relBody.relState.b2Gravity * Logic3001.GRAVITY_SCALE / jiang.mgrUI._sizePerPixel / 1000 / 2;
        for (let i = 0; i < this.Logic3014Args.listSplit.length; i++) {
            let angle = Math.PI * 2 / 3 - i * angelDistance;
            let eleBody = GameElementBody.PopForCall (
                APP,

                {
                    posX: this.relBody.commonCenterPos.x,
                    posY: this.relBody.commonCenterPos.y,

                    vecX: Math.cos (angle) * speedLen,
                    vecY: Math.sin (angle) * speedLen,
                    cfgId: this.Logic3014Args.listSplit [i],
                    camp: this.relBody.commonArgsCamp,
                    caller: this.relBody
                }
            );
            this.relBody.relState.AddEle (eleBody);
        };
    }

    static rs = GameElementBodyBehaviourRS.Pop<Logic3014Args>(
        APP,
        {
            logicCode: 3014,
            cfgToArgs: (cfg) => {
                return {
                    ...Logic3001.rs.cfgToArgs (cfg),
                    listSplit: utilString.ParseStrToListNum (cfg.prop_10)
                };
            },
            init: (ge, t) => {
                ge.commonBehaviour = Logic3014.Pop (APP, ge, t);
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
                return list;
            }
        }
    )
}

