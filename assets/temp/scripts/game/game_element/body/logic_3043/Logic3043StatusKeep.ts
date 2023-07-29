import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import gameCommon from "../../../GameCommon";
import GameElementEff from "../../common/GameElementEff";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import GameSizeMarkRS from "../GameSizeMarkRS";
import Logic3043 from "./Logic3043";
import Logic3043Status from "./Logic3043Status";

const APP = `Logic3043StatusKeep`;

/**
 * 3037 的状态 - 停滞
 */
export default class Logic3043StatusKeep extends Logic3043Status {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<Logic3043StatusKeep>({
        instantiate: () => {
            return new Logic3043StatusKeep();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relLogic: Logic3043) {
        let val = UtilObjPool.Pop (Logic3043StatusKeep._t, apply);
        val.relMachine = relLogic;
        return val;
    }

    /**
     * 伤害的允许次数
     */
    ableTime: number;
    /**
     * 还需等待的伤害时间
     */
    msWait: number = 0;

    OnEnter(): void {
        this.ableTime = this.relMachine.args.dmgTimes;
        let vec = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);
        vec.x = this.relMachine.relBody.relState.player.commonBehaviour.b2GetSpeedX();
        this.relMachine.relBody.commonBody.b2Body.SetLinearVelocity (vec);
        this.relMachine.relBody.commonBody.b2Body.SetGravityScale (this.relMachine.args.gravityScaleWhileKeep);
    }

    OnStep(ms: number): void {
        if (
            0 < this.relMachine.relBody.listConcatedGround.length 
            && this.relMachine.relBody.commonBody.b2Body.GetLinearVelocity().y <= 0 
            && this.relMachine.relBody.commonCenterPos.y < gameCommon.GROUND_Y
        ) 
        {
            GameSizeMarkRS.PlayEffHitByBodyForHitGround (
                APP,
                this.relMachine.relBody
            );
            this.relMachine.relBody.relState.RemEle(this.relMachine.relBody);
            return;
        };

        this.msWait -= ms;
        // 还没冷却完毕
        if (0 < this.msWait) {
            return;
        };
        this.relMachine.relBody.ClearDmgRecord ();
        for (let i = 0; i < this.relMachine.relBody.listConcatedBodyEnemy.length; i++) {
            let concat = this.relMachine.relBody.listConcatedBodyEnemy[0];
            if (this.relMachine.relBody.CheckDmgAble (concat)) {
                GameSizeMarkRS.PlayEffHitByConcat (
                    APP,
                    concat,
                    this.relMachine.relBody.relState,
                    this.relMachine.relBody.commonCache.colorMain,
                    this.relMachine.relBody.commonArgsCfg.size_mark
                );
                this.relMachine.relBody.CauseDmg (
                    concat,
                    GameElementBodyCtxDmg.Pop(
                        APP,
                        {
                            dmg: this.relMachine.relBody.commonInfluence,
                            posX: concat.position.x,
                            posY: concat.position.y,
        
                            repel: this.relMachine.relBody.commonArgsCfg.props_repel,
                            norX: concat.normal.x,
                            norY: concat.normal.y,
        
                            type: GameElementBodyCtxDmgType.equipment
                        }   
                    )
                )
            };
        };

        this.ableTime--;
        // 还有剩余次数
        if (0 < this.ableTime) {
            this.msWait = this.relMachine.args.dmgSpacing;
        }
        // 没有的话，销毁
        else {
            GameSizeMarkRS.PlayEffHitByBody (
                APP,
                this.relMachine.relBody
            );
            this.relMachine.relBody.relState.RemEle(this.relMachine.relBody);
            return;
        };
    }
}