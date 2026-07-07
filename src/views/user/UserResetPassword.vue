<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userUpdatePasswordService } from '@/api/user.js'
import { useTokenStore } from '@/stores/token.js'
import useUserInfoStore from '@/stores/userInfo.js'

const router = useRouter()
const tokenStore = useTokenStore()
const userInfoStore = useUserInfoStore()
const formRef = ref()
const passwordData = ref({
    oldPwd: '',
    newPwd: '',
    rePwd: ''
})

const checkRePwd = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请再次输入新密码'))
    } else if (value !== passwordData.value.newPwd) {
        callback(new Error('两次输入的新密码不一致'))
    } else {
        callback()
    }
}

const rules = {
    oldPwd: [
        { required: true, message: '请输入原密码', trigger: 'blur' },
        { min: 5, max: 16, message: '密码长度在5-16个字符之间', trigger: 'blur' }
    ],
    newPwd: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 5, max: 16, message: '密码长度在5-16个字符之间', trigger: 'blur' }
    ],
    rePwd: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        { validator: checkRePwd, trigger: 'blur' }
    ]
}

const updatePassword = async () => {
    await formRef.value.validate()
    const res = await userUpdatePasswordService(passwordData.value)
    ElMessage.success(res.message ? res.message : '修改成功，请重新登录')
    tokenStore.removeToken()
    userInfoStore.removeInfo()
    router.push('/')
}

const resetForm = () => {
    passwordData.value = {
        oldPwd: '',
        newPwd: '',
        rePwd: ''
    }
    formRef.value.clearValidate()
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>重置密码</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form
                    ref="formRef"
                    :model="passwordData"
                    :rules="rules"
                    label-width="100px"
                    size="large"
                >
                    <el-form-item label="原密码" prop="oldPwd">
                        <el-input v-model="passwordData.oldPwd" type="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPwd">
                        <el-input v-model="passwordData.newPwd" type="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="rePwd">
                        <el-input v-model="passwordData.rePwd" type="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updatePassword">提交修改</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>
