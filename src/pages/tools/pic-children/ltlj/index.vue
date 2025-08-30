<template>
    <div class="pr">
        <img src="@/assets/image/livelongtou2.jpg" style="width: 100%;" alt="">
        <div class="pb title">{{ content.title1 }}</div>
        <div class="pb title2">{{ content.title2 }}</div>
        <div class="pb livetitle flex align-center">
            <div></div>{{ content.livetitle }}
        </div>
        <div class="pb list">
            <div class="item" v-for="(item,index) in content.list" :key="index">
                <span>{{ item.title }}</span>
                <div v-html="item.content.replace(/\n/g, '<br>')"></div>
            </div>
        </div>
        <div class="pb playtitle">{{ content.playtitle }}</div>
        <div class="pb lastcontent">{{ content.lastcontent }}</div>
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

.lastcontent{
    top: 630px;
    left: 35px;
    text-align: center;
    color: #FFF;
    font-size: 16px;
    font-weight: bold;
}

.playtitle{
    top: 601px;
    left: 35px;
    width: 85px;
    text-align: center;
    color: #fd984d;
    font-size: 16px;
    font-weight: bold;
}

.list{
    top: 430px;
    left: 25px;
    right: 25px;
    height:150px;

    .item{
        margin-bottom: 10px;
        font-size: 12px;
        color: #000;
        position: relative;

        div{
           position: relative;
           padding-left: 8px;
           margin-top: 2px;

            &:before{
                content: '';
                position: absolute;
                top: 6px;
                left: 0px;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background-color: #032b72;
            }   
        }

        span{
            font-size: 8px !important;
            line-height: 8px;
            padding: 0 8px;
            height: 14px;
            display: inline-flex;
            align-items: center;
            border-radius: 80px;
            background-color: #032b72;
            color: #fff;
        }
    }
}

.livetitle{
    top: 402px;
    left: 25px;
    text-align: center;
    font-size:16px;
    font-weight: bold;
    color: #032b72;

    div{
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #032b72;
        margin-right: 4px;
    }
}

.title{
    top: 30px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 36px;
    font-weight: bold;
    letter-spacing: 3px;
    font-family:'Times New Roman', Times, serif;
    color: #167de0;
}

.title2{
    top: 74px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 40px;
    font-weight: bold;
    letter-spacing: 2px;
    font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    color: #032b72;
}

</style>