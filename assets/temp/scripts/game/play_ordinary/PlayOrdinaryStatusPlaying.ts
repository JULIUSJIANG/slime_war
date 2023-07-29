import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import CfgGameElement from "../../frame/config/src/CfgGameElement";
import jiang from "../../frame/global/Jiang";
import gameCommon from "../GameCommon";
import gameMath from "../GameMath";
import GameElementBody from "../game_element/body/GameElementBody";
import GameElementBodyBehaviourRS from "../game_element/body/GameElementBodyBehaviourRS";
import MBPlayer from "../game_element/body/logic_3031/MBPlayer";
import GuideMgr from "../view/guide_view/GuideMgr";
import PlayOrdinary from "./PlayOrdinary";
import PlayOrdinaryEnemyCall from "./PlayOrdinaryEnemyCall";
import PlayOrdinaryStatus from "./PlayOrdinaryStatus";

const APP = `PlayOrdinaryStatusPlaying`;

let DEBUG_ENEMY = 0;

/**
 * 玩法 - 经典 - 状态 - 正在体验
 */
export default class PlayOrdinaryStatusPlaying extends PlayOrdinaryStatus {

    private constructor () {super();}

    private static _t = new UtilObjPoolType<PlayOrdinaryStatusPlaying>({
        instantiate: () => {
            return new PlayOrdinaryStatusPlaying();
        },
        onPop: (t) => {
         
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMachine: PlayOrdinary) {
        let val = UtilObjPool.Pop(PlayOrdinaryStatusPlaying._t, apply);
        val.relMachine = relMachine;
        return val;
    }

    /**
     * 当前召唤的波次
     */
    enemyCall: PlayOrdinaryEnemyCall;

    public OnStep(ms: number): void {
        this.relMachine.totalPassedMS += ms;

        // 玩家已死亡，失败
        if (this.relMachine.mbPlayer.playerMgrHealth.machine.currStatus == this.relMachine.mbPlayer.playerMgrHealth.machine.statusDeath) {
            this.relMachine.Enter(this.relMachine.statusFailing);
            return;
        };

        // 物理世界时间推进
        this.relMachine.gameState.StepMS(ms);

        // 还有怪物的话，不会触发新的波次
        let listMonster = this.relMachine.gameState.GetTypeAllEle(GameElementBody);
        let enemyCount = 0;
        let enemyCountOrigin = 0;
        listMonster.forEach((ele) => {
            if (ele.commonArgsCamp == 1) {
                return;
            };
            enemyCount++;
            if (ele.commonCaller != null) {
                return;
            };
            enemyCountOrigin++;
        });

        // 超量的话终止
        if (DEBUG_ENEMY != 0 && 1 <= enemyCountOrigin) {
            return;
        };

        // 超量的话终止
        if (gameCommon.COUNT_MONSTER <= enemyCountOrigin) {
            return;
        };

        // 有需要召唤的波次
        if (this.enemyCall != null) {
            // 否则进行召唤检测
            for (let j = 0; j < this.enemyCall.listItem.length;) {
                let enemyCallItem = this.enemyCall.listItem[j];
                // 还未能够触发
                if (0 < enemyCallItem.ms) {
                    enemyCallItem.ms -= ms;
                    j++;
                    continue;
                };

                let mbPlayer = this.relMachine.gameState.player.commonBehaviour as MBPlayer;

                let footPos = Math.max (mbPlayer.relBody.commonFootPos.x, - mbPlayer.args.speed * this.relMachine.totalPassedMS);
                let posX =  footPos 
                            + jiang.mgrUI._containerUI.width / gameCommon.SCENE_SCALE
                            + gameCommon.CAMERA_OFFSET_X / gameCommon.SCENE_SCALE
                            + GameElementBodyBehaviourRS.GetSize(enemyCallItem.idCfg) * 2
                            + enemyCallItem.x;

                let posY = gameCommon.GROUND_Y + enemyCallItem.y

                let cfgMonster = jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, enemyCallItem.idCfg)._list [0];
                let body = GameElementBody.Pop (
                    APP,

                    {
                        posX: posX,
                        posY: posY,
                
                        vecX: 0,
                        vecY: 0,
                
                        cfgId: DEBUG_ENEMY || enemyCallItem.idCfg, 
                        camp: 2,
                        power: this.relMachine.rsInit.getterMonsterPower (this.relMachine.idCfgLev, cfgMonster.id),
                        caller: null
                    }
                );
                this.relMachine.gameState.AddEle(body);

                // 否则删除该召唤单元
                this.enemyCall.listItem.splice(j, 1);
            };
            if (this.enemyCall.listItem.length == 0) {
                this.enemyCall = null;
            };
            return;
        };
        
        if (enemyCount != 0) {
            return;
        };

        // 没有怪物，也没有新波次的话，胜利
        if (this.relMachine.listEnemyCall.length == 0) {
            this.relMachine.Enter(this.relMachine.statusSuccessing);
            return;
        };

        // 进行怪物召唤
        let enemyCall = this.relMachine.listEnemyCall[0];

        // 波次时间未到
        if (0 < enemyCall.ms) {
            enemyCall.ms -= ms;
            return;
        };

        // 后续进行该波次的检测
        this.enemyCall = enemyCall;
        this.relMachine.listEnemyCall.splice(0, 1);   
    }

    public OnPause(): void {
        this.relMachine.Enter(this.relMachine.statusPaused);
    }
}