/**
 * 参数字段定义
 */
export default interface Logic3021Args {
    deathOgg: number,

    hpMax: number,
    hpLevInc: number,

    bodyRadius: number,
    moveSpeed: number,
    hurtedOgg: number,
    cd: number,
    repel: number,
    atkArea: number,
    powerTime: number,
    atkTime: number,

    listCallTarget: Array <number>,
    areaCall: number,
    maxCount: number
}