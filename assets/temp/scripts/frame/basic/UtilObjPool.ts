import { b2Body, b2BodyDef, b2BodyType, b2CircleShape, b2EdgeShape, b2FixtureDef, b2JointDef, b2Mat33, b2MouseJointDef, b2PolygonShape, b2Shape, b2Vec2, b2Vec3, b2World, b2WorldManifold } from "../../../box2d_ts/Box2D";
import UtilObjPoolType from "./UtilObjPoolType";

const SYM_POP_TYPE = Symbol(`UtilObjPool.Pop.Type`);
const SYM_POP_APP = Symbol(`UtilObjPool.Pop.App`);
namespace UtilObjPool {
    /**
     * 应用的对象占有量
     */
    export const mapAppRefCount: Map<string, Map<UtilObjPoolType<any>, number>> = new Map();

    /**
     * 提取
     * @param type 
     */
    export function Pop<T> (type: UtilObjPoolType<T>, apply: string): T {
        // 过滤掉非法调用
        if (type == null || apply == null) {
            return null;
        };

        if (!mapAppRefCount.has(apply)) {
            mapAppRefCount.set(apply, new Map());
        };
        if (!mapAppRefCount.get(apply).has(type)) {
            mapAppRefCount.get(apply).set(type, 0);
        };
        mapAppRefCount.get(apply).set(type, mapAppRefCount.get(apply).get(type) + 1);

        let t: T;
        if (type._coll.length == 0) {
            t = type.instantiate();
            type.instantiatedCount++;
            t[SYM_POP_TYPE] = type;
        }
        else {
            t = type._coll.pop();
        };
        t[SYM_POP_APP] = apply;
        type.onPop(t);
        return t;
    }

    /**
     * 销毁
     * @param t 
     * @returns 
     */
    export function Push<T> (t: T) {
        if (t == null) {
            return;
        };

        // 过滤掉非法调用
        let type = t[SYM_POP_TYPE] as UtilObjPoolType<T>;
        if (type == null) {
            return;
        };

        // 防止重复回收
        let apply = t[SYM_POP_APP] as string;
        if (apply == null) {
            return;
        };
        t[SYM_POP_APP] = null;
        if (!mapAppRefCount.has(apply)) {
            mapAppRefCount.set(apply, new Map());
        };
        if (!mapAppRefCount.get(apply).has(type)) {
            mapAppRefCount.get(apply).set(type, 0);
        };
        mapAppRefCount.get(apply).set(type, mapAppRefCount.get(apply).get(type) - 1);

        type._coll.push(t);
        type.onPush(t);
    }

    /**
     * 类型 - 物理库 2 维向量
     */
    export const typeccVec2 = new UtilObjPoolType({
        instantiate: () => {
            return new cc.Vec2();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            t.x = 0;
            t.y = 0;
        },
        tag: `cc.Vec2`
    });

    /**
     * 类型 - 物理库 2 维向量
     */
    export const typeB2Vec2 = new UtilObjPoolType({
        instantiate: () => {
            return new b2Vec2();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            t.x = 0;
            t.y = 0;
        },
        tag: `b2Vec2`
    });

    /**
     * 物理库 3 维向量
     */
    export const typeB2Vec3 = new UtilObjPoolType({
        instantiate: () => {
            return new b2Vec3();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: `b2Vec3`
    });

    /**
     * 物理库 3 维向量
     */
    export const typeB2Mat33 = new UtilObjPoolType({
        instantiate: () => {
            return new b2Mat33();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: `b2Mat33`
    });

    /**
     * 类型 - 数组
     */
    export const typeArray = new UtilObjPoolType({
        instantiate: () => {
            return new Array();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            t.length = 0;
        },
        tag: `Array`
    });

    /**
     * 类型 - 映射
     */
    export const typeMap = new UtilObjPoolType({
        instantiate: () => {
            return new Map();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            t.clear();
        },
        tag: `Map`
    });

    /**
     * 类型 - 集合
     */
    export const typeSet = new UtilObjPoolType({
        instantiate: () => {
            return new Set<any>();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            t.clear();
        },
        tag: `Set`
    });

    /**
     * 类型 - 世界信息
     */
    export const typeB2WorldManifold = new UtilObjPoolType({
        instantiate: () => {
            return new b2WorldManifold();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: `b2WorldManifold`
    });

    /**
     * 类型 - 刚体参数
     */
    export const typeBodyDef = new UtilObjPoolType({
        instantiate: () => {
            return new b2BodyDef();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            t.type = b2BodyType.b2_staticBody;
            t.position.x = 0;
            t.position.y = 0;
        },
        tag: `b2BodyDef`
    });

    /**
     * 类型 - 形状参数
     */
    export const typeFixtureDef = new UtilObjPoolType({
        instantiate: () => {
            return new b2FixtureDef();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            t.shape = null;
        },
        tag: `b2FixtureDef`
    });

    /**
     * 类型 - 圆形
     */
    export const typeCircleShape = new UtilObjPoolType({
        instantiate: () => {
            return new b2CircleShape();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: `b2CircleShape`
    });

    /**
     * 类型 - 多边形
     */
    export const typePolygonShape = new UtilObjPoolType({
        instantiate: () => {
            return new b2PolygonShape();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: `b2PolygonShape`
    });

    /**
     * 类型 - 鼠标约束
     */
    export const typeB2MouseJointDef = new UtilObjPoolType({
        instantiate: () => {
            return new b2MouseJointDef();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: `b2MouseJointDef`
    });

    /**
     * 类型 - 边缘约束
     */
    export const typeB2EdgeShape = new UtilObjPoolType({
        instantiate: () => {
            return new b2EdgeShape();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: `b2EdgeShape`
    });

    /**
     * 类型 - cocos 图片
     */
    export const typeCCSpriteFrame = new UtilObjPoolType({
        instantiate: () => {
            return new cc.SpriteFrame();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: `cc.SpriteFrame`
    });

    /**
     * 类型 - cocos 颜色
     */
    const typeCCColor = new UtilObjPoolType({
        instantiate: () => {
            return new cc.Color();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: `cc.Color`
    });

    /**
     * 提取 cocos 颜色
     * @param apply 
     * @param r 
     * @param g 
     * @param b 
     * @param a 
     * @returns 
     */
    export function PopCCColor (apply: string, r: number, g: number, b: number, a: number) {
        let val = Pop(typeCCColor, apply);
        val.r = r;
        val.g = g;
        val.b = b;
        val.a = a;
        return val;
    }

    /**
     * 提取异步对象
     * @param act 
     */
    export function PopPromise<T> (apply: string, act: (resolve: (ctx: T) => void, reject: (ctx: T) => void) => void) {
        return new Promise(act);
    }

    /**
     * 提取 2d 世界
     * @param x 
     * @param y 
     * @returns 
     */
    export function PopB2World (x: number, y: number) {
        return new b2World({
            x,
            y
        });
    }
}

export default UtilObjPool;