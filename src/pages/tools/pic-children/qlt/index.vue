<template>
    <div class="pr">
        <img src="@/assets/image/qinlongtou.png" style="width: 100%;" alt="">
        <div class="pb title">{{ content.title1 }}</div>
        <!-- <div class="pb title2">{{ content.title2 }}</div> -->
        <div class="pb livetitle flex align-center">
            {{ content.livetitle }}
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
    top: 708px;
    left: 107px;
    text-align: center;
    color: #000;
    font-size: 16px;
    font-weight: 800;
    font-family:"黑体", "Microsoft YaHei", "微软雅黑", sans-serif;
    width: 165px;
}

.playtitle{
    top: 677px;
    left: 160px;
    width: 85px;
    text-align: center;
    color: #FFF;
    font-size: 15px;
    font-weight: bold;
}

.list{
    top: 500px;
    left: 40px;
    right: 40px;
    height:150px;

    .item{
        margin-bottom: 10px;
        font-size: 12px;
        color: rgba(255,255,255,.9);
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
                background-color: #000;
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
            background-color: #1cffab;
            margin-bottom: 5px;
            color: #000;
        }
    }
}

.livetitle{
    top: 425px;
    left: 45px;
    text-align: center;
    font-size:24px;
    font-weight: bold;
    color: #032b72;
    letter-spacing: 1.5px;

    div{
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #032b72;
        margin-right: 4px;
    }
}

.title{
    top: 50px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 40px;
    font-weight: 800;
    letter-spacing: 3px;
    font-family:'Times New Roman', Times, serif;
    color: #0a3aa7;
    font-style: italic;
    transform: rotate(-2deg);
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