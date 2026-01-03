import api from '@/plugins/axios'

export default class BaseAPI {
    get(url, config = {}) {
        return api.get(url, config).then(res => res.data)
    }

    post(url, data, config = {}) {
        return api.post(url, data, config).then(res => res.data)
    }

    put(url, data, config = {}) {
        return api.put(url, data, config).then(res => res.data)
    }

    patch(url, data, config = {}) {
        return api.patch(url, data, config).then(res => res.data)
    }

    delete(url, config = {}) {
        return api.delete(url, config).then(res => res.data)
    }
}
