<template>
  <!-- <a-card :bordered="false">
    <a-steps class="steps" :current="current">
      <a-step :title="$t('input')" />
      <a-step :title="$t('confirm')" />
      <a-step :title="$t('complete')" />
    </a-steps>
    <div class="content">
      <step1 v-if="current === 0" @nextStep="nextStep"></step1>
      <step2 v-if="current === 1" @nextStep="nextStep" @prevStep="prevStep"></step2>
      <step3 v-if="current === 2" @prevStep="prevStep" @finish="finish"></step3>
    </div>
  </a-card> -->
  <div style="background-color: #fff;padding: 20px;">
    <a-table
      :dataSource="searchData"
      :columns="columns"
      :pagination="false"
      bordered
      size="middle"></a-table>
    <div style="text-align: right;margin-top: 20px;margin-right: -8px;">
      <a-pagination
      show-size-changer
      :current="current1"
      :pageSize="pageSize"
      :total="500"
      @showSizeChange="onShowSizeChange" />
    </div>
  </div>
    
</template>

<script>
// import Step1 from './Step1'
// import Step2 from './Step2'
// import Step3 from './Step3'
const searchData = []
for (let i = 0; i < 10; i++) {
  searchData.push({
    index: i + 1,
    keyword: '关键词-' + i,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2)
  })
}

const columns = [
  {
    title: 'ID',
    dataIndex: 'index',
    key: 'rank'
  },
  {
    title: 'NAME',
    dataIndex: 'keyword',
    key: 'keyword',
    scopedSlots: {customRender: 'keyword'}
  },
  {
    dataIndex: 'count',
    key: 'users',
    sorter: (a, b) => a.count - b.count
  },
  {
    title: '周涨幅',
    dataIndex: 'range',
  }
]

export default {
  name: 'StepForm',
  i18n: require('./i18n'),
  data () {
    return {
      current1:1,
      pageSize:20,
      searchData,
      columns
    }
  },
  methods: {
    onShowSizeChange:function(e){
      console.info(e);
    }
  }
  
}
</script>

<style lang="less" scoped>
  .steps{
    max-width: 950px;
    margin: 16px auto;
  }
</style>
