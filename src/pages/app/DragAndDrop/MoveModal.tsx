import { Modal, Select } from "antd"
import DndContainer from "./DndContainer"


const MoveModal: React.FC<any> = ({ modalVisible, cancel, confirm, curItem, getIcon, onSelectChange, groupsInfo, ctrlDown, }) => {
    return <Modal
        visible={modalVisible}
        className="group-more"
        destroyOnClose={true}
        maskClosable={false}
        onCancel={cancel}
        onOk={confirm}
        title={
            <span className="modal-header">
                <span>
                    {getIcon(curItem)}
                    {curItem?.group_name}（{curItem?.boxes?.length}）
                </span>
                <span className="group-select">
                    <span>移动至：</span>
                    <Select
                        allowClear={true}
                        getPopupContainer={() => (document.querySelector('.group-select') as any)}
                        style={{ width: '160px' }}
                        dropdownClassName="group-select-option"
                        onChange={onSelectChange}
                        onClick={(event: any) => { event.preventDefault(); event.stopPropagation(); }}
                    >
                        {groupsInfo?.filter((item: any) => {
                            return item.group_id !== curItem.group_id
                        })
                            .map((item: any, index: number) => {
                                return (
                                    <Select.Option value={item.group_id} key={index}>
                                        {item.group_name}
                                    </Select.Option>
                                )
                            })}
                    </Select>
                </span>
            </span>
        }>
        <DndContainer ctrlDown={ctrlDown} list={curItem.boxes} parentId={`modal-boxes`} domRelative={false}>
        </DndContainer>
    </Modal>
}

export default MoveModal