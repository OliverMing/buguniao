<template>
  <!-- 正文 -->
  <div class="bg-box">
    <div class="top-box flex align-center justify-center">
      <img style="margin-top: 6px;" src="@/assets/image/mxnc_top1.png" />
      <div style="margin: 0 24px;width: max-content;" class="flex align-center justify-center">
          <div class="time flex justify-center align-center flex-column">
            <div>{{ timeSplit(true) }}</div>
            <div class="time2">{{ timeSplit(false) }}</div>
          </div>
          <span style="font-size: 32px;color: #FFF;font-weight: bold;">模型内参</span>
      </div>
      <img src="@/assets/image/mxnc_top2.png" />
    </div>
    <div class="content flex align-center">
      <img style="height: 300px;" src="@/assets/image/mxnc1.png" />
      <img v-if="content" :src="content" style="height: 300px;">
    </div>
    <div class="tips">
      以上内容仅作为模型案例学习，不构成买卖操作建议，股市有风险，投资需谨慎
    </div>
    <!-- 日期 -->



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
        return isYear ? `${str[0]}年${str[1]}` : `${str[2]}日`;
      }
    },
    getimage() {
      return this.content.split('src="')[1].split('"')[0]
    }
  }
}
</script>

<style scoped>
.bg-box {
  position: relative;
  background-color: #dc1c1b;
  width: max-content;
  padding: 0 20px;
  text-align: left;
  padding-top: 6px;
}

.top-box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;
  
  img{
    height: 70%;
  }
}

.cover {
  height: 100%;
  width: auto;
}

.content p,
div {
  width: 100%;
  height: 100%;
  text-align: center;
}

.time {
  border: 1px solid #fff;
  width: max-content;
  height: 80%;
  font-weight: bold;
  color: #fff;
  font-size: 0.85em;
  border-radius: 6px;
  margin-right: 10px;

  div {
    padding: 0 10px;
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.time2 {
  color: red;
  margin-top: 6px;
  background-color: #fff;
}

.tips {
  color: #e6b496;
  font-size: 10px;
  padding: 10px 0;
}
</style>

<style>
p {
  width: 100% !important;
  height: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
}

p img {
  width: auto !important;
  height: 300px !important;
  border-left: 1px solid #000;
}
</style>