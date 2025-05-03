<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3>Register</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="register">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input
                  v-model="user.name"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  v-model="user.email"
                  type="email"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input
                  v-model="user.password"
                  type="password"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Confirm Password</label>
                <input
                  v-model="user.password_confirmation"
                  type="password"
                  class="form-control"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100">
                Register
              </button>
            </form>
            <div class="mt-3 text-center">
              <p>
                Already have an account?
                <router-link to="/login">Login here</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";

export default {
  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
    };
  },
  methods: {
    async register() {
      if (this.user.password !== this.user.password_confirmation) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const response = await api.register(this.user);

        // Auto-login after registration
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isAdmin", response.data.user.is_admin);

        this.$router.push("/products");
      } catch (error) {
        console.error("Registration error:", error);
        if (error.response && error.response.data.email) {
          alert(error.response.data.email[0]);
        } else {
          alert("Registration failed. Please try again.");
        }
      }
    },
  },
};
</script>
