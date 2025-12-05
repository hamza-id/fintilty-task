<template>
  <div class="auth-card">
    <h2>Create Account</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label>Name</label>
        <input v-model="form.name" type="text" required />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" required />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="form.password" type="password" required />
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-primary">Register</button>
        <router-link to="/login" class="link">Have an account? Login</router-link>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { authService } from '../services/auth';

export default {
  name: 'RegisterView',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: ''
      },
      error: null
    };
  },
  methods: {
    handleRegister() {
      this.error = null;
      try {
        authService.register(this.form);
        this.$router.push({ name: 'Dashboard' });
      } catch (e) {
        this.error = e.message || 'Unable to register';
      }
    }
  }
};
</script>

<style scoped>
.auth-card {
  max-width: 420px;
  margin: 60px auto;
  padding: 28px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 16px;
  text-align: center;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
}

input {
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-primary {
  background: #42b983;
  color: #fff;
}

.error {
  margin-top: 12px;
  color: #dc3545;
  text-align: center;
}

.link {
  color: #007bff;
  text-decoration: none;
}
</style>

