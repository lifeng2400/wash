const config = {
  api_base_url: "https://wwx.50cms.com:446/apiww",
 //api_base_url: "https://yindaapp.com",
 img_base_url: "http://wwx.50cms.com/",


  //调试模式开关，调试模式下只调用本地数据
  debug: false,
  //学校数据配置名称，学校英文缩写
  //高德路线规划密钥，必须加入https://restapi.amap.com为request合法域名
  //密钥申请地址http://lbs.amap.com/api/javascript-api/summary/
  key: "1dac319276ebab1cc29dbe755a120ba6", 
  //地图更新地址，用于热修补，无需每次都提交审核
  updateUrl: "https://www.qq.com/json.json",
    //图片CDN域名
  imgCDN: "",

 page: {
   home: '/pages/home/index', // 首页
   problem_index: 'pages/problem/index/index', // 提问
   problem_detail: '/pages/problem/detail/detail', // 问题详情
   problem_setting: '/pages/problem/setting/index', // 问题设置
   problem_invite: '/pages/problem/invite/index', // 问题邀请
   problem_append: '/pages/problem/append/index', // 追加描述
   person_others: '/pages/person/others/index', // 个人中心（客态）
   person_index: '/pages/person/index/index', // 个人中心（主态）
   person_intro: '/pages/person/intro/index', // 编辑个人简介
   person_edit: '/pages/person/edit/index', // 编辑个人资料
   person_auth: '/pages/person/auth/index', // 实名认证
   person_message: '/pages/person/message/index', // 用户消息
   person_answer: '/pages/person/answer/index', // 用户回答
   person_question: '/pages/person/question/index', // 用户提问
   person_folproblem: '/pages/person/followProblem/index', // 用户关注问题
   person_follow: '/pages/person/follow/index', // 用户关注的人
   person_phoneBind: '/pages/person/phoneBind/index', // 用户绑定手机
   follow_me: '/pages/person/followMe/index', // 关注我的人
   answer_detail: '/pages/answer/detail/detail', // 回答详情
   answer_index: '/pages/answer/index/index', // 回答
   search: '/pages/search/index', // 搜索
   comment: '/pages/answer/comment/index', // 评论
   tag: '/pages/tag/index' // 分类问题列表
 }
}

export {
 config
}

