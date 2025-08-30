<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
       <a-form-item>
           <a-input addon-before="标题1" v-model="form.title1" placeholder="标题1" />
           <a-input addon-before="标题2" v-model="form.title2" placeholder="标题2" />
           <a-input addon-before="今日直播重点" v-model="form.livetitle" placeholder="今日直播重点" />

           <div v-for="(item,index) in form.list" :key="index" style="margin-top:10px">
               <a-input addon-before="重点" v-model="item.title" placeholder="标题" />
               <a-textarea v-model="item.content" placeholder="识别强势股起涨信号，狙击主升买点!" style="height: 100px;"  />
           </div>

           <a-input addon-before="直播时间标题" v-model="form.playtitle" placeholder="直播时间" />

           <a-input addon-before="直播时间" v-model="form.lastcontent" placeholder="今晚19：00 与狼共舞" />
           
           <!-- <a-input addon-before="直播标题" v-model="form.title" placeholder="标题" /> -->
           <!-- <a-input addon-before="直播文案" v-model="form.content1" placeholder="文案1" />
           <a-input addon-before="直播文案" v-model="form.content2" placeholder="文案2" /> -->

          
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
            title1:'深挖龙头逻辑',
            title2:'精研买卖机会',
            livetitle:'今日直播重点',
            list:[
                { title:'重点一', content:'' },
                { title:'重点二', content:'' },
                { title:'重点三', content:'' },
            ],
            playtitle:'直播时间',
            lastcontent:'今晚19：00 与狼共舞'
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
        // this.form.time = moment().format('YYYY年M月D日');
   },
}
</script>