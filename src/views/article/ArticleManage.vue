<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { articleCategoryListService, articleListService, articleAddService, articleUpdateService, articleDeleteService } from '@/api/article.js'
import {Plus} from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import{useTokenStore} from '@/stores/token.js'
const tokenStore = useTokenStore()
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content:'',
    state:''
})
const editorKey = ref(0)
const resetArticleModel = () => {
    articleModel.value = {
        title: '',
        categoryId: '',
        coverImg: '',
        content: '',
        state: ''
    }
    editorKey.value++
}
//文章分类数据模型
const categorys = ref([
])

//用户搜索时选中的分类id
const categoryId=ref('')

//用户搜索时选中的发布状态
const state=ref('')

//文章列表数据模型
const articles = ref([
])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(0)//总条数
const pageSize = ref(3)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    articleList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    articleList()
}
const articleCategoryList = async () => {
    const res = await articleCategoryListService()
    categorys.value = res.data
}
const articleList = async () => {
    const params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value || null,
        state: state.value || null
    }
    const res = await articleListService(params)
    articles.value = res.data.items || []
    total.value = res.data.total || 0
    articles.value.forEach(article => {
        const category = categorys.value.find(c => c.id === article.categoryId)
        article.categoryName = category ? category.categoryName : ''
    })
}
const initArticleManage = async () => {
    await articleCategoryList()
    await articleList()
}
initArticleManage()
const resetForm = () => {
    categoryId.value = ''
    state.value = ''
}
//上传成功的回调函数
const uploadSuccess = (res) => {
    articleModel.value.coverImg = res.data
} 
const addArticle = async (state) => {
    articleModel.value.state = state
    const res = await articleAddService(articleModel.value)
    if (res.code === 0) {
        ElMessage.success(res.message?res.message:'添加文章成功')
        visibleDrawer.value = false
        resetArticleModel()
        articleList()
    } else {
        ElMessage.error(res.message)
    }
}  
const drawerTitle = ref('添加文章')
const editMode = ref(false)
const openAddDrawer = () => {
    drawerTitle.value = '添加文章'
    editMode.value = false
    resetArticleModel()
    visibleDrawer.value = true
}
const openEditDrawer = (row) => {
    drawerTitle.value = '编辑文章'
    editMode.value = true
    articleModel.value = {
        id: row.id,
        title: row.title,
        categoryId: row.categoryId,
        coverImg: row.coverImg,
        content: row.content,
        state: row.state
    }
    editorKey.value++
    visibleDrawer.value = true
}
const saveArticle = async (state) => {
    try {
        articleModel.value.state = state

        const res = editMode.value
            ? await articleUpdateService(articleModel.value)
            : await articleAddService(articleModel.value)

        if (res.code === 0) {
            ElMessage.success(res.message || (editMode.value ? '修改文章成功' : '添加文章成功'))
            visibleDrawer.value = false
            resetArticleModel()
            articleList()
        } else {
            ElMessage.error(res.message)
        }
    } catch (err) {
        console.error(err)
    }
}
const deleteArticle = async (row) => {
    try {
        await ElMessageBox.confirm(
            '确认删除该文章吗？',
            '提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )
        const res = await articleDeleteService(row.id)
        if (res.code === 0) {
            ElMessage.success(res.message || '删除文章成功')
            articleList()
        } else {
            ElMessage.error(res.message)
        }
    } catch (err) {
        if (err !== 'cancel') {
            console.error(err)
        }
    }
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary" @click="openAddDrawer">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="文章分类：">
                <el-select placeholder="请选择" v-model="categoryId">
                    <el-option 
                        v-for="c in categorys" 
                        :key="c.id" 
                        :label="c.categoryName"
                        :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="articleList">搜索</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
            <el-table-column label="分类" prop="categoryName"></el-table-column>
            <el-table-column label="发表时间" prop="createTime"> </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="openEditDrawer(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5 ,10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
             <el-drawer v-model="visibleDrawer" :title="drawerTitle" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form :model="articleModel" label-width="100px" >
                <el-form-item label="文章标题" >
                    <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="文章分类">
                    <el-select placeholder="请选择" v-model="articleModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章封面">
                   <!--
                    auto-upload:设置是否自动上传
                    acttion:设置服务器接口路径
                    name:设置上传文件的字段名
                    header:设置上传请求的头部
                    on-success:设置上传成功后的回调函数
                    -->
                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                    action="/api/upload" name="file" :headers="{Authorization: 'Bearer ' + tokenStore.token}"
                    :on-success="uploadSuccess">
                        <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="文章内容">
                    <div class="editor">     
               <quill-editor :key="editorKey" theme="snow" v-model:content="articleModel.content" contentType="html">
               </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                   <el-button type="primary" @click="saveArticle('已发布')">
	              {{ editMode ? '修改' : '发布' }}
              </el-button>
               <el-button type="info" @click="saveArticle('草稿')">草稿</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
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
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
