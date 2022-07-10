$(function(){
    getUserInfo()
    // 点击按钮实现退出功能
    let layer = layui.layer
    $('#btnLogout').on('click',function(){
        // console.log('ok')
        // 提示用户是否退出
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            //do something
            // console.log('ok')
            // 清空本地存储的token
            localStorage.removeItem('token')
            // 重新跳转到登录页面 
            location.href = '/login.html'
            // 关闭询问框
            layer.close(index);
          });
    })
})

// 获取用户基本信息
function getUserInfo(){
   $.ajax({
        method:'GET',
        url: "/my/userinfo",
        // headers:{
        // Authorization: localStorage.getItem('token')
        // },
        success: function (res) {
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        },
        // 不论如何最后都会调用complete
        // complete:function(res){
        //     // console.log(res)
        //     // 在complete回调函数中，可以使用responseJSON拿到服务器响应回来的信息
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         // 强制清空token
        //         // 强制跳转到登录页面
        //         localStorage.removeItem('token')
        //         location.href = '/login.html'
        //     }
        // },
    })
}
// 渲染用户的头像
function renderAvatar (user){
    let name = user.nickname || user.username
    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
    // 按需渲染用户的头像
    if(user.user_pic !== null){
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }else{
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}