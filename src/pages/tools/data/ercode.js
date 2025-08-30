// 二维码
export const ercodeColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '二维码名称',
      dataIndex: 'name',
    },
    {
      title: '二维码',
      scopedSlots: { customRender: 'url' },
    },
    {
      title: '链接',
      scopedSlots: { customRender: 'wxurl' },
    },
    {
        title: '展示权重',
        dataIndex: 'bv',
    },
    // {
    //   title: '曝光量',
    //   dataIndex: 'exposure_count',
    // },
    // {
    //   title: '长按量',
    //   dataIndex: 'longpress_count',
    // },
    {
      title:'扫码客户列表',
      scopedSlots: { customRender: 'customer' },
    },
    {
      title: '状态',
      scopedSlots: { customRender: 'status' },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '操作',
      scopedSlots: { customRender: 'operation' },
      align: 'center'
    }
]