const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: '版本号',
        dataIndex: 'version_code',
    },
    {
        title: '版本名称',
        dataIndex: 'version_name',
    },
    {
        title: '是否强制更新',
        dataIndex: 'force_update',
    },
    {
        title: '是否补丁包',
        dataIndex: 'is_wgt',
    },
    {
        title: '平台',
        dataIndex: 'platform',
    },
    {
        title: '资源地址',
        dataIndex: 'url',
    },
    {
        title: '上传时间',
        dataIndex: 'create_time',
    },
    {
        title: '操作',
        scopedSlots: { customRender: 'operation' },
        align: 'center',
        width: 280
    }
]

export {
    columns
}