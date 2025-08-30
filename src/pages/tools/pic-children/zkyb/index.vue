<template>
    <div class="pr main" :style="{ width:`${contentWidth}px` }">
        <div class="pr w-100">
            <img class="w-100" src="@/assets/image/zk/zk_top.png" alt="">
            <div class="time flex justify-center align-center flex-column">
                <div class="flex justify-center align-center">{{ timeSplit(0) }}年{{ timeSplit(1) }}月</div>
                <div class="flex justify-center align-center">{{ timeSplit(2) }}日</div>
            </div>
        </div>
        <div class="flex user-box" ref="content">
            <div class="left-box"></div>
            <img class="user" src="@/assets/image/zk/zk_user.png" alt="">
            <img class="stock" :src="getImage" alt="">
            <div class="right-box"></div>
        </div>
        <img class="w-100" src="@/assets/image/zk/zk_bottom.png" alt="">
    </div>
</template>

<script>
export default {
    props:{
        time:String,
        content:String
    },
    data(){
        return {
            contentWidth:0
        }
    },
    computed:{
        timeSplit(){
            return index => {
                let str = this.time.split('-');
                return str[index];
            }
        },
        getImage(){
            var k = this.content ? this.content.indexOf('=">') : '';
            if(k){
                const start = '="';
                const end = '">';
                const regex = new RegExp(`${start}(.*?)${end}`);
                const result = regex.exec(this.content);
                const substr = result ? result[1] : ""; // 如果有匹配到结果则取第一个分组的内容
                return substr;
            }
            return k
        }
    },
    watch:{
        getImage:{
            immediate:true,
            handler(){
                setTimeout(() => {
                    this.contentWidth = this.$refs.content.offsetWidth;
                }, 200);
            }
        }
    },
    mounted() {
        this.contentWidth = this.$refs.content.offsetWidth;
    },
}
</script>

<style scoped>
.main{background-color: #d8130f;display: inline-block;}
.user-box{padding: 0 ;height: 400px;width: fit-content;}
.left-box,.right-box{width: 20px;height: 100%;}
.user{height: 100%;width: auto;}
.stock{height: 100%;width: auto;}

.time{position: absolute;left: 32%;font-size: 60%;top: 10%;height: 80%;border: 1px solid rgba(255,255,255,.5);
    border-radius: .6rem;width: 11%;overflow: hidden;}
.time>div:first-child{font-size: 1.8em;color: #fff;height: 50%;}

.time>div:last-child{font-size: 2.6em;font-weight: bold;background-color: #fff;
    color: #d8130f;width: 100%;text-align: center;height: 50%;margin-bottom: -1px;}

</style>
