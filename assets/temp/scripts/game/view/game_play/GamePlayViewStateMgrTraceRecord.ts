import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import UINodeType from "../../../frame/ui/UINodeType";
import gameCommon from "../../GameCommon";

const APP = `GamePlayViewStateTraceRecord`;

const {ccclass, property} = cc._decorator;

/**
 * 轨迹截图记录
 */
@ccclass
class GamePlayViewStateMgrTraceRecord {

    private constructor () {
        
    }

    private static _t = new UtilObjPoolType<GamePlayViewStateMgrTraceRecord>({
        instantiate: () => {
            return new GamePlayViewStateMgrTraceRecord();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    /**
     * 标识
     */
    id: number;

    /**
     * 位置 x
     */
    posX: number;
    /**
     * 位置 y
     */
    posY: number;

    /**
     * 已留存时间
     */
    existedTime: number;
    /**
     * 贴图
     */
    sprf: cc.SpriteFrame;
    /**
     * 宽
     */
    width: number;
    /**
     * 高
     */
    height: number;

    static Pop (
        apply: string,

        id: number,
        posX: number,
        posY: number
    ) 
    {
        let val = UtilObjPool.Pop(GamePlayViewStateMgrTraceRecord._t, apply);
        val.id = id;
        val.posX = posX;
        val.posY = posY;
        val.existedTime = 0;
        val.width = jiang.mgrUI._containerUI.width / gameCommon.SCENE_SCALE * gameCommon.TRACE_SIZE_SCALE;
        val.height = jiang.mgrUI._containerUI.height / gameCommon.SCENE_SCALE * gameCommon.TRACE_SIZE_SCALE;

        let rt = new cc.RenderTexture();
        rt.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR);
        rt.initWithSize(
            Math.ceil( val.width / gameCommon.TRACE_BLUR ), 
            Math.ceil( val.height / gameCommon.TRACE_BLUR ), 
            cc.RenderTexture.DepthStencilFormat.RB_FMT_D24S8
        );
        rt.setPremultiplyAlpha(false);
        val.sprf = new cc.SpriteFrame();
        val.sprf.setTexture(rt);
        return val;
    }
}

namespace GamePlayViewStateMgrTraceRecord {

}

export default GamePlayViewStateMgrTraceRecord;