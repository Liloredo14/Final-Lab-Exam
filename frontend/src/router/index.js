import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/products", // Redirect to product catalog by default
  },
  {
    path: "/admin/products",
    name: "admin-products",
    component: () => import("../views/admin/ProductManagement.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/checkouts",
    name: "admin-checkouts",
    component: () => import("../views/admin/CheckoutMonitoring.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/products",
    name: "products",
    component: () => import("../views/customer/ProductCatalog.vue"),
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("../views/customer/ShoppingCart.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/checkout",
    name: "checkout",
    component: () => import("../views/customer/Checkout.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/auth/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/auth/Register.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresAdmin && (!isAuthenticated || !isAdmin)) {
    next("/");
  } else {
    next();
  }
});

export default router;
