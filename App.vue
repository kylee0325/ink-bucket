<script>
import { mapState, mapMutations } from 'vuex';

export default {
	onLaunch: function() {
		console.log('App Launch');
		let uniIdToken = uni.getStorageSync('uni_id_token');
		if (uniIdToken) {
			this.login(uni.getStorageSync('username'));
		}

		// #ifdef APP-PLUS
		// 一键登录预登陆，可以显著提高登录速度
		uni.preLogin({
			provider: 'univerify',
			success: res => {
				this.setUniverifyErrorMsg();
				this.setHideUniverify(false);
				console.log('preLogin success: ', res);
			},
			fail: err => {
				this.setUniverifyErrorMsg(err.errMsg);
				// 没有开通一键登录
				this.setHideUniverify(true);
				console.log('preLogin fail: ', err);
			}
		});
		// #endif
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods: {
		...mapMutations(['login', 'setUniverifyErrorMsg', 'setHideUniverify'])
	}
};
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
/* 头条小程序需要把 iconfont 样式放到组件外 */
@import 'components/m-icon/m-icon.css';

/*每个页面公共css */
page {
	min-height: 100%;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	font-size: 14px;
}

input,
textarea,
button {
	font-size: 14px;
}

.page-content {
	display: flex;
	flex: 1;
	flex-direction: column;
	background-color: #ffffff;
	padding: 10px;
}
</style>
