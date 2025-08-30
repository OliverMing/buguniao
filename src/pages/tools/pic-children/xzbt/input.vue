<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
       <a-form-item>
           <a-input addon-before="直播时间" v-model="form.livetitle" placeholder="直播时间" />
           <a-input addon-before="直播日期" v-model="form.time" placeholder="推荐日期" />
           <a-input addon-before="直播时间" v-model="form.time1" placeholder="晚19:30" />
           
           <a-input addon-before="直播标题" v-model="form.title" placeholder="标题" />
           <!-- <a-input addon-before="直播文案" v-model="form.content1" placeholder="文案1" />
           <a-input addon-before="直播文案" v-model="form.content2" placeholder="文案2" /> -->

           <a-textarea v-model="form.content1" placeholder="1.周五半导体大涨，半导体是真的攻击?今晚观点分享?操作节奏是什么?" style="margin-top:10px;height: 100px;"  />
           <a-textarea v-model="form.content2" placeholder="2.《缺口理论》时间周期的秘密实战案例教学" style="margin-top:10px;height: 100px;"  />
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
            livetitle:'直播时间',
            time:null,
            time1:"晚19:30",
            title:"下周补贴",
            content1:"",
            content2:"",
            cangwei:"推荐仓位",
            liyou:"推荐理由",
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
        this.form.time = moment().format('YYYY年M月D日');

   },
}
</script>