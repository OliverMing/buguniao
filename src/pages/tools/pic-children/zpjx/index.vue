<template>
    <div class="pr">
        <img src="@/assets/image/zpjx_three1.png" style="width: 100%;" alt="">
        <div class="pb jgname">{{ content.name }}</div>
        <div class="pb time">{{ content.time }}</div>
        <div class="pb title">{{ content.title }}</div>
        <div class="pb list">
            <div class="flex list-item">
                <div class="item"><span class="itext">标的教学</span></div>
                <div class="item"><span class="itext">标的代码</span></div>
                <div class="item"><span class="itext">入选理由</span> </div>
            </div>
            <div class="flex list-item" v-for="(item,index) in content.list" :key="index">
                <div class="item">{{ item.name }}</div>
                <div class="item" style="font-size: 18px;">{{ item.code }}</div>
                <div class="item">
                    <span class="liyou">{{ item.liyou }}</span>
                </div>
            </div>
        </div>

        <div class="pb contenta flex align-center" v-html="content.contentA.replace(/\n/g, '<br>')"></div>

        <div class="pb contentb flex align-center" v-html="content.contentB.replace(/\n/g, '<br>')">
        </div>

        <div class="pb contentc flex align-center" v-html="content.contentC.replace(/\n/g, '<br>')"></div>
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
    top: 53px;
    color: #f6dbc0;
    font-size: 22px;
    left: 50%;
    width: max-content;
    transform: translateX(-50%);
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
    top: 103px;
    width: 85%;
    // color: #f2d7c7;
    text-align: center;
    font-weight: bold;
    font-size: 42px;
    left: 50%;
    line-height: 52px;
    transform: translateX(-50%);
    letter-spacing: 2px;
    color: #fcd8c3;
    text-shadow:0px 1px 0px #000,    
	 0px 1px 0px #000,    
	 0px 1px 0px #000,    
	 0px 1px 0px #000,    
	 0px 5px 10px rgba(0, 0, 0, .5);
}


.list{
    top: 232px;
    width: 93.5%;
    left: 50%;
    transform: translateX(-50%);

    .list-item{
        margin-bottom: 2px;
        height: 48px;

        .item{
            height: 100%;
            color: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            font-size: 16px;
            // background-color: rgba(0,0,0,.7);


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

        .item:first-child{
            width: 104px;
        }
        .item:nth-child(2n){
            width: 116px;
            margin: 0 1px;
        }

        .item:last-child{
            width: 128px;
        }
    }
    
    .list-item:first-child,.list-item:last-child{
        height: 38px;
    }
}

.contenta{
    top: 480px;
    height: 135px;
    width: 85%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    // text-align: justify;
    color: #bc302f;
}

.contentb{
    top: 630px;
    height: 100px;
    width: 85%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 13px;
    // text-align: justify;
    color: #e9ddbc;
}


.contentc{
    bottom: -15px;
    height: 100px;
    width: 90%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    text-align: center;
    color: #e9ddbc;
}
</style>