export const VmList: any[] = [
    { id: 1, name: 'vm1' },
    { id: 2, name: 'vm2' },
    { id: 3, name: 'vm3' },
    { id: 4, name: 'vm4' },
    { id: 5, name: 'vm5' },
    { id: 6, name: 'vm6' },
    { id: 7, name: 'vm7' },
    { id: 8, name: 'vm8' },
    { id: 9, name: 'vm9' },
    { id: 10, name: 'vm10' },
    { id: 11, name: 'vm11' },
]
export const VmList2: any[] = [
    { id: 12, name: 'vm12' },
    { id: 13, name: 'vm13' },
]

export const GroupsInfo: any[] = [{
    group_name: '未防护分组',
    group_id: 0,
    vms: VmList,
    left: '212px',
    top: '730px'
},
{
    group_name: '分组1',
    group_id: 1,
    vms: VmList2,
    left: '412px',
    top: '730px'
}, {
    group_name: '分组2',
    group_id: 2,
    vms: [],
    left: '612px',
    top: '730px'
}
]