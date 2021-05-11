<template>
	<view class="page-content">
		<view v-if="hasLogin && userInfo.nickname">
			<view class="title">您好，{{ userInfo.nickname || '' }}，您已成功登录。</view>
		</view>

		<view v-if="!hasLogin"><view class="title">您好，游客。</view></view>

		<uni-card
			v-for="item in articles"
			:key="item._id"
			:title="item.nickname"
			mode="title"
			:is-shadow="true"
			:thumbnail="item.avatar"
			:extra="item.last_modify_date | parseDate"
			note="true"
			@click="handleDetail(item.article_url)"
		>
			<view style="font-weight: 600;font-size: 16px;">{{ item.title }}</view>
			<view style="margin-top: 24rpx;">{{ item.description }}</view>
			<view style="margin-top: 24rpx;">
				<u-tag v-for="keyword in item.keywords.split(',')" :key="keyword" :text="keyword" type="warning" shape="circle" style="margin-right: 8rpx"></u-tag>
			</view>

			<template v-slot:footer>
				<view class="footer-box"><u-icon v-if="userInfo._id === item.user_id" name="edit-pen" size="28" @click="handleUpdate(item._id)"></u-icon></view>
			</template>
		</uni-card>
		<uni-load-more :status="loadingMore ? 'loading' : loadMore ? 'more' : 'noMore'"></uni-load-more>

		<view class="start-wrap" @click="handleArticleAdd">
			<u-image width="40rpx" height="40rpx" src="/static/img/icon_start.png"></u-image>
			<text>加墨</text>
		</view>
	</view>
</template>

<script>
import moment from 'moment';
import { mapState, mapMutations } from 'vuex';
import { getArticles } from '@/api';

export default {
	name: 'ArticleList',
	props: {
		type: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			pageNo: 1,
			pageSize: 10,
			articles: [],
			loadMore: true,
			loadingMore: false
		};
	},
	filters: {
		parseDate(d) {
			if (!d) {
				return '';
			}
			return moment(d).format('YYYY-MM-DD HH:mm');
		}
	},
	computed: mapState(['hasLogin', 'userInfo']),
	onLoad() {
		this.getArticles();
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
		async getArticles(params) {
			// uni.showLoading({
			// 	title: '加载中...'
			// });
			this.loadingMore = true;
			const finalParams = {
				pageNo: this.pageNo,
				pageSize: this.pageSize,
				article_status: 1,
				user_id: this.userInfo._id,
				...params
			};
			const [err, res] = await getArticles(finalParams);
			console.log(res);
			// uni.hideLoading();
			this.loadingMore = false;
			uni.stopPullDownRefresh();
			if (err) {
				return;
			}
			if (finalParams.pageSize > res.data.rows.length) {
				this.loadMore = false;
			} else {
				this.loadMore = true;
			}
			if (finalParams.pageNo === 1) {
				this.articles = res.data.rows || [];
			} else {
				this.articles = this.articles.concat(res.data.rows);
			}
		},
		handleDetail(url) {
			uni.navigateTo({
				url: './webview?url=' + url
			});
		},
		handleUpdate(id) {
			let _this = this;
			uni.navigateTo({
				url: '../ink-articles/edit?id=' + id,
				events: {
					// 监听修改页面成功修改数据后, 刷新当前页面数据
					refreshData: () => {
						_this.getArticles({ pageNo: 1 });
					}
				}
			});
		},
		handleArticleAdd() {
			if (!this.hasLogin) {
				this.guideToLogin();
				return;
			}
			uni.navigateTo({
				url: '/pages/ink-articles/add',
				events: {
					// 监听修改页面成功修改数据后, 刷新当前页面数据
					refreshData: () => {
						_this.getArticles();
					}
				}
			});
		},
		handleItemClick(id) {
			uni.navigateTo({
				url: './detail?id=' + id
			});
		},
		fabClick() {
			// 打开新增页面
			uni.navigateTo({
				url: './add',
				events: {
					// 监听新增数据成功后, 刷新当前页面数据
					refreshData: () => {
						this.$refs.udb.loadData({
							clear: true
						});
					}
				}
			});
		}
	},
	onPullDownRefresh() {
		this.getArticles({ pageNo: 1 });
	},
	onReachBottom() {
		if (this.loadMore) {
			this.getArticles({ pageNo: this.pageNo + 1 });
		}
	}
};
</script>

<style lang="scss">
.title {
	padding: 0 30rpx;
	color: $uni-color-primary;
}
.page-content {
	padding-bottom: 24rpx;
}
.start-wrap {
	position: fixed;
	right: 0;
	bottom: 100rpx;
	display: flex;
	align-items: center;
	height: 64rpx;
	padding: 0 12rpx;
	border-top-left-radius: 32rpx;
	border-bottom-left-radius: 32rpx;
	border: 1rpx solid $uni-color-primary;
	border-right: none;
	background: #fff;
	z-index: 99;
	text {
		margin-left: 8rpx;
		font-size: 12px;
		color: $uni-text-color-grey;
	}
}

.footer-box {
	display: flex;
	justify-content: flex-end;
}
</style>
