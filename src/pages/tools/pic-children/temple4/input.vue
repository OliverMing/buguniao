<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
        <a-form-item style="margin-bottom:-20px">
            <a-radio-group v-model="form.cover">
                <a-radio value="n1">封面一</a-radio>
                <a-radio value="n2">封面二</a-radio>
                <a-radio value="n3">封面三</a-radio>
                <a-radio value="n4">封面四</a-radio>
            </a-radio-group>
       </a-form-item>

       <a-form-item>
           <a-input addon-before="星期几" v-model="form.time" placeholder="星期几" />
           <a-input addon-before="日期" v-model="form.days" placeholder="07月18日" />
           <a-input addon-before="标题名字" :maxlength="4" v-model="form.title" placeholder="标题名字" />
           <a-input addon-before="股票代码" v-model="form.code" placeholder="600588" />
           <a-input addon-before="买入评级" v-model="form.jibie" placeholder="SSS" />
           <div style="margin-top: 20px"></div>
           <a-input addon-before="功能1" :max-length="4" v-model="form.m1" placeholder="股票代码" />
           <a-input addon-before="功能2" :maxlength="4" v-model="form.m2" placeholder="价位区间" />
           <a-input addon-before="功能3" :maxlength="4" v-model="form.m3" placeholder="预警区间" />
           <a-input addon-before="功能4" :maxlength="4" v-model="form.m4" placeholder="仓位配置" />
           <a-input addon-before="功能5" :maxlength="4" v-model="form.m5" placeholder="推荐理由" />
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
            cover:'n1',
            time:"周一",
            title:"突击一号",
            code:null,
            days:null,
            jibie:"SSSSS",
            m1:"股票代码",
            m2:"价位区间",
            m3:"预警区间",
            m4:"仓位配置",
            m5:"推荐理由",
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