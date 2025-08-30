<template>
    <!-- 正文 -->
    <div class="bg-box">
      <img class="w-100" src="@/assets/image/a.jpg" />
      <!-- 日期 -->
      <div class="time flex justify-center align-center flex-column">
        <div>{{ timeSplit(false) }}</div>
        <div>{{ timeSplit(true) }}</div>
      </div>
      <div class="content flex align-center justify-center">
        <!--  -->
        <div v-html="content"></div>
      </div>
    </div>
  </template>
    
  <script>
  export default {
    props:{
      time:String,
      content:String
    },
    computed:{
      timeSplit(){
        return isYear => {
          let str = this.time.split('-');
          return isYear ? str[0] : `${str[1]}-${str[2]}`;
        }
      }
    }
  }
  </script>
    
<style scoped>
.bg-box{position: relative;}
.content{position: absolute;z-index: 1;top: 16.4%;left: 28.6%;width: 66%;height: 77%;overflow: hidden;background-color: #fff;border-radius: 0 6px 6px 0;overflow-x: hidden;}
.content p, div{width: 100%; height: 100%;text-align: center;}

.time{position: absolute;z-index: 2;top: 3%;left: 16.6%;width:10%;height: auto;color: #fff;font-size: 0.9em;opacity: .8;}
</style>

<style>
p{width: 100% !important;height: 100% !important;display: flex;align-items: center;justify-content: center;}
p img{ width: 100% !important;height: auto !important;object-fit: contain !important;max-height: 100%;}
</style>
    