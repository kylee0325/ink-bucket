<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast">
			<uni-forms-item name="title" label="标题" required><uni-easyinput placeholder="标题" v-model="formData.title" trim="both" /></uni-forms-item>
			<uni-forms-item name="description" label="简介"><uni-easyinput placeholder="文章简介" v-model="formData.description" trim="both" /></uni-forms-item>
			<uni-forms-item name="keywords" label="关键词"><uni-easyinput placeholder="关键词" v-model="formData.keywords" trim="both" /></uni-forms-item>
			<uni-forms-item name="article_url" label="链接" required>
				<view style="display: flex; align-items: center;">
					<uni-easyinput placeholder="文章链接" v-model="formData.article_url" trim="both" style="flex: 1; margin-right: 24rpx;" />
					<u-button size="mini" @click="scanCode">扫码</u-button>
				</view>
			</uni-forms-item>
			<uni-forms-item name="article_status" label="文章状态">
				<uni-data-checkbox v-model="formData.article_status" :localdata="formOptions.article_status_localdata" />
			</uni-forms-item>
			<u-button type="primary" @click="submit">提交</u-button>
		</uni-forms>
	</view>
</template>

<script>
import { validator } from '../../js_sdk/validator/ink-articles.js';

const db = uniCloud.database();
const dbCollectionName = 'ink-articles';

function getValidator(fields) {
	let reuslt = {};
	for (let key in validator) {
		if (fields.indexOf(key) > -1) {
			reuslt[key] = validator[key];
		}
	}
	return reuslt;
}

export default {
	data() {
		return {
			formData: {
				keywords: '',
				title: '',
				description: '',
				article_url: '',
				article_status: 0
			},
			formOptions: {
				article_status_localdata: [
					{
						value: 0,
						text: '公有'
					},
					{
						value: 1,
						text: '私有'
					}
				]
			},
			rules: {
				...getValidator(['keywords', 'title', 'description', 'article_url', 'article_status'])
			}
		};
	},
	onLoad(e) {
		const id = e.id;
		this.formDataId = id;
		this.getDetail(id);
	},
	onReady() {
		this.$refs.form.setRules(this.rules);
	},
	methods: {
		/**
		 * 触发表单提交
		 */
		submit() {
			uni.showLoading({
				mask: true
			});
			this.$refs.form
				.submit()
				.then(res => {
					this.submitForm(res);
				})
				.catch(errors => {
					uni.hideLoading();
				});
		},
		scanCode() {
			let _this = this;
			uni.scanCode({
				success: function(res) {
					console.log('条码类型：' + res.scanType);
					console.log('条码内容：' + res.result);
					_this.formData.article_url = res.result;
				}
			});
		},
		submitForm(value) {
			// 使用 clientDB 提交数据
			value.last_modify_date = Date.now();
			db.collection(dbCollectionName)
				.doc(this.formDataId)
				.update(value)
				.then(res => {
					uni.showToast({
						icon: 'none',
						title: '修改成功'
					});
					this.getOpenerEventChannel().emit('refreshData');
					setTimeout(() => uni.navigateBack(), 500);
				})
				.catch(err => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					});
				})
				.finally(() => {
					uni.hideLoading();
				});
		},

		/**
		 * 获取表单数据
		 * @param {Object} id
		 */
		getDetail(id) {
			uni.showLoading({
				mask: true
			});
			db.collection(dbCollectionName)
				.doc(id)
				.field('user_id,keywords,title,description,article_url,article_status,view_count,like_count,publish_date,last_modify_date,mode')
				.get()
				.then(res => {
					const data = res.result.data[0];
					if (data) {
						this.formData = data;
					}
				})
				.catch(err => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					});
				})
				.finally(() => {
					uni.hideLoading();
				});
		}
	}
};
</script>

<style>
.uni-container {
	padding: 15px;
}

.uni-input-border,
.uni-textarea-border {
	width: 100%;
	font-size: 14px;
	color: #666;
	border: 1px #e5e5e5 solid;
	border-radius: 5px;
	box-sizing: border-box;
}

.uni-input-border {
	padding: 0 10px;
	height: 35px;
}

.uni-textarea-border {
	padding: 10px;
	height: 80px;
}

.uni-button-group {
	margin-top: 50px;
	display: flex;
	justify-content: center;
}

.uni-button {
	width: 184px;
	padding: 12px 20px;
	font-size: 14px;
	border-radius: 4px;
	line-height: 1;
	margin: 0;
}
</style>
