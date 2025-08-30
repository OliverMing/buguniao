<template>
    <div class="pr">
        <img src="@/assets/image/gssrx.png" style="width: 100%;" alt="">
        <div class="pb content-main flex align-center flex-column">
            <div class="title">{{ content.livetitle }}</div>
            <div class="content-item flex" v-for="(item,index) in content.list" :key="index">
                <div class="index">{{ index + 1}}</div>
                <div class="flex-1">{{ item.content }}</div>
            </div>
        </div>
        <div class="pb time flex justify-center align-center">{{ content.bottomTips }}</div>
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
    width: 84%;
    height: 148px;
    top: 395px;
    left: 30px;
    z-index: 3;

    .title{
        font-size: 15px;
        font-weight: bold;
        color: #d30e00;
        line-height: 38px;
    }

    .content-item{
        width: 100%;
        padding: 0 12px;
        font-size: 12px;
        color: #d30e00;
        font-weight: 400;

        .index{
            width: 14px;
            height: 14px;
            line-height: 12px;
            text-align: center;
            margin-right: 6px;
            margin-top: 4px;
            font-size: 12px;
            border-radius: 50%;
            background: #d30e00;
            color: #fff;
        }

        &:not(:last-child){
            margin-bottom: 10px;
        }
    }
}

</style>