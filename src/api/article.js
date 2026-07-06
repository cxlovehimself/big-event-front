import request from '@/utils/request' 

export const articleCategoryListService = () => {
    return request({
        url: '/category/list',
        method: 'GET',
    })
}
export const articleCategoryAddService = (categoryData) => {
    
    return request({
        url: '/category/add',
        method: 'POST',
        data: categoryData
    })
}
export const articleCategoryUpdateService = (categoryData) => {
    return request({
        url: '/category/update',
        method: 'put',
        data: categoryData
    })
}
export const articleCategoryDeleteService = (categoryId) => {
    return request({
        url: '/category/delete',
        method: 'delete',
        params: {
            id: categoryId
        }
    })
}
export const articleListService = (params) => {
    return request({
        url: '/article/list',
        method: 'get',
        params: params
    })
}
export const articleAddService = (articleData) => {
    return request({
        url: '/article/add',    
        method: 'POST',
        data: articleData
    })
}
export function articleUpdateService(articleData) {
    return request({
        url: '/article/update',
        method: 'patch',
        data: articleData
    })
}
export const articleDeleteService = (articleId) => {
    return request({
        url: '/article/delete',
        method: 'delete',
        params: {
            id: articleId
        }
    })
}
