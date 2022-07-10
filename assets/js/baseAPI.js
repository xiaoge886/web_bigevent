// 每次调用$.get()或$.post()或$.ajax()
$.ajaxPrefilter(function(options){
    // 统一拼接根路径
    options.url = 'http://www.liulongbin.top:3007'+options.url

    // 统一为有权限的接口设置 headers
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载complete回调函数
    options.complete = function (res){
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            // 强制清空token
            // 强制跳转到登录页面
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})