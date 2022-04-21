import { Security } from '../utils/security.js'

class IndexModel extends Security {
  getHotList(query) { // 首页热门列表
    let url = '/question/hotList'
    return this.security({ url: url, data: query })
  }

  getAttentionList(query) { // 首页关注列表
    let url = '/question/myAttention'
    return this.security({ url: url, data: query })
  }

  getLatestList(query) { // 首页最新列表
    let url = '/question/latestList'
    return this.security({ url: url, data: query })
  }

  getTagList(query) { // 首页分类列表
    let url = '/tag/list'
    return this.security({ url: url, data: query })
  }

  getQuestionListByTagId(tag_id) { // 分类问题列表
    let url = '/question/listByTagId'
    return this.security({ url: url, data: { tag_id: tag_id } })
  }
}

export const indexModel = new IndexModel()