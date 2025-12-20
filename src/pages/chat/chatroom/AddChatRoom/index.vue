<template>
    <!-- 新增或者修改聊天室 -->
    <a-modal :title="`${chatRoomForm.id ? '修改' : '新增'}聊天室`" centered width="580px"
        @cancel="close" 
        @ok="onSubmit"
        :confirm-loading="uploading"
        :visible="showAddResource">
        <div>
            <a-form-model ref="ruleForm" 
             :label-col="{ span: 5 }" :wrapper-col="{ span:19 }"
            @submit="onSubmit" :model="chatRoomForm" :rules="rules" @submit.native.prevent>
                
                <!-- 是否是vip -->
                <a-form-model-item label="vip房间" prop="is_vip_room">
                    <a-radio-group v-model="chatRoomForm.is_vip_room">
                        <a-radio :value="0">否</a-radio>
                        <a-radio :value="1">是</a-radio>
                    </a-radio-group>
                </a-form-model-item>

                <template v-if="chatRoomForm.is_vip_room == 1">
                    <!-- vip房间头像 -->
                    <a-form-model-item label="vip房间头像" prop="vip_room_avatar">
                        <UploadImage v-model="chatRoomForm.vip_room_avatar" style="margin-top: 10px;margin-bottom: -20px;" />
                    </a-form-model-item>

                    <!-- vip房间类型 -->
                    <a-form-model-item label="vip房间类型" prop="vip_room_type">
                        <a-select v-model="chatRoomForm.vip_room_type" placeholder="请选择vip房间类型">
                            <a-select-option v-for="item in vipRoomTypeOptions" 
                            :key="item.value" :value="item.value"
                            :disabled="item.value != 'text'">{{item.label}}</a-select-option>
                        </a-select>
                    </a-form-model-item>

                    <!-- vip房间描述 -->
                    <a-form-model-item label="vip房间描述" prop="vip_room_desc">
                        <a-input placeholder="请输入vip房间描述" v-model="chatRoomForm.vip_room_desc" />
                    </a-form-model-item>
                </template>
                
                <a-form-model-item label="房间号" prop="code">
                    <a-input :disabled="chatRoomForm.id != null" 
                    :placeholder="`${chatRoomForm.is_vip_room == 1 ? '请输入房间号(如：vip123456)' : '请输入房间号(如：123456)'}`"
                    v-model="chatRoomForm.code" :maxlength="chatRoomForm.is_vip_room == 1 ? 6 : 10" />
                </a-form-model-item>

                <!-- 房间名称 -->
                <a-form-model-item label="房间名称" prop="room_name">
                    <a-input placeholder="房间名称" v-model="chatRoomForm.room_name" />
                </a-form-model-item>

                <!-- 有效期多少天 -->
                <a-form-model-item label="有效期" prop="validity">
                    <a-input placeholder="请输入有效期多少天" v-model="chatRoomForm.validity" maxlength="3" />
                </a-form-model-item>
                <!-- 通知 -->
                <a-form-model-item label="通知公告" prop="notice_message">
                    <a-input placeholder="请输入通知公告" v-model="chatRoomForm.notice_message" />
                </a-form-model-item>
                <!-- <a-form-model-item style="margin-top: 24px">
                    <a-button type="primary" htmlType="submit" :loading="uploading" @click="onSubmit">提交</a-button>
                </a-form-model-item> -->
            </a-form-model>
        </div>
    </a-modal>
</template>

<script>
import api from '@/api'

export default {
    data() {
        return {
            showAddResource: false,
            initialForm: {
                id: null,
                code: null,
                validity: null,
                notice_message: null,
                is_vip_room: 0, // 是否是vip房间
                vip_room_type:'text', // vip房间类型
                vip_room_avatar:null, // vip房间头像
                vip_room_desc:null, // vip房间描述
                room_name:null, // vip房间名称
            },
            vipRoomTypeOptions:[
                {  label:'文字课程房间', value:'text' },
                {  label:'视频课程房间', value:'video' },
                {  label:'理论课程房间', value:'theory' },
                {  label:'文章', value:'article' },
                {  label:'量化策略', value:'quant' },
                {  label:'小目标', value:'goal' },
                {  label:'策略组合', value:'strategy' }
            ],   
            chatRoomForm: {},
            rules: {
                is_vip_room: { required: true, message: '是否是vip房间' },
                code: { required: true, message: '请输入房间号' },
                vip_room_type: { required: true, message: '请选择vip房间类型' },
                // room_name: { required: true, message: '请输入vip房间名称' },
                vip_room_avatar: { required: true, message: '请上传vip房间头像' },
                vip_room_desc: { required: true, message: '请输入vip房间描述' }
                // notice_message: { required: true, message: '请输入通知公告' },
                // validity: { required: true, message: '请输入有效期多少天' },
            },
        }
    },
    methods: {

        open(item = null) {
            this.chatRoomForm = Object.assign({}, this.initialForm);
            if (item) {
                Object.keys(this.chatRoomForm).forEach(key => {
                    this.chatRoomForm[key] = item[key];
                });
            }
            this.showAddResource = true;
        },

        close() {
            this.chatRoomForm = Object.assign({}, this.initialForm);
            this.showAddResource = false;
        },

        onSubmit: function () {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    if (!this.chatRoomForm.id) {
                        this.chatRoomForm.creators = this.$store.state.account.user.id;
                    }
                    api[this.chatRoomForm.id ? 'UpdateLiveRoom' : 'AddLiveRoom'](this.chatRoomForm).then(() => {
                        this.$message.success('执行成功');
                        this.close();
                        this.$emit('success');
                    })
                }
            })
        },
    }
}
</script>