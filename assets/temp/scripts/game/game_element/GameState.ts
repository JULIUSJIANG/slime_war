import { b2Body, b2BodyDef, b2Contact, b2ContactImpulse, b2Manifold, b2ParticleBodyContact, b2ParticleContact, b2ParticleSystem, b2World, b2WorldManifold } from "../../../box2d_ts/Box2D";
import GameElementPart from "./common/GameElementPart";
import GameElement from "./GameElement";
import GameElementScene from "./common/GameElementScene";
import EquipmentInstRS from "./equipment/EquipmentInstRS";
import GameElementBody from "./body/GameElementBody";
import jiang from "../../frame/global/Jiang";
import BCEventer from "../../frame/basic/BCEventer";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import BCCounter from "../../frame/basic/BCCounter";
import GameCtxB2BodyFixture from "./GameCtxB2BodyFixture";
import GameCtxB2BodyFixtureConcat from "./GameCtxB2BodyFixtureConcat";
import GameCtxB2BodyFixtureTypeRS from "./GameCtxB2BodyFixtureTypeRS";
import GameStatePhyAbleRSRec from "./GameStatePhyAbleRSRec";
import gameCommon from "../GameCommon";
import GameElementParticleRainMgr from "./particle/GameElementParticleRainMgr";
import GameElementParticleSnowMgr from "./particle/GameElementParticleSnowMgr";
import GameStateReward from "./GameStateReward";
import CfgScene from "../../frame/config/src/CfgScene";
import CfgCacheScene from "../cfg_cache/CfgCacheScene";

const APP = `GameState`;

/**
 * 游戏状态
 */
class GameState {
    
    private constructor () {}

    private static _t = new UtilObjPoolType<GameState>({
        instantiate: () => {
            return new GameState();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    /**
     * 场景数据的缓存
     */
    public cfgSceneCache: CfgCacheScene;

    /**
     * 掉落缩放
     */
    public dropScale: number;

    /**
     * 
     * @param apply 
     * @param idCfgScene 
     * @returns 
     */
    static Pop (apply: string, idCfgScene: number, dropScale: number) { 
        let val = UtilObjPool.Pop(GameState._t, apply);
        val.dropScale = dropScale;
        let cfgScene = jiang.mgrCfg.cfgScene.select (CfgScene.idGetter, idCfgScene)._list [0];
        let cfgSceneCache = CfgCacheScene.GetCache (cfgScene);
        val.cfgSceneCache = cfgSceneCache;

        // 设置重力
        val.b2Gravity = - jiang.mgrUI._containerUI.height * jiang.mgrUI._sizePerPixel * 2;

        // 物理世界
        val.b2w = UtilObjPool.PopB2World(
            0,
            val.b2Gravity
        );

        // 信息管理器
        let b2wm = UtilObjPool.Pop(UtilObjPool.typeB2WorldManifold, APP);
        val.b2w.SetContactListener({
            BeginContact: (contact: b2Contact) => {

            },
            EndContact: (contact: b2Contact) => {
    
            },
            BeginContactFixtureParticle: (system: b2ParticleSystem, contact: b2ParticleBodyContact) => {
    
            },
            EndContactFixtureParticle: (system: b2ParticleSystem, contact: b2ParticleBodyContact) => {
    
            },
            BeginContactParticleParticle: (system: b2ParticleSystem, contact: b2ParticleContact) => {
    
            },
            EndContactParticleParticle: (system: b2ParticleSystem, contact: b2ParticleContact) => {
    
            },
            PreSolve: (contact: b2Contact, oldManifold: b2Manifold) => {
                // 形状 A
                let fixA = contact.GetFixtureA();
                let fixABody = fixA.GetBody();
                let fixARec = fixA[GameCtxB2BodyFixture.SYM_REC] as GameCtxB2BodyFixture;
                let fixAEle = fixARec.relBody.relEle;

                // 形状 B
                let fixB = contact.GetFixtureB();
                let fixBBody = fixB.GetBody();
                let fixBRec = fixB[GameCtxB2BodyFixture.SYM_REC] as GameCtxB2BodyFixture;
                let fixBEle = fixBRec.relBody.relEle;
                
                // 获取碰撞信息
                contact.GetWorldManifold(b2wm);

                // 碰撞点
                let p = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
                p.x = b2wm.points[0].x / jiang.mgrUI._sizePerPixel;
                p.y = b2wm.points[0].y / jiang.mgrUI._sizePerPixel;

                // 法线
                let n = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
                n.x = b2wm.normal.x;
                n.y = b2wm.normal.y;

                // 如果 b 是 body，a 要把 b 记录下来
                if (fixARec.type.recAbleCheck(fixBRec.type)) {
                    // A 需要的上下文
                    let fixARecCtx = GameCtxB2BodyFixtureConcat.Pop(
                        APP,
                        fixARec,
                        fixBRec,

                        p.x,
                        p.y,

                        n.x,
                        n.y
                    );
                    // A 把它记录下来
                    fixARec.listConcat.push(fixARecCtx);
                };

                // 如果 a 是 body，b 要把 a 记录下来
                if (fixBRec.type.recAbleCheck(fixARec.type)) {
                    // B 需要的上下文
                    let fixBRecCtx = GameCtxB2BodyFixtureConcat.Pop(
                        APP,
                        fixBRec,
                        fixARec,

                        p.x,
                        p.y,

                        -n.x,
                        -n.y
                    );
                    // B 把它记录下来
                    fixBRec.listConcat.push(fixBRecCtx);
                };

                // 回收
                UtilObjPool.Push(p);
                UtilObjPool.Push(n);

                // 设置物理许可
                contact.SetEnabled(
                    (fixAEle instanceof GameElementScene && fixBRec.type.phyAble && fixBBody.GetLinearVelocity().y <= 0)
                    ||
                    (fixBEle instanceof GameElementScene && fixARec.type.phyAble && fixABody.GetLinearVelocity().y <= 0)
                );

                // B 与地面发生交互
                if (fixAEle instanceof(GameElementScene) && fixBRec.type.phyAble && fixBBody.GetLinearVelocity().y <= 0) {
                    fixBEle.evterContactGroundB.Call(contact);
                };
                // A 与地面发生交互
                if (fixBEle instanceof(GameElementScene) && fixARec.type.phyAble && fixABody.GetLinearVelocity().y <= 0) {
                    fixAEle.evterContactGroundA.Call(contact);
                };
            },
            PostSolve: (contact: b2Contact, impulse: b2ContactImpulse) => {
    
            }
        });
        
        // 实例化降雨器
        val.mgrRain = GameElementParticleRainMgr.Pop(APP, val);
        // 实例化降雪器
        val.mgrSnow = GameElementParticleSnowMgr.Pop(APP, val);
        return val;
    }
    
    /**
     * 重力，单位：米 / 秒的平方
     */
    b2Gravity: number;

    /**
     * 难度
     */
    cycle: number;

    /**
     * 元素标识
     */
    private genId = 0;

    /**
     * 当前的元素列表
     */
    private dataEleMap: Map<{prototype: GameElement}, Array<GameElement>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 标识到实例的记录
     */
    private idToEleMap: Map<number, GameElement> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 降雨管理器
     */
    mgrRain: GameElementParticleRainMgr;
    /**
     * 降雪管理器
     */
    mgrSnow: GameElementParticleSnowMgr;

    /**
     * 世界
     */
    b2w: b2World;

    /**
     * 动画要求计数器
     */
    counterAnimNeed: BCCounter = BCCounter.Pop(APP);

    /**
     * 事件派发-已经更新
     */
    evterSteped: BCEventer<number> = BCEventer.Pop(APP);

    /**
     * 玩家
     */
    player: GameElementBody;

    /**
     * 列表 - 当前奖励
     */
    listRewardIdCfg: Array<GameStateReward> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 已推进的时间
     */
    msSteped: number = 0;

    /**
     * 获取 id
     * @returns 
     */
    private GetId () {
        return ++this.genId;
    }
 
    /**
     * 添加元素
     * @param ele 
     */
    AddEle (ele: GameElement) {
        if (!this.dataEleMap.has(ele.constructor)) {
            this.dataEleMap.set(ele.constructor, UtilObjPool.Pop(UtilObjPool.typeArray, APP));
        };
        if (0 <= this.dataEleMap.get(ele.constructor).indexOf(ele)) {
            return;
        };
        ele.relState = this;
        ele.id = this.GetId();
        this.dataEleMap.get(ele.constructor).push(ele);
        this.idToEleMap.set(ele.id, ele);
        ele.evterAdded.Call(null);
    }

    /**
     * 移除元素
     * @param ele 
     * @returns 
     */
    RemEle (ele: GameElement) {
        if (!this.dataEleMap.has(ele.constructor)) {
            return;
        };
        let index = this.dataEleMap.get(ele.constructor).indexOf(ele);
        if (index < 0) {
            return;
        };
        this.dataEleMap.get(ele.constructor).splice(index, 1);
        this.idToEleMap.delete(ele.id);
        ele.isValid = false;
        ele.evterRem.Call(null);
        // 释放内存
        ele.Release();
    }

    /**
     * 获取某个类型集合
     * @param eleType 
     * @returns 
     */
    GetTypeAllEle<T extends GameElement> (eleType: {prototype: T}): Array<T> {
        if (!this.dataEleMap.has(eleType)) {
            this.dataEleMap.set(eleType, UtilObjPool.Pop(UtilObjPool.typeArray, APP));
        };
        return this.dataEleMap.get(eleType) as Array<T>;
    }

    /**
     * 获取实例
     * @param id 
     * @returns 
     */
    GetEleById<T extends GameElement> (id: number): T {
        return this.idToEleMap.get(id) as T;
    }

    /**
     * 时间推进
     * @param ms 
     */
    StepMS (
        ms: number
    )
    {
        if (gameCommon.PHY_STEP_MAX < ms) {
            ms = gameCommon.PHY_STEP_MAX;
        };

        this.msSteped += ms;
        // 步进之前，清空记录
        this.idToEleMap.forEach((val, index) =>{
            for (let i = 0; i < val.listBodyCtx.length; i++) {
                let bodyCtx = val.listBodyCtx[i];
                for (let j = 0; j < bodyCtx.listFixtureCtx.length; j++) {
                    let fixCtx = bodyCtx.listFixtureCtx[j];
                    for (let k = 0; k < fixCtx.listConcat.length; k++) {
                        let concatCtx = fixCtx.listConcat[k];
                        UtilObjPool.Push(concatCtx);
                    };
                    fixCtx.listConcat.length = 0;
                };
            };
        });

        // 要推进的时间
        let phyStepMSCount = ms / 1000;
        this.b2w.Step(phyStepMSCount, 1, 1, 1);

        // 帧事件派发，该接口作为推动一切的接口
        this.evterSteped.Call (ms);
    }

    /**
     * 时间缩放
     */
    _timeScale: number = 1;

    /**
     * 应用 id
     */
    private _appId: number = 0;

    /**
     * 应用 id 到应用值的映射
     */
    private _appIdToValMap: Map<number, number> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 应用全局时间缩放
     * @param timeScale 
     */
    ApplyTimeScale (
        timeScale: number
    )
    {
        let appId = this._appId++;
        this._appIdToValMap.set(appId, timeScale);
        this.RecalTimeScale();
        return appId;
    }

    /**
     * 取消全局时间缩放
     * @param appId 
     */
    CancelTimeScale (
        appId: number
    )
    {
        if (!this._appIdToValMap.has(appId)) {
            return;
        };
        this._appIdToValMap.delete(appId);
        this.RecalTimeScale();
    }

    /**
     * 重算时间缩放
     */
    private RecalTimeScale () {
        this._timeScale = 1;
        this._appIdToValMap.forEach((val) => {
            this._timeScale *= val;
        });
    }

    /**
     * 释放占用的资源
     */
    Release () {
        this.idToEleMap.forEach((val, index) =>{
            val.Release();
        });
    }

    /**
     * 获取某配表 id 单位的数量
     */
    GetIdCfgCount (idCfg: number) {
        let count = 0;
        let list = this.GetTypeAllEle (GameElementBody);
        for (let i = 0; i < list.length; i++) {
            let ele = list [i];
            if (idCfg != ele.commonArgsCfg.id) {
                continue;
            };
            count++;
        };
        return count;
    }
}

export default GameState;