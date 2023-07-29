
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";

const APP = `CfgNumStringify`;

export default class CfgNumStringify {

	private constructor () {}

	private static _t = new UtilObjPoolType<CfgNumStringify> ({
		instantiate: () => {
			return new CfgNumStringify();
		},
		onPop: (t) => {

		},
		onPush: (t) => {

		},
        tag: APP
	});

	static Pop (apply: string, data: any[]) {
		let t = UtilObjPool.Pop(CfgNumStringify._t, apply);
		t.count = data[0];
		t.tag = data[1];
		return t;
	}


	/**
	 * 边界数量（小于）
	 */
	count: number;

	/**
	 * 省略符
	 */
	tag: string;


	/**
	 * 获取边界数量（小于）
	 * @param cfgItem 
	 */
	public static countGetter (cfgItem: CfgNumStringify): number {
		return cfgItem.count;
	}

	/**
	 * 获取省略符
	 * @param cfgItem 
	 */
	public static tagGetter (cfgItem: CfgNumStringify): string {
		return cfgItem.tag;
	}
}