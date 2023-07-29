import { b2Body, b2BodyDef, b2BodyType, b2Fixture, b2MouseJoint, b2MouseJointDef, b2Vec2, b2World } from "../../../../box2d_ts/Box2D";
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";

const APP = `B2DrableWorld`;

/**
 * 可拖拽的世界
 */
export default class B2DrableWorld {

    private constructor () {}

    private static _t = new UtilObjPoolType<B2DrableWorld>({
        instantiate: () => {
            return new B2DrableWorld();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (
        apply: string,
        b2w: b2World
    ) 
    {
        let val = UtilObjPool.Pop(B2DrableWorld._t, apply);
        val._b2w = b2w;

        const bodyDef = UtilObjPool.Pop(UtilObjPool.typeBodyDef, APP);
        val._ground = val._b2w.CreateBody( bodyDef );
        return val;
    }

    /**
     * 物理世界
     */
    _b2w: b2World;

    /**
     * 刚性地板
     */
    _ground: b2Body;

    /**
     * 鼠标约束
     */
    _mouseJoint: b2MouseJoint;

    /**
     * 鼠标按下
     * @param p 
     */
     MouseDown (p: b2Vec2) {
        let hit_fixture: b2Fixture;
        this._b2w.QueryPointAABB(p, (fixture: b2Fixture) => {
            const body = fixture.GetBody();
            if (body.GetType() === b2BodyType.b2_dynamicBody) {
                const inside = fixture.TestPoint(p);
                if (inside) {
                    hit_fixture = fixture;
                    return false;
                };
            };
            return true;
        });

        if (hit_fixture) {
            const body = hit_fixture.GetBody();
            const md: b2MouseJointDef = UtilObjPool.Pop(UtilObjPool.typeB2MouseJointDef, APP);
            md.bodyA = this._ground;
            md.bodyB = body;
            md.target.Copy(p);
            md.maxForce = 1000 * body.GetMass();
            this._mouseJoint = this._b2w.CreateJoint(md);
            body.SetAwake(true);
        };
    }

    /**
     * 鼠标移动
     * @param p 
     */
    MouseMove (p: b2Vec2) {
        if (this._mouseJoint) {
            this._mouseJoint.SetTarget(p);
        };
    }

    /**
     * 鼠标抬起
     * @param p 
     */
    MouseUp (p: b2Vec2) {
        if (this._mouseJoint) {
            this._b2w.DestroyJoint(this._mouseJoint);
            this._mouseJoint = null;
        };
    }
}