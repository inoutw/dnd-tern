import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { GroupsInfo } from './data'
import DndContainer from './DndContainer'
import './style.scss'
import { common } from 'assets'
import { getNewGroupId } from './helper'
import { isEmpty } from 'lodash'
import { Collapse, message } from 'antd'
import { FolderOutlined, FullscreenOutlined } from '@ant-design/icons'
import MoveModal from './MoveModal'

interface Props { }
// 拖拽主机时，显示节点尺寸
const MovingNodeWidth = 50;
const MovingNodeHeight = 50;
export const GROUP_PREFIX = 'group-'
const PREFIX_LENTH = GROUP_PREFIX.length
const ActiveColor = 'rgba(14, 178, 255, 0.08)'
const DnDContext: any = React.createContext({} as any)
export const useDnDContext: any = () => useContext(DnDContext)

const DragAndDrop: React.FC<Props> = props => {
    const [ctrlDown, setCtrlDown] = useState<boolean>(false)
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [curItem, setCurItem] = useState<any>({})
    const [startEvent, setStartEvent] = useState<any>()
    const [movingXY, setMovingXY] = useState<any>({})
    const [activeBoxes, setActiveBoxes] = useState<any[]>([])
    const [newGroup, setNewGroup] = useState<any>()
    const [movingNodeVisible, setMovingNodeVisible] = useState<boolean>(false)
    const contentContainer = document.querySelector('#content-container')
    const ScrollX = contentContainer?.scrollLeft || 0

    const [groupsInfo, setGroupsInfo] = useState<any[]>(GroupsInfo)

    const updateGroupInfo = useCallback((oldGroupId: number, newGroupId: number) => {
        let changedBoxIds = activeBoxes.map(item => +item.id)
        setGroupsInfo((gInfo: any[]) => {
            let gInfoCopy = [...gInfo]
            let groupRes = gInfoCopy.find(gItem => gItem.group_id === oldGroupId)
            let oldGroupBoxes: any[] = groupRes?.boxes
            let changedBoxes = oldGroupBoxes?.filter(box => changedBoxIds.includes(box.id))
            for (let gItem of gInfoCopy) {
                let { boxes, group_id } = gItem
                if (group_id === oldGroupId) {
                    gItem.boxes = boxes.filter((box: any) => !changedBoxIds.includes(box.id))
                }
                if (group_id === newGroupId) {
                    gItem.boxes = [...gItem.boxes, ...changedBoxes]
                }
            }
            return gInfoCopy
        })
        setActiveBoxes([])
    }, [activeBoxes])

    useEffect(() => {
        const onClick = (event: any) => {
            event.stopPropagation()
            event.preventDefault()
            setActiveBoxes([])
            // 在container外up，清除activeBoxes
        }
        const mouseUp = (event: any) => {
            if (isEmpty(startEvent) || !movingNodeVisible) {
                return
            }
            setMovingNodeVisible(false)
            setStartEvent({})

            // 内部dnd-container释放拖拽元素时无法触发mouseup
            const newGroup = getNewGroupId(event)
            // 从拖动的box获取oldGroup更准确
            let oldGroup = activeBoxes && activeBoxes[0]?.parentElement?.id
            if (newGroup && oldGroup !== newGroup) {
                //todo 更新GroupInfo数据
                let oldGroupId = +oldGroup.substring(PREFIX_LENTH)
                let newGroupId = +newGroup.substring(PREFIX_LENTH)
                updateGroupInfo(oldGroupId, newGroupId)
            }
        }
        const keyDown = (e: any) => {
            if (e.keyCode !== 17) return
            setCtrlDown(true)
        }
        const keyUp = (e: any) => {
            if (e.keyCode !== 17) return
            setCtrlDown(false)
        }
        // 在Group之间进行拖动，处理box拖动
        const mouseMove = (event: any) => {
            event.stopPropagation()
            event.preventDefault()
            let { clientX, clientY } = event
            if (isEmpty(startEvent)) return
            setMovingXY({ clientX, clientY })
        }
        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', mouseUp)
        document.addEventListener('click', onClick)
        document.addEventListener('keydown', keyDown)
        document.addEventListener('keyup', keyUp)
        return () => {
            document.removeEventListener('mousemove', mouseMove)
            document.removeEventListener('mouseup', mouseUp)
            document.removeEventListener('click', onClick)
            document.removeEventListener('keydown', keyDown)
            document.removeEventListener('keyup', keyUp)
        }
    }, [startEvent, movingNodeVisible, activeBoxes, updateGroupInfo])

    const getMore = (event: any, item: any) => {
        setModalVisible(true)
        setCurItem(item)
        setActiveBoxes([])
        event.preventDefault() // 阻止默认行为
        event.stopPropagation() // 阻止事件冒泡
    }

    const movinNodeStyle = useMemo(() => {
        let { clientY = 0, clientX = 0 } = movingXY
        let top = clientY - Math.floor(MovingNodeHeight / 2)
        let left = clientX - Math.floor(MovingNodeWidth / 2) + ScrollX
        return { top, left, width: MovingNodeWidth, height: MovingNodeHeight }
    }, [movingXY, ScrollX])

    const getHeader = (item: any) => {
        return (
            <span
                title={item.group_name}
                className="header-text"
                style={{
                    width: item,
                }}>
                {item.group_name}
            </span>
        )
    }

    const getExtra = (item: any) => {
        return (
            <span>
                {item?.boxes?.length > 0 && (
                    <span className="more" onClick={(event: any) => getMore(event, item)}>
                        <FullscreenOutlined />
                    </span>
                )}
            </span>
        )
    }

    const getIcon = (item: any) => {
        let unprotectedClass = item.group_id === 0 ? 'disabled' : ''
        return <FolderOutlined className={`group-item-icon ${unprotectedClass}`} />
    }

    const cancelGetMore = () => {
        setModalVisible(false)
        setNewGroup(undefined)
    }

    const handleConfirmMove = () => {
        if (!activeBoxes?.length) {
            message.warn('请选择虚拟机')
            return
        }
        updateGroupInfo(curItem.group_id, newGroup)
        setModalVisible(false)
    }
    // 弹框和dnd-container内的box active状态分离
    useEffect(() => {
        const resetActiveBoxes = (targets: any) => {
            let allActiveBoxIds = activeBoxes.map(item => item.id)
            for (let item of targets) {
                if (allActiveBoxIds.includes(item.id)) {
                    item.style.background = ActiveColor
                } else {
                    item.style.background = 'transparent'
                }
            }
        }
        const clearActiveStatus = (targets: any) => {
            for (let item of targets) {
                item.style.background = 'transparent'
            }
        }

        setTimeout(() => {
            let targets = document.querySelectorAll('.dnd-container .box')
            if (modalVisible) {
                clearActiveStatus(targets)
                targets = document.querySelectorAll('.group-more .box')
            }
            resetActiveBoxes(targets)
        }, 50)

    }, [modalVisible, activeBoxes])
    return <DnDContext.Provider value={{ setGroupsInfo, setMovingNodeVisible, startEvent, setStartEvent, activeBoxes, setActiveBoxes }}>
        <div className='dnd-container'>
            {groupsInfo.map(item => {
                let parentId = `${GROUP_PREFIX}${item.group_id}`
                return <Collapse
                    key={item.group_id}
                    className='group-collapse'
                    style={{
                        width: '160px',
                        position: 'absolute', left: item?.left || 0, top: item?.top || 0
                    }}
                    expandIcon={props => getIcon(item)}
                    defaultActiveKey={'1'}
                >
                    <Collapse.Panel className="group-panel" header={getHeader(item)} key="1" extra={getExtra(item)}>
                        <DndContainer ctrlDown={ctrlDown} list={item.boxes} parentId={parentId}>
                        </DndContainer>
                    </Collapse.Panel>
                </Collapse>
            })}
            {movingNodeVisible && <img src={common.img_copy} alt="" className='img-copy' style={movinNodeStyle}
            />}

        </div>
        <MoveModal
            modalVisible={modalVisible}
            cancel={cancelGetMore}
            confirm={handleConfirmMove}
            curItem={curItem}
            getIcon={getIcon}
            groupsInfo={groupsInfo}
            ctrlDown={ctrlDown}
            onSelectChange={(value: string) => setNewGroup(value)}
        ></MoveModal>
    </DnDContext.Provider >
}
export default DragAndDrop