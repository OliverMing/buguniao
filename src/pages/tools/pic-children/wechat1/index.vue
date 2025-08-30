<template>
    <div class="w-100 main">
        <div>
            <div>推荐日期：</div>
            <div class="flex-1">{{ content.time }}</div>
        </div>
        <div>
            <div>股票代码：</div>
            <div class="flex-1">{{ content.code }}</div>
        </div>
        <div>
            <div>推荐价格：</div>
            <div class="flex-1">{{ content.price }}</div>
        </div>
        <div>
            <div>预警价格：</div>
            <div class="flex-1">{{ content.price1 }}</div>
        </div>
        <div>
            <div>推荐仓位：</div>
            <div class="flex-1">{{ content.cangwei }}</div>
        </div>
        <div>
            <div>推荐理由：</div>
            <div class="flex-1">{{ content.liyou }}</div>
        </div>
        <div class="line"></div>
        <div class="tips">{{ content.tips }}</div>
    </div>
</template>

<script>
export default {
    props:{
        content:Object
    }
}
</script>

<style  scoped>
.main{background-color: #fff;padding: 2% 5%;border: 1px solid #FFF;font-size: 1em;color: #1a1a1a;min-height: 100%;}
.main>div{margin-bottom: 0.5em;display: flex;}
.main>div>div:first-child{width: 5.2em}
.line{margin: 6% 0;height: 1px;background-color: #000;width: 18%;}
.tips{line-height: 1.4em !important;opacity: .8;text-align: justify;}
.tips span{margin-left: -0.5em;}
</style>