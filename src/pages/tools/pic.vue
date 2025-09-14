<template>
  <div class="main flex">
    <!-- 左侧模版列表 -->
    <div class="left-demo">


      <waterfall height="100%" :col="3" :data="list">
        <div class="elimg" style="width:90%;" v-for="(item,index) in list" :key="index">
          <div class="w-100 image-box" @click="chooseTemple(index)">
            <img class="w-100" :src="require(`@/assets/image/${item.src}`)" />
            <div class="flex align-center title-box">{{ item.title }}</div>
          </div>
        </div>
      </waterfall>

    </div>
    <!-- 右侧信息录入输入框 -->
    <div class="flex-1 right-box">
      <!-- 中间模版示意 -->
      <div :class="[
        'temple-box',
        // 是否垂直排列
        !info.isVertical && 'flex justify-start'
      ]">

        <div>
          <div class="canvas-box" id="canvas" :style="{
            width: `${info.width ? info.width + 'px' : 'auto'}`,
            height: `${info.height ? info.height + 'px' : 'auto'}`
          }">
            <!-- 水印 -->
            <!-- <div :class="[`sy${activeKey[0]}`]"></div> -->
            <!-- 正文 -->
            <!-- :style="{background:info.background || 'transparent'}" -->
            <div class="canvas-main">
              <components :is="`${info.components}`" 
              :content="info.editor ? editorContent : content"
              :time="nowDateStr" :name="info.name" />
            </div>
          </div>
          <div class="flex justify-center" style="font-size: 12px;margin-top:10px;color: #666;">
            {{ info.tips }}
          </div>
        </div>

        <div class="flex-1 editor">
          <template v-if="info.editor">
            <a-input v-if="chooseItemIndex" placeholder="标题名字（反弹先锋1号就买它）" v-model="name" style="margin-bottom: 14px" />
            <quill-editor class="ql-editor" v-model="editorContent" ref="myQuillEditor" :options="editorOption"
              @ready="ready($event)" @change="onEditorChange($event)">
            </quill-editor>
          </template>

          <template v-else>
            <!-- 自定义输入信息组件 -->
            <components v-model="content" :is="`${info.components}Input`" :title="info.name" :current="chooseItemIndex" />
            <!-- 渲染按钮 -->
            <div class="flex justify-end" style="margin-top: 14px;" v-if="!info.noButton">
              <a-button type="primary" @click="createImage" :loading="loading">立即渲染制作图片</a-button>
            </div>
          </template>
        </div>
        
      </div>
      <div class="flex justify-end" style="margin-top: 14px;" v-if="info.noButton">
        <a-button type="primary" @click="createImage" :loading="loading">立即渲染制作图片</a-button>
      </div>
    </div>
  </div>
</template>
  
<script>
import VueWaterfallEasy from 'vue-waterfall-easy'
import html2canvas from 'html2canvas'
/* eslint-disable */
import { toolbarOptions, Quill, lineHeightStyle } from "./tools"

export default {
  components: {
    VueWaterfallEasy,
    temple20: () => import("./pic-children/temple2"),
    temple21: () => import("./pic-children/temple3"),
    grfs1: () => import("./pic-children/grfs1"),
    grfs1Input: () => import("./pic-children/grfs1/input"),
    grfs2: () => import("./pic-children/grfs2"),
    grfs2Input: () => import("./pic-children/grfs1/input"),

    grfs4: () => import("./pic-children/grfs4"),
    grfs4Input: () => import("./pic-children/grfs1/input"),

    grfs3: () => import("./pic-children/grfs3"),
    grfs3Input: () => import("./pic-children/grfs3/input"),
    wechat1: () => import("./pic-children/wechat1"),
    wechat1Input: () => import("./pic-children/wechat1/input"),
    temple4: () => import("./pic-children/temple4"),
    temple4Input: () => import("./pic-children/temple4/input"),

    temple5: () => import("./pic-children/temple5"),
    temple5Input: () => import("./pic-children/temple5/input"),

    kzjg: () => import("./pic-children/kzjg"),
    kzjgInput: () => import("./pic-children/kzjg/input"),

    people: () => import("./pic-children/people"),
    peopleInput: () => import("./pic-children/people/input"),

    live: () => import("./pic-children/live"),
    liveInput: () => import("./pic-children/live/input"),

    jinniu: () => import("./pic-children/jinniu"),
    jinniuInput: () => import("./pic-children/jinniu/input"),

    zkyb:() => import("./pic-children/zkyb"),
    zkybInput: () => import("./pic-children/zkyb/input"),

    dxcl:() => import("./pic-children/dxcl"),
    dxclInput: () => import("./pic-children/dxcl/input"),

    mrjg:() => import("./pic-children/mrjg"),
    mrjgInput: () => import("./pic-children/mrjg/input"),

    zpjx:() => import("./pic-children/zpjx"),
    zpjxInput: () => import("./pic-children/zpjx/input"),

    rdfxb:() => import("./pic-children/rdfxb"),
    rdfxbInput: () => import("./pic-children/rdfxb/input"),

    xzbt:() => import("./pic-children/xzbt"),
    xzbtInput: () => import("./pic-children/xzbt/input"),

    ltlj:() => import("./pic-children/ltlj"),
    ltljInput: () => import("./pic-children/ltlj/input"),

    dxjg:() => import("./pic-children/dxjg"),
    dxjgInput: () => import("./pic-children/dxjg/input"),

    rtzy:() => import("./pic-children/rtzy"),
    rtzyInput: () => import("./pic-children/rtzy/input"),

    gssrx:() => import("./pic-children/gssrx"),
    gssrxInput: () => import("./pic-children/gssrx/input"),

    mxnc: () => import("./pic-children/mxnc"),
    mxncInput: () => import("./pic-children/mxnc/input"),

    tsfa: () => import("./pic-children/tsfa"),
    tsfaInput: () => import("./pic-children/tsfa/input"),

    jxal: () => import("./pic-children/jxal"),
    jxalInput: () => import("./pic-children/jxal/input"),

    qlt:() => import("./pic-children/qlt"),
    qltInput: () => import("./pic-children/qlt/input"),
  },
  computed:{
    // 当前选中的模板
    //  info(){
    //   return this.tepmleList[this.activeKey[0]].children[this.chooseItemIndex];
    //  }
  },
  data() {
    return {

      name: "反弹先锋1号就买它",

      list:[
        {
          title: "交易策略", width: 400, height: 800, components: "qlt",
          name:"交易策略",
          scale:3, src: 'qinlongtou.png',
        },
        {
          title: "教学案例", 
          width: '', height: '', 
          components: "jxal", 
          scale: 4,
          src:'jxal.png',
        },
        {
          title: "红七月", background: "#e3d1bb", width: '', height: '', components: "tsfa", scale: 4,
          isVertical:true,
          src:'hqy.png',
        },
        {
          title: "模型内参", background: "#e3d1bb", width: '', height: '', components: "mxnc", scale: 4,
          src:'mxnc1.png',
          tips: "单张图,尽量保证单张图宽高比 1.5:1",
        },
        {
          title: "股市三人行", background: "#fff", width: 360, height: 640, components: "gssrx",
          name:"股市三人行",
          scale:3, src: 'gssrx1.png',
        },
        {
          title: "融通智盈", background: "#fff", width: 375.33, height: 621.33, components: "rtzy",
          name:"融通智盈",
          scale:2, src: 'rtzy.jpg',
        },
        {
          title: "短线金股", background: "#fff", width: 391, height: 733.5, components: "dxjg",
          name:"短线金股",
          scale:2, src: 'time1.png',
        },
        {
          title: "龙头逻辑", background: "#e78546", width: 360, height: 735.333, components: "ltlj",
          name:"龙头逻辑",
          scale:3, src: 'livelongtou1.png',
        },
        {
          title: "下周补贴", background: "#e78546", width: 518.33, height: 277.33, components: "xzbt",
          name:"下周补贴",
          scale:3, src: 'xzbt1.png',
        },
        {
          title: "热点风向标", background: "#e78546", width: 332, height: 514.33, components: "rdfxb",
          name:"热点风向标",
          scale:3, src: 'rdfxb1.jpg',
        },
        {
          title: "早盘精选", background: "#e78546", width: 375, height: 812, components: "zpjx",
          name:"早盘精选",
          scale:2, src: 'zpjx1.png',
        },
        {
          title: "每日金股", background: "#e78546", width: 420, height: 740, components: "mrjg",
          name:"每日金股",
          scale:1, src: 'mrjg.jpg',
        },
        {
          title: "短线策略", background: "#e78546",
          components:"dxcl", 
          name:"短线策略",
          editor:false,
          width: 329, height: 585,
          scale:2, src: 'dxcl.jpg',
        },
        {
          title: "智库研报", background: "#e78546",
          components:"zkyb", 
          name:"智库研报",
          editor:true,
          scale:3, src: 'zkyb.png',
        },
        {
          title: "金牛系列", background: "#e78546", width: 426.7, height: 695, components: "jinniu",
          name:"金牛",
          scale:3, src: 'jinniu.png',
        },
        {
          title: "直播封面", background: "#e3d1bb", width: 518.3333, height: 277.3333, components: "live", scale: 3,
          src:'live_bg.jpg'
        },
        {
          title: "锵锵三人行", background: "#e3d1bb", width: 375, height: 637, components: "people", scale: 2,
          src:'people.png'
        },
        {
          title: "深夜研报1", background: "#e3d1bb", width: 640, height: 360, components: "temple20", scale: 4,
          src:'a.jpg',
          tips: "单张图,尽量保证单张图宽高比 1.5:1",
          editor: true
        },
        {
          title: "深夜研报2", background: "#e78546", width: 350, height: 417.5, components: "temple21",
          scale: 6, src: 'b.jpg',
          tips: "需要上传两张图,尽量保证每张图片宽高比 1.6:1",
          editor: true
        },
        {
          title: "战绩统计一", background: "#e3d1bb", width: 640, height: 350, components: "grfs1", scale: 4,
          src: '1.png',
        },
        {
          title: "战绩统计二", background: "#e78546", width: 296, height: 444, components: "grfs2",
          scale: 2, src: '2.png',
        },
        {
          title: "战绩统计三", background: "#e78546", width: 420, height: 701, components: "grfs4",
          name:"冲锋",
          scale: 1, src: '4.png',
        },
        {
          title: "价值超短", background: "#e3d1bb", width: 720, height: 398, components: "grfs3", scale: 4,
          src: 'p1.png',
        },
        {
          title: "微信", width: 250, height: 315, components: "wechat1", scale: 2,
          src: 'wechat.png',
        },
        {
          title: "建仓单股", width: 360, height: 680, components: "temple4", scale: 3,
          src: 'n1.jpg',
        },
        {
          title: "建仓单股二", width: 397, height: 629.5, components: "temple5", scale: 2,
          src: 'cf3_bg.jpg', // 794 1259
        },
        {
          title: "跨周金股", width: 340, height: 528.125, components: "kzjg", scale: 2,
          src: 'kzjg.png',
        },
      ],

      info:null,

      tepmleList: [
        {
          title: '模版样式一（森财有道）',
          children: [
            {
              title: "深夜研报1", background: "#e3d1bb", width: 640, height: 360, components: "temple20", scale: 4,
              icon: 'temple2/demo/0.jpg',
              tips: "单张图,尽量保证单张图宽高比 1.5:1",
              editor: true
            },
            {
              title: "深夜研报2", background: "#e78546", width: 350, height: 417.5, components: "temple21",
              scale: 6, icon: 'temple2/demo/2.jpg',
              tips: "需要上传两张图,尽量保证每张图片宽高比 1.6:1",
              editor: true
            },
          ]
        },
        {
          title: '模版样式二（国融投资）',
          children: [
            {
              title: "战绩统计一", background: "#e3d1bb", width: 640, height: 350, components: "grfs1", scale: 4,
              icon: 'fs1.png',
            },
            {
              title: "战绩统计二", background: "#e78546", width: 296, height: 444, components: "grfs2",
              scale: 2, icon: 'fs2.png',
              tips: "需要上传两张图,尽量保证每张图片宽高比 1.6:1"
            },
          ]
        },
        {
          title: '模版样式三（国融投资-价值超短）',
          children: [
            {
              title: "价值超短", background: "#e3d1bb", width: 720, height: 398, components: "grfs3", scale: 4,
              icon: 'fs1.png',
            },
          ]
        },
      ],
      nowDateStr: null, // 当前时间
      editorContent: null, //富文本内容
      content:null,// 自定义信息内容
      activeKey: [0], //折叠面板活动Key
      chooseItemIndex: 0, // 选中的模板子集中的第几项
      loading: false, // 制作中
      // 富文本编辑器配置
      editorOption: {
        modules: {
          toolbar: { 
            container: toolbarOptions,
            handlers: {
              lineheight: function (value) {
                if (value) {
                  this.quill.format('lineHeight', value);
                } else {
                  console.log(value);
                }
              }
            },
          },
        }
      }
    }
  },
  created() {
    this.info = this.list[0];
    // 获取当前日期
    var d = new Date();
    var year = d.getFullYear();
    var mounth = d.getMonth() + 1;
    var day = d.getDate();
    this.nowDateStr = [year, mounth, day].map(e => {
      return e > 9 ? e : `0${e}`;
    }).join('-');
    // 查询是否有缓存选中的模板
    // let cache = localStorage.getItem('chooseCache');
    // if(cache){
    //   cache = JSON.parse(cache);
    //   const { activeKey,chooseItemIndex } = cache;
    //   this.chooseTemple(activeKey,chooseItemIndex);
    // }
  },
  methods: {

    ready() {
      Quill.register({ 'formats/lineHeight': lineHeightStyle }, true);
    },

    // 选择模板
    chooseTemple: function (index) {
      this.info = this.list[index];
      // this.chooseItemIndex = i;
      // this.activeKey = [index];
      // localStorage.setItem('chooseCache', JSON.stringify({
      //   activeKey: index,
      //   chooseItemIndex: i
      // }));
    },

    // 内容改变事件
    onEditorChange({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
      this.editorContent = html;
    },

    // 生成图片
    createImage: function () {
      this.loading = true;
      const scale = this.tepmleList[this.activeKey[0]].children[this.chooseItemIndex].scale;
      html2canvas(document.getElementById('canvas'), {
        useCORS: true, //是否允许跨域
        scale
      }).then(canvas => {

        var imgUrl = canvas.toDataURL();
        const link = document.createElement('a');
        link.href = imgUrl;
        const timestamp = Date.parse(new Date());
        link.download = `${timestamp}.png`; //下载的文件名
        link.click();

        setTimeout(() => {
          this.loading = false;
        }, 300);

      }).catch(err => {
        this.loading = false;
        console.info(err);
      });
    },
  }
}
</script>
  
<style scoped>

.image-box{margin-bottom: 10px;cursor: pointer;}
.image-box img{border: 1px solid rgba(255,255,255,.5);border-radius: 3px;}
.title-box{font-size: 12px;color: rgba(255,255,255,.6);margin-top: 4px;}
.elimg{width: 100% !important;}
.main>div {
  background: #fff;
}

.left-demo {
  width: 330px;
  height: calc(100vh - 200px);
  margin-right: 15px;
  background-color: #091528 !important;
}

.left-demo,
.right-box {
  padding: 15px;
}

.editor {
  margin-left: 15px;
}

.temple-box {
  background: transparent !important;
}


.canvas-main {
  width: 100%;
  height: 100%
}

.choose {
  position: absolute;
  right: 4px;
  top: 4px;
  z-index: 9;
  width: 20px !important;
}

.canvas-box {
  position: relative;
}

.canvas-box img {
  width: 100%;
}

.sy0,
.sy1 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  opacity: .4;
}

.sy0 {
  background: url('../../assets/image/sy0.png');
  background-size: 30%;
}

.sy1 {
  background: url('../../assets/image/sy1.png');
  background-size: 30%;
}

.temp-cover>.temple-item:nth-child(2) {
  margin-left: 15px;
}

.temple-item {
  width: calc(100% - 10px);
  background: #fff;
  border-radius: 6px;
  overflow-x: hidden;
  cursor: pointer;
  position: relative;
}

.temple-item>img:first-child {
  width: 100%;
  height: 80px;
  object-fit: cover;
}

.mode-title {
  font-size: 12px;
  color: #9fcaf7;
  height: 30px;
  background: #337aee;
  margin-top: 2px;
}
</style>

<style>
.quill-editor {
  padding: 0;
  white-space: normal;
  height: auto !important;
}

.ql-container {
  min-height: 400px !important;
}

.info-box img {
  width: 100%;
}

p {
  margin-bottom: 8px;
}
</style>

<style>
.quill-editor {
  .editor-upload {
    display: none;
  }

  /*
      文字大小
    */
  .ql-snow .ql-picker.ql-size {
    width: 70px;
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='10px']::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='10px']::before {
    content: '10px';
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='12px']::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='12px']::before {
    content: '12px';
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='14px']::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='14px']::before {
    content: '14px';
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='16px']::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='16px']::before {
    content: '16px';
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='20px']::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='20px']::before {
    content: '20px';
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='24px']::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='24px']::before {
    content: '24px';
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='36px']::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='36px']::before {
    content: '36px';
  }

  /*
      字体
    */
  .ql-snow .ql-picker.ql-font {
    width: 80px;
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='宋体']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='宋体']::before {
    content: '宋体';
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='黑体']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='黑体']::before {
    content: '黑体';
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='微软雅黑']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='微软雅黑']::before {
    content: '微软雅黑';
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='楷体']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='楷体']::before {
    content: '楷体';
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='仿宋']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='仿宋']::before {
    content: '仿宋';
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Arial']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Arial']::before {
    content: 'Arial';
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='苹方']::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='苹方']::before {
    content: '苹方';
  }

  /*
      标题  
    */
  .ql-snow .ql-picker.ql-header {
    width: 80px;
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: "文本" !important;
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: "标题1" !important;
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: "标题2" !important;
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: "标题3" !important;
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: "标题4" !important;
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: "标题5" !important;
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: "标题6" !important;
  }

  .ql-snow .ql-picker.ql-lineheight {
    width: 70px;
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-label::before {
    content: '行高';
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value='initial']::before {
    content: '默认';
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value='1']::before {
    content: '1';
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value='1.1']::before {
    content: '1.1';
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value='1.2']::before {
    content: '1.2';
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value='1.3']::before {
    content: '1.3';
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value='1.4']::before {
    content: '1.4';
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value='1.5']::before {
    content: '1.5';
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value='1.75']::before {
    content: '1.75';
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value='2']::before {
    content: '2';
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value='3']::before {
    content: '3';
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value='4']::before {
    content: '4';
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value='5']::before {
    content: '5';
  }
}

.vue-waterfall::-webkit-scrollbar {
  display: none;
  
}

.vue-waterfall{
  -ms-overflow-style: none;  /* 适用于 IE 和 Edge */
  scrollbar-width: none;  /* 适用于 Firefox */
}

</style>