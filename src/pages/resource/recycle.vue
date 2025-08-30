<template>
    <a-modal
    title="批次回收池"
    centered
    width="960px"
    :zIndex="9999"
    :footer="null"
    @cancel="show = false"
    :visible="show">
       
        <div style="margin-bottom:10px">
            <div>
                <div style="font-weight:bold;color:#000">领取规则：</div>
                <div>回收池数据无勾选标记时，则按回收顺序进行领取，有勾选时则只会领取对应标记的回收池数据（并且按照勾选的先后顺序领取）</div>
            </div>
            <div v-if="chooseList.length > 0">
                <div style="margin:10px 0;font-weight:bold;color:#000">当前已勾选标记：</div>
                <div class="flex justify-start align-center">
                    <div v-for="(item,index) in chooseList" style="display:inline-flex" :key="index">
                        <a-tag :color="item.bg_color">{{ item.mark_name }}</a-tag>
                    </div>
                </div>
            </div>
        </div>

        <a-table :row-selection="rowSelection" :columns="columns" :data-source="list" :pagination="false" :loading="loading">
            <template slot="mark_name" slot-scope="text">
                <a-tag :color="text.bg_color">{{ text.mark_name }}</a-tag>
            </template>
            <template class="handler" slot="operation" slot-scope="text">
                <a-button type="primary" @click="showRecycleId = text.id" size="small" style="font-size:12px">数据列表</a-button>
            </template>
        </a-table>

    </a-modal>
</template>

<script>
import api from '@/api'
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: '标记名称',
        scopedSlots: { customRender: 'mark_name' },
    },
    {
        title: '标记数量',
        dataIndex: 'count',
    },
    {
        title: '操作',
        scopedSlots: { customRender: 'operation' },
        align: 'center',
        width:280
    }
]

export default {
    props:{
        id:Number,
        markStr:String,
    },
    data() {
        return {
            columns,
            loading:true,
            list:[],
            show:true,
            selectedRowKeysArray: [],
        }
    },
    watch:{
        show(){
            this.$emit('close');
        },
    },
    computed:{
        rowSelection() {
        return {
            selectedRowKeys:this.selectedRowKeysArray,

            onChange: (selectedRowKeys, selectedRows) => {
               console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
               this.selectedRowKeysArray = selectedRowKeys;
               
               this.UpdateRecycleGetMark();
            },

            getCheckboxProps: record => ({
                props: {
                    disabled:[7,9].includes(record.id), // Column configuration not to be checked
                    // name: record.name,
                },
                }),
            };
        },
        // 选中的数据
        chooseList(){
            let arr = [];
            for(let i = 0; i<this.selectedRowKeysArray.length; i++){
                const item = this.list[this.selectedRowKeysArray[i]];
                arr.push(item)
            }
            return arr;
        },
    },
    created() {
        api.GetRecycleStatisticsList(this.id).then(res => {
            res = res.sort((a,b) => b.count - a.count);
            res.forEach((e,index) => {
                e.key = index
            });

            if(this.markStr){
                const markList = this.markStr.split(',');
                let chooseArr = [];
                for(let i = 0; i < markList.length; i++){
                    const index = res.findIndex(e => e.id == markList[i]);
                    chooseArr.push(index)
                }
                this.selectedRowKeysArray = chooseArr;
            }
            this.list = res;
            this.loading = false;
        })
    },
    methods: {
        UpdateRecycleGetMark:function(){
            let mark = null;
            if(this.chooseList.length > 0){
                mark = this.chooseList.map(e => e.id).join(',')
            }
            api.UpdateRecycleGetMark({
                id:this.id,
                mark
            }).then(() => {
                this.$emit("refresh");
            });
        }
    },
}
</script>

<style lang="scss" scoped>

</style>