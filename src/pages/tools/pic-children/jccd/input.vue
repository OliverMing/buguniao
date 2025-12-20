<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
       <a-form-item>
        <a-input :maxLength="2" addon-before="锁定" v-model="form.lock" placeholder="锁定" />
        <a-input :maxLength="2" addon-before="时间段" v-model="form.time" placeholder="今晚" />
           <a-input :maxLength="5" addon-before="日期提示" v-model="form.livetitle" placeholder="日期提示" />
           <a-input addon-before="今日直播重点内容" v-model="form.zhongdian" placeholder="今日直播重点内容" />
           <div v-for="(item,index) in form.list" :key="index"
            style="display:flex;justify-content: space-between;align-items: center;margin-top: 10px;">
              <a-input :addon-before="`直播重点${index + 1}`" v-model="item.content" placeholder="直播重点" />
              <a-button style="margin-left: 20px;" size="small" type="danger" @click="form.list.splice(form.list.indexOf(item),1)" :loading="loading">删除</a-button>
           </div>
           <a-button type="primary" @click="form.list.push({content:''})" :loading="loading">增加文本框</a-button>
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
            livetitle:'6.25',
            time:'今晚',
            lock:'锁定',
            list:[
                { content:'指数持续跟踪讲解' },
                { content:'《金仓财道》总章：钱从哪儿来。' },
                { content:'现阶段仓位管理建议。' },
            ],
            zhongdian:"美联储降息靴子落地，持续半个月的反弹应声结束，今日尾盘机构抱团方向瓦解迹象明显，未来市场何去何从？"
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