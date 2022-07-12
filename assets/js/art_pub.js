$(function(){
    initCate()
    // 初始化富文本编辑器
initEditor()
    // 定义加载文章分类的方法
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layui.layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎
               let htmlStr = template('tpl-cate',res)
               $('[name=cate_id]').html(htmlStr)
            //一定要记得调用form.render（）方法  
            layui.form.render()  
            }
        })
    }
     // 1. 初始化图片裁剪器
  var $image = $('#image')
  
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 3. 初始化裁剪区域
  $image.cropper(options)

//   选择封面
  $('#btnChoseImage').on('click',function(){
    $('#coverFile').click()
  })
            // 监听coverFile的change事件
            $('#coverFile').on('change',function(e){
                // 获取到文件列表的数组
                var file = e.target.files[0]
                // 判断是否选择了文件
                if(file.length === 0){
                    return
                }
                // 根据图片，创建对应的url地址
                var newImgURL = URL.createObjectURL(file)
                // 裁剪区域重新设置文件
                $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
            }) 
            // 定义文章的发布状态
            let art_state = '已发布'
            $('#btnSave2').on('click',function(){
                art_state = '草稿'
            })
            // 为表单绑定submit事件
            $('#form-pub').on('submit',function(e){
                e.preventDefault()
                // 基于form表单创建一个FormData对象
                let fd =new  FormData($(this)[0])
                // 把文章状态保存到fd中
                fd.append('state',art_state)
                // 将封面裁剪后的图片输出为文件对象
                $image
  .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
    width: 400,
    height: 280
  })
  .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
    // 得到文件对象后，进行后续的操作
    // 将文件对象存储到fd中
    fd.append('cover_img',blob)
    publishArticle(fd)
  })
//   发起ajax请求
    
            })
            function publishArticle(fd) {
                $.ajax({
                  method: 'POST',
                  url: '/my/article/add',
                  data: fd,
                  // 注意：如果向服务器提交的是 FormData 格式的数据，
                  // 必须添加以下两个配置项
                  contentType: false,
                  processData: false,
                  success: function(res) {
                    if (res.status !== 0) {
                      return layer.msg('发布文章失败！')
                    }
                    layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                    location.href = '/aritcle/art_list.html'
                  }
                })
              }
})