<template>
    <!-- 正文 -->
    <div class="bg-box">
      <div class="content flex">
        <img :style="{ height: boxHeight + 'px' }" src="@/assets/image/hqy.png" />
        <!--  -->
        <div ref="box" style="width: max-content;">
            <div class="top flex justify-center align-center" :contenteditable="true">6月早盘推送累计统计</div>
            <div>
                <div class="flex item" v-for="(item,index) in list" :key="index">
                    <div><input type="text" v-model="item.date" /></div>
                    <div><input type="text" v-model="item.code" /></div>
                    <div><input type="text" v-model="item.name" /></div>
                    <div><input type="text" v-model="item.type" /></div>
                    <div
                    :class="[
                            item.profit && item.profit.includes('-') ? 'text-green' : 'text-red'
                        ]"><input type="text" v-model="item.profit" /></div>
                </div>
            </div>
            <div class="bottom" :contenteditable="true">
                【融通智盈(尉式逻辑交易体系)投顾团队:【尉小龙-执业号: S0070624070006，【谌华坤-执业号:S0070624060007】，历史战绩，不做未来保证，仅供教学参考，不作为具体投资建议;据此操作，盈亏自负，风险自担!投资有风险，入市需谨慎】
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import moment from 'moment';

  export default {
    props: {
      time: String,
      content: String
    },
    data(){
        return {
            boxHeight: 0,
            lineHeight:30,
            month:null,
            list:[]
        }
    },
    created(){
        // moment 获取当期月份
        const month = moment(this.time).format('M月');
        this.month = month;
        // moment 获取当前月除开周末所有的日期
        // moment 获取当前月除开周末所有的日期
        const dates = [];
        const start = moment(this.time).startOf('month');
        const end = moment(this.time).endOf('month');
        let date = start.clone();
        while (date.isSameOrBefore(end)) {
            if (date.day() !== 0 && date.day() !== 6) {
                dates.push(date.format('MM月DD日'));
            }
            date = date.add(1, 'day');
        }
        // 生成表格
        this.list = dates.map((item,index) => {
            return {
                date:item,
                code:null,
                name:null,
                type:'T+1',
                profit:null
            }
        })

        this.boxHeight =  this.lineHeight * this.list.length + this.list.length + 40 + 51;
    }
  }
  </script>
  
  <style scoped>

input{
    border: none;
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: transparent;
    font-weight: bold;
}

  .bg-box {
    position: relative;
    background-color: #FFF;
    width: max-content;
    text-align: left;

    .top{
        height: 40px;
        font-size: 18px;
        color: #FFF;
        font-weight: bold;
        letter-spacing: 2px;
        background-color: #e4700c;
    }

    .bottom{
        width: 600px;
        text-align: center;
        height: 50px;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #000;
        padding: 0 20px;
        border-bottom: 1px solid #888;
        border-right: 1px solid #888;
        background-color: #f8f8f8;
        line-height: 16px;
    }

    .item{
        border-bottom: 1px solid #888;
        
        div{
            border-right: 1px solid #888;
            font-size: 16px;
            width: 120px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;

            &:first-child,&:nth-child(4){
                color: #000;
            }

            &:nth-child(2),&:nth-child(3){
                color: #2196f3;
            }

            &:first-child{
                width: 100px;
            }

            &:last-child{
                width: 140px;
                input{
                    font-weight: bold;
                }
            }
        }
    }
  }
  
  .text-red{
        color: #f44336 !important;
    }

    .text-green{
        color: #4caf50 !important;
    }
  </style>
