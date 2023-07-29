import GameElement from "../GameElement";

/**
 * 粒子
 */
export default class GameElementParticle extends GameElement {

    GetPhysicsTag(): Function {
        return GameElementParticle;
    }
}