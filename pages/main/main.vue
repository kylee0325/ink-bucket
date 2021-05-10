<template>
	<view class="page-content">
		<view v-if="hasLogin" class="hello">
			<view class="title">您好 {{ userInfo.nickname || '' }}，您已成功登录。</view>
			<view class="ul">
				<view>这是 uni-app 带登录模板的示例App首页。</view>
				<view>在 “我的” 中点击 “退出” 可以 “注销当前账户”</view>
			</view>
		</view>
		<view v-if="!hasLogin" class="hello">
			<view class="title">您好 游客。</view>
			<view class="ul">
				<view>这是 uni-app 带登录模板的示例App首页。</view>
				<view>在 “我的” 中点击 “登录” 可以 “登录您的账户”</view>
			</view>
		</view>
		<view class="text-area">
			<text class="title">{{ title }}</text>
		</view>
		<button type="default" @click="sayHello()">say hello</button>
		<navigator url="../dating/dating">
			<view class="start-wrap">
				<u-image width="40rpx" height="40rpx" src="/static/img/icon_start.png"></u-image>
				<text>约聚</text>
			</view>
		</navigator>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { getName, sayHi } from '@/api';

export default {
	data() {
		return {
			title: ''
		};
	},
	computed: mapState(['hasLogin', 'userInfo']),
	onLoad() {
		let uniIdToken = uni.getStorageSync('uni_id_token');
		if (uniIdToken) {
			uniCloud.callFunction({
				name: 'user-center',
				data: {
					action: 'checkToken'
				},
				success: e => {
					if (e.result.code > 0) {
						uni.showModal({
							title: '登录状态已失效,请重新登录',
							success(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '../login/login'
									});
								}
							}
						});
					} else {
						this.login(e.result.userInfo);
					}
				},
				fail(e) {
					uni.showModal({
						content: JSON.stringify(e),
						showCancel: false
					});
				}
			});
		} else {
			this.guideToLogin();
		}
	},
	methods: {
		...mapMutations(['login']),
		guideToLogin() {
			uni.showModal({
				title: '未登录',
				content: '您未登录，需要登录后才能继续',
				success: res => {
					if (res.confirm) {
						uni.navigateTo({
							url: '../login/login'
						});
					}
				}
			});
		},
		async sayHello() {
			this.title = '';
			uni.showLoading({
				title: '加载中...'
			});
			const [err, res] = await sayHi({ nickname: 'rock123' });
			console.log('<-----err----->');
			console.log(err);
			console.log(res);
			uni.hideLoading();
			if (err) {
				return;
			}
			this.title = res.data;
		}
	}
};
</script>

<style lang="scss">
.hello {
	display: flex;
	flex: 1;
	flex-direction: column;
}

.title {
	color: $uni-color-primary;
	margin-top: 25px;
}

.ul {
	font-size: 15px;
	color: #8f8f94;
	margin-top: 25px;
}

.ul > view {
	line-height: 25px;
}
.start-wrap {
	position: absolute;
	right: 0;
	bottom: 100rpx;
	display: flex;
	align-items: center;
	// width: 120rpx;
	height: 64rpx;
	padding: 0 12rpx;
	border-top-left-radius: 32rpx;
	border-bottom-left-radius: 32rpx;
	border: 1rpx solid $uni-color-primary;
	border-right: none;
	text {
		margin-left: 8rpx;
		font-size: 12px;
		color: $uni-text-color-grey;
	}
}
</style>
