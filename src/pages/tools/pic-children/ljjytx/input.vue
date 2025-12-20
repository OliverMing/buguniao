<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
       <a-form-item>
            <a-radio-group v-model="form.cover">
                <a-radio value="ljjytx-red">封面一</a-radio>
                <a-radio value="ljjytx-blue">封面二</a-radio>
            </a-radio-group>
           <a-input :maxLength="2" addon-before="日期" v-model="form.time" placeholder="今晚" />
           <a-input :maxLength="5" addon-before="时间" v-model="form.livetitle" placeholder="日期提示" />
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
            livetitle:'19:30直播间揭晓',
            time:'',
            cover:'ljjytx-red',
            list:[
                { content:'指数持续跟踪讲解' },
                { content:'《金仓财道》总章：钱从哪儿来。' },
                { content:'现阶段仓位管理建议。' },
            ]
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