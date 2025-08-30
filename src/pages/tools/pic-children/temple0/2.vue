<template>
  <!-- 正文 -->
  <div>
    <img class="w-100" src="@/assets/images/temple0/2.png" />
    <div class="info-box">
      <div class="content">
        <div class="time flex justify-center">
          <div class="time-box flex justify-center align-center">{{ time }}</div>
        </div>
        <div v-html="content" class="content-main"></div>
      </div>
      <!-- 底部 -->
      <div class="bottom">
        <img src="@/assets/images/bottom0.png" class="w-100" alt="">
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
.content{background: linear-gradient(to bottom,#fe9834,#fed17e 30%);
  font-size:14px;line-height: 22px;position: relative;}
.time{position: absolute;left: 0;right: 0;}
.time-box{height: 30px;background:url('~@/assets/images/temple0/2-title.png') no-repeat;background-size: 100% 100%;width: 45%;color: #c74e4b;font-weight: bold;font-size: 16px;}
.content-main{background: #fff;min-height: 400px;margin: 0 10px;
  border-radius: 12px;padding: 15px;text-align: justify;padding-top: 40px;}
.bottom{font-size: 12px;text-align: center;padding: 10px;color: #970603;}















</style>
  