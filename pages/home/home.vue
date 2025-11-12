<template>
    <view class="container">
        <!-- 头部 start -->
        <view class="head">
            <u-navbar
                v-if="showTitleBar"
                :is-fixed="false"
                :border-bottom="false"
                :is-back="false"
                title="应用"
                :background="{ background: '#3060ED' }"
                title-color="#fff"
            >
            </u-navbar>
        </view>

        <!-- 服务按钮 start -->
        <view class="service-box">
            <u-grid :col="4" :border="false">
                <u-grid-item bg-color="transparent" v-for="(item, index) in serviceButton" :key="index">
                    <div class="service-item" @click="handleJump(item)">
                        <image :src="item.img" mode="widthFix" class="img"></image>
                        <view class="name">{{ item.name }}</view>
                    </div>
                </u-grid-item>
            </u-grid>
        </view>
    </view>
</template>

<script>
import { fakeServiceButton } from '@/api/mock/home.js';
import { needHideTitleBar, isEnvironment } from '@/utils/utils';
// import { getTopUrl, getCallbackUrl, isEnvironment } from '@/utils/utils.js';
import { initWxSDK, getWxConfig, setWxShare, wxScanQRCode } from '@/utils/wxsdk';
import { initWwScanQRCode, isWwEnvironment } from '@/utils/wwxsdk';
import Api from '@/api';
export default {
    data() {
        return {
            showTitleBar: true,
            userInfo: this.$store.getters.userInfo || uni.getStorageSync('userInfo') || {},
            serviceButton: [],
            loginInfo: this.$store.getters.loginInfo || uni.getStorageSync('loginInfo'),
        };
    },
    onLoad() {
        // let urllocl = 'https://www.eastwinbip.com/h5';
        // const url = urllocl.split('/h5/')[0];
        // console.log(url);
        // if (isEnvironment() == 'WECHAT_MP') {
        //     // 初始化微信SDK
        //     this.initWechatSDK();
        // } else if (isEnvironment() == 'WECHAT_ENTERPRISE') {
        //     // 初始化企业微信SDK
        //     this.initWeworkSDK();
        // }
        // 加载服务按钮数据
        fakeServiceButton().then((data) => {
            this.serviceButton = data;
        });
    },

    created() {
        this.showTitleBar = !needHideTitleBar();
    },

    methods: {
        // 初始化微信SDK
        initWechatSDK() {
            const url = window.location.href.split('#')[0];
            // 获取微信配置信息
            Api.common.wechat
                .getWxConfig(url)
                .then((res) => {
                    console.log('config', res);
                    console.log('config', res.data);
                    // 初始化微信SDK
                    this.$wxsdk.initWxSDK(res.data);
                    console.log('config', res);
                })
                .catch((error) => {
                    console.error('获取微信配置失败:', error);
                });
        },
        // 初始化企业微信SDK
        initWeworkSDK() {
            const url = window.location.href.split('#')[0];
            // 获取企业微信配置信息
            Api.common.wechat
                .getWwConfig(url)
                .then((res) => {
                    console.log('config', res);
                    console.log('config', res.data);
                    // 初始化企业微信SDK
                    this.$wwsdk.initWwSDK(res.data);
                    console.log('config', res);
                })
                .catch((error) => {
                    console.error('获取企业微信配置失败:', error);
                });
        },
        handleJump(item) {
            if (item.name == '流程中心') {
                uni.switchTab({ url: item.url });
            } else if (item.name == '料况跟进') {
                let url = `${item.url}${this.loginInfo.real_name}`;
                if (!this.loginInfo.real_name) {
                    uni.showToast({ title: '用户不存在', icon: 'none' });
                    return;
                }
                window.location.href = url;
            } else {
                uni.navigateTo({ url: item.url });
            }
        },
    },
};
</script>

<style lang="scss">
.container {
    background-color: #f7f7f7;

    overflow: hidden;
}

.head {
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;
}

.head-bg {
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: -1;
    width: 750rpx;
    height: 270rpx;
    background: linear-gradient(270deg, #f29346 0%, #f05466 100%);
}

.service-box {
    background: #ffffff;
    border-radius: 20px 20px 20px 20px;
    margin: 30rpx 20rpx 0;
    padding: 0rpx 20rpx;

    .service-item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 120rpx;
        font-size: 26rpx;
        font-family: PingFang SC;
        font-weight: 500;
        color: #585b61;

        .img {
            width: 70rpx;
            height: auto;
        }
    }
}
</style>
