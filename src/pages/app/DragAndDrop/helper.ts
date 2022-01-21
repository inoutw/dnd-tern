/**
 * 判断鼠标是否点选在已选中元素上要进行拖拽
 * @param e 鼠标事件目标
 * @param containerElement 所有选中项
 */

export const mouseToDrag = (target: any, nodeList: any) => {
    let containsEvent = false
    for (let node of nodeList) {
        if (node.contains(target)) {
            containsEvent = true
            break
        }
    }
    return containsEvent
}
/**
 * 鼠标时间发生在box内
 * @param event 
 */
export const eventTargetInElClass = (event: any, classNameStr: string) => {
    let eventTarget = event.target
    let targetClass = eventTarget.className
    return targetClass.indexOf(classNameStr) > -1
}