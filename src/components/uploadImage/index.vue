<template>
    <a-upload name="files" 
    list-type="picture-card"
    :show-upload-list="false" 
    :action="actionUrl"
    :before-upload="beforeUpload"
    @change="handleChange">
        <img v-if="value" :src="value" alt="avatar" style="width: 100%;height: 100%;" />
        <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">Upload</div>
        </div>
    </a-upload>
</template>

<script>
export default {
    mode:{
       type:"input",
       prop:"value"
    },
    data() {
        return {
            loading:false,
            baseUrl: `${process.env.VUE_APP_API_BASE_URL}`,
            actionUrl: `${process.env.VUE_APP_API_BASE_URL}/Admin/UploadFile`,
        }
    },
    props: {
        value:String
    },
    methods: {
        handleChange(info) {
            if (info.file.status === 'uploading') {
                this.loading = true;
                return;
            }
            if (info.file.status === 'done') {
                this.$emit('input',`https:${this.baseUrl}/${info.file.response.data}`);
                this.loading = false;
            }
        },

        // 上传资源
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                this.$message.error('You can only upload JPG file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('Image must smaller than 2MB!');
            }
            return isJpgOrPng && isLt2M;
        },
    }
}
</script>