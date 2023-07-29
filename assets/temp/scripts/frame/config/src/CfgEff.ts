
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";

const APP = `CfgEff`;

export default class CfgEff {

	private constructor () {}

	private static _t = new UtilObjPoolType<CfgEff> ({
		instantiate: () => {
			return new CfgEff();
		},
		onPop: (t) => {

		},
		onPush: (t) => {

		},
        tag: APP
	});

	static Pop (apply: string, data: any[]) {
		let t = UtilObjPool.Pop(CfgEff._t, apply);
		t.id = data[0];
		t.res = data[1];
		t.life = data[2];
		return t;
	}


	/**
	 * 标识
	 */
	id: number;

	/**
	 * 资源路径
	 */
	res: string;

	/**
	 * 生命周期
	 */
	life: number;


	/**
	 * 获取标识
	 * @param cfgItem 
	 */
	public static idGetter (cfgItem: CfgEff): number {
		return cfgItem.id;
	}

	/**
	 * 获取资源路径
	 * @param cfgItem 
	 */
	public static resGetter (cfgItem: CfgEff): string {
		return cfgItem.res;
	}

	/**
	 * 获取生命周期
	 * @param cfgItem 
	 */
	public static lifeGetter (cfgItem: CfgEff): number {
		return cfgItem.life;
	}
}