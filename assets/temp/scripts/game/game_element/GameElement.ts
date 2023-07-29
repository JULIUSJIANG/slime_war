import { b2BodyDef, b2Contact } from "../../../box2d_ts/Box2D";
import BCEventer from "../../frame/basic/BCEventer";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import GameCtxB2Body from "./GameCtxB2Body";
import GameCtxB2BodyFixtureConcat from "./GameCtxB2BodyFixtureConcat";
import GameState from "./GameState";

const APP = `GameElement`;

/**
 * 游戏内元素
 */
export default abstract class GameElement {
    /**
     * 是合法的
     */
    isValid: boolean = true;

    /**
     * 归属的核心
     */
    relState: GameState;
    /**
     * 全局标识
     */
    id: number;

    /**
     * 事件派发-初始化
     */
    evterAdded = BCEventer.Pop(APP)
    /**
     * 事件派发-释放
     */
    evterRem = BCEventer.Pop(APP);
    /**
     * 事件派发-地面接触 a
     */
    evterContactGroundA = BCEventer.Pop<b2Contact>(APP);
    /**
     * 事件派发-地面接触 b
     */
    evterContactGroundB = BCEventer.Pop<b2Contact>(APP);
    /**
     * 获取物理类型的标记
     * @returns 
     */
    GetPhysicsTag (): Function {
        return GameElement;
    }

    /**
     * 物体上下文的记录
     */
    listBodyCtx: Array<GameCtxB2Body<GameElement>> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 构造物体
     * @param bd 
     */
    BodyCreate (apply: string, bd: b2BodyDef) {
        let body = GameCtxB2Body.Pop(
            apply,
            this,
            bd
        );
        this.listBodyCtx.push(body);
        return body;
    }
    
    /**
     * 销毁物体
     * @param body 
     */
    BodyDestory (body: GameCtxB2Body<GameElement>) {
        for (let i = 0; i < body.listFixtureCtx.length; i++) {
            let ctxFix = body.listFixtureCtx [i];
            body.b2Body.DestroyFixture (ctxFix.b2Fixture);
        };
        this.relState.b2w.DestroyBody(body.b2Body);
    }

    /**
     * 释放
     */
    Release () {
        UtilObjPool.Push(this.evterAdded);
        UtilObjPool.Push(this.evterRem);
        UtilObjPool.Push(this.evterContactGroundA);
        UtilObjPool.Push(this.evterContactGroundB);

        for (let i = 0; i < this.listBodyCtx.length; i++) {
            let ctxBody = this.listBodyCtx[i];
            for (let j = 0; j < ctxBody.listFixtureCtx.length; j++) {
                let ctxBodyFixture = ctxBody.listFixtureCtx[j];
                for (let k = 0; k < ctxBodyFixture.listConcat.length; k++) {
                    let ctxBodyFixtureConcat = ctxBodyFixture.listConcat[k];
                    UtilObjPool.Push(ctxBodyFixtureConcat);
                };
                UtilObjPool.Push(ctxBodyFixture);
            };
            UtilObjPool.Push(ctxBody);
        };
        UtilObjPool.Push(this.listBodyCtx);
    }

    /**
     * 回归到最原始状态
     */
    Clear () {
        this.isValid = true;
        this.relState = null;
        this.id = null;
        this.evterAdded.Clear();
        this.evterRem.Clear();
        this.evterContactGroundA.Clear();
        this.evterContactGroundB.Clear();

        for (let i = 0; i < this.listBodyCtx.length; i++) {
            let ctxBody = this.listBodyCtx[i];
            for (let j = 0; j < ctxBody.listFixtureCtx.length; j++) {
                let ctxBodyFixture = ctxBody.listFixtureCtx[j];
                for (let k = 0; k < ctxBodyFixture.listConcat.length; k++) {
                    let ctxBodyFixtureConcat = ctxBodyFixture.listConcat[k];
                    UtilObjPool.Push(ctxBodyFixtureConcat);
                };
                UtilObjPool.Push(ctxBodyFixture);
            };
            UtilObjPool.Push(ctxBody);
        };
        this.listBodyCtx.length = 0;
    }
}