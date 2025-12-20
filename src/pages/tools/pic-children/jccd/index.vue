<template>
    <div class="pr">
        <img src="@/assets/image/jccd.png" style="width: 100%;" alt="">

        <div class="pb lock flex justify-center align-center flex-column">
            <div class="lock-title">{{ content.lock }}</div>
            <div class="lock-time flex justify-center align-center">
                <div class="left-time">{{ content.time }}</div>
                <div class="flex-1 right-time">{{ content.livetitle }}</div>
            </div>
        </div>

        <div class="pb content-main flex align-center flex-column">
             <div class="title">
                {{ content.zhongdian }}
             </div>
            <div class="content-item flex items-center" v-for="(item,index) in content.list" :key="index">
                <div class="index flex justify-center align-center">{{ index + 1}}</div>
                <div class="flex-1">{{ item.content }}</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'zpjx',
    props:{
        content:Object
    },
    data() {
        return {

        }
    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
.pr{ position: relative; }
.pb{ position: absolute; }

.lock{
    top: 340px;
    left: 35px;
    z-index: 3;
    width: 100px;
    // height: 100px;

    .lock-title{
        font-size: 48px;
        font-weight: bold;
        color: #701418;
        letter-spacing: 2px;
    }

    .lock-time{
        
        font-weight: bold;
        color: #4f2e01;
        letter-spacing: 2px;
        background-color: #701418;
        width: 100%;
        height: 40px;
        color: #e8c597;

        .right-time{
            font-weight: bold;
            text-align: center;
           
            font-size: 22px;
            padding-left: 4px;
        }

        .left-time{
            font-size: 12px;
            width: 24px;
            // margin: 0 6px;
            padding: 0 6px;
            opacity: .9;
            line-height: 15px;
            border-right: 1px solid #e8c597;
        }
    }
}

.time{
    width: 75%;
    height: 32px;
    top: 560px;
    left: 44px;
    z-index: 3;
    font-weight: 500;
    font-size: 15px;
    color: #000;
    letter-spacing: 1px;
}

.content-main{
    width: 87%;
    height: 147px;
    top: 540px;
    left: 30px;
    z-index: 3;
    padding: 0 12px;

    .title{
        font-size: 14px;
        font-weight: bold;
        color: #4f2e01;
        line-height: 18px;
        margin-bottom: 10px;
    }

    .content-item{
        width: 100%; 
        font-size: 14px;
        color: #4f2e01;
        font-weight: 400;

        .index{
            width: 18px;
            height: 18px;
            text-align: center;
            margin-right: 6px;
            border-radius:60px;
            background: #4f2e01;
            color: #FFF;
        }

        &:not(:last-child){
            margin-bottom: 4px;
        }
    }
}

</style>