<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
       <a-form-item>
           <a-input addon-before="标题" v-model="form.title" placeholder="锵锵三人行" />
           <a-input class="flex-1" :addon-before="`描述一`" :maxlength="4" v-model="form.title1" placeholder="文本内容" />
           <a-input class="flex-1" :addon-before="`描述二`" :maxlength="4" v-model="form.title2" placeholder="文本内容" />

           <a-input addon-before="直播时间" v-model="form.time_title" placeholder="直播时间" />
           <a-input addon-before="日期" v-model="form.day" placeholder="2024年09月08日" />
           <a-input addon-before="时间" v-model="form.time" placeholder="晚19:30" />

           <a-input addon-before="底部提示语" :maxlength="4" v-model="form.tips" placeholder="底部提示语" />
       </a-form-item>

       <a-form-item>
        
       </a-form-item>
       
           
    </a-form>
</template>

<script>

export default {
   mode:{
       event:"input"
   },
   data(){
       return {
        name:null,
        form:{
            title:"突然变盘,如何应对?",
            tips:"股市有风险 投资需谨慎",
            title1:"指数调整加剧,个股迎来分化",
            title2:"“金九行情”还值得期待吗?",
            time_title:"直播时间",
            day:"2024年09月08日",
            time:"晚19:30"
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
   },
   methods:{
    add(){
        this.form.list.push({ content:"" });
    },
    del(index){
        this.form.list.splice(index,1);
    }
   }
}
</script>

<style scoped>
.span{padding: 0 10px;font-size: 13px;color: #666;cursor: pointer;}
</style>