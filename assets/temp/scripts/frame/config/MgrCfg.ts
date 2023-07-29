
import BCCollection from "../basic/BCCollection";
import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import MgrRes from "../res/MgrRes";
import CfgBackpackProp from "./src/CfgBackpackProp";
import CfgBuffProps from "./src/CfgBuffProps";
import CfgChapter from "./src/CfgChapter";
import CfgEff from "./src/CfgEff";
import CfgCommon from "./src/CfgCommon";
import CfgEquipmentProps from "./src/CfgEquipmentProps";
import CfgGameElement from "./src/CfgGameElement";
import CfgLevel from "./src/CfgLevel";
import CfgLottery from "./src/CfgLottery";
import CfgNumStringify from "./src/CfgNumStringify";
import CfgScene from "./src/CfgScene";
import CfgStore from "./src/CfgStore";
import CfgVoiceOgg from "./src/CfgVoiceOgg";

const APP = `MgrCfg`;

/**
 * 配置管理器
 */
class MgrCfg {

	private constructor () {}

	private static _t = new UtilObjPoolType<MgrCfg>({
		instantiate: () => {
			return new MgrCfg();
		},
		onPop: (t) => {

		},
		onPush: (t) => {

		},
        tag: APP
	});

	static Pop (apply: string) {
		return UtilObjPool.Pop(MgrCfg._t, apply);
	}

    /**
     * 单例
     */
    public static inst = MgrCfg.Pop(APP);

	/**
	 * 所有加载异步
	 */
	public promiseArr: Promise<unknown>[];
    
	public cfgBackpackProp: BCCollection<CfgBackpackProp> = BCCollection.Pop<CfgBackpackProp>(APP);
	public cfgBuffProps: BCCollection<CfgBuffProps> = BCCollection.Pop<CfgBuffProps>(APP);
	public cfgChapter: BCCollection<CfgChapter> = BCCollection.Pop<CfgChapter>(APP);
	public cfgEff: BCCollection<CfgEff> = BCCollection.Pop<CfgEff>(APP);
	public cfgCommon: BCCollection<CfgCommon> = BCCollection.Pop<CfgCommon>(APP);
	public cfgEquipmentProps: BCCollection<CfgEquipmentProps> = BCCollection.Pop<CfgEquipmentProps>(APP);
	public cfgGameElement: BCCollection<CfgGameElement> = BCCollection.Pop<CfgGameElement>(APP);
	public cfgLevel: BCCollection<CfgLevel> = BCCollection.Pop<CfgLevel>(APP);
	public cfgLottery: BCCollection<CfgLottery> = BCCollection.Pop<CfgLottery>(APP);
	public cfgNumStringify: BCCollection<CfgNumStringify> = BCCollection.Pop<CfgNumStringify>(APP);
	public cfgScene: BCCollection<CfgScene> = BCCollection.Pop<CfgScene>(APP);
	public cfgStore: BCCollection<CfgStore> = BCCollection.Pop<CfgStore>(APP);
	public cfgVoiceOgg: BCCollection<CfgVoiceOgg> = BCCollection.Pop<CfgVoiceOgg>(APP);

    /**
     * 初始化
     */
    public Init () {
        this.promiseArr = [
			MgrRes.inst.mgrAssets.GetLoadRecord("resource_sub/json_config/CfgBackpackProp").process._promise
				.then(( jsonData ) => {
					(jsonData.json as any[]).forEach(( item ) => {
						this.cfgBackpackProp.add(CfgBackpackProp.Pop(APP, item));
					});
			}),
			MgrRes.inst.mgrAssets.GetLoadRecord("resource_sub/json_config/CfgBuffProps").process._promise
				.then(( jsonData ) => {
					(jsonData.json as any[]).forEach(( item ) => {
						this.cfgBuffProps.add(CfgBuffProps.Pop(APP, item));
					});
			}),
			MgrRes.inst.mgrAssets.GetLoadRecord("resource_sub/json_config/CfgChapter").process._promise
				.then(( jsonData ) => {
					(jsonData.json as any[]).forEach(( item ) => {
						this.cfgChapter.add(CfgChapter.Pop(APP, item));
					});
			}),
			MgrRes.inst.mgrAssets.GetLoadRecord("resource_sub/json_config/CfgEff").process._promise
				.then(( jsonData ) => {
					(jsonData.json as any[]).forEach(( item ) => {
						this.cfgEff.add(CfgEff.Pop(APP, item));
					});
			}),
			MgrRes.inst.mgrAssets.GetLoadRecord("resource_sub/json_config/CfgCommon").process._promise
				.then(( jsonData ) => {
					(jsonData.json as any[]).forEach(( item ) => {
						this.cfgCommon.add(CfgCommon.Pop(APP, item));
					});
			}),
			MgrRes.inst.mgrAssets.GetLoadRecord("resource_sub/json_config/CfgEquipmentProps").process._promise
				.then(( jsonData ) => {
					(jsonData.json as any[]).forEach(( item ) => {
						this.cfgEquipmentProps.add(CfgEquipmentProps.Pop(APP, item));
					});
			}),
			MgrRes.inst.mgrAssets.GetLoadRecord("resource_sub/json_config/CfgGameElement").process._promise
				.then(( jsonData ) => {
					(jsonData.json as any[]).forEach(( item ) => {
						this.cfgGameElement.add(CfgGameElement.Pop(APP, item));
					});
			}),
			MgrRes.inst.mgrAssets.GetLoadRecord("resource_sub/json_config/CfgLevel").process._promise
				.then(( jsonData ) => {
					(jsonData.json as any[]).forEach(( item ) => {
						this.cfgLevel.add(CfgLevel.Pop(APP, item));
					});
			}),
			MgrRes.inst.mgrAssets.GetLoadRecord("resource_sub/json_config/CfgLottery").process._promise
				.then(( jsonData ) => {
					(jsonData.json as any[]).forEach(( item ) => {
						this.cfgLottery.add(CfgLottery.Pop(APP, item));
					});
			}),
			MgrRes.inst.mgrAssets.GetLoadRecord("resource_sub/json_config/CfgNumStringify").process._promise
				.then(( jsonData ) => {
					(jsonData.json as any[]).forEach(( item ) => {
						this.cfgNumStringify.add(CfgNumStringify.Pop(APP, item));
					});
			}),
			MgrRes.inst.mgrAssets.GetLoadRecord("resource_sub/json_config/CfgScene").process._promise
				.then(( jsonData ) => {
					(jsonData.json as any[]).forEach(( item ) => {
						this.cfgScene.add(CfgScene.Pop(APP, item));
					});
			}),
			MgrRes.inst.mgrAssets.GetLoadRecord("resource_sub/json_config/CfgStore").process._promise
				.then(( jsonData ) => {
					(jsonData.json as any[]).forEach(( item ) => {
						this.cfgStore.add(CfgStore.Pop(APP, item));
					});
			}),
			MgrRes.inst.mgrAssets.GetLoadRecord("resource_sub/json_config/CfgVoiceOgg").process._promise
				.then(( jsonData ) => {
					(jsonData.json as any[]).forEach(( item ) => {
						this.cfgVoiceOgg.add(CfgVoiceOgg.Pop(APP, item));
					});
			})
        ];
    }
}

export default MgrCfg;
