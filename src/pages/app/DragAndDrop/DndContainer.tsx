import React, { useEffect, useState } from 'react';
import { debounce, isEmpty } from 'lodash'

import { useDnDContext } from '.';
import './style.scss'
import { eventTargetInElClass, mouseToDrag } from './helper';

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
const VmActiveClassName = 'active'
export const VmContainer = 'selectContainer'

interface Props {
    ctrlDown: boolean
    list: any[]
    parentId: any
}

const DndContainer: React.FC<Props> = ({ ctrlDown, list, parentId, ...props }) => {
    const [startXY, setStartXY] = useState<any>()
    const { movingXY, movingNodeVisible, setMovingNodeVisible, startEvent, setStartEvent, activeBoxes, setActiveBoxes } = useDnDContext()

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
        console.log('parentId', parentId)
        if (!isTargetActived && targetIsBox) {
            setActiveBoxes([event.target])
        }

        // 点击container:框选，记住鼠标开始位置
        let { clientX, clientY } = event
        // console.log('clientX', clientX, clientY)
    }

    // container内部的move处理框选
    const onContainerMouseMove = (event: any) => {
        if (isEmpty(startEvent)) return
        // 拖拽的两种情况：1、选中activeBox，再拖拽 2、直接点击inactive 状态的box，进行拖拽
        let startDrag = mouseToDrag(startEvent.target, activeBoxes)
        console.log('activeBoxes', activeBoxes)
        if (startDrag) {
            // console.log('startDrag', activeBoxes.map((item: any) => item.id))
            setMovingNodeVisible && setMovingNodeVisible(true)
        }

    }

    // 鼠标在container内部up
    const onContainerMouseUp = (event: any) => {
        event.stopPropagation()
        event.preventDefault()
        console.log('movingNodeVisible', movingNodeVisible)
        // 释放移动结点
        setMovingNodeVisible && setMovingNodeVisible(false)
        setStartEvent({})
    }

    const onContainerClick = (event: any) => {
        event.preventDefault()
        event.stopPropagation()
        let targetClass = event.target.className
        // 点击vm：拖拽单个
        if (eventTargetInElClass(event, VmClassName)) {
            if (ctrlDown) {
                setActiveBoxes((boxes: any) => [...boxes, event.target])
            } else {
                setActiveBoxes([event.target])
            }
            // 可进行box拖拽
        }
        // console.log('container click', event.target)
    }

    useEffect(() => {
        // console.log(activeBoxes.map(item => +item.id), 'activeBoex')
    }, [activeBoxes])
    const allActivedBoxIds = activeBoxes?.map((item: any) => +item.id)
    return <div className={VmContainer}
        onMouseDown={onContainerMouseDown}
        onMouseMove={onContainerMouseMove}
        onMouseUp={onContainerMouseUp}
        onClick={onContainerClick}
    >
        {
            list?.map((vm: any) => {
                let isActive = allActivedBoxIds.includes(vm.id)
                return <div className={`vm-box ${isActive ? 'active' : ''}`} key={vm.id} id={vm.id}></div>
            })
        }
        {!!props.children && props.children}
    </div>
}

export default DndContainer