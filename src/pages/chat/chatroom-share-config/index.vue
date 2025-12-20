<template>
    <div class="share-config-page">
        <div class="toolbar">
            <a-button type="primary" @click="handleCreate">新建分享</a-button>
        </div>
        <a-table
            row-key="id"
            :loading="loading"
            :columns="columns"
            :data-source="list"
            bordered>
            <span slot="imgUrl" slot-scope="text">
                <a v-if="text" :href="text" target="_blank" rel="noopener">
                    <img :src="text" alt="封面" class="thumb-img" />
                </a>
                <span v-else>-</span>
            </span>

            <!-- qrCodeUrl -->
            <span slot="qrCodeUrl" slot-scope="text">
                <a v-if="text" :href="text" target="_blank" rel="noopener">
                    <img :src="text" alt="二维码" class="thumb-img" />
                </a>
                <span v-else>-</span>
            </span>

            <span slot="action" slot-scope="text, record">
                <a @click="handleEdit(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确认删除该配置？" @confirm="handleDelete(record.id)">
                    <a class="link-btn">删除</a>
                </a-popconfirm>
            </span>
        </a-table>

        <ShareModal ref="shareModal" @success="getList" />
    </div>
</template>

<script>
import api from '@/api'
import ShareModal from './Model/index.vue'
import QRCode from 'qrcode'

export default {
    components: { ShareModal },
    data() {
        return {
            loading: false,
            list: [],
            columns: [
                { title: 'ID', dataIndex: 'id', key: 'id'},
                { title: '渠道', dataIndex: 'channel', key: 'channel'},
                { title: '分享封面', dataIndex: 'imgUrl', key: 'imgUrl', 
                scopedSlots: { customRender: 'imgUrl' } },
                { title: '分享链接', dataIndex: 'link', key: 'link'},
                { title: '标题', dataIndex: 'title', key: 'title', width: 160 },
                { title: '描述', dataIndex: 'desc', key: 'desc', width: 280 },
                { title: '分享二维码', dataIndex: 'qrCodeUrl', key: 'qrCodeUrl', scopedSlots: { customRender: 'qrCodeUrl' } },
                { title: '创建时间', dataIndex: 'create_time', key: 'create_time' },
                { title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
            ]
        }
    },
    created() {
        this.getList()
    },
    methods: {
        async getList() {
            this.loading = true
            try {
                const data = (await api.GetLiveShareConfigList()) || []
                // 基于 link + channel 动态生成二维码
                const listWithQr = await Promise.all(
                    data.map(async item => {
                        const shareLink = this.buildShareLink(item.link, item.channel)
                        let qrCodeUrl = ''
                        if (shareLink) {
                            try {
                                qrCodeUrl = await QRCode.toDataURL(shareLink, {
                                    width: 180,
                                    margin: 1
                                })
                            } catch (err) {
                                console.error('生成二维码失败', err)
                            }
                        }
                        return { ...item, qrCodeUrl }
                    })
                )
                this.list = listWithQr
            } finally {
                this.loading = false
            }
        },
        buildShareLink(link, channel) {
            if (!link) return ''
            if (!channel) return link
            const hasQuery = link.includes('?')
            const separator = hasQuery ? '&' : '?'
            return `${link}${separator}channel=${encodeURIComponent(channel)}`
        },
        handleCreate() {
            this.$refs.shareModal.open()
        },
        handleEdit(record) {
            this.$refs.shareModal.open(record)
        },
        handleDelete(id) {
            this.loading = true
            api.DeleteLiveShareConfig(id)
                .then(() => {
                    this.$message.success('删除成功')
                    this.getList()
                })
                .finally(() => {
                    this.loading = false
                })
        }
    }
}
</script>

<style scoped>
.share-config-page {
    background: #fff;
    padding: 16px;
}
.toolbar {
    margin-bottom: 12px;
}
.thumb-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #f0f0f0;
}
</style>