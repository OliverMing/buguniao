const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },
    {
        title: '机主姓名',
        dataIndex: 'phone_name',
    },
    {
      title: '是否已领取',
      dataIndex: 'is_get',
      scopedSlots: { customRender: 'is_get' },
    }
]

export {
    columns
}