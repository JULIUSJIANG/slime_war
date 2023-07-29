
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";

const APP = `CfgScene`;

export default class CfgScene {

	private constructor () {}

	private static _t = new UtilObjPoolType<CfgScene> ({
		instantiate: () => {
			return new CfgScene();
		},
		onPop: (t) => {

		},
		onPush: (t) => {

		},
        tag: APP
	});

	static Pop (apply: string, data: any[]) {
		let t = UtilObjPool.Pop(CfgScene._t, apply);
		t.id = data[0];
		t.name = data[1];
		t.rain_speed_x = data[2];
		t.rain_speed_y = data[3];
		t.rain_count_per_ms = data[4];
		t.snow_speed_x = data[5];
		t.snow_speed_y = data[6];
		t.snow_count_per_ms = data[7];
		t.bg_y_offset = data[8];
		t.color_light = data[9];
		t.color_shadow = data[10];
		t.res = data[11];
		t.bgm = data[12];
		t.card = data[13];
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
	 * 降雨速度x(像素/毫秒)
	 */
	rain_speed_x: number;

	/**
	 * 降雨速度y(像素/毫秒)
	 */
	rain_speed_y: number;

	/**
	 * 最大降雨量(个数/毫秒)0.2
	 */
	rain_count_per_ms: number;

	/**
	 * 降雪速度x(像素/毫秒)
	 */
	snow_speed_x: number;

	/**
	 * 降雪速度y(像素/毫秒)
	 */
	snow_speed_y: number;

	/**
	 * 最大降雪量(个数/毫秒)
	 */
	snow_count_per_ms: number;

	/**
	 * 背景 y 坐标
	 */
	bg_y_offset: number;

	/**
	 * 颜色-亮
	 */
	color_light: string;

	/**
	 * 颜色-暗
	 */
	color_shadow: string;

	/**
	 * 资源路径
	 */
	res: string;

	/**
	 * 背景音乐
	 */
	bgm: number;

	/**
	 * 解锁界面的卡片
	 */
	card: string;


	/**
	 * 获取标识
	 * @param cfgItem 
	 */
	public static idGetter (cfgItem: CfgScene): number {
		return cfgItem.id;
	}

	/**
	 * 获取名字
	 * @param cfgItem 
	 */
	public static nameGetter (cfgItem: CfgScene): string {
		return cfgItem.name;
	}

	/**
	 * 获取降雨速度x(像素/毫秒)
	 * @param cfgItem 
	 */
	public static rain_speed_xGetter (cfgItem: CfgScene): number {
		return cfgItem.rain_speed_x;
	}

	/**
	 * 获取降雨速度y(像素/毫秒)
	 * @param cfgItem 
	 */
	public static rain_speed_yGetter (cfgItem: CfgScene): number {
		return cfgItem.rain_speed_y;
	}

	/**
	 * 获取最大降雨量(个数/毫秒)0.2
	 * @param cfgItem 
	 */
	public static rain_count_per_msGetter (cfgItem: CfgScene): number {
		return cfgItem.rain_count_per_ms;
	}

	/**
	 * 获取降雪速度x(像素/毫秒)
	 * @param cfgItem 
	 */
	public static snow_speed_xGetter (cfgItem: CfgScene): number {
		return cfgItem.snow_speed_x;
	}

	/**
	 * 获取降雪速度y(像素/毫秒)
	 * @param cfgItem 
	 */
	public static snow_speed_yGetter (cfgItem: CfgScene): number {
		return cfgItem.snow_speed_y;
	}

	/**
	 * 获取最大降雪量(个数/毫秒)
	 * @param cfgItem 
	 */
	public static snow_count_per_msGetter (cfgItem: CfgScene): number {
		return cfgItem.snow_count_per_ms;
	}

	/**
	 * 获取背景 y 坐标
	 * @param cfgItem 
	 */
	public static bg_y_offsetGetter (cfgItem: CfgScene): number {
		return cfgItem.bg_y_offset;
	}

	/**
	 * 获取颜色-亮
	 * @param cfgItem 
	 */
	public static color_lightGetter (cfgItem: CfgScene): string {
		return cfgItem.color_light;
	}

	/**
	 * 获取颜色-暗
	 * @param cfgItem 
	 */
	public static color_shadowGetter (cfgItem: CfgScene): string {
		return cfgItem.color_shadow;
	}

	/**
	 * 获取资源路径
	 * @param cfgItem 
	 */
	public static resGetter (cfgItem: CfgScene): string {
		return cfgItem.res;
	}

	/**
	 * 获取背景音乐
	 * @param cfgItem 
	 */
	public static bgmGetter (cfgItem: CfgScene): number {
		return cfgItem.bgm;
	}

	/**
	 * 获取解锁界面的卡片
	 * @param cfgItem 
	 */
	public static cardGetter (cfgItem: CfgScene): string {
		return cfgItem.card;
	}
}