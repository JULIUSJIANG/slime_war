import UtilObjPool from "../../basic/UtilObjPool";
import { b2AABB, b2Body, b2Controller, b2Joint, b2ParticleSystem, b2Shape, b2Vec2, b2World, b2WorldManifold } from "../../../../box2d_ts/Box2D";
import GraphicsDrawer from "../graphics_drawer/GraphicsDrawer";
import B2ControllerRS from "./B2ControllerRS";
import b2EleSetting from "./B2EleSetting";
import B2JointRS from "./B2JointRS";
import B2ShapeRS from "./B2ShapeRS";
import UtilObjPoolType from "../../basic/UtilObjPoolType";

const APP = `B2ElementRS`;

/**
 * 形状的记录
 */
class ShapeRecord {
    /**
     * 具体形状
     */
    shape: b2Shape;
    /**
     * 归属的身体
     */
    body: b2Body;
}

/**
 * 类型 - 形状记录
 */
const typeShapeRecord = new UtilObjPoolType({
    instantiate: () => {
        return new ShapeRecord();
    },
    onPop: (t) => {

    },
    onPush: (t) => {

    },
    tag: `ShapeRecord`
});

/**
 * b2 世界元素注册信息
 */
class B2ElementRS<T>{
    
    private constructor () {}

    private static _t = new UtilObjPoolType<B2ElementRS<any>>({
        instantiate: () => {
            return new B2ElementRS();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop<T> (
        apply: string,
        drawAbleTag: number,
        arrayGetter: (b2W: b2World, listT: Array<T>) => Array<T>,
        tDrawer: (t: T, gd: GraphicsDrawer) => void
    ) 
    {
        let val = UtilObjPool.Pop(B2ElementRS._t, apply);
        val.drawAbleTag = drawAbleTag;
        val.arrayGetter = arrayGetter;
        val.tDrawer = tDrawer;

        B2ElementRS.eleDrawFuncList.push(( b2w, gd, drawDag ) => {
            if (!(drawDag & drawAbleTag)) {
                return;
            };
            let list = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
            arrayGetter(b2w, list);
            list.forEach(( ele ) => {
                tDrawer(ele, gd);
            });
            UtilObjPool.Push(list);
        });
        return val;
    }

    /**
     * 绘制列表
     */
    static eleDrawFuncList: Array<(b2w: b2World, gd: GraphicsDrawer, drawTag: number) => void> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 表示绘制许可的标签
     */
    drawAbleTag: number;

    /**
     * 从 b2 world 提取目标集合的方法
     */
    arrayGetter: (b2W: b2World, listT: Array<T>) => Array<T>;

    /**
     * 具体的绘制方法
     */
    tDrawer: (t: T, gd: GraphicsDrawer) => void;
}

namespace B2ElementRS {
    /**
     * 关节
     */
    export const joint = B2ElementRS.Pop<b2Joint>(
        APP,
        2**0,
        (b2w, list) => {
            for (let j = b2w.GetJointList(); j; j = j.GetNext()) {
                list.push(j);
            };
            return list;
        },
        (joint, gd) => {
            if (joint == null) {
                return;
            };
            let bodyA = joint.GetBodyA();
            let bodyB = joint.GetBodyB();
            const xf1 = bodyA.m_xf;
            const xf2 = bodyB.m_xf;
            const x1 = xf1.p;
            const x2 = xf2.p;
            const p1 = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            joint.GetAnchorA(p1);
            const p2 = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            joint.GetAnchorB(p2);

            if (B2JointRS._instMap.has(joint.m_type)) {
                B2JointRS._instMap.get(joint.m_type).drawer(
                    joint,
                    p1,
                    p2,
                    gd
                );
            }
            else {
                gd.StraightLine(
                    x1.x,
                    x1.y,
                    p1.x,
                    p1.y,
                    gd.Pixel(b2EleSetting.lineWidth),
                    b2EleSetting.color.joint.areaBegin
                );
                gd.StraightLine(
                    p1.x,
                    p1.y, 
                    p2.x,
                    p2.y,
                    gd.Pixel(b2EleSetting.lineWidth),
                    b2EleSetting.color.joint.areaBegin
                );
                gd.StraightLine(
                    x2.x,
                    x2.y, 
                    p2.x,
                    p2.y,
                    gd.Pixel(b2EleSetting.lineWidth),
                    b2EleSetting.color.joint.areaEnd
                );
            };
            UtilObjPool.Push(p1);
            UtilObjPool.Push(p2);
        }
    );

    /**
     * 物体中心
     */
    export const bodyTransform = B2ElementRS.Pop<b2Body>(
        APP,
        2**1,
        (b2w, list) => {
            for (let b = b2w.GetBodyList(); b; b = b.GetNext()) {
                list.push(b);
            };
            return list;
        },
        (bd, gd) => {
            let xAxis = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            bd.GetWorldPoint(b2EleSetting.xAxis, xAxis);
            let yAxis = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            bd.GetWorldPoint(b2EleSetting.yAxis, yAxis);
            let posO = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            bd.GetWorldPoint(b2EleSetting.posO, posO);
            gd.StraightLine(
                posO.x,
                posO.y,
                xAxis.x,
                xAxis.y,
                gd.Pixel(b2EleSetting.lineWidth),
                b2EleSetting.color.transform.xColor
            );
            gd.StraightLine(
                posO.x,
                posO.y,
                yAxis.x,
                yAxis.y,
                gd.Pixel(b2EleSetting.lineWidth),
                b2EleSetting.color.transform.yColor
            );

            UtilObjPool.Push(xAxis);
            UtilObjPool.Push(yAxis);
            UtilObjPool.Push(posO);
        }
    );
    
    /**
     * 碰撞盒
     */
    export const aabb = B2ElementRS.Pop<b2AABB>(
        APP,
        2**2,
        (b2w, list) => {
            for (let b = b2w.GetBodyList(); b; b = b.GetNext()) {
                for (let f = b.GetFixtureList(); f; f = f.GetNext()) {
                    for (let i = 0; i < f.m_proxyCount; i++) {
                        let proxy = f.m_proxies[i];
                        list.push(proxy.treeNode.aabb);
                    };
                };
            };
            return list;
        },
        (aabb, gd) => {
            let coll = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

            let p0 = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            p0.Set(aabb.lowerBound.x, aabb.lowerBound.y);
            coll.push(p0);

            let p1 = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            p1.Set(aabb.upperBound.x, aabb.lowerBound.y);
            coll.push(p1);

            let p2 = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            p2.Set(aabb.upperBound.x, aabb.upperBound.y);
            coll.push(p2);

            let p3 = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            p3.Set(aabb.lowerBound.x, aabb.upperBound.y);
            coll.push(p3);

            gd.CyclePosSetAll(
                coll,
                gd.Pixel(b2EleSetting.lineWidth),
                b2EleSetting.color.aabb
            );

            for (let i = 0; i < coll.length; i++) {
                UtilObjPool.Push(coll[i])
            };

            UtilObjPool.Push(coll);
        }
    );

    /**
     * 形状
     */
    export const shape = B2ElementRS.Pop<ShapeRecord>(
        APP,
        2**3,
        (b2w, list) => {
            for (let b = b2w.GetBodyList(); b; b = b.GetNext()) {
                for (let f = b.GetFixtureList(); f; f = f.GetNext()) {
                    var shapeRecord = UtilObjPool.Pop(typeShapeRecord, APP);
                    shapeRecord.shape = f.GetShape();
                    shapeRecord.body = b;
                    list.push(shapeRecord);
                };
            };
            return list;
        },
        (ctx, gd) => {
            if (B2ShapeRS._mapInst.has(ctx.shape.m_type)) {
                B2ShapeRS._mapInst.get(ctx.shape.m_type).drawer(ctx.shape, ctx.body, gd);
            };
            UtilObjPool.Push(ctx);
        }
    );

    /**
     * 粒子
     */
    export const particle = B2ElementRS.Pop<b2ParticleSystem>(
        APP,
        2**4,
        (b2w, list) => {
            for (let b2p = b2w.GetParticleSystemList(); b2p; b2p = b2p.GetNext()) {
                list.push(b2p);
            };
            return list;
        },
        (b2p, gd) => {
            let radius = b2p.GetRadius();
            let pCount = b2p.GetParticleCount();
            let pBuff = b2p.GetPositionBuffer();
            for (let i = 0; i < pCount; i++) {
                let pos = pBuff[i];
                gd.RoundFill(
                    pos.x,
                    pos.y,
                    radius,
                    b2EleSetting.color.particle.fill
                );
                gd.RoundLine(
                    pos.x,
                    pos.y,
                    radius,
                    gd.Pixel(b2EleSetting.lineWidth),
                    b2EleSetting.color.particle.fill
                );
            };
        }
    );

    /**
     * 约束器
     */
    export const controller = B2ElementRS.Pop<b2Controller>(
        APP,
        2**5,
        (b2w, list) => {
            for (let b2c = b2w.m_controllerList; b2c; b2c = b2c.GetNext()) {
                list.push(b2c);
            };
            return list;
        },
        (b2c, gd) => {
            if (!B2ControllerRS._mapInst.has(b2c.constructor)) {
                return;
            };
            B2ControllerRS._mapInst.get(b2c.constructor).drawer(b2c, gd);
        }
    );

    
    /**
     * 碰撞点
     */
     export const contact = B2ElementRS.Pop<b2Vec2>(
        APP,
        2**6,
        (b2w, list) => {
            let b2wm = UtilObjPool.Pop(UtilObjPool.typeB2WorldManifold, APP);
            for (let b2c = b2w.GetContactManager().m_contactList; b2c; b2c = b2c.GetNext()) {
                b2c.GetWorldManifold(b2wm);
                list.push(...b2wm.points);
            };
            UtilObjPool.Push(b2wm)
            return list;
        },
        (point, gd) => {
            gd.RoundFill(
                point.x,
                point.y,
                gd.Pixel(b2EleSetting.dotRadius),
                b2EleSetting.color.contactPoint.dot
            );
        }
    );
}

export default B2ElementRS;