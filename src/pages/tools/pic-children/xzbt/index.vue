<template>
    <div class="pr">
        <img src="@/assets/image/xzbt2.jpg" style="width: 100%;" alt="">
        <div class="pb jgname">{{ content.name }}</div>
        <div class="pb time name">{{ content.livetitle }}</div>
        <div class="pb time">{{ content.time }}</div>
        <div class="pb time time1">{{ content.time1 }}</div>
        <div class="pb title">{{ content.title }}</div>

        <div class="pb contenta flex align-center">
            {{ content.content1 }}
        </div>

        <div class="pb contentb flex align-center">
            {{ content.content2 }}
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



.time{
    top: 80px;
    color: #f6dbc0;
    font-size:11px;
    left: 2.8%;
    width: 100px;
    text-align: center;
}

.time1{
    top: 92px;
    font-weight: bold;
    font-size: 16px;
}

.name{
    top: 60px;
    color: #f6dbc0;
    font-size:11px;
    left: 2.4%;
    width: 100px;
    text-align: center;
}

.jgname{
    top: 10px;
    color: #FFF;
    font-size: 12px;
    font-weight: 300;
    left: 50%;
    width: max-content;
    transform: translateX(-50%);
}

.title{
    top: 30px;
    width:50%;
    text-align: center;
    font-weight: bold;
    font-size: 36px;
    left:50%;
    line-height: 52px;
    letter-spacing: 2px;
    // -webkit-text-stroke: 1px #770404; /* 边框宽度和颜色 */  
    color: #f2ecb9;
    text-shadow:0px 1px 0px #88120c,    
	 0px 2px 0px #88120c,    
	 0px 3px 0px #88120c,    
	 0px 4px 0px #88120c,    
	 0px 5px 10px rgba(0, 0, 0, .6);
}


.list{
    top: 234px;
    width: 90%;
    left: 50%;
    transform: translateX(-50%);

    .list-item{
        margin-bottom: 2px;
        height: 50px;

        .item{
            height: 100%;
            color: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            font-size: 16px;


            .liyou{
                font-size: 12px;
                line-height: 20px;
                // font-weight: normal;
                // text-align: justify;
                padding: 0 4px;
            }


            .itext{
                font-style: italic !important;
            }
        }

        .item:nth-child(2n){
            margin:0px;
        }
    }
    
}

.contenta{
    top: 95px;
    height: 70px;
    width:235px;
    left: 52%;
    font-size: 12px;
    color: #f5dec5;
    text-align: justify;
    padding: 10px;
}

.contentb{
    top: 179px;
    height: 70px;
    width:235px;
    left: 52%;
    text-align: justify;
    font-size: 12px;
    color: #f5dec5;
    padding: 10px;
}
</style>