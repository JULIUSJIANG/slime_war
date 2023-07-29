import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType"

const APP = `LotteryViewBubble`

/**
 * 乐透界面气泡的核心数据
 */
export default class LotteryViewBubbleData {

    private constructor () {}

    private static _t = new UtilObjPoolType <LotteryViewBubbleData> ({
        instantiate: () => {
            return new LotteryViewBubbleData ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, angle: number, msTotal: number, idLottery: number) {
        let val = UtilObjPool.Pop (LotteryViewBubbleData._t, apply);
        val.angle = angle;
        val.msTotal += msTotal;
        val.idLottery = idLottery;
        return val;
    }

    /**
     * 已经推进了的时间
     */
    public msSteped = 0;
    /**
     * 总时间
     */
    public msTotal = 0;
    /**
     * 奖励的配表 id
     */
    public idLottery;
    /**
     * 角度
     */
    public angle: number;
    /**
     * 当前位置
     */
    public pos = UtilObjPool.Pop (UtilObjPool.typeccVec2, APP);
    /**
     * 总进度
     */
    public rate = 0;
    /**
     * 
     * @param ms 
     */
    public onStep (ms: number) {
        this.msSteped += ms;
        this.msSteped = Math.min (this.msSteped, this.msTotal);
        this.rate = this.msSteped / this.msTotal;
    }
}