import CfgEquipmentProps from "../frame/config/src/CfgEquipmentProps";
import CfgGameElement from "../frame/config/src/CfgGameElement";
import jiang from "../frame/global/Jiang";

const APP = `gameCommon`;

namespace gameCommon {
    /**
     * 分组索引
     */
    export const GROUP_IDX_UI = 0;
    /**
     * 分组索引
     */
    export const GROUP_IDX_GUIDE = 13;
    /**
     * 子包名称
     */
    export const SUB_MAIN = `resource_sub`;
    /**
     * 抽奖专用货币
     */
    export const COIN_FOR_LOTTERY = 20001;
    /**
     * 商店专用货币
     */
    export const COIN_FOR_STORE = 20001;
    /**
     * 标准装备
     */
    export const STANDARD_EQUIP = 200001;
    /**
     * 标准的动画时长
     */
    export const STANDARD_ANIM_MS = 600;
    /**
     * 每偏移加大准星的量
     */
    export const MARK_RADIUS_PER_ANGLE = 160 / (Math.PI / 3);
    /**
     * 准星点的间距
     */
    export const MARK_DOT_SPACING = Math.PI / 2;
    /**
     * 准星点的数量
     */
    export const MARK_DOT_COUNT = 4;
    /**
     * 准星点的围绕半径
     */
    export const MARK_TIPS_BASE_RADIUS = 20;
    /**
     * 最小角度
     */
    export const AIM_MIN = - Math.PI / 6;
    /**
     * 最大角度
     */
    export const AIM_MAX = Math.PI / 4;
    /**
     * 受伤时候冲刺
     */
    export const FORWARD_WHILE_SUFFERED_DMG = false;
    /**
     * 格挡成功后多少时间内重新就绪
     */
    export const SHIELD_READY_IN_DEFEND_SUCCESS = 1 / 4;

    /**
     * 受伤时候冲刺时间
     */
    export const MS_FORWARD_WHILE_SUFFERED_DMG = 600;
    /**
     * 残影淡入
     */
    export const MS_FORWARD_TRACE_FADE_IN = 100;
    /**
     * 残影淡出
     */
    export const MS_FORWARD_TRACE_FADE_OUT = 700;

    /**
     * 受伤后无敌时间
     */
    export const HURTED_CD = 1600;
    /**
     * 受伤时候速度倍率
     */
    export const HURTED_SPEED_SCALE = 2;

    /**
     * 受伤闪烁 - 渐入
     */
    export const MS_DMG_FLASH_IN = 200;
    /**
     * 受伤闪烁 - 渐出
     */
    export const MS_DMG_FLASH_OUT = 600;
    /**
     * 就绪动画 - 渐入
     */
    export const PLAYER_MS_READY_IN = 20;
    /**
     * 就绪动画 - 渐出
     */
    export const PLAYER_MS_READY_OUT = 200;

    /**
     * 格挡成功后的时间缩放
     */
    export const TIME_SCALE_WHILE_DEFEND_SUCCESSED = 0.2;
    /**
     * 防御时间渐入
     */
    export const PLAYER_MS_DEFEND_IN = 200;
    /**
     * 防御时间渐出
     */
    export const PLAYER_MS_DEFEND_OUT = 600;
    /**
     * 护盾时间渐入
     */
    export const PLAYER_MS_SHIELD_IN = 20;
    /**
     * 护盾时间渐出
     */
    export const PLAYER_MS_SHIELD_OUT = 600;

    /**
     * 光点最大值
     */
    export const LIGHT_POINT_OPACITY_MAX = 50;
    /**
     * 技能按钮不透明度变化耗时
     */
    export const BTN_SKILL_OPACITY_TRANSITION_COST = 600;
    /**
     * 格挡成功后的持续时间
     */
    export const DEFEND_SUCCESS_KEEP = 100;
    /**
     * 护盾持续时间
     */
    export const DEFEND_KEEP = 1000;
    /**
     * 防御的 cd
     */
    export const CD_DEFEND = 2000;
    /**
     * 防御效果变化时间
     */
    export const TRANSITION_DEFEND = 100;
    /**
     * 必定掉落物品
     */
    export const ALL_DROP = false;
    /**
     * 场景缩放
     */
    export const SCENE_SCALE = 2.0;
    /**
     * 层 - ui
     */
    export const LAYER_UI = 0;
    /**
     * 层 - 实体
     */
    export const LAYER_SCENE_BODY_ELEMENT = 1;
    /**
     * 玩家的配表 id
     */
    export const PLAYER_CFG_ID = 1001;
    /**
     * 交互发音
     */
    export const BTN_VOICE = 1001001001;
    /**
     * 物理时间的最大推进间隔
     */
    export const PHY_STEP_MAX = 1000 / 60;
    /**
     * 分组 - ui
     */
    export const GROUP_UI = `ui`;
    /**
     * 分组 - 场景
     */
    export const GROUP_SCENE = `scene`;

    /**
     * 地面海拔 100 像素
     */
    export const GROUND_Y = 100;
    /**
     * 生命条偏移
     */
    export const HP_FOOT_OFFSET_Y = 10;
    /**
     * 水平偏移
     */
    export const CAMERA_OFFSET_X = - 250;
    /**
     * 垂直偏移
     */
    export const CAMERA_OFFSET_Y = - 160;
    /**
     * 右方阵营标识
     */
    export const FRIENDLY_CAMP = 1;
    /**
     * 敌方阵营标识
     */
    export const ENEMY_CAMP = 2;
    /**
     * 地板的标准宽度
     */
    export const GROUND_STANDARD_WIDTH = 64;
    /**
     * 边界的像素尺寸
     */
    export const BORDER_PIXEL = 1000000;
    /**
     * 轨迹提示线的间隔精度
     */
    export const TRACE_TIPS_SECOND_UNIT = 0.05;
    /**
     * 提示信息的存在时长
     */
    export const TIPS_HOLD = 2000;
    /**
     * 图鉴界面每页信息量
     */
    export const BOOK_INFO_COUNT_PER_PAGE = 20;
    /**
     * 残影冷却
     */
    export const CD_TRACE = 16;
    /**
     * 残影留存时间
     */
    export const TRACE_KEEP = 400;
    /**
     * 残影尺寸缩放宽
     */
    export const TRACE_SIZE_SCALE = 1.5;
    /**
     * 残影模糊
     */
    export const TRACE_BLUR = 4;
    /**
     * 怪物数量
     */
    export const COUNT_MONSTER = 6;
    /**
     * 标题 - 获得奖励
     */
    export const TITLE_REWARD = `获得奖励`;
    /**
     * 标题 - 视频观看不完整
     */
    export const TITLE_VIDEO_INVALID = `视频观看不完整，奖励发放失败`;
}

export default gameCommon;