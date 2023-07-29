
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";

const APP = `CfgBackpackProp`;

export default class CfgBackpackProp {

	private constructor () {}

	private static _t = new UtilObjPoolType<CfgBackpackProp> ({
		instantiate: () => {
			return new CfgBackpackProp();
		},
		onPop: (t) => {

		},
		onPush: (t) => {

		},
        tag: APP
	});

	static Pop (apply: string, data: any[]) {
		let t = UtilObjPool.Pop(CfgBackpackProp._t, apply);
		t.id = data[0];
		t.name = data[1];
		t.res_ui = data[2];
		t.res_scene = data[3];
		t.txt_info = data[4];
		return t;
	}


	/**
	 * 标识
	 */
	id: number;

	/**
	 * 名字
	 */
	name: string;

	/**
	 * ui资源
	 */
	res_ui: string;

	/**
	 * 场景资源
	 */
	res_scene: string;

	/**
	 * 描述信息
	 */
	txt_info: string;


	/**
	 * 获取标识
	 * @param cfgItem 
	 */
	public static idGetter (cfgItem: CfgBackpackProp): number {
		return cfgItem.id;
	}

	/**
	 * 获取名字
	 * @param cfgItem 
	 */
	public static nameGetter (cfgItem: CfgBackpackProp): string {
		return cfgItem.name;
	}

	/**
	 * 获取ui资源
	 * @param cfgItem 
	 */
	public static res_uiGetter (cfgItem: CfgBackpackProp): string {
		return cfgItem.res_ui;
	}

	/**
	 * 获取场景资源
	 * @param cfgItem 
	 */
	public static res_sceneGetter (cfgItem: CfgBackpackProp): string {
		return cfgItem.res_scene;
	}

	/**
	 * 获取描述信息
	 * @param cfgItem 
	 */
	public static txt_infoGetter (cfgItem: CfgBackpackProp): string {
		return cfgItem.txt_info;
	}
}