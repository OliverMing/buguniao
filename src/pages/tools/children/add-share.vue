<template>
    <a-card :bordered="false">
      <a-form-model ref="ruleForm" @submit="onSubmit" :model="form" :rules="rules" @submit.native.prevent>


        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="分享信息">
          <a-form-model-item v-if="!stubline" label="分享封面图" required>
              <a-upload :file-list="fileList"  :before-upload="beforeUpload" accept=".png,.jpg,.jpeg">
                  <a-button>
                      <upload-outlined></upload-outlined>
                      {{ info ? '重新上传' : '选择文件' }}
                  </a-button>
                  <div style="margin-top:10px;font-size:12px;color:#888">仅支持.png/.jpg/.jpeg文件，大小限制20kb以内</div>
              </a-upload>
          </a-form-model-item>

          <a-form-model-item v-if="!stubline" label="分享标题" prop="shareTitle">
            <a-input placeholder="请输入分享标题" v-model="form.shareTitle" />
          </a-form-model-item>

          <a-form-model-item v-if="!stubline" label="分享描述" prop="shareDesic">
            <a-input placeholder="请输入分享描述" v-model="form.shareDesic" />
          </a-form-model-item>

          <a-form-model-item label="获客链接" prop="link" v-if="type == 0">
            <a-input placeholder="https://work.weixin.qq.com/ca/cawcdec955a7069464" v-model="form.link" />
          </a-form-model-item>

          <a-form-model-item label="归属用户" prop="username" v-if="type == 0">
            <a-input placeholder="归属用户（非必填）" v-model="form.username" />
          </a-form-model-item>

          </a-tab-pane>
          <a-tab-pane key="2" tab="文章内容" force-render  v-if="type == 1">

            <a-form-model-item label="文章标题">
              <a-input placeholder="请输入文章标题" v-model="form.content_title" />
            </a-form-model-item>
            <a-form-model-item label="文章创建时间">
              <a-input placeholder="请选择文章创建时间" v-model="form.content_time" />
            </a-form-model-item>
            <a-form-model-item label="作者">
              <a-input placeholder="请输入作者" v-model="form.content_doctor" />
            </a-form-model-item>
            <a-form-model-item label="阅读量">
              <a-input placeholder="请输入阅读量" v-model="form.content_readcount" />
            </a-form-model-item>
            <a-form-model-item label="点赞数">
              <a-input placeholder="请输入点赞数" v-model="form.content_likecount" />
            </a-form-model-item>
          
            <a-form-model-item label="文章内容" prop="content">
              <!-- <quill-editor 
                class="ql-editor"
                style="padding: 0 0;margin-top: 0px;"
                v-model="form.content" 
                ref="myQuillEditor" 
                :options="editorOption"
                @ready="ready($event)"
                @change="onEditorChange">
              </quill-editor> -->
              <div class="module-box" v-for="(item,index) in contentList" :key="index">
                <img v-if="item.type == 'image'" :src="item.content" />
                <div v-else-if="item.type == 'text'" v-html="item.content"></div>
                <video controls v-else-if="item.type == 'video'" :src="item.content" style="width:100%;height: 220px;object-fit: cover;"></video>
                
                <div class="handler">
                  <span @click="contentHandler(index,'edit')" v-if="item.type == 'text'">编辑</span>
                  <span @click="contentHandler(index,'move')" v-if="index > 0">上移</span>
                  <span @click="contentHandler(index,'del')">删除</span>
                </div>
              </div>
              <a-button type="primary" :loading="imageloading" @click="imgHandler('.jpg,.png')" icon="file-image">图片</a-button>
              <a-button type="primary" :loading="videoloading" @click="imgHandler('.mp4')" icon="video-camera" style="margin:0 10px">视频</a-button>
              <a-button type="primary" @click="openText" icon="file-text">文本</a-button>
            </a-form-model-item>
          </a-tab-pane>
          <!-- <a-tab-pane key="3" tab="页面模板" force-render  v-if="type == 1">
            <a-upload :file-list="fileList"  :before-upload="beforeUpload" accept=".png,.jpg,.jpeg">
                  <a-button>
                      <upload-outlined></upload-outlined>
                      {{ info ? '重新上传' : '选择文件' }}
                  </a-button>
                  <div style="margin-top:10px;font-size:12px;color:#888">仅支持.png/.jpg/.jpeg文件，大小限制20kb以内</div>
              </a-upload>

              <div class="template-box" v-for="(item,index) in template" :key="index">
                <a-input style="margin-bottom: 10px;" placeholder="请输入标题" v-model="item.name" />
                <a-textarea v-model="item.content" placeholder="请输入页面模板" />
              </div>
          </a-tab-pane> -->
        </a-tabs>

        
        <a-form-model-item style="margin-top: 10px">
          <!-- <a-button type="" style="margin-right:10px" @click="useTemplate">模板库导入</a-button> -->
          <a-button type="primary" htmlType="submit" :loading="uploading">提交{{ info ? '修改' : '' }}</a-button>
        </a-form-model-item>
        
      </a-form-model>

      <input v-if="showInput" type="file" hidden :accept="accept" ref="fileBtn" @change="handleChange" />
      
      <a-modal :zIndex="9999" width="900px" v-model="visible" title="添加内容" @ok="handleOk">
        <quill-editor 
          class="ql-editor"
          style="padding: 0 0;margin-top: 0px;"
          v-model="content" 
          ref="myQuillEditor" 
          :options="editorOption"
          @ready="ready($event)"
          @change="onEditorChange">
        </quill-editor>
      </a-modal>

    </a-card>
  </template>
  
  <script>
  import request from 'umi-request'
  import { toolbarOptions, Quill, lineHeightStyle } from "./tools"

  export default {
    name:"add-ercode",
    data () {
      return {
        uploading:false,
        visible:false,
        fileList:[],
        showInput:false,
        rules:{
          link:[
            { required: true, message: '请输入链接', trigger: 'blur' }
          ],
          shareTitle:[
            { required: true, message: '请输入分享标题', trigger: 'blur' }
          ],
          shareDesic:[
            { required: true, message: '请输入分享描述', trigger: 'blur' }
          ]
        },
        accept:null,
        handlerIndex:null,
        videoloading:false,
        imageloading:false,
        template:[
          { name:"重要声明",content:"" }
        ],
        form: {
          id:null,
          link:null,
          type:null,
          shareTitle:null,
          shareDesic:null,
          shareCover:null,
          content:null,
          content_title:null,
          content_time:null,
          content_doctor:null,
          content_readcount:null,
          content_likecount:null,
          username:null
        },
        contentList:[],
        content:null,
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
    props:{
      info:Object,
      list:Array,
      type:Number,
      channelId:String,
      stubline:Boolean
    },
    computed:{
      getSuperCount(){
        if(!this.list || this.list.length == 0) return 100;
        let list = this.list.map(e => e.bv);
        let count = list.reduce((a,b) => a + b);
        return 100 - count;
      },
    },
    created() {
      if(this.info){
        request(`${process.env.VUE_APP_API_BASE_URL}/Anp/StaticitcsCustom`, {
          method: 'post',
          data: {
            id:this.info.id
          }
        }).then(({ data }) => {
          Object.keys(this.form).forEach(e => {
            this.form[e] = data[e];
          });
          this.contentList = JSON.parse(data.content);
        })
        
        
      }
    },
    // mounted() {
    //     if (this.$refs.myQuillEditor) {
    //         //myQuillEditor改成自己的
    //         this.$refs.myQuillEditor.quill.getModule("toolbar").addHandler("image", this.imgHandler);
    //     }
    // },
    methods: {

      openText(){
        this.handlerIndex = null;
        this.visible = true;
      },

      imgHandler(accept) {
        this.accept = accept;
        this.handlerIndex = null;
        this.showInput = false;
        setTimeout(() => {
          this.showInput = true;
          //触发input的单击 ，fileBtn换成自己的
         this.$nextTick(() => {
          this.$refs.fileBtn.click()
         });
        }, 100);
        
      },


      contentHandler(index,type){
        this.handlerIndex = index;
        const item = JSON.parse(JSON.stringify(this.contentList[index]));

        switch(type){
          case "edit":
            this.content = item.content;
            this.visible = true;
            break;
          case "move":
            this.contentList.splice(index,1);
            this.contentList.splice(index -1,0,item);
          break;
          case "del":
            this.contentList.splice(index,1);
          break;
        }
      
      },

      ready() {
        Quill.register({ 'formats/lineHeight': lineHeightStyle }, true);
      },

      // 内容改变事件
      onEditorChange({ quill, html, text }) {
        console.log(html)
        this.content = html;
      },

      // 使用模板库
      useTemplate:function(){
        Object.assign(this.form,{
          link:null,
          shareTitle:"限时领取",
          shareDesic:"诊断研报，仅限50个名额，先到先得！",
          shareCover:"http://y8.gir666.top/uploads/gift1.jpg",
        })
      },

      // 提交资源
      onSubmit:function(){
        if(this.fileList.length == 0 && !this.form.shareCover && !this.stubline){
          this.$message.error("请先选择封面");
        }else{
          this.$refs.ruleForm.validate(valid => {
            if(valid){
              this.form.type = this.type;
              this.form.content = JSON.stringify(this.contentList);
              let formData = new FormData();
              if(this.fileList.length > 0)  formData.append('files', this.fileList[0]);
              Object.keys(this.form).forEach(e => {
                if(this.form[e] != null) formData.append(e, this.form[e]);
              });
              this.uploading = true;
              request(`${process.env.VUE_APP_API_BASE_URL}/Anp/UploadCustom`, {
                  method: 'post',
                  data: formData,
              }).then(res => {
                if(res.state == 'success'){
                  this.$message.success(`${this.form.id ? '修改' : '新增'}成功啦~`);
                  this.fileList = [];
                  this.uploading = false;
                  this.$emit("success");
                }else{
                  this.$message.error("添加失败");
                  this.uploading = false;
                }
              })
            }
          })
        }
      },

      // 上传资源
      beforeUpload:function(file){
        this.fileList = [...this.fileList, file];
        return false;
      },

      handleChange(e) {
          const files = Array.prototype.slice.call(e.target.files);
          if (!files) return;
          let formData = new FormData();
          formData.append("files", files[0]);

          if(this.accept.includes('mp4')) this.videoloading = true;
          else this.imageloading = true;
          

          request(`${process.env.VUE_APP_API_BASE_URL}/Anp/UploadFile`, {
            method: 'post',
            data: formData
          }).then(res => {
              //这里设置为空是为了联系上传同张图可以触发change事件
              // this.$refs.fileBtn.value = "";
              // let selection = this.$refs.myQuillEditor.quill.getSelection();
              //这里就是返回的图片地址，如果接口返回的不是可以访问的地址，要自己拼接
              // let imgUrl = res.data; 
              //获取quill的光标，插入图片 
              // this.$refs.myQuillEditor.quill.insertEmbed(selection != null ? selection.index : 0, 'image', imgUrl)                 
              //插入完成后，光标往后移动一位 
              // this.$refs.myQuillEditor.quill.setSelection(selection.index + 1);

              this.contentList.push({
                type: this.accept.includes('mp4') ? 'video' : 'image',
                content:res.data
              });

              if(this.accept.includes('mp4')) this.videoloading = false;
              else this.imageloading = false;

          })
      },


      // 文本输入返回
      handleOk(){
        if(this.handlerIndex != null){
          this.contentList[this.handlerIndex].content = this.content
        }else{
          this.contentList.push({  type:'text',  content:this.content });
        }
        this.content = null;
        this.handlerIndex = null;
        this.visible = false;
      },


      chooseFile(e){
        const files = Array.prototype.slice.call(e.target.files);
          if (!files) {
              return;
          }
          let formData = new FormData();
          formData.append("files", files[0]);
          request(`${process.env.VUE_APP_API_BASE_URL}/Anp/UploadFile`, {
            method: 'post',
            data: formData
          }).then(res => {
            console.info(res);
          })
      },
    },
  }
  </script>
  
  <style scoped>
  .ant-form-item{margin-bottom: 10px;}
 ::v-deep .ant-card-body{padding: 0px;}

 ::v-deep .ql-container.ql-snow{min-height: 150px;}



.module-box{background-color: #f5f5f5;padding: 10px;margin-bottom: 10px;position: relative;padding-right: 150px;}
.module-box img{width: 100%;}
 ::v-deep p{margin-bottom: 0 !important;line-height:initial !important;}

.handler{position: absolute;right: 10px;top: 50%;transform: translateY(-50%);}
.handler>span{padding: 0 10px;font-size: 12px !important;cursor: pointer;color: #337aee;}
.handler>span:last-child{color: #f10;}


/* 修复 Quill 自定义 size 下拉项与标签均显示为 normal 的问题 */
 ::v-deep .ql-snow .ql-picker.ql-size .ql-picker-label::before,
 ::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: attr(data-value) !important;
}



  </style>
  