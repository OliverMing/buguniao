<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
       <a-form-item>
           <a-input addon-before="标题" v-model="form.title" placeholder="锵锵三人行" />
           <a-input addon-before="底部提示语" :maxlength="4" v-model="form.tips" placeholder="底部提示语" />
       </a-form-item>

       <a-form-item>
          <div class="flex justify-start align-center" v-for="(e,index) in form.list" :key="index">
            <a-input class="flex-1" :addon-before="`第${index + 1}行`" :maxlength="4" v-model="e.content" placeholder="文本内容" />
            <span class="span" type="text" @click="del(index)">删除</span>
          </div>
          <a-button type="primary" @click="add" v-if="form.list.length < 4">追加内容</a-button>
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
            title:"锵锵三人行",
            tips:"证券服务标杆 股市有风险 投资需谨慎",
            list:[
                { content:"" }
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