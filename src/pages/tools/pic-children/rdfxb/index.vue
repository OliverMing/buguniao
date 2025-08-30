<template>
    <div class="pr">
        <img src="@/assets/image/rdfxb2.jpg" style="width: 100%;" alt="">
         <div class="pb title">{{ content.title1 }}</div>
        <div class="pb time">{{ content.time }}</div>
        <div class="pb title title2">{{ content.title2 }}</div>
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
    top:92px;
    color: #000;
    font-size: 16px;
    left: 52%;
    font-weight: bold;
    width: max-content;
    font-style: italic;
}

.title{
    font-family: "sans-serif monospace";
    top: 60px;
    // color: #f2d7c7;
    text-align: center;
    font-style: italic;
    font-weight: bold;
    font-size: 50px;
    left: 2%;
    line-height: 52px;
    letter-spacing: 2px;
    color: #d81302;
}

.title2{
    top: 110px;
    font-size: 40px;
    left: 48%;
}
</style>