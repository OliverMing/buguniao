<template>
    <!-- 正文 -->
    <div class="bg-box">
      <img class="w-100" src="@/assets/image/b.jpg" />
      <div class="name-box">
        <span v-for="(item,index) in name" :key="index" :style="{'font-size':`${22 + index}px` }">{{ item }}</span>
      </div>
      <div class="content">
        <div v-html="content"></div>
      </div>
    </div>
  </template>
    
  <script>
  export default {
    props:{
      name:String,
      time:String,
      content:String
    }
  }
  </script>
    
<style scoped>
.bg-box{position: relative;}
.content{position: absolute;z-index: 1;top: 37.5%;left: 5.6%;width: 89%;height: 46.7%;overflow: hidden;background-color: #fff;overflow-x: hidden;padding: 6px;}
.content p{width: 100%; height: 100%;text-align: center;}
.name-box{position: absolute;z-index: 2;top: 19.5%;left: 32.6%;transform: rotate(-5deg);
  font-weight: bold;font-size: 24px;color: #e5d75b;-webkit-text-stroke: 1px #1139d4;}






















</style>

<style>
.content p{width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;}
p img{ width: 50% !important;height: 100% !important;object-fit: cover !important;}
/* object-fit: c !important; */
</style>
    