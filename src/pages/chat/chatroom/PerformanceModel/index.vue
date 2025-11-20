<template>
    <a-modal title="战绩回顾" centered width="800px" :footer="null" @cancel="close" :visible="show">

        <span style="font-size: 12px; color: #555">是否显示</span>:
        <a-switch v-model="form.status" style="margin-left: 10px; opacity: .7;" />
        <div style="padding-right: 40px;margin-top: 20px;">
            
            <div class="table-box">
                <div class="name-title">
                    <a-input class="input" placeholder="战绩名称" v-model="form.content.title" />
                </div>
                <div class="flex line-box title">
                    <div class="date">推荐日期</div>
                    <div class="right-box flex flex-1">
                        <div class="item" v-for="value in colums" :key="value.key">{{ value.title }}</div>
                    </div>
                </div>
                <div v-for="(item, index) in form.content.list" :key="index" class="flex line-box">
                    <div class="date">
                        <a-input placeholder="日期" class="input" v-model="item.date" />
                    </div>
                    <div class="right-box flex-1">
                        <div class="flex items-box" v-for="(item2, index2) in item.list" :key="index2">
                            <div class="item" v-for="value in colums" :key="value.title">
                                <a-input :placeholder="value.title" class="input" v-model="item2[value.key]" />
                            </div>
                            <!-- 删除按钮 -->
                            <div class="del-item add-item" @click="addData(index, index2)">
                                <a-icon type="plus" />
                            </div>
                            <div class="del-item" @click="deleteData(index, index2)">
                                <a-icon type="delete" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cgv">
                <a-input class="input" placeholder="成功率：" v-model="form.content.bv" />
            </div>
            <div class="tips">
                <a-input class="input" placeholder="提示" v-model="form.content.tips" />
            </div>
        </div>
        

        <div class="btn-box">
            <a-button type="primary" @click="addResource">新增一条记录</a-button>
            <a-button style="margin-left: 10px;" type="primary" @click="save">保存</a-button>
        </div>
    </a-modal>
</template>

<script>
import api from '@/api';

export default {
    name: 'PerformanceModel',
    props: {
        roomId:Number
    },
    data() {
        return {
            show: false,
            colums: [
                { title: '点评方式', key: 'type' },
                { title: '推荐时间', key: 'time' },
                { title: '股票代码', key: 'code' },
                { title: '股票名称', key: 'name' },
                { title: '板块题材', key: 'plate' },
                { title: '最大涨幅', key: 'max' }
            ],

            form:{
                room_id:null,// 房间id
                status: true,
                content: {
                    title: '', // 标题
                    bv: '', // 成功率
                    tips: '', // 提示
                    list: [] // 列表
                },
            }
        }
    },
    methods: {

        open() {
            api.SelectLivePerformance(this.roomId).then(res => {
                this.form.status = res.status == 1;
                this.form.content =  JSON.parse(res.content);
            }).finally(() => {
                this.show = true;
            })
        },

        // 删除一条记录
        deleteData(index, index1) {
            this.form.content.list[index].list.splice(index1, 1);
            if (this.form.content.list[index].list.length == 0) {
                this.form.content.list.splice(index, 1);
            }
        },

        // 新增一条记录
        addResource() {
            this.form.content.list.push({
                date: '',
                list: [
                    { type: '', time: '', code: '', name: '', plate: '', max: '' }
                ]
            })
        },

        addData(index){
            this.form.content.list[index].list.push({
                type: '', time: '', code: '', name: '', plate: '', max: ''
            })
        },

        close(){
            this.form = {
                room_id:null,// 房间id
                status: true,
                content: {
                    title: '', // 标题
                    bv: '', // 成功率
                    tips: '', // 提示
                    list: [] // 列表
                },
            }
            this.show = false;
        },

        save(){
            console.info(this.form);
            let form = JSON.parse(JSON.stringify(this.form));
            form.room_id = this.roomId;
            form.content = JSON.stringify(form.content);
            form.status = form.status ? 1 : 0;

            api.UpdateLivePerformance(form).then(() => {
                this.$message.success('保存成功');
                this.close();
            })
        }
    }
}
</script>

<style lang="less" scoped>
.btn-box {
    margin-top: 20px;
}

.cgv{
    height: 40px;
    background-color: #f10;
    font-weight: bold;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #000;
    border-top: none;

    input{
        font-weight: bold;
        font-size: 22px;
    }
}

.tips{
    height: 35px;
    background-color: #f5dd59;
    font-weight: bold;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #000;
    border-top: none;

    input{
        font-size: 12px;
    }
}

.table-box {
    border: 1px solid #000;
    border-bottom: none;
    border-right: none;

    .title {

        .date,
        .item {
            background-color: red;
            border: 1px solid #000;
            border-left: none;
            border-top: none;
        }
    }

    .line-box {

        .date {
            width: 14.28%;

            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #000;
            border-left: none;
            border-top: none;
        }

        .right-box {

            .items-box {
                position: relative;

                .del-item {
                    position: absolute;
                    right: -90px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 50px;
                    cursor: pointer;
                }

                .add-item{
                    right: -60px;
                }

            }

        }

    }
}

.item {
    flex: 1;
    height: 50px;

    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #000;
    border-left: none;
    border-top: none;
}

input {
    text-align: center;
    border: none;
    background-color: transparent;
    outline: none;
    border: none;
    border-color: transparent !important;
    box-shadow: none !important;
}

.name-title {
    background-color: #f5dd59;
    border-bottom: 1px solid #000;
    border-right:1px solid #000;
    padding: 10px;

    input {
        font-size: 30px;
        color: #f10;
    }
}
</style>