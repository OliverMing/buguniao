<template>
    <!-- 正文 -->
    <div class="bg-box">
      <img class="w-100" src="@/assets/image/rtzy.jpg" />
      <!-- 标题 -->
      <div class="theme-title">
        {{ content.name }}
      </div>

       <!-- 标题 -->
       <div class="small-title">
        {{ content.smallTitle }}
      </div>

      <!-- 日期 -->
      <!-- <div class="time">
        {{ content.weekTime }}
      </div> -->
      <!-- {{ content }} -->
      <div class="content-box">
        <div class="flex justify-start align-center">
          <div class="flex-1">分享时间</div>
          <div class="flex-1">股票名称</div>
          <div class="flex-1 red-color">股票代码</div>
          <div class="flex-1 red-color">实际涨迭幅</div>
        </div>

        <div class="flex justify-start align-center" v-for="(item,index) in content.list" :key="index">
          <div style="width: 24.2%;">{{ item.time.split('(')[0] }}</div>
          <div class="flex-1">{{ item.name }}</div>
          <div class="flex-1">{{ item.code }}</div>
          <div :class="[
            'flex-1 count-size',
            item.number.includes('+') ? 'red-color' : 'green-color'
          ]">{{ item.number }}</div>
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
.time{position: absolute;z-index: 2;top: 28.5%;left: 20%;height: auto;color: #c31e0b;font-size: 1.5em;font-weight: bold;
width: 60.4%;text-align: center;}
.content-box{position: absolute;left: 2.5%;top:29.4%;width: 93%;height: 56.5%;}

.content-box>div:first-child{height: 9%;margin-bottom: 4.5%;}
.content-box>div{height: 17.3%;}
.content-box>div div{height: 100%;display: flex;justify-content: center;align-items: center;
  font-weight: bold;color: #1a1a1a;font-size: 1em;text-align: center;display: flex;align-items: center;}

.red-color{color: #c31e0b !important;}
.green-color{color: #008000 !important;}

.theme-title{position: absolute;top: 10%;left:0;font-size: 2.5em;font-weight: 800;width: 100%;text-align: center;
  color: #FFF;letter-spacing: 4px; text-shadow:4px 5px 8px rgba(0, 0, 0, 0.2);transform: rotate(-7deg);}

/* .theme-title>i{color: #fff;letter-spacing: 0.05em; text-shadow:0px 1px 0px rgba(0, 0, 0, .2),    
	 0px 2px 0px rgba(0, 0, 0, .4),    
	 0px 3px 0px rgba(0, 0, 0, .4),    
	 0px 4px 0px rgba(0, 0, 0, .4),    
	 0px 5px 10px rgba(0, 0, 0, .4);} */

.small-title{position: absolute;
  top:18%;left:0;font-size: 1.3em;
  font-weight: bold;width: 100%;text-align: center;letter-spacing: .2em;color: #FFF;transform: rotate(-7deg);}

.bottom-tips{position:absolute;left:5%;right: 5%;bottom: 2%;line-height: 1rem;
  font-size: .71em;text-align: left;color: rgba(255,255,255,0.8);word-break: break-all;}

</style>