<template>
  <a-modal title="发送模板消息" centered width="850px" @ok="onSubmit" @cancel="close" :visible="show"
    :confirm-loading="confirmLoading">
    <div class="template-message-modal" v-if="show">
      <a-card :bordered="false" class="form-card">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="课程名称" prop="course_name">
            <a-input placeholder="请输入课程名称" v-model="form.course_name" />
          </a-form-model-item>

          <a-form-model-item label="上课时间" prop="time">
            <a-date-picker v-model="form.time" show-time placeholder="请选择时间" style="width: 100%"
              format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss" />
          </a-form-model-item>

          <a-form-model-item label="讲师姓名" prop="teacher_name">
            <a-input placeholder="请输入讲师姓名" v-model="form.teacher_name" />
          </a-form-model-item>
          <a-form-model-item label="跳转链接" prop="url">
            <a-input placeholder="请输入跳转链接" v-model="form.url" />
            <a-button type="link" style="margin-left: -15px;" @click="form.url = baseUrl">默认聊天室链接</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-card>

      <!-- 选中用户列表 -->
      <a-card :bordered="false" class="selected-users-card" title="已选中用户">
        <a-table :dataSource="selectedUsers" :columns="userColumns" :pagination="false" bordered size="small"
          :scroll="{ y: 146 }" :rowKey="record => record.id">
          <div slot="headimgurl" slot-scope="text, record">
            <a-avatar :size="32" icon="user" :src="record.headimgurl" />
          </div>
          <div slot="action" slot-scope="text, record">
            <a-button type="link" size="small" style="color: #f5222d;" @click="removeUser(record)">
              <a-icon type="delete" /> 移除
            </a-button>
          </div>
        </a-table>
        <div class="user-count">
          共选中 <span class="count">{{ selectedUsers.length }}</span> 位用户
        </div>
      </a-card>
    </div>
  </a-modal>
</template>

<script>
import api from '@/api';

export default {
  name: 'TemplateMessageModal',
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
      show: false,
      confirmLoading: false,
      selectedUsers: [],
      form: {
        course_name: '',
        time: null,
        url:'',
        teacher_name: ''
      },
      baseUrl: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9e6666dfb7c0165d&redirect_uri=https%3A%2F%2Fwechat.mk-ytx.cn%2Fim%2F&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`,
      rules: {
        course_name:{ required: true, message: '请输入课程名称', trigger: 'blur' },
        time:{ required: true, message: '请选择时间', trigger: 'change' },
        teacher_name: { required: true, message: '请输入讲师姓名', trigger: 'blur' },
        // url: { required: true, message: '请输入跳转链接', trigger: 'blur' }
      },
      userColumns: [
        { title: 'ID', dataIndex: 'id', width: 80 },
        { title: '头像', scopedSlots: { customRender: 'headimgurl' }, width: 80 },
        { title: '昵称', dataIndex: 'nickname', width: 100 },
        { title: 'OPENID', dataIndex: 'openid' },
        { title: '操作', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
      ]
    };
  },
  methods: {
    // 初始化弹窗，传入选中的用户列表
    init(users) {
      this.selectedUsers = JSON.parse(JSON.stringify(users || []));
      this.form.url = this.baseUrl;
      this.show = true;
    },

    // 移除用户
    removeUser(record) {
      const index = this.selectedUsers.findIndex(user => user.id === record.id);
      if (index > -1) {
        this.selectedUsers.splice(index, 1);
        // 通知父组件同步删除
        this.$emit('remove-user', record.id);
      }
    },

    // 提交发送模板消息
    onSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.selectedUsers.length === 0) {
            this.$message.warning('请至少选择一个用户');
            return;
          }

          this.confirmLoading = true;

          try {
            // 准备发送的数据
            const openids = this.selectedUsers.map((user) => user.openid);
            const params = {
              course_name: this.form.course_name,
              time: this.form.time,
              teacher_name: this.form.teacher_name,
              openids: openids.join(','),
              url: this.form.url
            };
            // 调用发送模板消息的接口（需要根据实际API调整）
            await api.SendTemplateMessage(params);
            this.$message.success('模板消息发送成功');
            this.$emit('success');
            this.close();
          } catch (error) {
            this.$message.error('发送失败，请稍后重试');
          } finally {
            this.confirmLoading = false;
          }
        }
      });
    },

    // 关闭弹窗
    close() {
      this.show = false;
      this.confirmLoading = false;
      this.selectedUsers = [];
      this.form = {
        course_name: '',
        time: null,
        teacher_name: ''
      };
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
    }
  }
};
</script>

<style scoped>
.template-message-modal {
  max-height: 70vh;
  overflow-y: auto;
}

.form-card {
  margin-bottom: 16px;
}

.selected-users-card {
  background: #fafafa;
}

.user-count {
  margin-top: 12px;
  text-align: right;
  color: #666;
  font-size: 14px;
}

.user-count .count {
  color: #1890ff;
  font-weight: bold;
  font-size: 16px;
}
</style>
