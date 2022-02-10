import React, { useEffect, useRef, useState } from 'react';
import { isArray, isEmpty } from 'lodash'

import { useDnDContext } from '.';
import './style.scss'
import { eventTargetInElClass, getSelectBoxStyle, listFindSelected, mouseToDrag, preventEvent } from './helper';

interface Props { }

/**
 * container内绑定事件
 * 鼠标在container内mousedown，分两种情况，
 * 1、vm-box内，增加activeBox
 * 2、container其他地方，记住鼠标开始位置startXY，开始框选
 * 
 * 
 * 鼠标在container内mousemove，
 * 1、没有activeBoxes也没有startXY， return
 * 2、有activeBox && event in activeBoxes，创建拖动元素，开始拖动
 * 3、有startXY，创建框选元素，框选结束位置随鼠标移动。
 * 
 * 
 * 鼠标在container内mouseup，有结束位置endXY
 * 1、有startXY，endXY,判断vm-box 是否被选中
 * 2、有activeBox, 未找到新分组, 拖动效果清除；找到新的分组，更新分组信息
 * 
 * 
 * 鼠标在container内click, 
 * 1、有activeBox，在activeBox外up，清除active状态
 * 2、点在vm-box上，
 */



export const VmClassName = 'vm-box'
export const VmContainer = 'selectContainer'

interface Props {
    ctrlDown: boolean
    list: any[]
    parentId: any
    domRelative?: boolean
}

const DndContainer: React.ForwardRefRenderFunction<any, Props> = ({ ctrlDown, list, parentId, domRelative = true, ...props }, ref) => {
    const [selectBoxStyle, setSelectBoxStyle] = useState<any>({})
    const { movingXY, movingNodeVisible, setMovingNodeVisible, startEvent, setStartEvent, activeBoxes, setActiveBoxes, oldGroup, setOldGroup } = useDnDContext()

    const SELECT_BOX_ID = `${parentId}-select-box`
    const dndRef = useRef<any>()

    const updateActiveBoxes = (newComes: any) => {
        if (isEmpty(newComes)) return
        let newBoxes: any[] = newComes
        if (newBoxes && !isArray(newComes)) {
            newBoxes = [newComes]
        }
        setActiveBoxes((boxes: any) => {
            let lastGroup = boxes && boxes[0]
            lastGroup = lastGroup?.parentElement?.id
            // 判断是是否在同一个Group中点选
            if (lastGroup === parentId) {
                return [...boxes, ...newBoxes]
            } else {
                return newBoxes
            }
        })
    }
    /**
     * 记录鼠标down event
     * @param event 
     * @returns 
     */
    const onContainerMouseDown = (event: any) => {
        event.stopPropagation()
        event.preventDefault()
        if (ctrlDown) return
        setStartEvent(event)

        let allActiveBoxIds = activeBoxes?.map((item: any) => +item.id)
        let isTargetActived = allActiveBoxIds.includes(+event.target.id)

        let targetIsBox = eventTargetInElClass(event, VmClassName)
        // 鼠标down in inactive box
        // console.log('parentId', parentId)
        if (!isTargetActived && targetIsBox) {
            setActiveBoxes([event.target])
        }
        // 鼠标down in 空白处
        if (!targetIsBox) {
            setActiveBoxes([])
        }

    }

    // container内部的move处理框选和显示移动结点
    const onContainerMouseMove = (event: any) => {
        if (isEmpty(startEvent)) return
        let { clientX: oldX, clientY: oldY } = startEvent
        let { clientX, clientY } = event
        const scrollX = document.querySelector('.server-layout-flow-chart')?.scrollLeft || 0
        // 鼠标点在浏览器外，在点在vm上会出现移动结点
        if (oldX === clientX + scrollX && oldY === clientY) {
            return
        }
        // 拖拽的两种情况：1、选中activeBox，再拖拽 2、直接点击inactive 状态的box，进行拖拽
        let startDrag = mouseToDrag(startEvent.target, activeBoxes)
        setOldGroup && setOldGroup(parentId)
        if (startDrag) {
            setMovingNodeVisible && setMovingNodeVisible(true)
            // 只保留原始group和最新的groupId
        } else {
            // 处理框选
            // console.log('select-box', event.clientX, event.clientY)
            const styleRes = getSelectBoxStyle(event, parentId, startEvent, domRelative)
            setSelectBoxStyle(styleRes)
            // console.log('styleRes', styleRes)
            // todo 右下角开始框选，鼠标hover穿透
            preventEvent(event)
        }

    }

    /**
     * 拖动元素时在container内mouseup, 未捕捉到？
     * @param event 
     */
    const onContainerMouseUp = (event: any) => {
        preventEvent(event)
        // container
        if (movingNodeVisible) {
        }
        if (!isEmpty(selectBoxStyle)) {
            let selectedVms = listFindSelected(parentId, document.getElementById(SELECT_BOX_ID))
            updateActiveBoxes(selectedVms)
        }
        setOldGroup(undefined)
        // 释放移动结点
        setMovingNodeVisible && setMovingNodeVisible(false)
        setStartEvent({})
        setSelectBoxStyle({})
    }

    const onContainerClick = (event: any) => {
        preventEvent(event)
        // 点击vm：拖拽单个
        if (eventTargetInElClass(event, VmClassName)) {
            if (ctrlDown) {
                updateActiveBoxes(event.target)
            } else {
                setActiveBoxes([event.target])
            }
            // 可进行box拖拽
        } else {
        }
        // console.log('container click', event.target)
    }

    useEffect(() => {
        let allVmBoxes = document.querySelectorAll(`#${parentId} .vm-box`)
    }, [parentId])
    const allActivedBoxIds = activeBoxes?.map((item: any) => +item.id)

    // 鼠标移出，框选取消
    const onContainerMouseLeave = () => {
        if (!isEmpty(selectBoxStyle)) {
            setSelectBoxStyle({})
        }
    }

    return <div
        ref={dndRef}
        id={parentId}
        className={`${VmContainer}`}
        onMouseDown={onContainerMouseDown}
        onMouseMove={onContainerMouseMove}
        onMouseUp={onContainerMouseUp}
        onClick={onContainerClick}
        onMouseLeave={onContainerMouseLeave}
    >
        {
            list?.map((vm: any) => {
                // let isActive = allActivedBoxIds.includes(vm.id)
                return <div className={`vm-box `} key={vm.id} id={vm.id}>{vm.name}</div>
            })
        }
        {!!props.children && props.children}
        <div className="select-box" style={selectBoxStyle} id={SELECT_BOX_ID}></div>
    </div>
}

export default DndContainer