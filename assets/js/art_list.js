$(function(){
    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(date){
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth()+1)
        let d = padZero(dt.getDate())
        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    // 定义补零
    function padZero(n){
        return n>9?n:'0'+n
    }
    // 订义一个查询的参数对象，将请求数据的时候提交到服务器
    let q ={
        pagenum:1,  //页面值
        pagesize:2, //每页显示多少条数据
        cate_id:'', //文章分类的id
        state:'', //文章的发步状态
    }
    initTable()
    initCate()
    // 获取文章列表
    function initTable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
                if(res.status !== 0){
                    return layui.layer.msg('获取文章列表失败！')
                }
                console.log(res)
                // 使用模板引擎渲染数据
                let htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            // data:q,
            success:function(res){
                console.log(res)
                if(res.status !== 0){
                    return layui.layer.msg('获取分类数据失败！')
                }
                let htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                // 通知layui重新渲染表单ui结构
                layui.form.render()
            }
        })
    }
    // 为筛选表单绑定submit时间
    $('#form-search').on('submit',function(e){
        e.preventDefault()
        // console.log('ok')
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 为查询对象q中对应赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的数据重新筛选数据
        initTable()

    })
    let laypage = layui.laypage
    // 定义渲染分页的方法
    function renderPage(total){
        // console.log(total)
        // 调用laypage.render()方法来渲染分页结构
        laypage.render({
            elem:'pageBox', //分页容器的id
            count:total,    //总数据条数
            limit:q.pagesize, //每页显示几条数据
            curr:q.pagenum, //设置默认被选中的分页
            layout:['count','limit','prev', 'page', 'next','skip'],
            limits:[2,3,5,10],
            // 分页发生切换的时候，触发回调
            // 触发方式有两种，点击会触发
            // 只有调用了laypage.render()方法就会触发
            jump:function(obj,first){
                // console.log(obj.curr)
                q.pagenum = obj.curr
                // 把最新的条目数赋值
                q.pagesize = obj.limit
                // 根据最新的q获取对应的数据列表
                // initTable()
                if(!first){
                    initTable()
                }
                
            },
            
        })

    }
    // 事件委托删除按钮
    $('tbody').on('click','.btn-delete',function(){
        let len = $('.btn-delete').length
        console.log(len)
        let id =$(this).attr('data-id')
        layui.layer.confirm('是否要删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'GET',
                url:'/my/article/delete/'+id,
                success:function(res){
                    if(res.status !== 0){
                        return layui.layer.msg('删除文章失败！')
                    }
                    layui.layer.msg('删除文章成功！')
                    // 当数据删除完成后，需判断当前页面中是否还有剩余数据，如没有就要让页面值减一
                    if(len === 1){
                        // 如果len值等于1，证明删除后页面没有任何数据
                        q.pagenum = q.pagenum === 1?1:q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
          });
    })
})