import { b2BodyType } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementBody from "../GameElementBody";
import GameElementBodyBehaviour from "../GameElementBodyBehaviour";
import GameElementBodyBehaviourRS from "../GameElementBodyBehaviourRS";
import MBPlayer from "../logic_3031/MBPlayer";
import Logic3013Args from "./Logic3013Args";
import GameDisplayMonster000 from "../../../display/GameDisplayBody000";
import GameCtxB2BodyFixtureTypeRS from "../../GameCtxB2BodyFixtureTypeRS";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameElementPart from "../../common/GameElementPart";
import GameElementEff from "../../common/GameElementEff";
import GameDisplayMonster008 from "../../../display/GameDisplayBody008";
import gameCommon from "../../../GameCommon";
import gameMath from "../../../GameMath";

const APP = `Logic3013`;

/**
 * 治愈气团
 */
class Logic3013 extends GameElementBodyBehaviour {
    /**
     * 参数
     */
    public args: Logic3013Args;

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3013>({
        instantiate: () => {
            return new Logic3013();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, ge: GameElementBody, args: Logic3013Args) {
        let val = UtilObjPool.Pop(Logic3013._t, apply);
        val.relBody = ge;
        val.args = args;
        return val;
    }

    private _life: number;

    private _curedSet: Set<number> = UtilObjPool.Pop (UtilObjPool.typeSet, APP);

    public OnInit(): void {
        this._life = this.args.life;
        this.relBody.commonHpMax = 0;
        this.relBody.commonHpCurrent = 0;

        const npcBD = UtilObjPool.Pop(UtilObjPool.typeBodyDef, APP);
        npcBD.type = b2BodyType.b2_dynamicBody;
        npcBD.position.x = this.relBody.commonFootPos.x * jiang.mgrUI._sizePerPixel;
        npcBD.position.y = this.relBody.commonFootPos.y * jiang.mgrUI._sizePerPixel;
        npcBD.gravityScale = 0;
        this.relBody.commonBody = this.relBody.BodyCreate(
            APP,
            npcBD
        );
        this.relBody.commonBody.b2Body.SetFixedRotation(true);

        const npcFDMiddle = UtilObjPool.Pop(UtilObjPool.typeFixtureDef, APP);
        let shapeMiddle = UtilObjPool.Pop(UtilObjPool.typeCircleShape, APP);
        let posMiddle = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
        posMiddle.y = this.args.bodyRadius / 2;
        posMiddle.mulSelf (jiang.mgrUI._sizePerPixel);
        shapeMiddle.Set(
            posMiddle,
            this.args.bodyRadius / 2 * jiang.mgrUI._sizePerPixel
        );
        npcFDMiddle.shape = shapeMiddle;
        this.relBody.commonBody.FixtureCreate(APP, npcFDMiddle, GameCtxB2BodyFixtureTypeRS.AREA);

        const npcFDLeft = UtilObjPool.Pop(UtilObjPool.typeFixtureDef, APP);
        let shapeLeft = UtilObjPool.Pop(UtilObjPool.typeCircleShape, APP);
        let posLeft = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
        posLeft.x = - this.args.bodyRadius / 2;
        posLeft.y = this.args.bodyRadius / 2;
        posLeft.mulSelf (jiang.mgrUI._sizePerPixel);
        shapeLeft.Set(
            posLeft,
            this.args.bodyRadius / 2 * jiang.mgrUI._sizePerPixel
        );
        npcFDLeft.shape = shapeLeft;
        this.relBody.commonBody.FixtureCreate(APP, npcFDLeft, GameCtxB2BodyFixtureTypeRS.AREA);

        const npcFDRight = UtilObjPool.Pop(UtilObjPool.typeFixtureDef, APP);
        let shapeRight = UtilObjPool.Pop(UtilObjPool.typeCircleShape, APP);
        let posRight = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
        posRight.x = this.args.bodyRadius / 2;
        posRight.y = this.args.bodyRadius / 2;
        posRight.mulSelf (jiang.mgrUI._sizePerPixel);
        shapeRight.Set(
            posRight,
            this.args.bodyRadius / 2 * jiang.mgrUI._sizePerPixel
        );
        npcFDRight.shape = shapeRight;
        this.relBody.commonBody.FixtureCreate(APP, npcFDRight, GameCtxB2BodyFixtureTypeRS.AREA);
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        this.relBody.relState.RemEle(this.relBody);
    }

    public OnTimeStep(passedMS: number): void {
        this._life -= passedMS;
        if (this._life < 0) {
            this.relBody.relState.RemEle(this.relBody);
            return;
        };

        this.relBody.commonFootPos.x = this.relBody.commonBody.b2Body.GetPosition().x / jiang.mgrUI._sizePerPixel;
        this.relBody.commonFootPos.y = this.relBody.commonBody.b2Body.GetPosition().y / jiang.mgrUI._sizePerPixel;
        this.relBody.commonCenterPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonCenterPos.y = this.relBody.commonFootPos.y;
        this.relBody.commonHeadPos.x = this.relBody.commonFootPos.x;
        this.relBody.commonHeadPos.y = this.relBody.commonFootPos.y;

        for (let i = 0; i < this.relBody.listConcatedBodyFriendNoBullet.length; i++) {
            let concat =  this.relBody.listConcatedBodyFriendNoBullet [i];
            let ele = concat.relFixture.relBody.relEle as GameElementBody;
            if (this._curedSet.has (ele.id)) {
                continue;
            };
            this._curedSet.add (ele.id);
            ele.commonHpMax += this.args.cureCount * this.relBody.commonArgsPower;
            ele.commonEvterCureWithEff.Call(this.args.cureCount * ele.commonArgsPower);
        };
    }

    public OnDestory(): void {
        this.relBody.BodyDestory(this.relBody.commonBody);
    }
}

namespace Logic3013 {
    export const rs = GameElementBodyBehaviourRS.Pop<Logic3013Args>(
        APP,
        {
            logicCode: 3013,
            cfgToArgs: (cfg) => {
                let t = {
                    bodyRadius: Number.parseFloat (cfg.prop_0),
                    life: Number.parseFloat (cfg.prop_1),
                    cureCount: Number.parseFloat (cfg.lv_inc_2)
                };
                return t;
            },
            init: (ge, t) => {
                ge.commonBehaviour = Logic3013.Pop(APP, ge, t);
            },
            instDisplay: (state, ge, displayList) => {
                displayList.push(GameDisplayMonster008.GetNodeType(ge.commonArgsCfg).CreateNode(
                    state,
                    ge.id,
                    ge.id
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
    );
}

export default Logic3013;