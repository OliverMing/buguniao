<template>
    <div class="pr">
        <img :src="require(`@/assets/image/${content.cover}.png`)" style="width: 100%;" alt="">

        <div class="pb lock flex justify-center align-center">
            <div class="left-time">{{ content.time }}</div>
            <div class="flex-1 right-time">{{ content.livetitle }}</div>
        </div>

        <div class="pb content-main flex align-center flex-column">
             <div class="title">
                {{ content.zhongdian }}
             </div>
            <div :class="[
                'content-item flex items-center',
                content.cover
            ]" v-for="(item,index) in content.list" :key="index">
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
    top: 392px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    width: 295px;
    font-weight: bold;
    text-align: center;
    font-size: 15px;
    line-height: 30px;

    .right-time{
        color: #000;
    }

    .left-time{
        width: 50%;
        color: #4f2e01;
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
    width: 83%;
    height: 105px;
    top: 510px;
    left: 50%;
    transform: translateX(-50%);
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
        color: #000;
        font-weight: 400;

        .index{
            width: 18px;
            height: 18px;
            text-align: center;
            margin-right: 8px;
            border-radius:4px;
            background: #FFF;
            color: #000;
            opacity: .8;
        }

        &:not(:last-child){
            margin-bottom: 4px;
        }
    }

    .ljjytx-blue{
        margin-bottom: 10px !important;
        color: rgba(255,255,255,.8);
    }
}

</style>