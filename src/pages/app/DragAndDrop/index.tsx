import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { GroupsInfo } from './data'
import DndContainer from './DndContainer'
import './style.scss'
import { common } from 'assets'

interface Props { }
// 拖拽主机时，显示节点尺寸
const MovingNodeWidth = 50;
const MovingNodeHeight = 50;

const DnDContext: any = React.createContext({} as any)
export const useDnDContext: any = () => useContext(DnDContext)
const DragAndDrop: React.FC<Props> = props => {
    const [ctrlDown, setCtrlDown] = useState<boolean>(false)
    const [startEvent, setStartEvent] = useState<any>()
    const [movingXY, setMovingXY] = useState<any>({})
    const [activeBoxes, setActiveBoxes] = useState<any[]>([])
    const [movingNodeVisible, setMovingNodeVisible] = useState<boolean>(false)
    const contentContainer = document.querySelector('#content-container')
    const ScrollX = contentContainer?.scrollLeft || 0
    const ScrollY = contentContainer?.scrollTop || 0

    useEffect(() => {
        const onClick = (event: any) => {
            event.stopPropagation()
            event.preventDefault()
            setActiveBoxes([])

            // setDragVmStart(false)
            // 在container外up，清除activeBoxes
        }
        const mouseUp = (event: any) => {
            // event.stopPropagation()
            // event.preventDefault()
            setMovingNodeVisible(false)
            setStartEvent({})

            // setDragVmStart(false)
            // 在container外up，清除activeBoxes
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
            setMovingXY({ clientX, clientY })

            // console.log('mouse move', event.clientX)
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
    }, [])

    const movinNodeStyle = useMemo(() => {
        let top = movingXY.clientY - Math.floor(MovingNodeHeight / 2)
        let left = movingXY.clientX - Math.floor(MovingNodeWidth / 2) + ScrollX
        return { top, left, width: MovingNodeWidth, height: MovingNodeHeight }
    }, [movingXY, ScrollX])

    return <DnDContext.Provider value={{ movingXY, movingNodeVisible, setMovingNodeVisible, startEvent, setStartEvent, activeBoxes, setActiveBoxes }}>
        <div className='dnd-container'>
            {GroupsInfo.map(item => {
                let parentId = `group-${item.group_id}`
                return <div id={parentId}
                    key={parentId}
                    style={{ position: 'absolute', left: item.left, top: item.top }}>
                    <DndContainer ctrlDown={ctrlDown} list={item.vms} parentId={parentId}
                    >
                    </DndContainer>
                </div>
            })}
            {movingNodeVisible && <img src={common.img_copy} alt="" className='img-copy' style={movinNodeStyle}
            />}
        </div>
    </DnDContext.Provider>
}

export default DragAndDrop