<template>
  <!-- 正文 -->
  <div>
    <img class="w-100" src="@/assets/images/temple1/2.png" />
    <div class="info-box">
      <div class="content">
        <div class="time flex justify-center">
          <div class="time-box flex justify-center align-center">{{ time }}</div>
        </div>
        <div class="content-main" v-html="content">
        </div>
      </div>
      <!-- 底部 -->
      <div class="bottom">
        <img src="@/assets/images/bottom1.png" class="w-100" alt="">
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  props:{
    time:String,
    content:String
  }
}
</script>
  
<style scoped>
.info-box{font-size: 28px;width: 100%;}
.content{background:#fa9c22;font-size:14px;line-height: 26px;padding-bottom: 0;position: relative;}
.time{position: absolute;left: 0;right: 0;}
.time-box{height: 30px;width: 45%;color: #c74e4b;font-weight: bold;font-size: 18px;margin-top: -34px;}
.content-main{background:#fefbea;min-height:400px;margin:-4px 12.7px 0px 12.78px;
  text-align: justify;padding: 15px}
.bottom{font-size: 12px;text-align: center;padding: 10px;}
</style>
  