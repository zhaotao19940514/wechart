//封装请求
//const server = 'https://XXXX/';//正式域名 必须为https
const server = 'http://127.0.0.1:8080/';//测试域名
//本地前后端调试时可以先不检验合法域名（在微信开发者工具中的本地设置记得打钩这一选项），就可以进行访问HTTP啦
const requestUrl = ({
    url, 
    params,
    success, 
    method = "post"
}) => {       
    wx.showLoading({
        title: '加载中',
    });
    // let headerPost = {'content-type': 'application/x-www-form-urlencoded'}
    let headerPost= {'content-Type': 'application/json'}
    let headerGet = {'content-Type': 'application/json'}
    return new Promise((resolve, reject) => {
        wx.request({
            url: server + url,
            method: method,
            data: params,
            header: method = 'post' ? headerPost : headerGet,
            success: (res) => {
                wx.hideLoading();
                if (res['statusCode'] == 200) {
                    resolve(res)//异步成功之后执行的函数
                } else {
                    wx.showToast({
                        title: res.data.msg || '请求出错',
                        icon: 'none',
                        duration: 2000,
                        mask: true
                    })
                    reject(res.ErrorMsg);
                }
            },
            fail: (res) => {
                wx.hideLoading();
                wx.showToast({
                    title: res.data.msg || '',
                    icon: 'none',
                    duration: 2000,
                    mask: true
                })
                reject('网络出错');
            },
            complete: function () {
                wx.hideLoading()
            }
        })
    })
}
module.exports = {
    requestUrl: requestUrl
}
