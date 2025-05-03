<template>
  <div class="container mt-5">
    <h2>Product Management</h2>

    <div class="mb-3">
      <button @click="showAddModal = true" class="btn btn-primary">
        Add New Product
      </button>
    </div>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>${{ product.price }}</td>
          <td>{{ product.stock }}</td>
          <td>
            <button
              @click="editProduct(product)"
              class="btn btn-sm btn-warning me-2"
            >
              Edit
            </button>
            <button
              @click="confirmDelete(product.id)"
              class="btn btn-sm btn-danger"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add/Edit Product Modal -->

    <div
      class="modal fade"
      :class="{ show: showAddModal, 'd-block': showAddModal }"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingProduct ? "Edit Product" : "Add New Product" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduct">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input
                  v-model="currentProduct.name"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea
                  v-model="currentProduct.description"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Price</label>
                <input
                  v-model="currentProduct.price"
                  type="number"
                  step="0.01"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Stock</label>
                <input
                  v-model="currentProduct.stock"
                  type="number"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Image URL</label>
                <input
                  v-model="currentProduct.image"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="closeModal"
                >
                  Close
                </button>
                <button type="submit" class="btn btn-primary">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAddModal" class="modal-backdrop fade show"></div>

    <!-- Delete Confirmation Modal -->

    <div
      class="modal fade"
      :class="{ show: showDeleteModal, 'd-block': showDeleteModal }"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button
              type="button"
              class="btn-close"
              @click="showDeleteModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this product?</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showDeleteModal = false"
            >
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="deleteProduct">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDeleteModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import api from "@/api/api";

export default {
  data() {
    return {
      products: [],
      showAddModal: false,
      showDeleteModal: false,
      editingProduct: null,
      currentProduct: {
        name: "",
        description: "",
        price: 0,
        stock: 0,
        image: "",
      },
      productToDelete: null,
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
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    editProduct(product) {
      this.editingProduct = product;
      this.currentProduct = { ...product };
      this.showAddModal = true;
    },
    async saveProduct() {
      try {
        if (this.editingProduct) {
          await api.updateProduct(this.editingProduct.id, this.currentProduct);
        } else {
          await api.createProduct(this.currentProduct);
        }
        this.closeModal();
        await this.fetchProducts();
      } catch (error) {
        console.error("Error saving product:", error);
      }
    },
    confirmDelete(productId) {
      this.productToDelete = productId;
      this.showDeleteModal = true;
    },
    async deleteProduct() {
      try {
        await api.deleteProduct(this.productToDelete);
        this.showDeleteModal = false;
        await this.fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        if (error.response && error.response.data.detail) {
          alert(error.response.data.detail);
        }
      }
    },
    closeModal() {
      this.showAddModal = false;
      this.editingProduct = null;
      this.currentProduct = {
        name: "",
        description: "",
        price: 0,
        stock: 0,
        image: "",
      };
    },
  },
};
</script>
