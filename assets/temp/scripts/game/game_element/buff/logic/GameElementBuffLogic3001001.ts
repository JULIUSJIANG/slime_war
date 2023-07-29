import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GameElementEff from "../../common/GameElementEff";
import { GameElementBuffBehaviour } from "../GameElementBuffBehaviour";
import GameElementBuffRS from "../GameElementBuffRS";
import GameElementBodyCtxDmg from "../../body/GameElementBodyCtxDmg";
import GameElementBodyCtxDmgType from "../../body/GameElementBodyCtxDmgType";

const APP = `GameElementBuffLogic3001001`;

interface Args {
    
}

class GameElementBuffLogic3001001 extends GameElementBuffBehaviour<Args> {

    private constructor () {
        super();
    }

    static _tExp = new UtilObjPoolType<GameElementBuffLogic3001001>({
        instantiate: () => {
            return new GameElementBuffLogic3001001();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    override OnLayerIncrease(): void {
        // 满层数了
        if (this.relBuff._layer == this.relBuff._cfg.layer_max) {
            this.relBuff.EnterStatus(this.relBuff._statusUnload);
            this.relBuff._mgrBuff.eleMonster.commonEvterDmg.Call(GameElementBodyCtxDmg.Pop(
                APP,
                {
                    dmg: 0,
                    posX: this.relBuff._mgrBuff.eleMonster.commonHeadPos.x,
                    posY: this.relBuff._mgrBuff.eleMonster.commonHeadPos.y,

                    repel: 0,
                    norX: 0,
                    norY: 1,

                    type: GameElementBodyCtxDmgType.equipment
                }
            ));
        };
    }
}

GameElementBuffRS.Pop(
    APP,
    {
        logicCode: 3001001,
        instantiate: () => {
            return UtilObjPool.Pop(GameElementBuffLogic3001001._tExp, APP);
        },
        argsCreate: (cfg) => {
            return {

            }
        }
    }
)

export default GameElementBuffLogic3001001;