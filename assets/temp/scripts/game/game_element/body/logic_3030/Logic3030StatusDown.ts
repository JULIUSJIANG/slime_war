import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import MgrSdk from "../../../../frame/sdk/MgrSdk";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import GameSizeMarkRS from "../GameSizeMarkRS";
import Logic3030Status from "./Logic3030Status";

const APP = `Logic3030StatusDown`;

/**
 * 震荡弹 - 状态 - 下降中
 */
export default class Logic3030StatusDown extends Logic3030Status {

    public OnUp(): void {
        this.relMachine.EnterStatus (this.relMachine.statusUp);
    }

    public OnEnter(): void {
        // 进入下一个伤害周期
        this.relMachine.relBody.commonActionId++;
        this.relMachine.relBody.ClearDmgRecord ();
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        this.Bounce ();
    }

    public OnStep(ms: number): void {
        // 接触到地板的话，直接销毁
        if (0 < this.relMachine.relBody.listConcatedGround.length) {
            this.relMachine.relBody.relState.RemEle(this.relMachine.relBody);
            return;
        };

        // 有接触到敌对单位，进行伤害
        for (let i = 0; i < this.relMachine.relBody.listConcatedBodyEnemy.length; i++) {
            let concat = this.relMachine.relBody.listConcatedBodyEnemy[0];
            let eleBody = concat.relFixture.relBody.relEle as GameElementBody;
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
    }

    /**
     * 回弹
     */
    Bounce () {
        this.relMachine.relBody.commonHpCurrent--;
        if (this.relMachine.relBody.commonHpCurrent == 0) {
            this.relMachine.relBody.relState.RemEle(this.relMachine.relBody);
            return;
        };
        let vec = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);
        vec.x = this.relMachine.relBody.relState.player.commonBehaviour.b2GetSpeedX ();
        vec.y = -this.relMachine.relBody.commonBody.b2Body.GetLinearVelocity().y;
        this.relMachine.relBody.commonBody.b2Body.SetLinearVelocity(vec);
    }
}