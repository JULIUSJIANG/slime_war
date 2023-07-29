import GameElement from "../GameElement";
import CfgGameElement from "../../../frame/config/src/CfgGameElement";
import BCEventer from "../../../frame/basic/BCEventer";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import GameElementBodyBehaviourRS from "./GameElementBodyBehaviourRS";
import GameElementBodyBehaviour from "./GameElementBodyBehaviour";
import GameElementMgrBuff from "../buff/GameElementMgrBuff";
import jiang from "../../../frame/global/Jiang";
import indexDataStorageItem from "../../../IndexStorageItem";
import gameCommon from "../../GameCommon";
import GameCtxB2BodyFixtureConcat from "../GameCtxB2BodyFixtureConcat";
import GameCtxB2Body from "../GameCtxB2Body";
import GameElementScene from "../common/GameElementScene";
import GameElementBodyCtxDmg from "./GameElementBodyCtxDmg";
import GameCtxB2BodyFixtureTypeRS from "../GameCtxB2BodyFixtureTypeRS";
import GameElementTxt from "../common/GameElementTxt";
import AnimKeep from "../common/AnimKeep";
import AnimFlash from "../common/AnimFlash";
import GameCD from "../common/GameCD";
import GameSizeMarkRS from "./GameSizeMarkRS";
import CfgCacheGameElement from "../../cfg_cache/CfgCacheGameElement";
import gameMath from "../../GameMath";
import MgrSdk from "../../../frame/sdk/MgrSdk";

const APP = `GameElementBody`;

/**
 * 元素-怪物
 */
class GameElementBody extends GameElement {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<GameElementBody>({
        instantiate: () => {
            return new GameElementBody();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static PopForCall (
        apply: string,

        data: {
            posX: number,
            posY: number,
    
            vecX: number,
            vecY: number,

            cfgId: number, 
            camp: number,

            caller: GameElementBody
        }
    )
    {
        let cfgCallTarget = jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, data.cfgId)._list [0];
        return GameElementBody.Pop (
            apply,

            {
                posX: data.posX,
                posY: data.posY,

                vecX: data.vecX,
                vecY: data.vecY,

                cfgId: data.cfgId,
                camp: data.camp,

                power: ((cfgCallTarget.power == 0 || data.caller.commonArgsCfg.power == 0) ? 1 : cfgCallTarget.power / data.caller.commonArgsCfg.power) * data.caller.commonArgsPower,
                caller: data.caller
            }
        )
    }

    /**
     * 提取
     * @param apply 
     * @param pos 
     * @param vec 
     * @param cfgId 
     * @param camp 
     * @returns 
     */
    static Pop (
        apply: string, 

        data: {
            posX: number,
            posY: number,
    
            vecX: number,
            vecY: number,

            cfgId: number, 
            camp: number,
            power: number,
            caller: GameElementBody
        }
    ) 
    {
        // 怪物配置
        let cfg = jiang.mgrCfg.cfgGameElement.select(CfgGameElement.idGetter, data.cfgId)._list[0];
        // 注册信息
        let rs = GameElementBodyBehaviourRS.instMap.get(cfg.logic);
        // 构造怪物
        let monsterEle = UtilObjPool.Pop(GameElementBody._t, apply);
        monsterEle.commonCaller = data.caller;
        monsterEle.commonArgsPower = data.power;
        monsterEle.commonInfluence = cfg.props_influence_count * monsterEle.commonArgsPower;
        monsterEle.commonArgsCfg = cfg;
        monsterEle.commonCache = CfgCacheGameElement.GetCache (cfg);

        monsterEle.commonArgsInitPos.x = data.posX;
        monsterEle.commonArgsInitPos.y = data.posY == - 1 ? gameCommon.GROUND_Y : data.posY;

        monsterEle.commonArgsInitVec.x = data.vecX;
        monsterEle.commonArgsInitVec.y = data.vecY;

        monsterEle.commonArgsCamp = data.camp;
        monsterEle.commonArgsRs = rs;

        monsterEle.commonFootPos.x = monsterEle.commonArgsInitPos.x;
        monsterEle.commonFootPos.y = monsterEle.commonArgsInitPos.y;
        monsterEle.commonCenterPos.x = monsterEle.commonFootPos.x;
        monsterEle.commonCenterPos.y = monsterEle.commonFootPos.y;
        monsterEle.commonMgrBuff = GameElementMgrBuff.Pop(apply, monsterEle);
        // 时间步进的监听
        let stepListen: number;
        // 初始化
        monsterEle.evterAdded.On(() => {
            stepListen = monsterEle.relState.evterSteped.On((passedMS) => {
                monsterEle.commonEnabledMS += passedMS;
                if (!monsterEle.commonBehaviour) {
                    return;
                };
                monsterEle.commonAnimTipsKeep.currStatus.OnStep (passedMS);
                monsterEle.commonAnimTipsFlash.currStatus.OnStep (passedMS);
                if (monsterEle.commonCD) {
                    monsterEle.commonCD.currStatus.OnStep (passedMS);
                };
                monsterEle.RefreshConcatedData();
                monsterEle.commonBehaviour.OnTimeStep(passedMS);
            });

            if (!monsterEle.commonBehaviour) {
                return;
            };
            monsterEle.commonBehaviour.OnInit();    
        });
        // 治疗 - 有特效
        monsterEle.commonEvterCureWithEff.On ((count) => {
            GameSizeMarkRS.PlayEffCure (
                APP,
                monsterEle
            );
            monsterEle.commonHpCurrent += count;
            monsterEle.commonHpCurrent = Math.min (monsterEle.commonHpCurrent, monsterEle.commonHpMax);
            GameElementTxt.PopForCure (
                APP,
                count,
                monsterEle
            );
        });
        // 受伤
        monsterEle.commonEvterDmg.On((dmgCtx) => {
            if (!monsterEle.commonBehaviour) {
                return;
            };
            monsterEle.commonBehaviour.OnDmg(dmgCtx);
        });
        // 接触 - A
        monsterEle.evterContactGroundA.On((concat) => {
            if (!monsterEle.commonBehaviour) {
                return;
            };
            monsterEle.commonBehaviour.OnConcatA(concat);
        });
        // 接触 -B
        monsterEle.evterContactGroundB.On((concat) => {
            if (!monsterEle.commonBehaviour) {
                return;
            };
            monsterEle.commonBehaviour.OnConcatB(concat);
        });
        // 销毁
        monsterEle.evterRem.On(() => {
            // 非召唤物才可产生掉落
            if (monsterEle.commonCaller == null) {
                for (let i = 0; i < monsterEle.commonCache.listDrop.length; i++) {
                    let structDrop = monsterEle.commonCache.listDrop [i];
                    let able = Math.random() < gameMath.GetDropRate (monsterEle.commonArgsCfg.id);
                    able = able|| gameCommon.ALL_DROP;
                    // 掉落的概率发生
                    if (able) {
                        structDrop.rs.onTrigger (structDrop, monsterEle);
                    };
                };
            };
            monsterEle.relState.evterSteped.Off(stepListen);
            if (monsterEle.commonBehaviour) {
                monsterEle.commonBehaviour.OnDestory();
            };

            // 清除 buff
            monsterEle.commonMgrBuff.Clear();
        });
        // 初始化
        rs.init(monsterEle, CfgCacheGameElement.GetCache(monsterEle.commonArgsCfg).logicArgs);
        // 返回怪物
        return monsterEle;
    }

    /**
     * 行为 id
     */
    commonActionId: number = 0;
    /**
     * 动画管理 - 提示维持
     */
    commonAnimTipsKeep: AnimKeep = AnimKeep.Pop (APP, 100, 100);
    /**
     * 动画管理 - 提示闪烁
     */
    commonAnimTipsFlash: AnimFlash = AnimFlash.Pop (APP, 200, 600);
    /**
     * 技能冷却
     */
    commonCD: GameCD;

    /**
     * 模型配置
     */
    commonArgsCfg: CfgGameElement;
    /**
     * 缓存内容
     */
    commonCache: CfgCacheGameElement;
    /**
     * 初始位置
     */
    commonArgsInitPos: cc.Vec2 = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
    /**
     * 初始速度
     */
    commonArgsInitVec: cc.Vec2 = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
    /**
     * 阵营
     */
    commonArgsCamp: number;
    /**
     * 逻辑
     */
    commonArgsRs: GameElementBodyBehaviourRS<any>;
    /**
     * 当前动画
     */
    commonAnim: string;

    /**
     * buff 管理器
     */
    commonMgrBuff: GameElementMgrBuff;
    /**
     * 通用 2d 物体
     */
    commonBody: GameCtxB2Body<GameElement>;
    /**
     * 自身当前位置
     */
    commonFootPos = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
    /**
     * 中心位置
     */
    commonCenterPos = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
    /**
     * 头顶位置
     */
    commonHeadPos = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
    /**
     * 最大生命
     */
    commonHpMax = 0;
    /**
     * 当前生命
     */
    commonHpCurrent = 0;
    /**
     * 表现
     */
    commonBehaviour: GameElementBodyBehaviour;
    /**
     * 自身的时间倍率
     */
    commonTimeScaleSelf = 1;
    /**
     * 已显示的时间
     */
    commonEnabledMS = 0;
    /**
     * 强度
     */
    commonArgsPower = 1;
    /**
     * 造成影响
     */
    commonInfluence = 1;

    /**
     * 事件派发 - 治疗 - 有特效
     */
    commonEvterCureWithEff: BCEventer <number> = BCEventer.Pop(APP);
    /**
     * 事件派发 - 受伤
     */
    commonEvterDmg: BCEventer<GameElementBodyCtxDmg> = BCEventer.Pop(APP);
    /**
     * 护盾值
     */
    commonShield: number = 0;
    /**
     * 召唤者
     */
    commonCaller: GameElementBody;

    /**
     * 获取自身的物理标识符
     * @returns 
     */
    GetPhysicsTag(): Function {
        return GameElementBody;
    }

    /**
     * 身体接触到的敌方单位
     */
    listConcatedBodyEnemy: Array<GameCtxB2BodyFixtureConcat> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
    /**
     * 身体接触到的敌方单位 - 仅考虑 body，不考虑 bullet
     */
    listConcatedBodyEnemyNoBullet: Array<GameCtxB2BodyFixtureConcat> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
    /**
     * 身体接触到的友方单位
     */
    listConcatedBodyFriend: Array<GameCtxB2BodyFixtureConcat> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
    /**
     * 身体接触到的友方单位 - 仅考虑 body，不考虑 bullet
     */
    listConcatedBodyFriendNoBullet: Array<GameCtxB2BodyFixtureConcat> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
    /**
     * 探测到的地面
     */
    listConcatedGround: Array<GameCtxB2BodyFixtureConcat> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 与地面接触
     * @returns 
     */
    IsConcatWithGround () {
        for (let i = 0; i < this.listConcatedGround.length; i++) {
            let concat = this.listConcatedGround[i];
            if (
                concat.fixtureSelf.type != GameCtxB2BodyFixtureTypeRS.AREA
                && this.commonBody != null 
                && this.commonBody.b2Body.GetLinearVelocity().y <= 0
            ) 
            {
                return true;
            };
        };
        return false;
    }

    /**
     * 查找命中了的目标
     * @param type 
     * @param list 
     */
    RefreshConcatedData () {
        this.listConcatedBodyEnemy.length = 0;
        this.listConcatedBodyEnemyNoBullet.length = 0;

        this.listConcatedBodyFriend.length = 0;
        this.listConcatedBodyFriendNoBullet.length = 0;

        this.listConcatedGround.length = 0;

        // 查找目标内容
        for (let i = 0; i < this.listBodyCtx.length; i++) {
            let bodyCtx = this.listBodyCtx[i];
            for (let j = 0; j < bodyCtx.listFixtureCtx.length; j++) {
                let fixCtx = bodyCtx.listFixtureCtx[j];
                for (let k = 0; k < fixCtx.listConcat.length; k++) {
                    let concat = fixCtx.listConcat[k];

                    // 参与碰撞的另一方已被回收
                    if (concat.relFixture.relBody == null) {
                        continue;
                    };

                    // 获取参与碰撞的另一方
                    let ele = concat.relFixture.relBody.relEle;

                    // 身体接触了的敌方单位
                    if (
                            ele.isValid
                        &&  ele instanceof GameElementBody
                        &&  ele.commonArgsCamp != this.commonArgsCamp
                    ) 
                    {
                        this.listConcatedBodyEnemy.push (concat);

                        if (concat.relFixture.type != GameCtxB2BodyFixtureTypeRS.BODY_BULLET) {
                            this.listConcatedBodyEnemyNoBullet.push (concat);
                        };
                    };

                    // 身体接触了的友方单位
                    if (
                        ele.isValid
                        &&  ele instanceof GameElementBody
                        &&  ele.commonArgsCamp == this.commonArgsCamp
                    ) 
                    {
                        this.listConcatedBodyFriend.push(concat);

                        if (concat.relFixture.type != GameCtxB2BodyFixtureTypeRS.BODY_BULLET) {
                            this.listConcatedBodyFriendNoBullet.push (concat);
                        };
                    };

                    // 对地面的探查
                    if (
                            ele.isValid
                        &&  ele instanceof GameElementScene
                    ) 
                    {
                        this.listConcatedGround.push(concat);
                    };
                };
            };
        };
    }

    /**
     * 已伤害的目标记录
     */
    private _setDmgedTargetId = UtilObjPool.Pop (UtilObjPool.typeSet, APP);
    /**
     * 清除伤害记录
     */
    ClearDmgRecord () {
        this._setDmgedTargetId.clear ();
    }
    
    /**
     * 检查是否能够伤害
     * @param ele 
     * @returns 
     */
    CheckDmgAble (concat: GameCtxB2BodyFixtureConcat) {
        if (!concat.CheckValid ()) {
            return false;
        };
        let ele = concat.relFixture.relBody.relEle as GameElementBody;
        if (this._setDmgedTargetId.has (ele.id)) {
            return false;
        };
        if (ele.commonCaller && this._setDmgedTargetId.has (ele.commonCaller.id)) {
            return false;
        };
        return true;
    }

    /**
     * 进行伤害
     * @param ele 
     * @param ctx 
     * @returns 
     */
    CauseDmg (concat: GameCtxB2BodyFixtureConcat, ctx: GameElementBodyCtxDmg) {
        if (!this.CheckDmgAble (concat)) {
            return;
        };
        let ele = concat.relFixture.relBody.relEle as GameElementBody;
        this._setDmgedTargetId.add (ele.id);
        ele.commonEvterDmg.Call (ctx);
    }

    /**
     * 身体停止
     * @returns 
     */
    BodyStop () {
        if (!this.commonBody) {
            return;
        };
        let vec = UtilObjPool.Pop (UtilObjPool.typeccVec2, APP);
        this.commonBody.b2Body.SetLinearVelocity (vec);
    }

    /**
     * 已经释放
     */
    isReleased: boolean = false;

    /**
     * 释放
     */
    Release(): void {
        this.isReleased = true;
        super.Release ();
    }
}

namespace GameElementBody {
    /**
     * 动画名-待机
     */
    export const ANIM_IDLE = "anim_idle";
    /**
     * 动画名-行为
     */
    export const ANIM_ACTION = "anim_action";
    /**
     * 动画名-站立
     */
    export const ANIM_WALK = "anim_walk";
}

export default GameElementBody;