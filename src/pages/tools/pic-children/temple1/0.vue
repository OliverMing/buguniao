<template>
    <!-- 正文 -->
    <div>
      <img class="w-100" src="@/assets/images/temple1/0.png" />
      <div class="info-box">
        <div class="content">
          <div class="time flex justify-center">
            <div class="time-box flex justify-center align-center">{{ time }}</div>
          </div>
          <div v-html="content" class="content-main"></div>
          <img class="w-100" src="@/assets/images/temple1/0bg1.png" />
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
  .content{background: #e3d1bb;font-size:14px;line-height: 22px;padding-bottom: 0;position: relative;}
  .time{position: absolute;left: 0;right: 0;}
  .time-box{height: 30px;background:url('~@/assets/images/temple0/0-title.png') no-repeat;background-size: 100% 100%;width: 45%;
    border-radius: 80px;color: #c74e4b;font-weight: bold;font-size: 16px;margin-top: 10px;}
  .content-main{background:url('~@/assets/images/temple1/0bg.png') repeat-y;background-size: 100% auto;min-height: 400px;margin:-2px 0 -10px 0;
    border-radius: 12px;padding: 15px;text-align: justify;padding:30px;padding-top: 50px;padding-bottom: 10px;}
  .bottom{font-size: 12px;text-align: center;padding: 10px;}
  </style>
    