/**
 * 判断鼠标是否点选在已选中元素上要进行拖拽
 * @param e 鼠标事件目标
 * @param containerElement 所有选中项
 */

import { VmContainer } from "./DndContainer"

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
 *
 * @param element 当前元素
 * @param containerElement 容器元素
 *
 * 返回 当前元素相对容器元素的偏移
 * return {
 * 		left: xx,
 * 		top: xx
 * }
 */
export const getOffset = (element: any, containerElement?: any) => {
    let position = {
        left: 0,
        top: 0,
    }
    containerElement = containerElement || document.body
    while (element && element !== containerElement) {
        position.left += element.offsetLeft
        position.top += element.offsetTop
        element = element.offsetParent
    }
    return position
}
/**
 *
 * @param e 事件
 * @param containerElement 容器元素 或 id
 *
 * 返回 事件发生时, 鼠标是否在容器中
 * return boolean
 */
export const isMouseInclude = (event: any, containerElement: any) => {
    if (!containerElement) return
    // const scrollX = document.querySelector('.server-layout-flow-chart').scrollLeft || 0
    let ContentContainerEl = document.querySelector('#content-container')
    const scrollX = 0
    const scrollY = ContentContainerEl?.scrollTop || 0
    if (typeof containerElement === 'string') {
        containerElement = document.getElementById(containerElement)
    }
    let offset = getOffset(containerElement)
    let { pageX, pageY } = event
    pageX += scrollX
    pageY += scrollY
    const { top: y1, left: x1 } = offset
    const x2 = x1 + containerElement?.offsetWidth
    const y2 = y1 + containerElement?.offsetHeight
    return pageX > x1 && pageX < x2 && pageY > y1 && pageY < y2
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

// 拖拽主机时，获取新的分组id
export const getNewGroupId = (event: any) => {
    let newGroupId: string = ''
    const groupEles: any = document.getElementsByClassName(VmContainer)
    for (let i = 0; i < groupEles?.length; i++) {
        const gItem = groupEles[i]
        if (isMouseInclude(event, gItem)) {
            newGroupId = gItem.id
            break
        }
    }
    return newGroupId
}
/**
 *
 * @param e 事件
 * @param containerElement 容器元素 或 id
 *
 * 返回 事件发生时, 鼠标在容器内的坐标
 * return {
 * 		left: xx,
 * 		top: xx
 * }
 */
export const getPositionInContainer = (e: any, containerElement: any, domRelative = true) => {
    if (!e) return {}
    if (typeof containerElement === 'string') {
        containerElement = document.getElementById(containerElement)
    }
    let offset = getOffset(containerElement)
    let x = 'pageX',
        y = 'pageY'
    if (!domRelative) {
        x = 'clientX'
        y = 'clientY'
    }
    return {
        left: e[x] - offset.left,
        top: e[y] - offset.top,
    }
}
/**
 * 获取框选div的样式
 */
export const getSelectBoxStyle = (event: any, parentId: any, oldEvent: any, domRelative = true) => {
    const position: any = getPositionInContainer(event, parentId, domRelative)
    const oldPosition: any = getPositionInContainer(oldEvent, parentId, domRelative)
    const domContainer = document.querySelector('#content-container')
    const scrollY = domRelative ? domContainer?.scrollTop || 0 : 0
    const scrollX = 0
    const groupEl = document.getElementById(parentId)
    const scrollGroupY = groupEl?.scrollTop || 0
    position.left += scrollX
    position.top += scrollY + scrollGroupY
    const startPosition = {
        left: oldPosition.left + scrollX,
        top: oldPosition.top + scrollY + scrollGroupY,
    }
    let left = Math.min(position.left, startPosition.left) - 1 //-1避免反向选择时，鼠标穿透触发hover
    let top = Math.min(position.top, startPosition.top) - 1
    let width = Math.abs(position.left - startPosition.left)
    let height = Math.abs(position.top - startPosition.top)
    return { left, top, width, height }
}

export const preventEvent = (event: any) => {
    event.stopPropagation()
    event.preventDefault()
    return false
}

/**
 *
 * @param rect1 矩形1 {x, y, w, h}
 * @param rect2 矩形2 {x, y, w, h}
 * 判断两个矩形是否相交
 * 规则: 若两个矩形相交, 则两个矩形中心点的距离小于两个矩形边长和的一半
 */
export function isRectIntersection(rect1: any, rect2: any) {
    let center1 = {
        x: (rect1.x + rect1.x + rect1.w) / 2,
        y: (rect1.y + rect1.y + rect1.h) / 2,
    }
    let center2 = {
        x: (rect2.x + rect2.x + rect2.w) / 2,
        y: (rect2.y + rect2.y + rect2.h) / 2,
    }
    let dx = Math.abs(center1.x - center2.x)
    let dy = Math.abs(center1.y - center2.y)
    return dx < (rect1.w + rect2.w) / 2 && dy < (rect1.h + rect2.h) / 2
}

/**
 *
 * @param ele1 元素1
 * @param ele2 元素2
 * @param correcting 是否进行校正
 *
 * 返回 元素1是否包含元素2
 * return boolean
 */

export const isEleInclude = (ele1: any, ele2: any, containerElement: any) => {
    const p1 = getOffset(ele1, containerElement)
    const rect1 = {
        x: p1.left,
        y: p1.top,
        w: ele1.clientWidth,
        h: ele1.clientHeight,
    }
    const p2 = getOffset(ele2, containerElement)
    const rect2 = {
        x: p2.left,
        y: p2.top,
        w: ele2.clientWidth,
        h: ele2.clientHeight,
    }
    return isRectIntersection(rect1, rect2)
}

// 获取在框选区域内的虚拟机
export const listFindSelected = (groupId: string, selectBox: any,) => {
    let list: any = []
    let constainerEl = document.getElementById(groupId)
    const vmList: any = constainerEl?.getElementsByClassName('vm-box')
    for (let i = 0; i < vmList?.length; i++) {
        const item: any = vmList[i]
        if (isEleInclude(selectBox, item, constainerEl)) {
            list.push(item)
        }
    }
    return list
}