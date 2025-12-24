// src/composables/queryClient.js
import { ref, reactive, computed, watch } from 'vue'

class QueryClient {
    constructor() {
        this.queries = reactive(new Map()) // key -> { data, status, error, subscribers, timestamp }
    }

    getQuery(key) {
        return this.queries.get(key)
    }

    setQuery(key, query) {
        this.queries.set(key, query)
    }

    subscribe(key, callback) {
        const query = this.queries.get(key)
        if (query) {
            query.subscribers.push(callback)
        } else {
            this.queries.set(key, { data: null, status: 'idle', error: null, subscribers: [callback], timestamp: 0 })
        }
    }

    notify(key) {
        const query = this.queries.get(key)
        if (query) {
            query.subscribers.forEach(cb => cb(query.data))
        }
    }

    invalidateQuery(key) {
        const query = this.queries.get(key)
        if (query) {
            query.timestamp = 0 // mark as stale
        }
    }
}

export const queryClient = new QueryClient()
