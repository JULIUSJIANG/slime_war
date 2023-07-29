import UtilObjPool from "../../basic/UtilObjPool";
import { b2Body, b2ChainShape, b2CircleShape, b2EdgeShape, b2PolygonShape, b2Shape, b2ShapeType, b2Vec2 } from "../../../../box2d_ts/Box2D";
import GraphicsDrawer from "../graphics_drawer/GraphicsDrawer";
import b2EleSetting from "./B2EleSetting";
import UtilObjPoolType from "../../basic/UtilObjPoolType";

const APP = `B2ShapeRS`;

/**
 * 形状的注册信息
 */
class B2ShapeRS<T extends b2Shape> {

    private constructor () {}

    private static _t = new UtilObjPoolType<B2ShapeRS<any>>({
        instantiate: () => {
            return new B2ShapeRS();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop<T extends b2Shape> (
        apply: string,
        type: b2ShapeType,
        drawer: (shape: T, body: b2Body, gd: GraphicsDrawer) => void
    ) 
    {
        let val = UtilObjPool.Pop(B2ShapeRS._t, apply);
        val.type = type;
        val.drawer = drawer;

        B2ShapeRS._mapInst.set(type, val);
        return val;
    }
    
    /**
     * 形状的类型
     */
    type: b2ShapeType;

    /**
     * 具体的绘制方法
     */
    drawer: (shape: T, body: b2Body, gd: GraphicsDrawer) => void
}

namespace B2ShapeRS {
    /**
     * 实例记录
     */
    export const _mapInst: Map<b2ShapeType, B2ShapeRS<any>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 圆
     */
    export const circle = B2ShapeRS.Pop<b2CircleShape>(
        APP,
        b2ShapeType.e_circleShape,
        (shape, body, gd) => {
            const center = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            body.GetWorldPoint(shape.m_p, center);
            const radius = shape.m_radius;
            gd.RoundFill(
                center.x, 
                center.y, 
                radius, 
                b2EleSetting.color.shape.body
            );
            gd.RoundLine(
                center.x, 
                center.y, 
                radius, 
                gd.Pixel(b2EleSetting.lineWidth), 
                b2EleSetting.color.shape.outline
            );
            UtilObjPool.Push(center);
        }
    );

    /**
     * 边界
     */
    export const edge = B2ShapeRS.Pop<b2EdgeShape>(
        APP,
        b2ShapeType.e_edgeShape,
        (shape, body, gd) => {
            const v1 = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            body.GetWorldPoint( shape.m_vertex1, UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP));
            const v2 = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            body.GetWorldPoint( shape.m_vertex2, UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP));
            gd.StraightLine(
                v1.x, 
                v1.y, 
                v2.x, 
                v2.y, 
                gd.Pixel(b2EleSetting.lineWidth),
                b2EleSetting.color.shape.outline
            );
            UtilObjPool.Push(v1);
            UtilObjPool.Push(v2);
        }
    );

    /**
     * 锁链
     */
    export const chain = B2ShapeRS.Pop<b2ChainShape>(
        APP,
        b2ShapeType.e_chainShape,
        (shape, body, gd) => {
            const count = shape.m_count;
            const vertices: Array<b2Vec2> = shape.m_vertices;
            let v1 = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP)
            body.GetWorldPoint( vertices[0], v1);
            gd.RoundFill(
                v1.x, 
                v1.y, 
                gd.Pixel(b2EleSetting.dotRadius), 
                b2EleSetting.color.shape.outline
            );

            if (shape.m_hasPrevVertex) {
                const vp = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
                body.GetWorldPoint( shape.m_prevVertex, vp);
                gd.StraightLine(
                    vp.x,
                    vp.y,
                    v1.x,
                    v1.y,
                    gd.Pixel(b2EleSetting.lineWidth),
                    b2EleSetting.color.shape.outline
                );
                gd.RoundFill(
                    vp.x,
                    vp.y,
                    gd.Pixel(b2EleSetting.dotRadius),
                    b2EleSetting.color.shape.outline
                );
                UtilObjPool.Push(vp);
            };

            for (let i = 1; i < count; i++) {
                const v2 = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
                body.GetWorldPoint( vertices[i], v2);
                gd.StraightLine(
                    v1.x,
                    v1.y,
                    v2.x,
                    v2.y,
                    gd.Pixel(b2EleSetting.lineWidth),
                    b2EleSetting.color.shape.outline
                );
                gd.RoundFill(
                    v2.x,
                    v2.y,
                    gd.Pixel(b2EleSetting.dotRadius),
                    b2EleSetting.color.shape.outline
                );
                v1.Set(v2.x, v2.y);
                UtilObjPool.Push(v2);
            };

            if (shape.m_hasNextVertex) {
                const vn = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
                body.GetWorldPoint( shape.m_nextVertex, vn);
                gd.StraightLine(
                    vn.x,
                    vn.y,
                    v1.x, 
                    v1.y,
                    gd.Pixel(b2EleSetting.lineWidth),
                    b2EleSetting.color.shape.outline
                );
                gd.RoundFill(
                    vn.x,
                    vn.y,
                    gd.Pixel(b2EleSetting.dotRadius),
                    b2EleSetting.color.shape.outline
                );
                UtilObjPool.Push(vn);
            };
            UtilObjPool.Push(v1);
        }
    );

    /**
     * 多边形
     */
    export const polygon = B2ShapeRS.Pop<b2PolygonShape>(
        APP,
        b2ShapeType.e_polygonShape,
        (shape, body, gd) => {
            const vertices = shape.m_vertices;
            let arr: Array<b2Vec2> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
            for (let i = 0; i < shape.m_count; i++) {
                let pos = vertices[i];
                arr.push(body.GetWorldPoint(pos, UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP)));
            };
            gd.FillPosSetAll(
                arr,
                b2EleSetting.color.shape.body
            );
            gd.CyclePosSetAll(
                arr,
                gd.Pixel(b2EleSetting.lineWidth),
                b2EleSetting.color.shape.outline
            );
            for (let i = 0; i < arr.length; i++) {
                UtilObjPool.Push(arr[i]);
            };
            UtilObjPool.Push(arr);
        }
    );
}

export default B2ShapeRS;