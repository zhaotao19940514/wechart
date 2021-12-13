import requestUrl from '../../utils/util.js'
// 获取应用实例
const app = getApp()

Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        openid: null,
        sessionkey:null,
        token: null,
        phonenumber:null
    },
    onLoad: function (options) {
    //登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                if (res.code) {
                    console.log('code', res.code)
                    requestUrl.requestUrl({
                        url: "wx/getOpenId",
                        params: {
                            code: res.code
                        },
                        method: 'GET',
                    }).then((res) => {
                        this.data.openid = res.data.data.openId
                        this.data.sessionkey = res.data.data.sessionKey
                    }).catch((errorMsg) => {
                        console.log(errorMsg)
                    })
                }
            }
          })
    },
    //获取手机号
    getPhoneNumber: function (e) {//点击的“拒绝”或者“允许
        // console.log(e.detail.errMsg)
        // console.log(e.detail.iv)
        // console.log(e.detail.encryptedData)
        if(e.detail.errMsg=="getPhoneNumber:ok"){//点击了“允许”按钮，
            requestUrl.requestUrl({
                url:"wx/getPhone",
                params: {
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv,
                    sessionKey: this.data.sessionkey,
                    openId: this.data.openid
                },
                method:"post",
            }).then((res) => {//then接收一个参数，是函数，并且会拿到我们在requestUrl中调用resolve时传的参数
                console.log("允许授权了")
                let data = {
                    token: res.data.data.token,
                    phonenumber: res.data.data.phone,
                    openid: res.data.data.openId,
                    sessionKey: res.data.data.sessionKey
                }
                if(res.data.code==200){
                    wx.navigateTo({
                        url: `../index/index?token=${data.token}&phone=${data.phonenumber}&openid=${data.openid}&sessionKey=${data.sessionKey}`,
                        success: function(res) {},
                      })
                }
            }).catch((errorMsg) => {
                console.log(errorMsg)
            })
        }
    }
})
