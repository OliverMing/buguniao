<template>
    <!-- 正文 -->
    <div class="bg-box">
      <img class="w-100" src="@/assets/image/2.png" />
      <!-- 标题 -->
      <div class="theme-title">
        <i>{{ content.name }}系列战绩统计</i>
      </div>

       <!-- 标题 -->
       <div class="small-title">
        {{ content.smallTitle }}
      </div>

      <!-- 日期 -->
      <div class="time">
        <i>{{ content.weekTime }}</i>
      </div>
      <!-- {{ content }} -->
      <div class="content-box">
        <div class="flex justify-start align-center">
          <div class="flex-1">日期</div>
          <div class="flex-1">龙头标的</div>
          <div class="flex-1 red-color">股票代码</div>
          <div class="flex-1 red-color">实际涨幅</div>
        </div>

        <div class="flex justify-start align-center" v-for="(item,index) in content.list" :key="index">
          <div class="flex-1">{{ item.time.split('(')[0] }}</div>
          <div class="flex-1">{{ item.name }}</div>
          <div class="flex-1 red-color">{{ item.code }}</div>
          <div class="flex-1 count-size red-color">{{ item.number }}</div>
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
.time{position: absolute;z-index: 2;top: 42.8%;left: 20%;height: auto;color: #ffd19b;font-size: 1em;font-weight: bold;
width: 60.4%;text-align: center;}
.content-box{position: absolute;left: 6.8%;top: 49.6%;width: 85.6%;height: 41%;}

.content-box>div{height: calc(14.266%);margin-bottom: 2%;}
.content-box>div div{height: 100%;display: flex;justify-content: center;align-items: center;font-weight: bold;color: #1a1a1a;font-size: .75em;text-align: center;line-height: 1.2em;}

.red-color{color: #c31e0b !important;}

.theme-title{position: absolute;top: 6%;left:0;font-size: 2.2em;font-weight: bold;width: 100%;text-align: center;}
.theme-title>i{color: #fff;letter-spacing: 0.05em; text-shadow:0px 1px 0px #c31e0b,    
	 0px 2px 0px #c31e0b,    
	 0px 3px 0px #c31e0b,    
	 0px 4px 0px #c31e0b,    
	 0px 5px 10px rgba(0, 0, 0, .6);}

.small-title{position: absolute;top:18.8%;left:0;font-size: 1em;font-weight: bold;width: 100%;text-align: center;letter-spacing: .2em;color: #c31e0b;}

.bottom-tips{position:absolute;left:5%;right: 5%;bottom: 2%;font-size: 0.4em;text-align: center;color: #eee2cb;}

</style>