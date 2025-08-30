<template>
    <div class="w-100 h-100 pr" v-if="content.cover">
      <img class="w-100" :src="imageArr[content.cover]" />
      <div v-if="content.cover === 'time1'" :class="[content.cover]">
        <div class="pa week">
            <i>{{ content.time }}</i>
        </div>

        <div class="pa times flex align-center">
            <div><i>推送时间</i></div>
            <div><i>{{ content.days }}</i></div>
        </div>
      </div>

      <div v-if="['time2','time3'].includes(content.cover)" :class="[content.cover]">
        <div class="pa times flex justify-center align-center">
            <span>推送时间</span>
            <span class="red-color days">{{ content.days }}</span>
            <span class="red-color">{{ content.time }}</span>
        </div>
      </div>

      <div v-if="['time4'].includes(content.cover)" :class="[content.cover]">
        <div class="pa times flex justify-center align-center">
            <span><i>推送时间:</i></span>
            <span class="red-color days"><i>{{ content.days }}</i></span>
        </div>
        <span class="week pa"><i>{{ content.time }}</i></span>
      </div>

      <div v-if="['time5'].includes(content.cover)" :class="[content.cover]">
        <div class="pa times flex justify-center align-center">
            <span><i>推送时间:</i></span>
            <span class="red-color days"><i>{{ content.days }}</i></span>
        </div>
        <span class="week pa">{{ content.time }}</span>
      </div>
 
    </div>
 </template>
 
 <script>
 export default {
    props: {
      content:Object
    },
    data(){
      return {
        imageArr:{
            time1:require('@/assets/image/time1.png'),
            time2:require('@/assets/image/time2.png'),
            time3:require('@/assets/image/time3.png'),
            time4:require('@/assets/image/time4.png'),
            time5:require('@/assets/image/time5.png'),
        }
      }
    }
 };
 </script>
 
 <style lang="less" scoped>
.pa{ position: absolute; }


.time1 {
    .week{
        top: 147px;
        left: 292px;
        color: #fdf6cc;
        font-size: 24px;
        letter-spacing: 2px;
        font-weight: bold;
    }

    .times{
        top: 427px;
        left: 24px;
        width: max-content;
       
        font-weight: bold;

        div:first-child{
            margin-right: 20px;
            color: #a70000;
            padding: 0 10px;
            font-size: 14px;
        }

        div:nth-child(2){
            // margin-left: 20px;
             color: #a70000;
             opacity: .7;
             font-size: 13px;
             letter-spacing: 1px;
        }
    }
}

.time2 {
    .times{
        top: 224px;
        left: 115px;
        width: 195px;
        transform: rotate(-1.85deg);
        color: #4e0101;
        font-size: 14px;
        font-weight: bold;
        text-shadow:
        -1px -1px 0 #fff,  /* 左上角白色阴影 */
        1px -1px 0 #fff,  /* 右上角白色阴影 */
        -1px  1px 0 #fff,  /* 左下角白色阴影 */
        1px  1px 0 #fff;  /* 右下角白色阴影 */

        .red-color{
            color: red !important;
            opacity: .8;
        }

        .days{
            font-size: 24px;
            padding:0 4px;
        }
    }
}

.time3 {
    .times{
        top: 304px;
        left: 150px;
        width: 195px;
        transform: rotate(-1.85deg);
        color: #4e0101;
        font-size: 16px;
        font-weight: bold;
        text-shadow:
        -1px -1px 0 #fff,  /* 左上角白色阴影 */
        1px -1px 0 #fff,  /* 右上角白色阴影 */
        -1px  1px 0 #fff,  /* 左下角白色阴影 */
        1px  1px 0 #fff;  /* 右下角白色阴影 */

        .red-color{
            color: #c10606 !important;
            opacity: .8;
        }

        .days{
            font-size: 24px;
            padding:0 4px;
        }
    }
}


.time4{
    .times{
        top: 148px;
        left: 25px;
        width: max-content;
        transform: rotate(-5deg);
        color: #de0904;
        font-size: 20px;
        font-weight: bold;
        text-shadow:
        -2px -2px 0 #000,  /* 左上角白色阴影 */
        2px -1px 0 #000,  /* 右上角白色阴影 */
        -2px  1px 0 #000,  /* 左下角白色阴影 */
        2px  1px 0 #000;  /* 右下角白色阴影 */
    }

    .week{
        top: 30px;
        left: 80px;
        color: #fdf6cc;
        font-size: 24px;
        letter-spacing: 2px;
        font-weight: bold;
        transform: rotate(-4deg);
    }
}

.time5{
    .times{
        top: 168px;
        left: 35px;
        width: max-content;
        transform: rotate(-2deg);
        color: #e3da8a;
        font-size: 20px;
        font-weight: bold;
        text-shadow:
        -2px -2px 0 #000,  /* 左上角白色阴影 */
        2px -2px 0 #000,  /* 右上角白色阴影 */
        -2px  2px 0 #000,  /* 左下角白色阴影 */
        2px  2px 0 #000;  /* 右下角白色阴影 */
    }

    .week{
        top: 45px;
        right: 50px;
        width: 40px;
        color: #843518;
        line-height: 24px;
        font-size: 28px;
        font-weight: bold;
        transform: rotate(-4deg);
    }
}


 </style>