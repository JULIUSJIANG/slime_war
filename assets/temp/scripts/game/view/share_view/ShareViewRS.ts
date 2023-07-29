import UtilObjPool from "../../../frame/basic/UtilObjPool";

const APP = `ShareViewRS`;

/**
 * 奖励类型的注册信息
 */
class ShareViewRS {

    /**
     * 物品的配表 id
     */
    public idProp: number;

    /**
     * 图片 id
     */
    public imgId: string;

    /**
     * 图片地址
     */
    public imgUrl: string;

    public constructor (args: {
        idProp: number,
        imgId: string,
        imgUrl: string
    }) 
    {
        this.idProp = args.idProp;
        this.imgId = args.imgId;
        this.imgUrl = args.imgUrl;
        ShareViewRS.listShareViewRS.push (this);
    }
}

namespace ShareViewRS {
    /**
     * 所有类型的集合
     */
    export const listShareViewRS: Array <ShareViewRS> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

    /**
     * 红水晶
     */
    export const heart = new ShareViewRS ({
        idProp: 10002,
        imgId: `2aC63Du6SQSkbKF3HUnbXA==`,
        imgUrl: `https://mmocgame.qpic.cn/wechatgame/1iagYwZj3s9VMIcQzCTZAkZp0qR75objq9LYYnu51VLPkMgbPHlejNAvn5AYmTJTX/0`
    });

    /**
     * 蓝水晶
     */
    export const star = new ShareViewRS ({
        idProp: 10003,
        imgId: `o8Tr4tmBRnizesvAt9OEZg==`,
        imgUrl: `https://mmocgame.qpic.cn/wechatgame/1iagYwZj3s9VUcYNzmibWRtyfIumPutpE6DNlIibUatj8mrgCkoFKVicjJCzgibWclcxC/0`
    });
}

export default ShareViewRS;