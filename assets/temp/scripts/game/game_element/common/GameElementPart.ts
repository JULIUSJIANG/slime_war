import jiang from "../../../frame/global/Jiang";
import { b2Body, b2BodyDef, b2BodyType, b2CircleShape, b2FixtureDef } from "../../../../box2d_ts/Box2D";
import GameElement from "../GameElement";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import GameCtxB2Body from "../GameCtxB2Body";
import GameCtxB2BodyFixtureTypeRS from "../GameCtxB2BodyFixtureTypeRS";
import UINodeType from "../../../frame/ui/UINodeType";
import GameDisplayPart from "../../display/GameDisplayPart";
import GamePlayViewState from "../../view/game_play/GamePlayViewState";
import GameState from "../GameState";
import GameElementBody from "../body/GameElementBody";

const APP = `GameElementPart`;

/**
 * 数据注册信息
 */
interface DataInfo {
    /**
     * 节点类型
     */
    nodeType: UINodeType<GameDisplayPart, GamePlayViewState, number>,
    /**
     * 半径
     */
    radius: number,
    /**
     * 体积
     */
    volume: number,
}

/**
 * 数据注册信息的集合
 */
let listDataInfo: DataInfo[] = [
    // {
    //     nodeType: GameDisplayPart.nodeType101,
    //     radius: 1,
    //     volume: 0
    // },
    {
        nodeType: GameDisplayPart.nodeType202,
        radius: 2,
        volume: 0
    },
    {
        nodeType: GameDisplayPart.nodeType203,
        radius: 3,
        volume: 0
    },
    {
        nodeType: GameDisplayPart.nodeType204,
        radius: 4,
        volume: 0
    },
    {
        nodeType: GameDisplayPart.nodeType205,
        radius: 5,
        volume: 0
    },
    {
        nodeType: GameDisplayPart.nodeType206,
        radius: 6,
        volume: 0
    },
    {
        nodeType: GameDisplayPart.nodeType207,
        radius: 7,
        volume: 0
    },
    {
        nodeType: GameDisplayPart.nodeType208,
        radius: 8,
        volume: 0
    },
    {
        nodeType: GameDisplayPart.nodeType209,
        radius: 9,
        volume: 0
    },
    {
        nodeType: GameDisplayPart.nodeType210,
        radius: 10,
        volume: 0
    }
];

// 初始化体积
for (let i = 0; i < listDataInfo.length; i++) {
    let dataInfo = listDataInfo[i];
    dataInfo.volume = Math.PI * dataInfo.radius ** 2;
};

// 粒子速度
const PARTICLE_SPEED = 640 / 1000 / 2;

// 重力缩放
const GRAVITY_SCALE = 0.5;

// 最长持续时间
const MAX_MS = 1000;

// 偏正比率
const ANGLE_FIX_RATE = 0.7;

/**
 * 元素 - 碎块
 */
export default class GameElementPart extends GameElement {
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<GameElementPart>({
        instantiate: () => {
            return new GameElementPart();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });
    
    /**
     * 在某个位置引起碎块
     * @param color 
     * @param volume 
     * @param centerPosX 
     * @param centerPosY 
     */
    static BoomForBody (
        apply: string,
        gameState: GameState,
        color: cc.Color,
        radius: number,
        centerPosX: number,
        centerPosY: number,
        dirX: number,
        dirY: number
    )
    {
        let volume = Math.PI * (radius ** 2);
        let angle = Math.atan2(-dirY, -dirX);
        if (angle < - Math.PI / 2) {
            angle += Math.PI * 2;
        };
        if (angle < Math.PI / 2) {
            angle = (Math.PI / 2 - angle) * ANGLE_FIX_RATE + angle;
        }
        else {
            angle = (angle - Math.PI / 2) * (1 - ANGLE_FIX_RATE) + Math.PI / 2;
        };

        let volumeInit = volume;
        // 从大到小生成小球
        for (let i = listDataInfo.length - 1; 0 <= i; i--) {
            let dataInfo = listDataInfo[i];
            // 太大块的话不好看
            if (volumeInit / 3 < dataInfo.volume) {
                continue;
            };
            let count = volume / dataInfo.volume;
            count = Math.floor(count);
            // 同一尺寸最多 3 个
            count = Math.min(count, 3);
            // 无可拥有数量，忽略
            if (count <= 0) {
                continue;
            };
            volume -= count * dataInfo.volume;
            let angleUnit = 2 * Math.PI / count;
            // 按照可以囊括的数量
            for (let j = 0; j < count; j++) {
                // 均匀分布的关键角
                let angleTick = Math.PI / 2 + j * angleUnit;
                let posX = centerPosX + Math.cos(angleTick) * dataInfo.radius;
                let posY = centerPosY + Math.sin(angleTick) * dataInfo.radius;
                let randomAngle = angle + (Math.random() - 0.5) * 2 / 6 * Math.PI;
                gameState.AddEle(GameElementPart.Pop(
                    apply,

                    posX,
                    posY,

                    Math.cos(randomAngle) * PARTICLE_SPEED,
                    Math.sin(randomAngle) * PARTICLE_SPEED,

                    color,
                    dataInfo.nodeType,
                    MAX_MS,
                    GRAVITY_SCALE
                ));
            };
        };
    }

    /**
     * 在某个位置引起碎块
     * @param color 
     * @param volume 
     * @param centerPosX 
     * @param centerPosY 
     */
    static BoomForHorse (
        apply: string,
        gameState: GameState,
        color: cc.Color,
        radius: number,
        centerPosX: number,
        centerPosY: number,
        dirX: number,
        dirY: number,

        particleSpeed: number,
        msKeep: number,
        gravityScale: number
    )
    {
        let volume = Math.PI * (radius ** 2);
        let angle = Math.atan2(dirY, dirX);

        let volumeInit = volume;
        // 从大到小生成小球
        for (let i = listDataInfo.length - 1; 0 <= i; i--) {
            let dataInfo = listDataInfo[i];
            // 太大块的话不好看
            if (volumeInit / 3 < dataInfo.volume) {
                continue;
            };
            let count = volume / dataInfo.volume;
            count = Math.floor(count);
            // 同一尺寸最多 3 个
            count = Math.min(count, 2);
            // 无可拥有数量，忽略
            if (count <= 0) {
                continue;
            };
            volume -= count * dataInfo.volume;
            let angleUnit = 2 * Math.PI / count;
            // 按照可以囊括的数量
            for (let j = 0; j < count; j++) {
                // 均匀分布的关键角
                let angleTick = Math.PI / 2 + j * angleUnit;
                let posX = centerPosX + Math.cos(angleTick) * dataInfo.radius;
                let posY = centerPosY + Math.sin(angleTick) * dataInfo.radius;
                let randomAngle = angle + (Math.random() - 0.5) * 2 / 6 * Math.PI;
                gameState.AddEle(GameElementPart.Pop(
                    apply,

                    posX,
                    posY,

                    Math.cos(randomAngle) * particleSpeed,
                    Math.sin(randomAngle) * particleSpeed,

                    color,
                    dataInfo.nodeType,
                    msKeep,
                    gravityScale
                ));
            };
        };
    }

    static Pop (
        apply: string,

        initPosX: number,
        initPosY: number,

        initSpeedX: number,
        initSpeedY: number,

        color: cc.Color,
        nodeType: UINodeType<GameDisplayPart, GamePlayViewState, number>,
        lifeMS: number,
        gravityScale: number
    ) 
    {
        let val = UtilObjPool.Pop(GameElementPart._t, apply);

        val.currPos.x = initPosX;
        val.currPos.y = initPosY;
        val.currSpeed.x = initSpeedX;
        val.currSpeed.y = initSpeedY;

        val.opacity = color.a;
        color.a = 255;
        val.color = color;
        val.nodeType = nodeType;
        val.maxLifeMS = lifeMS;
        val.evterAdded.On(() => {
            val.rrListenIdStep = val.relState.evterSteped.On((ms) => {
                val.currPos.x += val.currSpeed.x * ms;
                val.currPos.y += val.currSpeed.y * ms;
                val.currSpeed.y += val.relState.b2Gravity * gravityScale / jiang.mgrUI._sizePerPixel * ms / 1000 / 1000;
                val.totalMS += ms;
                if (val.maxLifeMS < val.totalMS) {
                    val.relState.RemEle(val);
                    return;
                };
            });
        });

        val.evterRem.On(() => {
            val.relState.evterSteped.Off( val.rrListenIdStep );
        });
        return val;
    }
    
    GetPhysicsTag(): Function {
        return GameElementPart;
    }

    /**
     * 时间步进的监听
     */
    private rrListenIdStep: number;

    /**
     * 释放占用的空间
     */
    override Release(): void {
        this.Clear();
        
        this.rrListenIdStep = 0;
        this.currPos.x = 0;
        this.currPos.y = 0;
        this.color = null;
        this.maxLifeMS = null;
        this.totalMS = 0;

        UtilObjPool.Push(this);
    }

    /**
     * 当前位置
     */
    currPos: cc.Vec2 = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
    /**
     * 当前速度
     */
    currSpeed: cc.Vec2 = UtilObjPool.Pop (UtilObjPool.typeccVec2, APP);
    /**
     * 不透明度
     */
    opacity: number;
    /**
     * 颜色
     */
    color: cc.Color;
    /**
     * 最大留存时间
     */
    maxLifeMS;
    /**
     * 累计留存时间
     */
    totalMS = 0;
    /**
     * 可视化对应的节点类型
     */
    nodeType: UINodeType<GameDisplayPart, GamePlayViewState, number>;
}