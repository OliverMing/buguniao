<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
       <a-form-item>
           <a-input addon-before="机构名称" v-model="form.name" placeholder="机构名称" />
           <a-input addon-before="推荐日期" v-model="form.time" placeholder="推荐日期" />
           <a-input addon-before="模板标题" v-model="form.title" placeholder="标题" />

           <div style="margin: 20px 0 10px 0;">
                <div class="flex" style="margin-bottom: 10px;" v-for="(item,index) in form.list" :key="index">
                    <a-input addon-before="股票名称" v-model="item.name" placeholder="回盛生物" />
                    <a-input addon-before="股票代码" style="margin: 0 10px;" v-model="item.code" placeholder="300871" />
                    <a-input addon-before="入选理由" v-model="item.liyou" placeholder="入选理由" />
                </div>
           </div>

           <!-- <a-input addon-before="推荐价格" v-model="form.price" placeholder="推荐价格" />
           <a-input addon-before="预警价格" v-model="form.price1" placeholder="预警价格" />
           <a-input addon-before="推荐仓位" v-model="form.cangwei" placeholder="推荐仓位" />
           <a-input addon-before="推荐理由" v-model="form.liyou" placeholder="推荐理由" /> -->
           <a-textarea v-model="form.contentA" style="margin-top:10px;height: 100px;"  />
           <a-textarea v-model="form.contentB" style="margin-top:10px;height: 100px;"  />
           <a-textarea v-model="form.contentC" style="margin-top:10px;height: 100px;"  />
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
            name:'申睿智胜',
            time:null,
            title:"早盘精选股票池案例分享",
            list:[
                { name:'',code:'',liyou:'' },
                { name:'',code:'',liyou:'' },
                { name:'',code:'',liyou:'' },
                { name:'',code:'',liyou:'' },
            ],
            contentA:"在绝对的实力面前，行情好坏只是辅助，股市本身就是三分选股，七分买卖！缺乏时间盯盘缺乏短线买卖判断力，那么找寻专业证券公司来帮助您是最好的!",
            contentB:"签约后您可获得：\n市场追势研判：动态跟踪宏观经济与行业数据\n 组合管理建议：定期评估持仓结构与风险敞口\n风险提元小制：对立异动预警与应对预案",
            contentC:"【以上信息出自申港【申睿智胜投顾团队】投资顾问杨柳 执业证编号S1660623060003内容不做具体操作指导，客户亦不应将其作为投资决策的唯一参考因素。据此操作责任自负，股市有风险，投资需谨慎!】"
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
        this.form.time = moment().format('YYYY年MM月DD日');

   },
}
</script>