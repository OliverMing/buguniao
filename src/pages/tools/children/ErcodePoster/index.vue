<template>
    <div class="fixed-main">
        <div id="canvas" class="ercode-poster">
        <img src="@/assets/share/shares.jpg" alt="">
        <div class="content">
            <div class="title">
                <span>点击领取</span>
                <span>领取福利</span>
            </div>
            <div class="ercode">
                <img :src="qrCodeUrl" alt="二维码">
            </div>
            <div class="color-box">
                <span>长按识别</span>
            </div>

            <div class="color-box fuli">
                <span>福利</span>
            </div>

            <div class="fuli-list">
                <div>1，机构锁筹 量化指标</div>
                <div>2，私域实战直播观看权限</div>
                <div>3，每日方向  异动提醒  答疑解惑</div>
            </div>
        </div>
    </div>
    </div>
    
</template>

<script>
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'
    
export default {
    data(){
        return {
            qrCodeUrl: ''
        }
    },
    methods:{
        // 生成图片
        createImage: async function (link) {
            if(!link) return this.$message.error('请输入链接');
            try {
                // 生成二维码
                this.qrCodeUrl = await QRCode.toDataURL(link, {
                    width: 310,
                    margin: 1,
                    color: {
                        dark: '#000000',
                        light: '#ffffff'
                    }
                });

                // 等待DOM更新
                await this.$nextTick();

                // 生成海报图片
                html2canvas(document.getElementById('canvas'), {
                    useCORS: true,
                    scale: 1
                }).then(canvas => {
                    var imgUrl = canvas.toDataURL();
                    const link = document.createElement('a');
                    link.href = imgUrl;
                    const timestamp = Date.parse(new Date());
                    link.download = `${timestamp}.png`;
                    link.click();
                });
            } catch (error) {
                console.error('生成二维码失败:', error);
            }
        },
    }
}
</script>


<style lang="less" scoped>
.fixed-main{
    position: fixed;
    top: 0;
    left: -1800px;

    .ercode-poster {
    position: relative;
    width: max-content;

    .content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        // background-color: rgba(0, 0, 0, 0.5);

        .title{
            margin-top: 595px;
            text-align: center;
            font-size: 40px;
            font-weight: bold;
            color: #000;
        }

        .ercode{
            width: 310px;
            height: 310px;
            margin: 0 auto;
            margin-top: 50px;
            background: #fff;
            padding: 10px;
            border-radius: 8px;
            img{
                width: 100%;
                height: 100%;
            }
        }

        .color-box{
            margin-top:25px;
            text-align: center;
            span{
                font-size: 35px;
                font-style: italic;
                font-weight:bold;
                color: #ca1e1e;
                text-shadow: 
                    -3px -3px 0 #FFD700,
                    3px -3px 0 #FFD700,
                    -3px 3px 0 #FFD700,
                    3px 3px 0 #FFD700;
            }   
        }

        .fuli{
            margin-top: 50px;

            span{
                font-style: normal;
                font-size: 56px;
            }
        }

        .fuli-list{
            padding: 0 90px;
            margin-top: 30px;
            font-size: 38px;
            font-weight: bold;
            color: #fdf8be;//#e8dddd

            div:not(:last-child){
                margin-bottom: 10px;
                letter-spacing: 2px;
            }
        }

    }
}
}
</style>
