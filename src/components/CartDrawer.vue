<template>
  <div v-if="isOpen" class="drawer-backdrop" @click.self="$emit('close')">
    <div class="cart-drawer">
      <!-- Drawer Header -->
      <div class="drawer-header">
        <div class="header-title-box">
          <span class="tech-badge">DISPATCH LOGISTICS</span>
          <h2 class="drawer-title">TECHNICAL ORDER TRAY</h2>
        </div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- Drawer Items List -->
      <div class="drawer-body">
        <div v-if="items.length === 0" class="empty-state">
          <div class="empty-icon">📦</div>
          <div class="empty-title">ORDER TRAY EMPTY</div>
          <p class="empty-desc">
            No components currently selected for procurement or CAD allocation.
          </p>
        </div>

        <div v-else class="items-list">
          <div v-for="item in items" :key="item.part.id" class="cart-item">
            <div class="item-top">
              <div>
                <span class="item-sku font-mono">{{ item.part.sku }}</span>
                <div class="item-name">{{ item.part.name }}</div>
              </div>
              <button class="remove-btn" @click="removeItem(item.part.id)">✕</button>
            </div>

            <div class="item-specs-bar">
              <span class="item-spec-chip font-mono">WEIGHT: {{ formatWeight(item.part.weightKg * item.quantity, unit) }}</span>
              <span class="item-spec-chip font-mono">HUB: LEIPZIG</span>
            </div>

            <div class="item-pricing-row">
              <div class="qty-pill">
                <button class="qty-change" @click="changeQty(item, -1)">-</button>
                <span class="qty-val font-mono">{{ item.quantity }}</span>
                <button class="qty-change" @click="changeQty(item, 1)">+</button>
              </div>
              <div class="line-total font-mono">
                {{ formatPrice(item.part.price * item.quantity) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Drawer Footer / Summary -->
      <div v-if="items.length > 0" class="drawer-footer">
        <!-- Logistics summary box -->
        <div class="logistics-box">
          <div class="summary-line">
            <span class="sum-label">TOTAL SHIPMENT WEIGHT:</span>
            <span class="sum-val font-mono">{{ formatWeight(totalWeight, unit) }}</span>
          </div>
          <div class="summary-line">
            <span class="sum-label">DISPATCH HUB:</span>
            <span class="sum-val">MUNICH CENTRAL (EXPRESS COURIER)</span>
          </div>
          <div class="summary-line">
            <span class="sum-label">NET SUB-TOTAL:</span>
            <span class="sum-val font-mono text-white">{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="summary-line">
            <span class="sum-label">ESTIMATED FREIGHT:</span>
            <span class="sum-val font-mono text-cyan">{{ formatPrice(shippingCost) }}</span>
          </div>
          <div class="summary-line total-line">
            <span class="total-label">TOTAL COMMERCIAL ESTIMATE:</span>
            <span class="total-val font-mono">{{ formatPrice(grandTotal) }}</span>
          </div>
        </div>

        <button class="btn-primary checkout-btn" @click="onProceedCheckout">
          <span>GENERATE ORDER SPECIFICATION & PO</span>
          <span>➔</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatCurrency, formatWeight } from '../utils/formatters.js';
import { sound } from '../utils/audio.js';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
  currency: { type: String, default: 'USD' },
  unit: { type: String, default: 'metric' }
});

const emit = defineEmits(['close', 'update:qty', 'remove', 'checkout']);

const formatPrice = (amt) => formatCurrency(amt, props.currency);

const totalWeight = computed(() => {
  return props.items.reduce((acc, curr) => acc + (curr.part.weightKg * curr.quantity), 0);
});

const subtotal = computed(() => {
  return props.items.reduce((acc, curr) => acc + (curr.part.price * curr.quantity), 0);
});

const shippingCost = computed(() => {
  return totalWeight.value > 0 ? Math.round(45 + totalWeight.value * 2.5) : 0;
});

const grandTotal = computed(() => {
  return subtotal.value + shippingCost.value;
});

const changeQty = (item, delta) => {
  sound.playClick();
  const next = item.quantity + delta;
  if (next <= 0) {
    emit('remove', item.part.id);
  } else {
    emit('update:qty', { partId: item.part.id, quantity: next });
  }
};

const removeItem = (partId) => {
  sound.playClick();
  emit('remove', partId);
};

const onProceedCheckout = () => {
  sound.playSuccessChime();
  emit('checkout', {
    items: props.items,
    subtotal: subtotal.value,
    shippingCost: shippingCost.value,
    grandTotal: grandTotal.value,
    totalWeight: totalWeight.value
  });
};
</script>

<style scoped>
.drawer-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(4, 5, 8, 0.75);
  backdrop-filter: blur(6px);
  z-index: 300;
  display: flex;
  justify-content: flex-end;
}

.cart-drawer {
  background: #10131b;
  border-left: 1px solid var(--border-bright);
  width: 100%;
  max-width: 480px;
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: slideDrawer 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.8);
}

@keyframes slideDrawer {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: #0d0f15;
  border-bottom: 1px solid var(--border-dim);
}

.drawer-title {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 800;
  color: #ffffff;
  margin-top: 4px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 18px;
  cursor: pointer;
}

.close-btn:hover {
  color: #fff;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  gap: 12px;
}

.empty-icon {
  font-size: 40px;
  opacity: 0.4;
}

.empty-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

.empty-desc {
  font-size: 13px;
  color: var(--text-muted);
  max-width: 260px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  background: #141722;
  border: 1px solid var(--border-dim);
  border-radius: 4px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.item-sku {
  font-size: 10px;
  color: var(--accent-orange);
}

.item-name {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
}

.remove-btn:hover {
  color: var(--accent-red);
}

.item-specs-bar {
  display: flex;
  gap: 6px;
}

.item-spec-chip {
  font-size: 9px;
  background: #0d0f15;
  color: var(--text-dim);
  padding: 2px 6px;
  border-radius: 2px;
}

.item-pricing-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 8px;
}

.qty-pill {
  display: flex;
  align-items: center;
  background: #0d0f15;
  border: 1px solid var(--border-dim);
  border-radius: 2px;
}

.qty-change {
  background: none;
  border: none;
  color: var(--text-muted);
  width: 26px;
  height: 24px;
  cursor: pointer;
}

.qty-change:hover {
  color: #fff;
}

.qty-val {
  font-size: 12px;
  width: 24px;
  text-align: center;
  color: #fff;
}

.line-total {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
}

.drawer-footer {
  background: #0d0f15;
  border-top: 1px solid var(--border-dim);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logistics-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
}

.sum-label {
  color: var(--text-dim);
}

.sum-val {
  color: var(--text-muted);
}

.text-white {
  color: #ffffff !important;
  font-weight: 600;
}

.text-cyan {
  color: var(--accent-cyan) !important;
}

.total-line {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border-bright);
}

.total-label {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 800;
  color: #ffffff;
}

.total-val {
  font-size: 20px;
  font-weight: 800;
  color: var(--accent-orange);
}

.checkout-btn {
  width: 100%;
  height: 46px;
  font-size: 14px;
}
</style>
