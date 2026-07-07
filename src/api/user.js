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
export const userInfoService = () => {
  return request({
    url: '/user/userInfo',
    method: 'get'
  })
}
export const userUpdateService = (userData) => {
  return request({
    url: '/user/update',  
    method: 'put',
    data: userData
  })
}
export const userUpdateAvatarService = (avatarUrl) => {
  return request({
    url: '/user/updateAvatar',
    method: 'patch',
    params: {
      avatarUrl
    }
  })
}
export const userUpdatePasswordService = (passwordData) => {
  return request({
    url: '/user/updatePwd',
    method: 'patch',
    data: {
      old_pwd: passwordData.oldPwd,
      new_pwd: passwordData.newPwd,
      re_pwd: passwordData.rePwd
    }
  })
}
