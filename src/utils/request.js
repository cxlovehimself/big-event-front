//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useTokenStore } from '@/stores/token.js';
import { useRouter } from 'vue-router'

const router = useRouter();

//定义一个变量,记录公共的前缀  ,  baseURL
/* const baseURL = 'http://localhost:8080'; */
const baseURL='/api';
const instance = axios.create({baseURL})

/* instance.interceptors.request.use(
    config=>{
        //在请求发送之前做一些处理  

    })   */
//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        if(result.data.code === 0){
            return result.data;
        }   
        
        ElMessage.error(result.data.message?result.data.message:'服务异常');
        return Promise.reject(result.data);//异步的状态转化成失败的状态
    },
    err=>{
        ElMessage.error('服务异常');
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)
instance.interceptors.request.use(
    (config)=>{
        //在请求发送之前做一些处理  
        const tokenStore = useTokenStore();
        if(tokenStore.token){
            config.headers['Authorization'] = `Bearer ${tokenStore.token}`;
        }
        return config;
    },
    (err)=>{
        //判断响应状态码如果是401 说明token过期了或者未登录 需要重新登录
        if(err.response?.status === 401){
            ElMessage.error('登录过期，请重新登录');
            const tokenStore = useTokenStore();
            tokenStore.removeToken();
            // 跳转到登录页面
            router.push('/');
        }
        ElMessage.error('服务异常');
        return Promise.reject(err);
    }
)

export default instance;