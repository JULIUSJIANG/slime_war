import { b2BodyType } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import GameDisplayMonster009 from "../../../display/GameDisplayBody009";
import GameCtxB2BodyFixtureTypeRS from "../../GameCtxB2BodyFixtureTypeRS";
import GameElementBody from "../GameElementBody";
import GameElementBodyBehaviour from "../GameElementBodyBehaviour";
import GameElementBodyBehaviourRS from "../GameElementBodyBehaviourRS";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3044Args from "./Logic3044Args";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import GameElementEff from "../../common/GameElementEff";
import GameDisplayBody016 from "../../../display/GameDisplayBody016";
import GameDisplayBody018 from "../../../display/GameDisplayBody018";
import utilString from "../../../../frame/basic/UtilString";
import GameElementPart from "../../common/GameElementPart";
import GameSizeMarkRS from "../GameSizeMarkRS";

const APP = `Logic3044`;

/**
 * 刀光 + 地面震撼波
 */
class Logic3044 extends GameElementBodyBehaviour {
    /**
     * 参数
     */
    public args: Logic3044Args;

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3044>({
        instantiate: () => {
            return new Logic3044();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, ge: GameElementBody, args: Logic3044Args) {
        let val = UtilObjPool.Pop (Logic3044._t, apply);
        val.relBody = ge;
        val.args = args;
        return val;
    }

    public OnInit(): void {
        this.relBody.commonFootPos.x = this.relBody.relState.player.commonFootPos.x;
        this.relBody.commonFootPos.y = this.relBody.relState.player.commonFootPos.y;
        this.relBody.commonArgsInitVec.x = 0;
        this.relBody.commonArgsInitVec.y = 1;

        this._lifeLess = this.args.keep;
        this.relBody.commonHpMax = 0;
        this.relBody.commonHpCurrent = 0;

        const npcBD = UtilObjPool.Pop(UtilObjPool.typeBodyDef, APP);
        npcBD.type = b2BodyType.b2_dynamicBody;
        npcBD.position.x = this.relBody.commonFootPos.x * jiang.mgrUI._sizePerPixel;
        npcBD.position.y = this.relBody.commonFootPos.y * jiang.mgrUI._sizePerPixel;
        npcBD.gravityScale = this.relBody.commonArgsCfg.gravity_scale;
        this.relBody.commonBody = this.relBody.BodyCreate(
            APP,
            npcBD
        );
        this.relBody.commonBody.b2Body.SetFixedRotation(true);
        this.relBody.commonBody.b2Body.SetAngle(Math.atan2(this.relBody.commonArgsInitVec.y, this.relBody.commonArgsInitVec.x));

        const npcFD = UtilObjPool.Pop(UtilObjPool.typeFixtureDef, APP);
        let polygonShape = UtilObjPool.Pop (UtilObjPool.typePolygonShape, APP);
        let arr: Array<cc.Vec2> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
        arr.push (UtilObjPool.Pop (UtilObjPool.typeccVec2, APP));
        for (let x = 0; x <= 1; x += 0.25) {
            let y = -((2 * (x - 0.5)) ** 2) + 1;
            y = Math.sqrt(y);
            let pos: cc.Vec2 = UtilObjPool.Pop (UtilObjPool.typeccVec2, APP);
            pos.x = y * this.args.height * jiang.mgrUI._sizePerPixel;
            pos.y = (x - 0.5) * this.args.width * jiang.mgrUI._sizePerPixel;
            arr.push (pos);
        };
        arr.reverse();
        polygonShape.Set(arr);
        npcFD.shape = polygonShape;
        this.relBody.commonBody.FixtureCreate(APP, npcFD, GameCtxB2BodyFixtureTypeRS.AREA_SWORD);

        GameElementPart.BoomForBody (
            APP,
            this.relBody.relState,
            this.relBody.commonCache.colorMain,
            this.args.width / 4,
            this.relBody.commonFootPos.x,
            this.relBody.commonFootPos.y,
            0,
            -1
        );
    }

    /**
     * 用于填充坐标的复用对象
     */
    posToSet = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);

    /**
     * 留存时间
     */
    private _lifeLess: number;

    public OnTimeStep(passedMS: number): void {
        for (let i = 0; i < this.relBody.listConcatedBodyEnemy.length; i++) {
            let concat = this.relBody.listConcatedBodyEnemy[i];
            if (!this.relBody.CheckDmgAble (concat)) {
                continue;
            };
            GameSizeMarkRS.PlayEffHitByConcat (
                APP,
                concat,
                this.relBody.relState,
                this.relBody.commonCache.colorMain,
                this.relBody.commonArgsCfg.size_mark
            );
            this.relBody.CauseDmg (
                concat,
                GameElementBodyCtxDmg.Pop(
                    APP,
                    {
                        dmg: this.relBody.commonInfluence,
                        posX: concat.position.x,
                        posY: concat.position.y,
    
                        repel: this.relBody.commonArgsCfg.props_repel,
                        norX: concat.normal.x,
                        norY: concat.normal.y,

                        type: GameElementBodyCtxDmgType.equipment
                    }
                )
            );
        };

        this._lifeLess -= passedMS;
        // 时间到了的话，自动销毁
        if (this._lifeLess <= 0) {
            this.relBody.relState.RemEle(this.relBody);
        };
    }

    public OnDestory(): void {
        this.relBody.BodyDestory(this.relBody.commonBody);
    }
}

namespace Logic3044 {
    export const rs = GameElementBodyBehaviourRS.Pop<Logic3044Args>(
        APP,
        {
            logicCode: 3044,
            cfgToArgs: (cfg) => {
                return {
                    width: Number.parseFloat (cfg.prop_0),
                    height: Number.parseFloat (cfg.prop_1),
                    keep: utilString.ParseStrToNum (cfg.prop_2)
                };
            },
            init: (ge, t) => {
                ge.commonBehaviour = Logic3044.Pop(APP, ge, t);
            },
            instDisplay: (state, ge, displayList) => {
                switch (ge.commonArgsCfg.style_code) {
                    case 1018: {
                        displayList.push (GameDisplayBody018.GetNodeTypeForAtk(ge.commonArgsCfg).CreateNode(
                            state,
                            ge.id,
                            ge.id
                        ));
                        break;
                    };
                    default: {
                        displayList.push (GameDisplayBody016.GetNodeTypeForAtk(ge.commonArgsCfg).CreateNode(
                            state,
                            ge.id,
                            ge.id
                        ));
                        break;
                    };
                };
            },
            boardDisplay: null,
            atkGetter: (cfg, t) => {
                return 0;
            },
            hpGetter: (cfg, t) => {
                return 0;
            },
            sizeGetter: (t) => {
                return 0;
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
    );
}

export default Logic3044;