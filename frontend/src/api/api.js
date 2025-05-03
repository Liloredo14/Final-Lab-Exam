import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api", // Django backend URL
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  // Auth endpoints
  login(credentials) {
    return apiClient.post("/auth/login/", credentials);
  },
  register(userData) {
    return apiClient.post("/auth/register/", userData);
  },

  // Product endpoints
  getProducts() {
    return apiClient.get("/products/");
  },
  getProduct(id) {
    return apiClient.get(`/products/${id}/`);
  },
  createProduct(productData) {
    return apiClient.post("/products/", productData, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
  },
  updateProduct(id, productData) {
    return apiClient.put(`/products/${id}/`, productData, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
  },
  deleteProduct(id) {
    return apiClient.delete(`/products/${id}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
  },

  // Cart endpoints
  getCart() {
    return apiClient.get("/cart/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
  },
  addToCart(item) {
    return apiClient.post("/cart/add/", item, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
  },
  removeFromCart(itemId) {
    return apiClient.delete(`/cart/remove/${itemId}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
  },
  checkout() {
    return apiClient.post(
      "/checkout/",
      {},
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
  },

  // Order endpoints
  getOrders() {
    return apiClient.get("/orders/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
  },
  getOrder(id) {
    return apiClient.get(`/orders/${id}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
  },
  filterOrders(date) {
    return apiClient.get(`/orders/filter/?date=${date}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
  },
};
