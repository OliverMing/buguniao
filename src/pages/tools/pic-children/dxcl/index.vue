<template>
   <div class="w-100 h-100 pr">
     <img class="w-100" src="@/assets/image/dxcl.jpg" alt="">
     <div class="pa top-title flex justify-center align-center">
        <div class="flex align-center" v-for="(item,index) in splitContent()" :key="index">
         {{item}} <div v-if="index < splitContent().length - 1" class="line"></div>
        </div>
     </div>

     <div class="pa tips">
      {{ content.tips }}
     </div>
   </div>
</template>

<script>
export default {
   props: {
     content:Object
   },
   methods: {
      splitContent(){
          return  this.content.top?.split('') ?? [];
      },
   },
};
</script>

<style scoped>
.top-title{
   top: 23%;
   left:0;
   right: 0;
   text-align: center;
   font-size: 1.2rem;
   line-height: 1.2rem;
   font-weight: 700;
   color: #f8eac0;

   .line{
      width: 2px;
      height: 16px;
      background: #f8eac0;
      margin: 0 10px;
      margin-top:2px
   }
}


.tips{
   left: 0;
   right: 0;
   text-align: center;
   bottom: 4.5%;
   z-index: 9;
   color:#f8eac0;
   padding: 0 10%;
   font-size:.5rem;
}
</style>