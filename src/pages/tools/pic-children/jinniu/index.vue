<template>
    <!-- 正文 -->
    <div class="bg-box">
      <img class="w-100" src="@/assets/image/jinniu1.png" />
      <!-- 标题 -->
      <div class="theme-title">
        {{ content.name }}系列战绩统计
      </div>

       <!-- 标题 -->
       <!-- <div class="small-title">
        {{ content.smallTitle }}
      </div> -->

      <!-- 日期 -->
      <div class="time">
        <!-- {{ content.weekTime }} -->
      </div>
      <!-- {{ content }} -->
      <div class="content-box">
        <!-- <div class="flex justify-start align-center">
          <div class="flex-1">日期</div>
          <div class="flex-1">龙头标的</div>
          <div class="flex-1 red-color">股票代码</div>
          <div class="flex-1 red-color">实际涨幅</div>
        </div> -->

        <div class="flex justify-start align-center" v-for="(item,index) in content.list" :key="index">
          <div class="flex-1">{{ item.time.split('(')[0] }}</div>
          <div class="flex-1">{{ item.name }}</div>
          <div class="flex-1 red-color">{{ item.code }}</div>
          <div class="flex-1 count-size red-color">{{ item.number }}</div>
        </div>
      </div>
      <!-- 底部提示 -->
      <!-- <div class="bottom-tips">{{ content.tips }}</div> -->
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
.time{position: absolute;z-index: 2;top: 27.5%;left: 20%;height: auto;color: #c31e0b;font-size: 1.5em;font-weight: bold;
width: 60.4%;text-align: center;}
.content-box{position: absolute;left: 17%;top:51.5%;width: 65%;height: 36%}

.content-box>div{height: 16.5%;margin-bottom: 4.1%;}
.content-box>div div{height: 100%;display: flex;justify-content: center;align-items: center;
  font-weight: bold;color: #1a1a1a;font-size: .85em;text-align: center;line-height: 1.2em;}

.red-color{color: #c31e0b !important;}

.theme-title{position: absolute;top: 5.5%;left:0;font-size: 2.4em;font-weight: bold;width: 100%;text-align: center;}
.theme-title {color: #f8e09e;letter-spacing: 0.2em; text-shadow:0px 1px 0px rgba(0, 0, 0, .2),    
	 0px 2px 0px rgba(0, 0, 0, .2),    
	 0px 3px 0px rgba(0, 0, 0, .2),    
	 0px 4px 0px rgba(0, 0, 0, .2),    
	 0px 5px 10px rgba(0, 0, 0, .2);}

.small-title{position: absolute;top:19.8%;left:0;font-size: 1.8em;font-weight: bold;width: 100%;text-align: center;letter-spacing: .2em;color: #c31e0b;}

.bottom-tips{position:absolute;left:5%;right: 5%;bottom: 2px;font-size: 0.4em;text-align: center;color: #eee2cb;}

</style>