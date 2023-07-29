import jiang from "../../../../frame/global/Jiang";
import MBPlayer from "./MBPlayer";
import GameElementBodyBehaviourRS from "../GameElementBodyBehaviourRS";
import GameDisplayPlayer000 from "../../../display/GameDisplayPlayer000";
import Logic3031Args from "./Logic3031Args";
import utilString from "../../../../frame/basic/UtilString";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";

const APP = `Logic3031`;

export default class Logic3031 {

}

GameElementBodyBehaviourRS.Pop<Logic3031Args>
(
    APP,
    {
        logicCode: 3031,
        cfgToArgs: (cfg) => {
            return {
                speed: Number.parseFloat(cfg.prop_0),
                hpMax: Number.parseFloat(cfg.prop_1),
                bodyRadius: Number.parseFloat(cfg.prop_2),
                mpMax: Number.parseFloat(cfg.prop_3),
                mpInc: Number.parseFloat(cfg.prop_4),
                equipOffsetX: Number.parseFloat(cfg.prop_5),
                equipOffsetY: Number.parseFloat(cfg.prop_6),
                defendRadius: Number.parseFloat(cfg.prop_7)
            };
        },
        init: (ge, t) => {
            ge.commonHpMax = t.hpMax;
            ge.commonBehaviour = MBPlayer.Pop(APP, ge, t);
        },
        instDisplay: (state, eleMonster, instList) => {
            instList.push(GameDisplayPlayer000.nodeType.CreateNode(
                state,
                eleMonster.id,
                eleMonster.id
            ));
        },
        boardDisplay: null,
        atkGetter: (cfg, t) => {
            return 0;
        },
        hpGetter: (cfg, t) => {
            return 0;
        },
        sizeGetter: (t) => {
            return t.bodyRadius;
        },

        aditionalBody: (cfg, t) => {
            let list: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
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