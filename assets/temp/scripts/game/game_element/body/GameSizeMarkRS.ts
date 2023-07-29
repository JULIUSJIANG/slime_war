import UtilObjPool from "../../../frame/basic/UtilObjPool";
import gameCommon from "../../GameCommon";
import VoiceOggViewState from "../../view/voice_ogg/VoiceOggViewState";
import GameCtxB2BodyFixtureConcat from "../GameCtxB2BodyFixtureConcat";
import GameState from "../GameState";
import GameElementEff from "../common/GameElementEff";
import DefineVoice from "./DefineVoice";
import GameElementBody from "./GameElementBody";

const APP = `GameSizeMarkRS`;

/**
 * 尺寸标记
 */
class GameSizeMarkRS {
    /**
     * 配表 id
     */
    idCfg: number;
    /**
     * 治疗效果的配表 id
     */
    effCure: number;
    /**
     * 召唤效果的配表 id
     */
    effCall: number;
    /**
     * 传送效果的配表 id
     */
    effTranslation: number;
    /**
     * 命中效果的配表 id
     */
    effHit: number;

    constructor (
        args: {
            idCfg: number,
            effCure: number,
            effCall: number,
            effTranslation: number,
            effHit: number
        }
    )
    {
        this.idCfg = args.idCfg;
        this.effCure = args.effCure;
        this.effCall = args.effCall;
        this.effTranslation = args.effTranslation;
        this.effHit = args.effHit;
        GameSizeMarkRS.listInst.push (this);
    }
}

namespace GameSizeMarkRS {
    /**
     * 列表形式
     */
    export const listInst: Array<GameSizeMarkRS> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

    /**
     * 尺寸 1
     */
    export const size1 = new GameSizeMarkRS ({
        idCfg: 1,
        effCure: 20001,
        effCall: 30001,
        effTranslation: 50001,
        effHit: 60001
    });
    /**
     * 尺寸 2
     */
    export const size2 = new GameSizeMarkRS ({
        idCfg: 2,
        effCure: 20002,
        effCall: 30002,
        effTranslation: 50002,
        effHit: 60002
    });
    /**
     * 尺寸 3
     */
    export const size3 = new GameSizeMarkRS ({
        idCfg: 3,
        effCure: 20003,
        effCall: 30003,
        effTranslation: 50003,
        effHit: 60003
    });
    /**
     * 尺寸 4
     */
    export const size4 = new GameSizeMarkRS ({
        idCfg: 4,
        effCure: 20004,
        effCall: 30004,
        effTranslation: 50004,
        effHit: 60004
    });

    /**
     * 获取尺寸策略
     * @param size 
     * @returns 
     */
    function GetSizeMark (size: number) {
        let rs: GameSizeMarkRS;
        for (let i = 0; i < listInst.length; i++) {
            let sizeMark = listInst [i];
            if (sizeMark.idCfg <= size || rs == null) {
                rs = sizeMark;
            };
        };
        return rs;
    };

    /**
     * 播放治愈效果
     */
    export function PlayEffCure (
        apply: string,
        ele: GameElementBody
    ) 
    {
        if (!ele) {
            return;
        };
        let rs = GetSizeMark (ele.commonArgsCfg.size_mark);
        if (rs == null) {
            return;
        };
        GameElementEff.PopForXYBind (
            apply,
            ele.commonCenterPos.x,
            ele.commonCenterPos.y,
            0,
            1,
            rs.effCure,
            cc.Color.WHITE,

            ele
        );
    }

    /**
     * 播放召唤效果
     */
    export function PlayEffCall (
        apply: string,
        ele: GameElementBody
    ) 
    {
        if (!ele) {
            return;
        };
        let rs = GetSizeMark (ele.commonArgsCfg.size_mark);
        if (rs == null) {
            return;
        };
        GameElementEff.PopForXYBind (
            apply,
            ele.commonCenterPos.x,
            ele.commonCenterPos.y,
            0,
            1,
            rs.effCall,
            cc.Color.WHITE,

            ele
        );
    }

    /**
     * 播放召唤效果
     */
    export function PlayEffTransition (
        apply: string,
        ele: GameElementBody
    ) 
    {
        if (!ele) {
            return;
        };
        let rs = GetSizeMark (ele.commonArgsCfg.size_mark);
        if (rs == null) {
            return;
        };
        ele.relState.AddEle(GameElementEff.PopForXYStatic (
            apply,
            ele.commonCenterPos.x,
            ele.commonCenterPos.y,
            0,
            1,
            rs.effTranslation,
            cc.Color.WHITE
        ));
    }

    /**
     * 播放命中效果
     */
    export function PlayEffHitByConcat (
        apply: string,
        concat: GameCtxB2BodyFixtureConcat,
        state: GameState,
        colorBody: cc.Color,
        sizeMark: number
    ) 
    {
        let rs = GetSizeMark (sizeMark);
        if (rs == null) {
            return;
        };
        GameElementEff.PopForXYBind (
            apply,
            concat.position.x,
            concat.position.y,
            0,
            1,
            rs.effHit,
            colorBody,
            concat.relFixture.relBody.relEle as GameElementBody
        );
        // state.AddEle(GameElementEff.PopForXYStatic (
        //     apply,
        //     concat.position.x,
        //     concat.position.y,
        //     0,
        //     1,
        //     rs.effHit,
        //     colorBody
        // ));
    }

    /**
     * 播放身体效果
     * @param apply 
     * @param ele 
     * @returns 
     */
    export function PlayEffHitByBody (
        apply: string,
        ele: GameElementBody
    ) 
    {
        let rs = GetSizeMark (ele.commonArgsCfg.size_mark);
        if (rs == null) {
            return;
        };
        ele.relState.AddEle (
            GameElementEff.PopForXYStatic (
                apply,
                ele.commonCenterPos.x,
                ele.commonCenterPos.y,
                0,
                1,
                rs.effHit,
                ele.commonCache.colorMain
            )
        );
    }

    /**
     * 播放身体效果
     * @param apply 
     * @param ele 
     * @returns 
     */
    export function PlayEffHitByBodyForHitGround (
        apply: string,
        ele: GameElementBody
    ) 
    {
        let rs = GetSizeMark (ele.commonArgsCfg.size_mark);
        if (rs == null) {
            return;
        };
        ele.relState.AddEle (
            GameElementEff.PopForXYStatic (
                apply,
                ele.commonCenterPos.x,
                gameCommon.GROUND_Y,
                0,
                1,
                rs.effHit,
                ele.commonCache.colorMain
            )
        );
        VoiceOggViewState.inst.VoiceSet (DefineVoice.HORSE_DIRT_2);
    }
}

export default GameSizeMarkRS;