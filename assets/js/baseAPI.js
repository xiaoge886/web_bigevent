// 每次调用$.get()或$.post()或$.ajax()
$.ajaxPrefilter(function(options){
    options.url = 'http://www.liulongbin.top:3007'+options.url
})