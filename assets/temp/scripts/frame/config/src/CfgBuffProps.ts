
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";

const APP = `CfgBuffProps`;

export default class CfgBuffProps {

	private constructor () {}

	private static _t = new UtilObjPoolType<CfgBuffProps> ({
		instantiate: () => {
			return new CfgBuffProps();
		},
		onPop: (t) => {

		},
		onPush: (t) => {

		},
        tag: APP
	});

	static Pop (apply: string, data: any[]) {
		let t = UtilObjPool.Pop(CfgBuffProps._t, apply);
		t.id = data[0];
		t.res_display = data[1];
		t.layer_max = data[2];
		t.layer_keep_ms = data[3];
		t.logic = data[4];
		return t;
	}


	/**
	 * 标识
	 */
	id: number;

	/**
	 * 展示用的资源
	 */
	res_display: string;

	/**
	 * 最大层级
	 */
	layer_max: number;

	/**
	 * 每层数的维持时间
	 */
	layer_keep_ms: number;

	/**
	 * 层数引爆
	 */
	logic: number;


	/**
	 * 获取标识
	 * @param cfgItem 
	 */
	public static idGetter (cfgItem: CfgBuffProps): number {
		return cfgItem.id;
	}

	/**
	 * 获取展示用的资源
	 * @param cfgItem 
	 */
	public static res_displayGetter (cfgItem: CfgBuffProps): string {
		return cfgItem.res_display;
	}

	/**
	 * 获取最大层级
	 * @param cfgItem 
	 */
	public static layer_maxGetter (cfgItem: CfgBuffProps): number {
		return cfgItem.layer_max;
	}

	/**
	 * 获取每层数的维持时间
	 * @param cfgItem 
	 */
	public static layer_keep_msGetter (cfgItem: CfgBuffProps): number {
		return cfgItem.layer_keep_ms;
	}

	/**
	 * 获取层数引爆
	 * @param cfgItem 
	 */
	public static logicGetter (cfgItem: CfgBuffProps): number {
		return cfgItem.logic;
	}
}