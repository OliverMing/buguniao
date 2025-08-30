<template>
    <div class="w-100 h-100 pr">
      <img class="w-100" :src="require(`@/assets/image/kzjg.png`)" alt="">
      <div class="pa title">{{ content.time }}</div>
      <div class="flex justify-center align-center pa title-1">
        <div class="flex-1">{{ content.ls1Title }}</div>
        <div class="flex-1">{{ content.ls2Title }}</div>
        <div class="flex-1">{{ content.ls3Title }}</div>
      </div>

      <div class="list-box pa">
        <div class="flex justify-center align-center" v-for="e in content.list" :key="e.time">
           <div class="flex-1 flex justify-center align-center flex-column">
              <div>{{ e.chineseNumber }}</div>
              <div>{{ e.time }}</div>
           </div>
           <div class="flex-1 flex justify-center align-center">
             <div :class="['code-box',e.name == '预约中' && 'big-size']">{{ e.name }}</div>
           </div>
           <div class="flex-1 flex justify-center align-center">
            <div :class="['code-box',e.number == '预约中' && 'big-size']">{{ e.number }}</div>
           </div>
        </div>
      </div>
    </div>
 </template>

<script>
export default {
  props:{
    content:Object
  },
  data(){
    return {

    }
  }
}
</script>
 
<style scoped>
.title{top: 8%;left: 50%;transform: translateX(-50%);color: yellow;text-align: center;font-size: 1.1em;margin-left: -2%;letter-spacing: .05em;font-weight: bold;}
.title-1{left: 7.2%;right:7.2%;top: 34%;height: 6.5%;}
.title-1>div{text-align: center;font-size: 1em;color: #980400;}
.title-1>div:not(:last-child){margin-right: 8%;}
.list-box { height: 54%;left: 5%;right: 5%;top: 39%; }
.list-box>div{height: 25%;width: 100%;font-size: .8em;color: #ffe72c;letter-spacing: .1em;}
.code-box{margin: 0 10%;text-align: center;font-size: 1.2em;line-height: 1.2em;}
/* .big-size{font-size: 1.4em !important;letter-spacing: .16em;} */
</style>