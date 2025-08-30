<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
       <a-form-item>
           <a-input addon-before="推荐日期" v-model="form.time" placeholder="推荐日期" />
           <a-input addon-before="股票代码" v-model="form.code" placeholder="600588" />
           <a-input addon-before="推荐价格" v-model="form.price" placeholder="推荐价格" />
           <a-input addon-before="预警价格" v-model="form.price1" placeholder="预警价格" />
           <a-input addon-before="推荐仓位" v-model="form.cangwei" placeholder="推荐仓位" />
           <a-input addon-before="推荐理由" v-model="form.liyou" placeholder="推荐理由" />
           <a-textarea v-model="form.tips" style="margin-top:24px"  />
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
            code:null,
            price:null,
            price2:null,
            cangwei:null,
            liyou:null,
            tips:"【以上信息，内容不做具体操作指导，客户亦不应将其作为投资决策的唯一参考因素。据此操作，责任自负，股市有风险，投资需谨慎!国融投资顾问谌华坤 --执业号:S0070624060007】"
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