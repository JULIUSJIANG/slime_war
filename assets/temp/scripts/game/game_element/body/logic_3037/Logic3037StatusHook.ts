import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GameElementEff from "../../common/GameElementEff";
import GameElementPart from "../../common/GameElementPart";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import GameSizeMarkRS from "../GameSizeMarkRS";
import Logic3037 from "./Logic3037";
import Logic3037Status from "./Logic3037Status";

const APP = `Logic3037StatusHook`;

/**
 * 3037 的状态 - 飞翔
 */
export default class Logic3037StatusHook extends Logic3037Status {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<Logic3037StatusHook>({
        instantiate: () => {
            return new Logic3037StatusHook();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relLogic: Logic3037) {
        let val = UtilObjPool.Pop (Logic3037StatusHook._t, apply);
        val.relMachine = relLogic;
        return val;
    }

    /**
     * 相对位置 x
     */
    relX: number;
    /**
     * 相对位置 y
     */
    relY: number;

    /**
     * 伤害允许
     */
    dmgAbleCount: number;
    /**
     * 挂靠时间限制
     */
    hookMSLimit: number;

    OnEnter(): void {
        this.dmgAbleCount = this.relMachine.args.dmgAbleCount;
        this.hookMSLimit = this.relMachine.args.hookMSLimit;
        this.relMachine.relBody.commonBody.b2Body.SetGravityScale (0);
        this.relX = this.relMachine.relBody.commonBody.b2Body.GetPosition().x - this.relMachine.hookTarget.commonBody.b2Body.GetPosition().x;
        this.relY = this.relMachine.relBody.commonBody.b2Body.GetPosition().y - this.relMachine.hookTarget.commonBody.b2Body.GetPosition().y;
    }

    /**
     * 用于设置的位置
     */
    pos = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);

    OnStep(ms: number): void {
        this.hookMSLimit -= ms;
        // 没有剩余时间了
        if (this.hookMSLimit <= 0) {
            this.relMachine.relBody.relState.RemEle(this.relMachine.relBody);
            return;
        };

        // 挂靠单位非法
        if (!this.relMachine.hookTarget.isValid) {
            this.relMachine.relBody.relState.RemEle(this.relMachine.relBody);
            return;
        };

        this.pos.x = this.relMachine.hookTarget.commonBody.b2Body.GetPosition().x + this.relX;
        this.pos.y = this.relMachine.hookTarget.commonBody.b2Body.GetPosition().y + this.relY;
        this.relMachine.relBody.commonBody.b2Body.SetPosition(this.pos);

        for (let i = 0; i < this.relMachine.relBody.listConcatedBodyEnemy.length; i++) {
            let concat = this.relMachine.relBody.listConcatedBodyEnemy [i];
            if (!this.relMachine.relBody.CheckDmgAble (concat)) {
                continue;
            };
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
            );
            GameSizeMarkRS.PlayEffHitByConcat (
                APP,
                concat,
                this.relMachine.relBody.relState,
                this.relMachine.relBody.commonCache.colorMain,
                this.relMachine.relBody.commonArgsCfg.size_mark
            );
            this.dmgAbleCount--;
            if (this.dmgAbleCount == 0) {
                this.relMachine.relBody.relState.RemEle(this.relMachine.relBody);
                return;
            };
        };
    }
}