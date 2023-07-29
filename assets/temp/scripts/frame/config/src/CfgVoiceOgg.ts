
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";

const APP = `CfgVoiceOgg`;

export default class CfgVoiceOgg {

	private constructor () {}

	private static _t = new UtilObjPoolType<CfgVoiceOgg> ({
		instantiate: () => {
			return new CfgVoiceOgg();
		},
		onPop: (t) => {

		},
		onPush: (t) => {

		},
        tag: APP
	});

	static Pop (apply: string, data: any[]) {
		let t = UtilObjPool.Pop(CfgVoiceOgg._t, apply);
		t.id = data[0];
		t.name = data[1];
		t.res = data[2];
		return t;
	}


	/**
	 * 类型
【3】ui 交互相关的
【5】长的背景音乐
	 */
	id: number;

	/**
	 * 名字
	 */
	name: string;

	/**
	 * 资源路径
	 */
	res: string;


	/**
	 * 获取类型
【3】ui 交互相关的
【5】长的背景音乐
	 * @param cfgItem 
	 */
	public static idGetter (cfgItem: CfgVoiceOgg): number {
		return cfgItem.id;
	}

	/**
	 * 获取名字
	 * @param cfgItem 
	 */
	public static nameGetter (cfgItem: CfgVoiceOgg): string {
		return cfgItem.name;
	}

	/**
	 * 获取资源路径
	 * @param cfgItem 
	 */
	public static resGetter (cfgItem: CfgVoiceOgg): string {
		return cfgItem.res;
	}
}