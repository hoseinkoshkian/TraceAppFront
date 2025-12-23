<!-- Login.vue -->
<template>
  <div class="login-container">
    <h2>ورود به سیستم</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">ایمیل:</label>
        <input
            type="email"
            id="email"
            v-model="email"
            placeholder="ایمیل خود را وارد کنید"
            required
        />
      </div>

      <div class="form-group">
        <label for="password">رمز عبور:</label>
        <input
            type="password"
            id="password"
            v-model="password"
            placeholder="رمز عبور"
            required
        />
      </div>

      <button type="submit">ورود</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

// state ها
const email = ref("");
const password = ref("");
const error = ref("");

// تابع لاگین
const handleLogin = () => {
  error.value = "";

  // اعتبارسنجی ساده
  if (!email.value || !password.value) {
    error.value = "لطفاً همه فیلدها را پر کنید.";
    return;
  }

  // ارسال داده به API (نمونه)
  fetch("https://example.com/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.value, password: password.value }),
  })
      .then((res) => {
        if (!res.ok) throw new Error("ایمیل یا رمز عبور اشتباه است.");
        return res.json();
      })
      .then((data) => {
        console.log("ورود موفق:", data);
        // بعد از لاگین می‌توانید کاربر را ریدایرکت کنید
      })
      .catch((err) => {
        error.value = err.message;
      });
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-family: sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error {
  margin-top: 15px;
  color: red;
  text-align: center;
}
</style>
