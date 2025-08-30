<template>
  <!-- 正文 -->
  <div class="bg-box">
    <div class="top-box flex align-center justify-center">
      <span class="top-span">市场深度解析</span>
      <div class="time flex justify-center align-center flex-column">
        <div>{{ timeSplit(false) }}</div>
        <div class="time2">{{ timeSplit(true) }}</div>
      </div>
      <span class="top-span">教学案例</span>
      <div class="flex right-logo">
        <div>申睿</div>
        <div>智胜</div>
      </div>
    </div>
    <div class="content flex align-center">
      <img style="height: 300px;" src="@/assets/image/jxal.png" />
      <img v-if="content" :src="content" style="height: 300px;">
    </div>
    <div class="tips">
      以上内容仅作为模型案例学习，不构成买卖操作建议，申睿智胜 证券服务标杆企业 投资有风险，入市需谨慎
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
        return isYear ? `${str[0]}` : `${str[1]}/${str[2]}`;
      }
    }
  }
}
</script>

<style scoped>
.bg-box {
  position: relative;
  background-color: #181d71;
  width: max-content;
  padding: 0 20px;
  text-align: left;
  padding-top: 6px;
}

.top-span{
  font-size: 32px;
  color: #FFF;
  font-weight: bold;
  letter-spacing: 4px;
}

.right-logo{
   margin-left: 20px;
   background-color: #FFF;

   div{
    width: max-content;
    font-size: 24px;
    color: #000;
    font-weight: bold;
    padding: 0 10px;
   }

   div:last-child{
     background-color: #efd268;
   }
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


.content{
  border-radius:6px;
  overflow-x: hidden;

  img:first-child{
    border: 2px solid #f6c999;
    border-radius: 6px 0 0 6px;
    border-right: none;
  }

  img:nth-child(2){
    border: 2px solid #FFF;
    border-radius: 0 6px 6px 0;
    border-left: none;
  }
}

/* div {
  width: 100%;
  height: 100%;
  text-align: center;
} */

.time {
  border: 1px solid rgba(255,255,255,.5);
  width: max-content;
  padding: 4px 10px;
  font-weight: bold;
  color: #fff;
  font-size: 1em;
  border-radius: 6px;
  margin: 0 20px;

  div {
    /* padding: 0 10px; */
    /* height:; */
    height: max-content;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.time2 {
  color: #000;
  background-color: #efd268;
  font-size: 0.7em;
  padding: 0 8px;
}

.tips {
  color: rgba(255,255,255,.5);
  font-size: 10px;
  padding: 10px 0;
  text-align: center;
}
</style>