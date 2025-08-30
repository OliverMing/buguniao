<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">

       <a-form-item>
           <a-input addon-before="名称" v-model="name" placeholder="短线系列战绩统计" />
           <a-input addon-before="二级标题" v-model="smallTitle" placeholder="小标题" />
           <a-input addon-before="风险提示" v-model="tips" placeholder="底部风险提示" />
       </a-form-item>
       <a-form-item v-for="(e,i) in list" :key="i">
           <a-input addon-before="标的日期" v-model="e.time" />
           <a-input addon-before="龙头标的" v-model="e.name" />
           <div class="flex justify-start align-center">
               <a-input class="flex-1" addon-before="股票代码" placeholder="统一股份（600506）" v-model="e.code" style="margin-right:10px" />
           </div>
           <div class="flex justify-start align-center">
               <a-input class="flex-1" addon-before="股票涨迭幅" placeholder="+30%" v-model="e.number" style="margin-right:10px" />
           </div>
          
       </a-form-item>
    </a-form>
</template>

<script>
import moment from 'moment';
export default {
   mode:{
       event:"input"
   },
   props:{
       current:Number,
       title:String
   },
   data(){
       return {
           list:[],
           timeIndex:1,
           name:'短线系列',
           smallTitle:"《 近期数据统计表  》",
           tips:"【融通智盈(尉式逻辑交易体系)投顾团队:【尉小龙-执业号: S0070624070006，【谌华坤-执业号:S0070624060007】，历史战绩，不做未来保证，仅供教学参考，不作为具体投资建议;据此操作，盈亏自负，风险自担!投资有风险，入市需谨慎】",
           weekTime:null,
           enumDate:{
               0:'一',
               1:'二',
               2:'三',
               3:'四',
               4:'五'
           }
       }
   },
   watch:{
       list:{
           deep:true,
           immediate:true,
           handler(){
               this.change();
           }
       },
       timeIndex() {
           this.getTime();
       },
       smallTitle(val){
           localStorage.setItem("week-small-title",val);
           this.change();
       },
       tips(val){
           localStorage.setItem("week-tips",val);
           this.change();
       },
   },
   created() {
      this.getTime();
   },
   methods: {
      change() {
           this.$emit("input",{
               list:this.list,
               tips:this.tips,
               name:this.name,
               smallTitle:this.smallTitle,
               weekTime:this.weekTime
           });
      },

      getTime() {

       var time = this.moment.calculateWeekPeriods();
       var arr = time[this.timeIndex].dateRange.split('~');

       var start = moment(arr[0]).add(0, 'days').format("YYYY年MM月DD日");
       var end = moment(arr[0]).add(4, 'days').format("DD日");
       this.weekTime = `${start} - ${end}`;

       let list = [];
       for(let i= 0; i<5;i++){
           var d = moment(arr[0]).add(i, 'days').format("MM月DD日");
           list.push({
               time:`${d}`,
               name:"",
               code:"",
               number:""
           })
       }
       this.list = list;
      }
   },
}
</script>