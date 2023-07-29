import IndexLayer from "../../../IndexLayer";
import IndexDataModule from "../../../IndexDataModule";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";

/**
 * 截图界面状态
 */
class ScreenShotViewState extends ViewState {
    /**
     * 全局静态
     */
    static inst: ScreenShotViewState;

    public constructor () {
        super (
            IndexLayer.SYSTEM,
            ViewState.BG_TYPE.NONE,
            false
        );
        this.rtScreen = new cc.RenderTexture();
        this.rtScreen.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR);
        this.rtScreen.initWithSize (
            jiang.mgrUI._containerUI.width, 
            jiang.mgrUI._containerUI.height, 
            cc.RenderTexture.DepthStencilFormat.RB_FMT_D24S8
        );
        this.rtScreen.setPremultiplyAlpha (false);
        ScreenShotViewState.inst = this;
    }

    /**
     * 针对全屏的 rt
     */
    rtScreen: cc.RenderTexture;
    
    /**
     * 要求捕获画面内容的 id 集合
     */
    private _setApp = new Set ();

    /**
     * 是否要求捕获
     */
    get isRendering () {
        return 0 < this._setApp.size;
    }

    /**
     * 标识生成器
     */
    private _idGen = 0;

    /**
     * 要求展示
     */
    public App () {
        let id = ++this._idGen;
        this._setApp.add (id);
        jiang.mgrUI.ModuleRefresh (IndexDataModule.SCREEN_SHOT);
        return id;
    }

    /**
     * 取消展示
     * @param appId 
     */
    public Cancel (appId: number) {
        this._setApp.delete (appId);
        jiang.mgrUI.ModuleRefresh (IndexDataModule.SCREEN_SHOT);
    }
}

export default ScreenShotViewState;