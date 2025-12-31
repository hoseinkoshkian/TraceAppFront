// src/api/profile.api.js
import BaseAPI from './BaseAPI.js'

class ProfileApi extends BaseAPI {
    // مشاهده پروفایل کاربر لاگین شده
    getProfile() {
        return this.get('/api/v1/users/profile/')
    }

    // بروزرسانی کامل پروفایل (PUT)
    updateProfile(data) {
        return this.put('/api/v1/users/profile/update', data)
    }

    // بروزرسانی جزئی پروفایل (PATCH)
    partialUpdateProfile(data) {
        return this.patch('/api/v1/users/profile/', data)
    }

    // حذف حساب کاربری
    deleteProfile() {
        return this.delete('/api/v1/users/profile/')
    }
}

export const profileApi = new ProfileApi()
