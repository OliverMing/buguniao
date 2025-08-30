<template>
    <!-- 正文 -->
    <div class="bg-box">
      <img class="w-100" src="@/assets/image/1.png" />
      <!-- 标题 -->
      <div class="theme-title">
        <i>{{ content.name }}系列战绩统计</i>
      </div>
      <!-- 日期 -->
      <div class="time">{{ content.weekTime }}</div>

      <!-- 列表title -->
      <div class="flex list-title">
        <div class="flex-1"><span>日期</span></div>
        <div class="flex-1"><span>龙头标的</span></div>
        <div class="flex-1"><span>股票代码</span></div>
        <div style="width: 19.2%;"><span>实际涨幅</span></div>
      </div>
      <!-- {{ content }} -->
      <div class="content-box">
        <div class="flex justify-start align-center" v-for="(item,index) in content.list" :key="index">
          <div class="flex-1">{{ item.time }}</div>
          <div class="flex-1">{{ item.name }}</div>
          <div class="flex-1 red-color">{{ item.code }}</div>
          <div class="count-size red-color" style="width: 19.2%;">{{ item.number }}</div>
        </div>
      </div>
      <!-- 底部提示 -->
      <div class="bottom-tips">{{ content.tips }}</div>
    </div>
  </template>
    
  <script>
  export default {
    props:{
      content:Object
    },
    computed:{
    }
  }
  </script>
    
<style scoped>
.bg-box{position: relative;}
.time{position: absolute;z-index: 2;top: 16%;left: 38%;height: auto;color: #fff;font-size: 1em;font-weight: bold;}
.content-box{position: absolute;left: 6.5%;top: 35%;width: 87.8%;height: 60.5%;}

.content-box>div{height: 20%;}
.content-box>div div{height: 100%;display: flex;justify-content: center;align-items: center;font-weight: bold;color: #1a1a1a;font-size: .9em;}

.red-color{color: #c31e0b !important;}

.theme-title{position: absolute;top: 2.6%;left:0;font-size: 1.8em;font-weight: bold;width: 100%;text-align: center;}
.theme-title>i{text-shadow: 0.16em 0.16em 0.2em rgba(0,0,0,0.4);color: #fff;letter-spacing: 0.2em;padding-left: 6%;}

.list-title{position: absolute;top: 26%;left: 6.5%;right: 5.8%;}

.list-title>div{text-align: center;}

.list-title span{background-color: #a60b00;color: rgba(255,255,255,.9);font-size: .8rem;font-weight: bold;border-radius:500px;display: inline-block;width: 6em;height: 2em;line-height: 1.8em;text-align: center;}
.bottom-tips{position:absolute;left: 0;right: 0;bottom: 0.52em;font-size: 0.52em;text-align: center;color: #eee2cb;}
</style>