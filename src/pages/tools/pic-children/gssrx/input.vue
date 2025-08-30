<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
       <a-form-item>
           <a-input addon-before="直播时间" v-model="form.livetitle" placeholder="直播时间" />
           <a-input addon-before="日期提示" v-model="form.bottomTips" placeholder="日期提示" />
           <div v-for="(item,index) in form.list" :key="index" style="display:flex;justify-content: space-between;align-items: center">
              <a-textarea v-model="item.content" placeholder="请输入" style="margin-top:10px;height: 100px;"  />
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
            livetitle:'6.25 晚间直播',
            list:[
                { content:'' },
                { content:'' },
                { content:'' },
            ],
            bottomTips:"2025年6月25日 20:00直播间揭晓"
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