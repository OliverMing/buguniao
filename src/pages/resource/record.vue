<template>
    <a-card :bordered="false">
        <div class="flex justify-start align-start">
            <div class="flex-1">
                <div class="search-box flex justify-start align-center" v-if="markList.length > 0">
                    <a-select v-model="type" style="width: 200px;margin-right: 10px;">
                        <a-select-option :value="item.id" v-for="(item,index) in markList" :key="index">{{ item.mark_name }}</a-select-option>
                    </a-select>
                    <div>
                        <select v-model="batch_id" class="select-box">
                            <option :value="item.id" v-for="(item) in resourceList" :key="item.id">{{ item.batch_name }}</option>
                        </select>
                        <!-- <a-select v-model="pwd" style="width: 200px;margin-right: 10px;">
                            <a-select-option :value="item.pwd" v-for="(item,index) in resourceList" :key="index">{{ item.mark }}</a-select-option>
                        </a-select> -->
                    </div>
                    <a-button type="primary" :loading="loading" @click="changePageId(1,true)">搜索</a-button>
                    <div class="total">
                        共计<span>{{ total }}</span>条数据
                    </div>
                </div>
                <a-table :dataSource="list" :columns="columns" :pagination="false" bordered size="middle">
                    <template slot="mark_id" slot-scope="mark_id">
                        <a-tag :color="getMarkColor(mark_id)">{{ getMarkNameById(mark_id) }}</a-tag>
                    </template>
                    <template slot="user_id" slot-scope="user_id">
                        {{ getUserNick(user_id) }}
                    </template>
                    
                </a-table>

                <div style="text-align: right;margin-top: 20px;margin-right: 0px;">
                    <a-pagination :current="pageId" :pageSize="pageSize" :total="total" @change="changePageId($event,false)" />
                </div>
            </div>

            <div id="echart-main" style="width:38%;height:500px;margin-left: 30px;" class="flex justify-center align-center">
                <span style="font-size: 12px;color: #666;">可视化数据加载中</span>
            </div>
        </div>
        
    </a-card>
</template>
  
<script>
import * as echarts from 'echarts';
import api from '@/api'

const columns = [
    {
        title: '手机号码',
        dataIndex: 'phone_number',
    },
    {
        title: '标记状态',
        dataIndex: 'mark_id',
        scopedSlots: { customRender: 'mark_id' },
    },
    {
        title: '领取用户',
        dataIndex: 'user_id',
        scopedSlots: { customRender: 'user_id' },
    },
    {
        title: '批次',
        dataIndex: 'batch_name',
    },
    {
        title: '资源上传时间',
        dataIndex: 'create_time',
    },
    {
        title: '领取时间',
        dataIndex: 'get_time',
    }
]

export default {
    data() {
        return {
            desc: "客户同意未添加资源每周回收、空号每日删除、其他的除了已添加的每日自动回收",
            pageId: 1,
            pageSize: 10,
            loading:false,
            total:0,
            type:-1,
            batch_id:null,
            list: null, //数据列表
            columns, // 表格渲染数据title
            markList:[], // 标签列表
            resourceList:[],//资源池
            userList:[], // 用户列表
            myChart:null, //图标数据
        }
    },
    computed:{
        // 获取名字
        getMarkNameById(){
            return id => {
                const item = this.markList.find(e => e.id == id);
                return item?.mark_name || '未标记';
            }
        },
        // 获取标识颜色
        getMarkColor(){
            return id => {
                const item = this.markList.find(e => e.id == id);
                return item?.bg_color || '';
            }
        },
        // 获取用户名
        getUserNick(){
            return id => {
                const item = this.userList.find(e => e.id == id);
                let name = "";
                console.info()
                if(item){
                    name = item.nick_name || item.account
                }
                return name;
            }
        }
    },
    created() {
        this.GetAllUserList();
        this.queryList();
        this.getMarkAllList();
        this.queryPool();
        window.addEventListener("resize", () => { 
            this.myChart.resize();
        });
    },
    mounted() {
        
    },
    methods: {

        initEcharts:function(data){
            const colors = this.markList.filter(e => e.id > -1).map(e => e.bg_color);
            colors.unshift("#f0f2f5");
            var chartDom = document.getElementById('echart-main');
            this.myChart = echarts.init(chartDom);
            const option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '0',
                    left: 'center'
                },
                series: [
                    {
                        name: '资源标记统计',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2,
                            color: function(params) {
                                //通过返回值的下标一一对应将颜色赋给柱子上
                                return colors[params.dataIndex];
                            }
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                            show: true,
                            fontSize: 36,
                            fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data
                    }
                ]
            };
            this.myChart.setOption(option);
        },
        
        GetAllUserList:function(){
            api.GetAllUserList().then(data => {
                this.userList = data;
            })
        },

        //获取资源池列表
        queryPool:function(){
            api.GetAllPool().then(data => {
                data.push({
                    id:null,
                    batch_name:"全部资源池"
                });
                this.resourceList = data.reverse();
                console.log(this.resourceList);
            })
        },

        // 获取标签列表
        getMarkAllList:function(){
            api.GetMarkList().then(data => {
                this.markList = [...[{
                    id:-1,
                    mark_name:"全部标记状态"
                }],...data];
                // 获取标识统计
                this.getCount();
            })
        },
        
        // 获取标记统计
        getCount:function(){
            api.GetMarkCount().then(data => {
                this.initEcharts(data);
            })
        },

        changePageId: function (e,loading = false) {
            this.pageId = e;
            this.loading = loading;
            this.queryList();
        },

        // 获取列表
        queryList: function () {
           api.GetPoolHaveUserList({
                pageId: this.pageId,
                pageSize: this.pageSize,
                type:this.type,
                batch_id:this.batch_id
            }).then(data => {
                // debugger;
                const { total, records } = data;
                this.list = records;
                this.total = total;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
    }

}
</script>



<style scoped>
.search-box{background-color: #fff;margin-bottom: 20px;}
.total{padding: 0 20px;color: #777;}
.total span{color: red;font-weight: bold;padding: 0 3px;}
.select-box{width: 140px;height: 33px;border: 1px solid #ddd;border-radius: 3px;margin-right: 10px;}
</style>