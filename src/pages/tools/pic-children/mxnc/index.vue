time<template>
  <!-- 正文 -->
  <div class="bg-box">
    <div class="top-box flex align-center justify-around"  v-if="contentWidth" :style="{ width:`${contentWidth + 12}px` }">
      <div class="flex align-center">
          <div class="time flex justify-center align-center flex-column">
            <div>{{ timeSplit(true) }}</div>
            <div class="time2">{{ timeSplit(false) }}</div>
          </div>
      </div>
      <div class="flex-1 flex justify-center" style="font-size: 32px;color: #FFF;font-weight: bold;">模型内参</div>
      <div class="flex justify-end">
        <img style="border-radius: 6px;height: 40px;" src="@/assets/image/mxnc_top3.png" />
      </div>
    </div>
    <div class="content">
      <!-- <img style="height: 300px;" src="@/assets/image/mxnc-rtzs1.png" /> -->
      <img ref="cover" v-if="content" :src="content" style="width: auto;max-width: 1000px;" @load="getSize">

      <div class="tips" v-if="contentWidth" :style="{ width:`${contentWidth}px` }">
        【仅为部分案例特定区间历史业绩展示，不代表全部案例表现，不代表实际收益，不代表任何收益保证，上扬幅度参考同花顺/通达信等终端数据。案例仅供参考，不构成任何投资建议，决策自主，风险自担。股市有风险，投资需谨慎!】
      </div>
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
  data() {
    return {
      contentWidth: 0
    }
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
  },
  methods:{
    getSize() {
        const img = this.$refs.cover;
        this.contentWidth = img.width > 1000 ? 1000 : img.width;
    }
  }
}
</script>

<style scoped>
.bg-box {
  position: relative;
  background-color: #dc1c1b;
  width: auto;
  padding: 0 20px;
  text-align: left;
  padding-top: 6px;
  /* max-width: 700px; */
}

.top-box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;
  padding: 0 10px;
}

.content {
  img{
    width: 100%;
    border: 5px solid #f9fd00;
  }
}

.cover {
  height: 100%;
  width: auto;
}


.time {
  border: 1px solid #fff;
  width: max-content;
  height: 50px;
  font-weight: bold;
  color: #fff;
  font-size: 1em;
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
  margin-top: 2px;
  background-color: #fff;
  width: 100%;
}

.tips {
  color: #e6b496;
  font-size: .85rem;
  line-height: 1.2rem;
  padding: 1rem 0;
  text-align: center;
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