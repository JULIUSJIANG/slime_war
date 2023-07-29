/**
 * 数据的模块划分
 */
enum IndexDataModule {
    /**
     * 重新生成节点树
     */
    RELOAD,
    /**
     * 默认
     */
    DEFAULT,
    /**
     * 画面捕获
     */
    SCREEN_SHOT,
    /**
     * 模糊
     */
    BLUR,
    /**
     * 引导
     */
    GUIDE,
    /**
     * 锁定
     */
    LOCK,
    /**
     * 字体
     */
    FONT,
    /**
     * sdk 数据发生变化
     */
    SDK,
    /**
     * 自动退出
     */
    EXIT,
    /**
     * 闪屏
     */
    FLASH,
    /**
     * 红点
     */
    RED_DOT,

    /**
     * 根界面 - 子节点许可
     */
    INDEXVIEW_CHILDREN_ABLE,
    /**
     * 根界面 - 子界面 - 滚动
     */
    INDEXVIEW_MAIN,
    /**
     * 根界面 - 子界面 - 关卡选择
     */
    INDEXVIEW_CHALLENGE,
    /**
     * 根界面 - 子界面 - 乐透
     */
    INDEXVIEW_LOTTO,
    /**
     * 根界面 - 子界面 - 商店
     */
    INDEXVIEW_STORE,
    /**
     * 根界面 - 子界面 - 装备
     */
    INDEXVIEW_EQUIP,
    /**
     * 根界面 - 子界面 - 图鉴
     */
    INDEXVIEW_BOOK,
    /**
     * 根界面 - 子界面 - 设置
     */
    INDEXVIEW_SETTING,
    /**
     * 根界面 - 分享
     */
    INDEXVIEW_SHARE,

    /**
     * 音效界面
     */
    VOICE_OGG_VIEW,
    /**
     * 音量变化
     */
    VOLUME_CHANGE,
    /**
     * 提示界面
     */
    TIPSVIEW,
    /**
     * 调试界面
     */
    DEBUG_VIEW,
    /**
     * 正在体验
     */
    PLAYING,
    /**
     * 奖励界面
     */
    REWARD,
    /**
     * 升级
     */
    LV_UP,
    /**
     * 批量升级
     */
    LV_UP_SUM,
    /**
     * 章节解锁
     */
    CHAPTER_UNLOCK,
    /**
     * 批量强化 - 画面元素不透明度
     */
    LV_UP_BATCH_OPACITY,
    /**
     * 批量强化 - 画面元素位置
     */
    LV_UP_BATCH_POS,
    /**
     * 倒数
     */
    SECONDS,
};
export default IndexDataModule