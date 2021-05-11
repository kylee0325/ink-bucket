<template>
	<view class="wrap">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item :leftIconStyle="{ color: '#888', fontSize: '32rpx' }" left-icon="account" label-width="120" :label-position="labelPosition" label="主题" prop="name">
				<u-input :border="border" placeholder="请输入主题" v-model="model.name" type="text"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="时间" prop="date">
				<u-input :border="border" type="select" :select-open="dateShow" v-model="model.date" placeholder="请选择时间" @click="dateShow = true"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="简介" prop="intro">
				<u-input type="textarea" :border="border" placeholder="请填写简介" v-model="model.intro" />
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="结算方式" prop="payType" label-width="150">
				<u-radio-group v-model="radio" @change="radioGroupChange" :width="radioCheckWidth" :wrap="radioCheckWrap">
					<u-radio shape="circle" v-for="(item, index) in radioList" :key="index" :name="item.name">{{ item.name }}</u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item
				:label-position="labelPosition"
				label="手机号码"
				prop="phone"
				label-width="150"
			>
				<u-input :border="border" placeholder="请输入手机号" v-model="model.phone" type="number"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="上传图片" prop="photo" label-width="150"><u-upload width="160" height="160"></u-upload></u-form-item>
		</u-form>
		<u-button @click="submit">提交</u-button>
		<u-picker v-model="dateShow" mode="time" :start-year="2021" :params="params" @confirm="dateSelect"></u-picker>
	</view>
</template>

<script>
export default {
	data() {
		let that = this;
		return {
			model: {
				name: '',
				date: '',
				intro: '',
				payType: '支付宝',
				phone: '',
				photo: ''
			},
			rules: {
				name: [
					{
						required: true,
						message: '请输入主题',
						trigger: 'blur'
					},
					{
						min: 3,
						max: 20,
						message: '主题长度在3到20个字符',
						trigger: ['change', 'blur']
					}
				],
				date: [
					{
						required: true,
						message: '请选择时间',
						trigger: 'change'
					}
				],
				intro: [
					{
						required: true,
						message: '请填写简介'
					},
					{
						min: 5,
						message: '简介不能少于5个字',
						trigger: 'change'
					},
					{
						pattern: /^[\u4e00-\u9fa5]+$/gi,
						message: '简介只能为中文',
						trigger: 'change'
					}
				],
				payType: [
					{
						required: true,
						message: '请选择任意一种支付方式',
						trigger: 'change'
					}
				],
				phone: [
					{
						required: true,
						message: '请输入手机号',
						trigger: ['change', 'blur']
					},
					{
						validator: (rule, value, callback) => {
							return this.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ['change', 'blur']
					}
				]
			},
			border: false,
			check: false,
			radioList: [
				{
					name: '支付宝',
					checked: true,
					disabled: false
				},
				{
					name: '微信',
					checked: false,
					disabled: false
				},
				{
					name: '银联',
					checked: false,
					disabled: false
				},
				{
					name: '现金',
					checked: false,
					disabled: false
				}
			],
			radio: '支付宝',
			radioCheckWidth: 'auto',
			radioCheckWrap: false,
			labelPosition: 'top',
			errorType: ['message'],
			dateShow: false,
			params: {
				year: true,
				month: true,
				day: true,
				hour: true,
				minute: true,
				second: false
			}
		};
	},
	onLoad() {},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		submit() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
					console.log('验证通过');
				} else {
					console.log('验证失败');
				}
			});
		},
		dateSelect(date) {
			uni.hideKeyboard();
			this.model.date = `${date.year}-${date.month}-${date.day} ${date.hour}:${date.minute}`;
		},
		radioGroupChange(e) {
			this.model.payType = e;
		}
	}
};
</script>

<style scoped lang="scss">
.wrap {
	padding: 30rpx;
}
</style>
