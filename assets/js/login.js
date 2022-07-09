$(function(){
    // 点击去注册的链接
    $('#link-reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击去登录的链接
    $('#link-login').on('click',function(){
        $('.reg-box').hide()
        $('.login-box').show()
    })
    //从layui 中获取 form 对象
    let form = layui.form
    let layer = layui.layer
    form.verify({
        pwd:[/^[\S]{6,12}$/
        ,'密码必须6到12位，且不能出现空格'],
        repwd:function(value){
            // 验证密码是否一致
            // 如果判断失败则return一个提示
           let pwd = $('.reg-box [name=password]').val()
           if(pwd !== value){
            return '两次密码不一致'
           }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit',function(e){
        // 阻止默认提交行为
        e.preventDefault()
        let data = {
            username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()
        }
        $.post("/api/reguser",data,
            function (res) {
                if(res.status !== 0) return layer.msg(res.message)
                layer.msg('注册成功,请登录')
                // 模拟点击
                $('#link-login').click()
            })
    })
    // 监听登录表单
    $('#form_login').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            
            url: "/api/login",
            method:'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                console.log(res.token)
                // 将保存到的值保存到localStorage
                localStorage.setItem('token',res.token)
                location.href = '/index.html'
            }
        });
    })
})