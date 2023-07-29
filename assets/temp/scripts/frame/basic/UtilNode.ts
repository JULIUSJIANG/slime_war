import UtilObjPool from "./UtilObjPool";

const APP = `utilNode`;

namespace utilNode {
    /**
     * 获取节点路径
     * @param node 
     * @returns 
     */
    export function GetPath (node: cc.Node) {
        let pathList: Array<string> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
        while (node != null) {
            pathList.push(node.name);
            node = node.parent;
        };
        pathList.reverse();
        return pathList.join(`/`);
    }

    /**
     * 穷举所有节点
     * @param node 
     * @param walker 
     */
    export function WalkAllNode (node: cc.Node, walker: (n: cc.Node) => void) {
        walker(node);
        for (let i = 0; i < node.children.length; i++) {
            WalkAllNode(node.children[i], walker);
        };
    }

    /**
     * 设置节点的分组
     * @param node 
     * @param group 
     */
    export function SetGroup (node: cc.Node, group: number) {
        WalkAllNode (
            node,
            (n) => {
                n.groupIndex = group
            }
        )
    }
}

export default utilNode;