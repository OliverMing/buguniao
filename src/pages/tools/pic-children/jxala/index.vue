<template>
  <!-- 正文 -->
  <div class="bg-box">
    <div class="time flex justify-center align-center flex-column">
      <div>{{ timeSplit(false) }}</div>
      <div class="time2">{{ timeSplit(true) }}</div>
    </div>

    <img class="top" src="@/assets/image/jiaoxueanli-top.png" />
    <div class="content flex justify-center align-center">
      <img v-if="content" :src="content" style="width: 100%;height: auto;">
    </div>
    <div class="tips flex justify-center align-center">
      本产品风险级别为RA，适合积极型及以上级别客户使用，观点及历史案例仅供参考，
      不作为投资建议，据此操作风险自担，投资有风险，入市需谨慎。
      【申港申享世家(申容智胜)投资顾问团队:罗力川执业证编S1660625040010】
    </div>
  </div>
</template>

<script>
export default {
  props: {
    time: String,
    content: String
  },
  computed: {
    timeSplit() {
      return isYear => {
        let str = this.time.split('-');
        return isYear ? `${str[0]}-${str[1]}` : `${str[2]}`;
      }
    },
    getimage() {
      return this.content.split('src="')[1].split('"')[0]
    }
  }
}
</script>

<style lang="less" scoped>
.bg-box {
  width: 100%;
  position: relative;
  background-color: #dc1c1b;
  text-align: left;


  .time {
    width: 55px;
    font-weight: bold;
    color: #000;
    font-size: .95em;
    overflow: hidden;
    border-radius: 4px;
    position: absolute;
    top: 10px;
    left: 222px;

    div {
      height: max-content;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFF;
    }
  }

  .time2 {
    color: rgba(0,0,0,.7) !important;
    font-size: .85em;
    margin-top: 5px;
  }



  .top {
    width: 100%;
  }

  .content {
    min-height: 280px;
    background-color: #f8f8f8;
    text-align: center;
  }

  .tips {
    background-color: #69a9fd;
    color: rgba(0, 0, 0, .6);
    font-size: .65rem;
    padding: 10px 0;
    padding: 10px 6%;
    text-align: center;
  }
}
</style>