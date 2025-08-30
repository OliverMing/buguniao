<template>
    <div class="w-100 h-100 pr">
      <img class="w-100" :src="require(`@/assets/image/${content.cover}.jpg`)" alt="">
      <!-- <div class="pa theme-title">
         <i>{{ content.time }}</i>
      </div> -->
      <div class="pa theme-title p2">
         <span :class="[`${content.cover}-title`]">{{ content.title }}</span>
      </div>
      <div class="pa time flex align-center">
         <div><span>建仓时间</span>{{ content.days1 }}</div>
         <div><span style="padding-right: 5%">布局时间</span>{{ content.days2 }}</div>
      </div>

      <div class="pa flex justify-center tips">{{ content.tips }}</div>
 
      <!-- 股票代码 -->
      <div class="pa stock flex align-center">
          <span :class="[`${content.cover}`]">股票代码 {{ content.code }}</span>
          <!-- <span>买入评级 {{ content.jibie }}</span> -->
      </div>
      
      <!-- <div class="pa bt b1">{{ content.m1 }}</div>
      <div class="pa bt b2">{{ content.m2 }}</div>
      <div class="pa bt b3">{{ content.m3 }}</div>
      <div class="pa bt b4">{{ content.m4 }}</div>
      <div class="pa bt b5">{{ content.m5 }}</div> -->
 
 
    </div>
 </template>
 
 <script>
 export default {
    props: {
      content:Object
    },
 };
 </script>
 
 <style scoped>
 .theme-title{left:11%;top: 4%;font-size:3.6em;opacity: .8;}
 .cf1-title{color: #9a4326;letter-spacing: 0.05em;
    text-shadow:0px 1px 0px #9a4326,    
      0px 2px 0px #e4ae2a,    
      0px 3px 0px #9a4326,    
      0px 4px 0px #9a4326,    
      0px 5px 10px #9a4326;}

      .cf3-title{color: #fff;letter-spacing: 0.05em;
    text-shadow:0px 4px 0px rgba(0,0,0,.5),    
      0px 2px 0px rgba(0,0,0,.5),    
      0px 3px 0px rgba(0,0,0,.5),    
      0px 4px 0px rgba(0,0,0,.5),    
      0px 5px 10px rgba(0,0,0,.5);}

      .cf2-title{color: #ffe041;letter-spacing: 0.05em;
    text-shadow:2px 6px 0px rgba(0,0,0,.5),    
      0px 2px 0px rgba(0,0,0,.5),    
      0px 3px 0px rgba(0,0,0,.5),    
      0px 4px 0px rgba(0,0,0,.5),    
      0px 5px 10px rgba(0,0,0,.5);}

      .cf4-title{color: #fff;letter-spacing: 0.05em;
    text-shadow:2px 6px 0px rgba(255,72,65,.5),    
      0px 2px 0px rgba(255,72,65,.5),    
      0px 3px 0px rgba(255,72,65,.5),    
      0px 4px 0px rgba(255,72,65,.5),    
      0px 5px 10px rgba(255,72,65,.5);}
 
 
 .p2{top:7%;left: 0;right: 0;text-align: center;font-size: 5.2em;font-weight: bold;}
 
 .time{top: 5.8%;left: 0;right: 0;font-size: .8em;color: #ffe9ab;font-weight: bold;}

 .time>div{width:49%;padding-left: 22%;}

 .time>div span{color: red !important;padding-right:8%;}
 .time>div:last-child{margin-left:2%;padding-left: 5%;}
 .stock{padding-left:12%;left: 0;right: 0;height: 4%;top: 31.3%;}
 .stock span{font-size: 1.4em;font-weight: bold;}

.cf1{color: #9a4326;}
.cf2{color: #fff;}
.cf3{color: #fff;}
.cf4{color: #fff;}
 
 .bt{color: #ded801;font-size: 1.2em;font-weight: 600;letter-spacing: .1em;}
 
 .b1{top: 73.8%;left: 8.2%;}
 .b2{top: 73.8%;left: 43.5%;}
 .b3{top: 73.8%;left: 76%;}
 .b4{top: 80.2%;left: 19%;}
 .b5{top: 80.2%;left: 64%;}
 


 .tips{left: 0;right: 0;top: 25%;font-size: 1.1em;letter-spacing: 0.06em;color: #9a4326;font-weight: 800;}


 </style>