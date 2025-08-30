// 二维码
export const ercodeColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '二维码 ',
      scopedSlots: { customRender: 'url' },
    },
    {
      title: '专属码',
      dataIndex: 'code',
    },
    {
      title: '归属业务',
      dataIndex: 'user_id',
    },
    {
      title: '曝光量',
      dataIndex: 'exposure_count',
    },
    {
      title: '长按量',
      dataIndex: 'longpress_count',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '创建时间',
      dataIndex: 'creator_time',
    },
    {
      title: '操作',
      scopedSlots: { customRender: 'operation' },
      align: 'center'
    }
]


// 滚动
export const scrollList = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
      title: '头像',
      scopedSlots: { customRender: 'head_url' },
    },
    {
      title: '名字',
      dataIndex: 'name',
    },
    {
      title: '操作',
      scopedSlots: { customRender: 'operation' },
      align: 'center'
    }
]