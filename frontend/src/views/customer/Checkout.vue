<template>
  <div class="container mt-5">
    <h2>Checkout Monitoring</h2>

    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label">Filter by Date:</label>
        <input
          v-model="filterDate"
          type="date"
          class="form-control"
          @change="filterOrders"
        />
      </div>
      <div class="col-md-2 d-flex align-items-end">
        <button @click="clearFilter" class="btn btn-secondary">Clear</button>
      </div>
    </div>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.customer_name }}</td>
          <td>{{ formatDate(order.created_at) }}</td>
          <td>${{ order.total_amount }}</td>
          <td>{{ order.status }}</td>
          <td>
            <button
              @click="viewOrderDetails(order)"
              class="btn btn-sm btn-info"
            >
              View Details
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Order Details Modal -->

    <div
      class="modal fade"
      :class="{ show: showDetailsModal, 'd-block': showDetailsModal }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Order #{{ selectedOrder?.id }} Details</h5>
            <button
              type="button"
              class="btn-close"
              @click="showDetailsModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedOrder">
              <div class="row mb-3">
                <div class="col-md-6">
                  <h6>Customer Information</h6>
                  <p>
                    <strong>Name:</strong> {{ selectedOrder.customer_name }}
                  </p>
                  <p>
                    <strong>Email:</strong> {{ selectedOrder.customer_email }}
                  </p>
                </div>
                <div class="col-md-6">
                  <h6>Order Information</h6>
                  <p>
                    <strong>Date:</strong>
                    {{ formatDate(selectedOrder.created_at) }}
                  </p>
                  <p><strong>Status:</strong> {{ selectedOrder.status }}</p>
                  <p>
                    <strong>Total:</strong> ${{ selectedOrder.total_amount }}
                  </p>
                </div>
              </div>

              <h6>Order Items</h6>
              <table class="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedOrder.items" :key="item.id">
                    <td>{{ item.product_name }}</td>
                    <td>${{ item.price }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showDetailsModal = false"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDetailsModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import api from "@/api/api";

export default {
  data() {
    return {
      orders: [],
      filterDate: "",
      showDetailsModal: false,
      selectedOrder: null,
    };
  },
  async created() {
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await api.getOrders();
        this.orders = response.data;
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },
    async filterOrders() {
      if (!this.filterDate) return;

      try {
        const response = await api.filterOrders(this.filterDate);
        this.orders = response.data;
      } catch (error) {
        console.error("Error filtering orders:", error);
      }
    },
    clearFilter() {
      this.filterDate = "";
      this.fetchOrders();
    },
    viewOrderDetails(order) {
      this.selectedOrder = order;
      this.showDetailsModal = true;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
  },
};
</script>
