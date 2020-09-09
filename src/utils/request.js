import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000,// request timeout
  paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.accessToken) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Access-Token'] = getToken()
    }
    return config
  },
  error => {
    console.log('error====>' + error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  async response => {
    const res = response.data
    return new Promise((resolve, reject) => {
      // if the custom code is not 20000, it is judged as an error.
      if (res.code !== 1) {
        // 401标识未登录;
        if (res.code === 401 || res.code === 402) {
          // to re-login
          MessageBox.confirm('您的账号未登录，或登录已过期！', '未登录', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetLoginStatus').then(() => {
              location.reload()
            })
          }).catch(() => {
          })
        } else {
          Message({
            message: res.message || 'Error',
            type: 'error',
            duration: 5 * 1000
          })
        }
        reject(res.message || 'Error')
      } else {
        resolve(res)
      }
    })
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)


/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
service.post = (url, data) => {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(data)).then(
      response => {
        resolve(response.data)
      },
      err => {
        reject(err)
      }
    )
  })
}

/**
 * delete 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
service.delete = (url, data) => {
  return new Promise((resolve, reject) => {
    axios.delete(url, {params: data}).then(
      response => {
        resolve(response.data)
      },
      err => {
        reject(err)
      }
    )
  })
}

/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
service.post_json = (url, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, {
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
      })
      .then(
        response => {
          resolve(response.data)
        },
        err => {
          reject(err)
        }
      )
  })
}


export default service
