<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
        <a-form-item style="margin-bottom:-20px">
            <a-radio-group v-model="form.cover">
                <a-radio value="time1">封面一</a-radio>
                <a-radio value="time2">封面二</a-radio>
                <a-radio value="time3">封面三</a-radio>
                <a-radio value="time4">封面四</a-radio>
                <a-radio value="time5">封面五</a-radio>
            </a-radio-group>
       </a-form-item>

       <a-form-item>
           <a-input addon-before="周几" v-model="form.time" placeholder="周一" />
           <a-input addon-before="日期" v-model="form.days" placeholder="07月18日" />
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
            cover:'time1',
            time:"",
            days:'',
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
   }
}
</script>