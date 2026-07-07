<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import {ref} from 'vue'
import useUserInfoStore from '@/stores/userInfo.js'
import {useTokenStore} from '@/stores/token.js'
import { userUpdateAvatarService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import avatar from '@/assets/default.png'
const uploadRef = ref()
const userInfoStore = useUserInfoStore()
const tokenStore = useTokenStore()
const getAvatarUrl = (url) => {
    return url && url !== 'undefined' && url !== 'null' ? url : avatar
}
//用户头像地址
const imgUrl= ref(getAvatarUrl(userInfoStore.info.userPic))
const uploadAvatar = async () => {
    let result = await userUpdateAvatarService(imgUrl.value)
    ElMessage.success(result.message ? result.message : '上传成功')
    userInfoStore.setInfo({
        ...userInfoStore.info,
        userPic: imgUrl.value
    })
}
const uploadSuccess = (result) => {
    if (!result.data) {
        ElMessage.error('图片上传失败')
        return
    }
    imgUrl.value = result.data
}
const imgError = () => {
    imgUrl.value = avatar
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>更换头像</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-upload 
                    ref="uploadRef"
                    class="avatar-uploader" 
                    :show-file-list="false"
                    :auto-upload="true"
                    action="/api/upload"
                    name="file"
                    :headers="{'Authorization': 'Bearer ' + tokenStore.token}"
                    :on-success="uploadSuccess"
                    >
                    <img :src="imgUrl" class="avatar" @error="imgError" />
                </el-upload>
                <br />
                <el-button type="primary" :icon="Plus" size="large"  @click="uploadRef.$el.querySelector('input').click()">
                    选择图片
                </el-button>
                <el-button type="success" :icon="Upload" size="large" @click="uploadAvatar">
                    上传头像
                </el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
    :deep() {
        .avatar {
            width: 278px;
            height: 278px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 278px;
            height: 278px;
            text-align: center;
        }
    }
}
</style>
