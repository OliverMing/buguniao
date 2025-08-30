<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
        <a-form-item style="margin-bottom:-20px">
            <a-radio-group v-model="form.cover">
                <a-radio value="cf4">封面一</a-radio>
                <a-radio value="cf2">封面二</a-radio>
                <a-radio value="cf3">封面三</a-radio>
                <a-radio value="cf1">封面四</a-radio>
            </a-radio-group>
       </a-form-item>

       <a-form-item>
           <!-- <a-input addon-before="星期几" v-model="form.time" placeholder="星期几" /> -->
           <a-input addon-before="建仓时间" v-model="form.days1" placeholder="07月18日" />
           <a-input addon-before="布局时间" v-model="form.days2" placeholder="07月18日" />
           <a-input addon-before="标题名字" :maxlength="4" v-model="form.title" placeholder="标题名字" />
           <a-input addon-before="股票代码" v-model="form.code" placeholder="600588" />
           <a-input addon-before="提示语" v-model="form.tips" placeholder="市场进入反弹周期，把握周期性机会" />
           <div style="margin-top: 20px"></div>
           <!-- <a-input addon-before="功能1" :max-length="4" v-model="form.m1" placeholder="股票代码" />
           <a-input addon-before="功能2" :maxlength="4" v-model="form.m2" placeholder="价位区间" />
           <a-input addon-before="功能3" :maxlength="4" v-model="form.m3" placeholder="预警区间" />
           <a-input addon-before="功能4" :maxlength="4" v-model="form.m4" placeholder="仓位配置" />
           <a-input addon-before="功能5" :maxlength="4" v-model="form.m5" placeholder="推荐理由" /> -->
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
            cover:'cf1',
            title:"冲锋1号",
            code:null,
            days1:null,
            days2:null,
            tips:"市场进入反弹周期，把握周期性机会！",
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