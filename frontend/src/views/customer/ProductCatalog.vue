<template>
  <div class="container mt-5">
    <div class="row mb-4">
      <div class="col-md-6">
        <h2>Our Products</h2>
      </div>
      <div class="col-md-6">
        <div class="input-group">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Search products..."
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="searchProducts"
          >
            Search
          </button>
        </div>
      </div>
    </div>

    <div class="row">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="col-md-4 mb-4"
      >
        <div class="card h-100">
          <img
            :src="product.image || 'https://via.placeholder.com/300'"
            class="card-img-top product-image"
            alt="Product image"
          />
          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">{{ product.description }}</p>
            <p class="card-text">
              <strong>Price:</strong> ${{ product.price }}
            </p>
            <p class="card-text"><strong>Stock:</strong> {{ product.stock }}</p>
          </div>
          <div class="card-footer bg-transparent">
            <button
              @click="addToCart(product)"
              class="btn btn-primary w-100"
              :disabled="product.stock <= 0"
            >
              {{ product.stock > 0 ? "Add to Cart" : "Out of Stock" }}
            </button>
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
      products: [],
      searchQuery: "",
      filteredProducts: [],
    };
  },
  async created() {
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await api.getProducts();
        this.products = response.data;
        this.filteredProducts = [...this.products];
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    searchProducts() {
      if (!this.searchQuery) {
        this.filteredProducts = [...this.products];
        return;
      }

      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    },
    async addToCart(product) {
      if (!localStorage.getItem("token")) {
        this.$router.push("/login");
        return;
      }

      if (product.stock <= 0) {
        alert("This product is out of stock");
        return;
      }

      try {
        await api.addToCart({
          product_id: product.id,
          quantity: 1,
        });
        alert("Product added to cart successfully!");
      } catch (error) {
        console.error("Error adding to cart:", error);
        if (error.response && error.response.data.detail) {
          alert(error.response.data.detail);
        }
      }
    },
  },
};
</script>

<style scoped>
.product-image {
  height: 200px;
  object-fit: cover;
}
</style>
