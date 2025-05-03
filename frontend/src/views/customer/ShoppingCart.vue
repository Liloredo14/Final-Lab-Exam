<!-- src/views/customer/ShoppingCart.vue -->
<template>
  <div class="container mt-5">
    <h2>Your Shopping Cart</h2>

    <div v-if="cartItems.length === 0" class="alert alert-info">
      Your cart is empty.
      <router-link to="/products">Browse products</router-link>
    </div>

    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.id">
            <td>
              <img
                :src="item.product.image || 'https://via.placeholder.com/50'"
                class="me-2"
                style="width: 50px; height: 50px; object-fit: cover"
              />
              {{ item.product.name }}
            </td>
            <td>${{ item.product.price }}</td>
            <td>
              <input
                v-model.number="item.quantity"
                type="number"
                min="1"
                :max="item.product.stock"
                class="form-control"
                style="width: 70px"
                @change="updateQuantity(item)"
              />
            </td>
            <td>${{ (item.product.price * item.quantity).toFixed(2) }}</td>
            <td>
              <button
                @click="removeItem(item.id)"
                class="btn btn-sm btn-danger"
              >
                Remove
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="text-end"><strong>Subtotal:</strong></td>
            <td>
              <strong>${{ subtotal.toFixed(2) }}</strong>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <div class="text-end">
        <button @click="proceedToCheckout" class="btn btn-primary btn-lg">
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";

export default {
  data() {
    return {
      cartItems: [],
    };
  },
  computed: {
    subtotal() {
      return this.cartItems.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0);
    },
  },
  async created() {
    await this.fetchCart();
  },
  methods: {
    async fetchCart() {
      try {
        const response = await api.getCart();
        this.cartItems = response.data.items;
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    },
    async updateQuantity(item) {
      if (item.quantity < 1) {
        item.quantity = 1;
        return;
      }

      if (item.quantity > item.product.stock) {
        item.quantity = item.product.stock;
        alert(`Only ${item.product.stock} available in stock`);
        return;
      }

      try {
        await api.addToCart({
          product_id: item.product.id,
          quantity: item.quantity,
        });
      } catch (error) {
        console.error("Error updating quantity:", error);
        await this.fetchCart(); // Reset to server state if error
      }
    },
    async removeItem(itemId) {
      try {
        await api.removeFromCart(itemId);
        await this.fetchCart();
      } catch (error) {
        console.error("Error removing item:", error);
      }
    },
    proceedToCheckout() {
      this.$router.push("/checkout");
    },
  },
};
</script>
