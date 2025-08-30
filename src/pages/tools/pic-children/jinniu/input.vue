<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
       <a-form-item style="margin-bottom:-15px">
           <a-radio-group v-model="timeIndex">
               <a-radio :value="0">上周</a-radio>
               <a-radio :value="1">本周</a-radio>
               <a-radio :value="2">下周</a-radio>
           </a-radio-group>
      </a-form-item>

       <a-form-item>
           <a-input addon-before="本周系列" v-model="name" placeholder="翻身" />
           <!-- <a-input v-if="current == 1" addon-before="二级标题" v-model="smallTitle" placeholder="小标题" />
           <a-input addon-before="风险提示" v-model="tips" placeholder="底部风险提示" /> -->
       </a-form-item>
       <a-form-item v-for="(e,i) in list" :key="i">
           <a-input addon-before="标的日期" v-model="e.time" />
           <a-input addon-before="龙头标的" v-model="e.name" />
           <div class="flex justify-start align-center" style="margin-top:4px">
               <a-input class="flex-1" addon-before="股票代码" placeholder="统一股份（600506）" v-model="e.code" style="margin-right:10px" />
               <a-radio-group v-model="e.code">
                   <a-radio value="预约中">预约中</a-radio>
                   <a-radio value="已封仓">已封仓</a-radio>
                   <a-radio value="敬请期待">敬请期待</a-radio>
               </a-radio-group>
           </div>
           <div class="flex justify-start align-center" style="margin-top:4px">
               <a-input class="flex-1" addon-before="股票涨幅" placeholder="+30%" v-model="e.number" style="margin-right:10px" />
               <a-radio-group v-model="e.number">
                   <a-radio value="预约中">预约中</a-radio>
                   <a-radio value="敬请期待">敬请期待</a-radio>
               </a-radio-group>
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
           name:null,
           smallTitle:null,
           tips:"【国融证券尉小龙逻辑买卖投研团队:谌华坤(执业编号:S0070624060007);历史战绩，不做未来保证，仅供教学参考，不作为具体投资建议;据此操作，盈亏自负，风险自担!投资有风险，入市需谨慎】",
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
       name(val){
           localStorage.setItem("week-name",val);
           this.list.forEach((e,index) => {
               e.name = `${val}${index + 1}号`
           });
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

      var name = localStorage.getItem("week-name");
      var smallTitle = localStorage.getItem("week-small-title");
   //    var tips = localStorage.getItem("week-tips");
      this.name = this.title || name || '翻身';
      this.smallTitle = smallTitle || '每日金股不错过';
   //    this.tips = tips || this.tips;

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
               time:`${d}(周${this.enumDate[i]})`,
               name:`${this.name}${i+1}号`,
               code:"预约中",
               number:"预约中"
           })
       }
       this.list = list;
      }
   },
}
</script>