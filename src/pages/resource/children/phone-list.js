const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '手机号码',
      dataIndex: 'phone_number',
    },
    {
        title: '机主姓名',
        dataIndex: 'phone_name',
    },
    {
      title: '标记状态',
      scopedSlots: { customRender: 'mark_id' },
    },
    {
      title: '领取用户',
      scopedSlots: { customRender: 'user_id' },
    },
    // {
    //   title: '是否已被回收',
    //   scopedSlots: { customRender: 'isRecycle' },
    // },
    {
      title: '领取/回收时间',
      dataIndex: 'get_time',
    },
]

export {
    columns
}