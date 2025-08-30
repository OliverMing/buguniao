<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
       <a-form-item>
           <a-input addon-before="预约中标题" v-model="data.top" />
           <a-input addon-before="温馨提示" v-model="data.tips" />
       </a-form-item>
    </a-form>
</template>

<script>

export default {
   mode:{
       event:"input"
   },
   props:{
       current:Number,
       title:String
   },
   data(){
       return {
           data:{
               top:'周四正在预约',
               tips:'温馨提示：以上分析由顾老师分析判断，不做具体承诺保证，股市有风险，投资需谨慎'
           }
       }
   },
   watch:{
        data:{
           deep:true,
           immediate:true,
           handler(){
               this.change();
           }
       },
   },
   methods: {
      change() {
           this.$emit("input",this.data);
      },
   },
}
</script>