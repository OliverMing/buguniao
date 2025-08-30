<template>
   <div class="w-100 h-100 pr">
     <img class="w-100" :src="require(`@/assets/image/${content.cover}.jpg`)" alt="">
     <div class="pa theme-title">
        <i>{{ content.time }}</i>
     </div>
     <div class="pa theme-title p2">
        <i>{{ content.title }}</i>
     </div>
     <div class="pa time flex align-center">
        <div>建仓时间</div>
        <div>{{ content.days }}</div>
     </div>

     <!-- 股票代码 -->
     <div class="pa stock flex justify-center align-center">
         <span>股票代码 {{ content.code }}</span>
         <span>买入评级 {{ content.jibie }}</span>
     </div>
     
     <div class="pa bt b1">{{ content.m1 }}</div>
     <div class="pa bt b2">{{ content.m2 }}</div>
     <div class="pa bt b3">{{ content.m3 }}</div>
     <div class="pa bt b4">{{ content.m4 }}</div>
     <div class="pa bt b5">{{ content.m5 }}</div>


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
.theme-title{left:11%;top: 6%;font-size:3.6em;}
.theme-title>i{color: #fff;letter-spacing: 0.05em; text-shadow:0px 1px 0px #ded801,    
	 0px 2px 0px #ded801,    
	 0px 3px 0px #ded801,    
	 0px 4px 0px #ded801,    
	 0px 5px 10px rgba(0, 0, 0, .6);}

.p2{top: 14.5%;left: 0;right: 0;text-align: center;font-size: 5.2em;font-weight: bold;}

.time{top: 14.8%;left: 60%;width: 40%;font-size: .8em;padding-left: .6em;color: #cb0000;font-weight: bold;}
.time>div:last-child{margin-left: 1.8em;color: #fff;}
.stock{left: 0;right: 0;height: 4%;top: 30%;color: #fff;}
.stock span{text-shadow:0px 0px 2px #cb0000, 0px 2px 0px #000,    
	 0px 0 2px #cb0000,    
	 0px 0 2px #cb0000,    
	 0px 0 2px #cb0000;font-size: 1.2em;}
.stock span:nth-child(2){margin-left: 20%;}

.bt{color: #ded801;font-size: 1.2em;font-weight: 600;letter-spacing: .1em;}

.b1{top: 73.8%;left: 8.2%;}
.b2{top: 73.8%;left: 43.5%;}
.b3{top: 73.8%;left: 76%;}
.b4{top: 80.2%;left: 19%;}
.b5{top: 80.2%;left: 64%;}

</style>