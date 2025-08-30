<template>
    <!-- 正文 -->
    <div class="bg-box h-100 w-100">
      <div class="small-title">
        <i>{{ content.smallTitle  }}</i>
      </div>
      <img class="h-100" :src="require(`@/assets/image/${content.cover}.png`)" />

      <div class="guwen">{{ content.guwen }}</div>
      <div class="guwen guwen-number">{{ content.guwenNumber }}</div>
      

      <div class="right-box">
         <div style="height:47.5%" v-for="(item,index) in content.list" :key="index">
          <div class="top-box flex justify-center align-center">{{ item.title }}</div>
          <!-- <div class="list-item list-title flex">
              <div>推送日期</div>
              <div>股票代码</div>
              <div>股票名称</div>
              <div>交易周期</div>
              <div>涨跌情况</div>
          </div> -->

          <div class="right-list">
              <div class="list-item flex" v-for="(e,i) in item.list" :key="i">
                <div style="color:#000">{{ e.time || '-' }}</div>
                <div class="blue">{{ e.code || '-' }}</div>
                <div class="blue">{{ e.name || '-' }}</div>
                <div style="color:#000">{{ e.zhouqi || '-' }}</div>
                <div style="color:#c31e0b">
                    {{ e.number }}
                    <span v-if="e.number">%</span>
                    <span v-else>-</span>
                </div>
            </div>
          </div>
         </div>
         <div class="tips flex justify-center align-center">{{ content.tips }}</div>
      </div>
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
.right-box{position: absolute;left: 31.7%;right: 0;top: 0;height: 100%;background-color:#fff;}

.top-box{height: 15%;background-color: #edc02e;font-size: 1.2em;letter-spacing: 0.2em;color: #1a1a1a;}
.list-title{height: 6% !important;background-color: #ddd;font-size: .75em;}
.list-title>div{display: flex;justify-content: center;align-items: center;height: 100%;line-height: 6%;}
.right-list{height: calc(100% - 15%);}
.list-item{height: 20%;border-bottom: 1px solid #ccc}
.list-item>div{flex: 1;text-align: center;display: flex;font-size: 1.1em;
    justify-content: center;align-items: center;border-right: 1px solid #ccc;height: 100%;}

.blue{color: #2196f3;}
.guwen{position: absolute;top: 77%;left: 6.4%;font-size: .75em;color: #1a1a1a;opacity: .8;}

.guwen-number{top: 84.4%;left: 6.4%;}
.small-title{font-size: 1em;position: absolute;width: 18%;top: 17.4%;left: 4.6%;text-align: center;color: #fff;letter-spacing: .1em;font-weight: bold;}
.tips{height: 5%;background-color: #ececec;font-size: .7em;}
</style>