import  {createRouter,createWebHashHistory} from 'vue-router'
import Layout from '@/views/Layout.vue'
import Login from '@/views/Login.vue'
import ArticleCategory from '@/views/article/ArticleCategory.vue'
import ArticleManage from '@/views/article/ArticleManage.vue'
import UserAvatar from '@/views/user/UserAvatar.vue'
import UserInfo from '@/views/user/UserInfo.vue'
import UserResetPassword from '@/views/user/UserResetPassword.vue'
const routes = [
    {
        path: '/',
        component: Login
    },
    {
        path: '/layout',
        component: Layout,
        redirect:'/article/category',
        children:[
            {
                path: '/article/category',
                component: ArticleCategory
            },
            {
                path: '/article/manage',
                component: ArticleManage
            },
            {
                path: '/user/avatar',
                component: UserAvatar
            },
            {
                path: '/user/info',
                component: UserInfo
            },
            {
                path: '/user/reset-password',
                component: UserResetPassword
            }
        ]
    }
] 
const router = createRouter({
    history:createWebHashHistory(),
    routes
})
export default router  