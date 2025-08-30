<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
       <a-form-item>
        <a-radio-group v-model="cover">
            <a-radio value="p1">封面一</a-radio>
            <a-radio value="p2">封面二</a-radio>
            <a-radio value="p3">封面三</a-radio>
            <a-radio value="p4">封面四</a-radio>
        </a-radio-group>
       </a-form-item>

       <div style="margin:-15px 0 20px">
        <a-input addon-before="小标题" v-model="smallTitle"  />
        <a-input addon-before="投资顾问" v-model="guwen" style="margin: 6px 0;" />
        <a-input addon-before="执业编号" v-model="guwenNumber" />
        <a-input addon-before="风险提示" v-model="tips" style="margin-top:6px" />
       </div>

       <div style="margin-top:40px" v-for="(item,index) in list" :key="index">
            <div style="margin-bottom:20px">
                <a-input addon-before="标题" v-model="item.title" />
            </div>
            <a-form-item style="margin-bottom:10px" v-for="(e,i) in item.list" :key="`${index}-${i}`">
                <a-input addon-before="推送日期" v-model="e.time" />
                <a-input addon-before="股票代码" v-model="e.code" />
                <a-input addon-before="股票名字" v-model="e.name" />
                <a-input addon-before="交易周期" v-model="e.zhouqi" />
                <a-input addon-before="涨跌情况" addon-after="%" v-model="e.number" />
            </a-form-item>
       </div>
    </a-form>
</template>

<script>
import moment from 'moment';
export default {
   mode:{
       event:"input"
   },
   props:{
       current:Number
   },
   data(){
       return {
           list:[
            {
                title:'近期【价值超短】方案股统计',
                list:[]
            },
            {
                title:'近期【短线掘金】方案股统计',
                list:[]
            }
           ],
           
           weekTime:null,
           guwen:"投资顾问：谌华坤",
           guwenNumber:"执业编号：S0070624060007",
           smallTitle:"",
           cover:"p1",
           enumDate:{
               0:'一',
               1:'二',
               2:'三',
               3:'四',
               4:'五'
           },
           tips:"(以上内容由投资顾问谌华坤编号：S0070624060007，出具仅供参考，不作为投资决策的唯一依据)"
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
       cover(){
        this.change();
       },
       guwen(){
        this.change();
       },
       tips(){
        this.change();
       },
       guwenNumber(){
        this.change();
       },
       smallTitle(val){
           localStorage.setItem("week-small-title1",val);
           this.change();
       },
   },
   created() {

    var smallTitle = localStorage.getItem("week-small-title1");
    this.smallTitle = smallTitle || '周四震撼来袭';

      var time = this.moment.calculateWeekPeriods();
      var arr = time[1].dateRange.split('~');

      var start = moment(arr[0]).add(0, 'days').format("YYYY年MM月DD日");
      var end = moment(arr[0]).add(4, 'days').format("DD日");
      this.weekTime = `${start} ~ ${end}`;

      let list = [];
      for(let i= 0; i<10;i++){
        var d = moment(arr[0]).add(i, 'days').format("MM月DD日");
        list.push({
           time:d,
           name:null,
           code:null,
           zhouqi:null,
           number:null
        })
      }
      this.list[0].list = list.slice(0,5);
      this.list[1].list = list.slice(5,10);
   },
   methods: {
      change() {
           this.$emit("input",{
               list:this.list,
               cover:this.cover,
               guwen:this.guwen,
               guwenNumber:this.guwenNumber,
               smallTitle:this.smallTitle,
               tips:this.tips
           });
      } 
   },
}
</script>