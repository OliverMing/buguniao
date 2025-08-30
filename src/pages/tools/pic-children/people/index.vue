<template>
    <div class="w-100 h-100 pr">
      <img class="w-100" :src="require(`@/assets/image/people.png`)" alt="">
      <div class="pa theme-title">
        <i>{{ content.title }}</i>
      </div>
      <div class="pa user-box flex justify-center align-center">
        <img :src="require(`@/assets/image/user.png`)" >
      </div>
      <div class="pa box"></div>
      <div class="pa content-box">
        <div class="flex" v-for="(e,index) in content.list" :key="index">
          <div class="index flex justify-center align-center">{{ index + 1 }}</div>
          <div class="flex-1 text">
            {{ e.content }}
          </div>
        </div>
        
      </div>

      <div class="pa flex justify-center align-center flex-column tips">
        {{ content.tips }}
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
.theme-title{ font-size: 4em;top:8%;left:0;width: 100%;text-align: center;font-weight: bold;}
.theme-title>i{color: #f0e1ae;letter-spacing: 0.05em; text-shadow:0px 1px 0px #000,    
	 0px 1px 0px #000,    
	 0px 1px 0px #000,    
	 0px 1px 0px #000,    
	 0px 5px 10px rgba(0, 0, 0, .5);}

.user-box{top: 26.45%;left: 0;right: 0;z-index: 2;}
.user-box img{width: 82%;}

.box{width: 86%;left: 50%;transform:translateX(-50%);z-index: 9;height: 32%;border: 1.4px solid #f0e1ae;top: 61.5%;}

.tips{left: 0;right: 0;bottom: 1.4%;font-size: .75em;color: #fff;z-index: 3;opacity: .8;}
.content-box{
  width: 75%;left: 50%;transform:translateX(-50%);z-index: 7;height: 26.5%;top: 64%;
  padding: 6% 3%;}
.text{text-align: justify;font-size: 1em;color: #c61524;font-family: "fangsong";font-weight: bold;line-height: 1.2em;}
.content-box>div{ margin-bottom: 5%; }
.index{width: 1.3em;height:1.3em;background-color: #c61524;color: #fff;
  border-radius: 50%;margin-right: 3%;font-size: .9em;}










</style>