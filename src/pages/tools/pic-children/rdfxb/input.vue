<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
       <a-form-item>
           <a-input addon-before="标题A" v-model="form.title1" placeholder="机构名称" />
           <a-input addon-before="标题B" v-model="form.title2" placeholder="标题" />
           <a-input addon-before="日期" v-model="form.time" placeholder="日期" />
           
       </a-form-item>
    </a-form>
</template>

<script>
import moment from 'moment';

export default {
   mode:{
       event:"input"
   },
   data(){
       return {
        form:{
            time:null,
            title1:"“热点”",
            title2:'风向标'
        }
       }
   },
   watch:{
        form:{
           deep:true,
           immediate:true,
           handler(){
            this.$emit("input",this.form);
           }
       },
   },
   created(){
        // 获取进入时间
        this.form.time = moment().format('YYYY.M.DD');

   },
}
</script>