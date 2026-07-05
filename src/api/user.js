import request from '@/utils/request'
export const userRegisterService = (registerdata) => {
    const params = new URLSearchParams()
    for(let key in registerdata) {
        params.append(key, registerdata[key])
    }
  return request({
    url: '/user/register',
    method: 'post',
    data: params
  })
}
export const userLoginService = (logindata) => {
    const params = new URLSearchParams() 
    for(let key in logindata) {
        params.append(key, logindata[key])
    }
  return request({
    url: '/user/login',
    method: 'post',
    data: params
  })
}