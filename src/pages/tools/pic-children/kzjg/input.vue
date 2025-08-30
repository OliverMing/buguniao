<template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 24 }">
       <a-form-item>
           <a-input addon-before="标题" v-model="form.time" placeholder="翻身7月" />
           <div style="margin-top: 20px"></div>
           <a-input addon-before="推荐日期" :maxlength="4" v-model="form.ls1Title" placeholder="推荐日期" />
           <a-input addon-before="股票名称" :maxlength="4" v-model="form.ls2Title" placeholder="股票名称" />
           <a-input addon-before="涨幅" :maxlength="4" v-model="form.ls3Title" placeholder="涨幅" />
       </a-form-item>

       <a-form-item v-for="e in form.list" :key="e.time">
           <a-input addon-before="周数" :maxlength="4" v-model="e.chineseNumber" placeholder="第一周" />
           <a-input addon-before="日期" v-model="e.time" placeholder="07月18日" />
           
           <a-input addon-before="股票名称" v-model="e.name" placeholder="天迈科技（300807）" />
           <a-input addon-before="涨幅" v-model="e.number" placeholder="+25%" />
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
        name:null,
        form:{
            time:"",
            ls1Title:"推荐日期",
            ls2Title:"股票名称",
            ls3Title:"涨幅",
            list:[]
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
        // 获取当前月份（返回数字）
        const currentMonth = moment().month() + 1;
        this.form.time = `${this.name || '翻身'}` + currentMonth + '月';

        // 获取本月第一二三四周星期五的日期
        const nthWeekdayOfMonth = (year, month, nth, dow) => {
            const d = new Date(year, month - 1, 7 * (nth - 1) + 1);
            const w = d.getDay();
            d.setDate(d.getDate() + (7 + dow - w) % 7);
            return moment(d).add(-2,'days').format("MM月DD日");
        }

        let list = [],chineseNumber = ['一','二','三','四'];
        for(let i = 0; i<4;i++){
            const time = nthWeekdayOfMonth(2023, currentMonth, i+1, 5).toString() + "(周五)";
            list.push({
                time,
                name:"预约中",
                number:"预约中",
                chineseNumber:`第${chineseNumber[i]}周`
            })
        }
        this.form.list = list;
   }
}
</script>