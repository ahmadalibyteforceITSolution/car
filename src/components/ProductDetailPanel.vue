<template>
  <aside class="product-panel">
    <!-- Category & SKU Header -->
    <div class="panel-header">
      <div class="category-meta">
        <span class="tech-badge">{{ part.badge }}</span>
        <span class="sku-tag font-mono">{{ part.sku }}</span>
      </div>
      <h1 class="part-title">{{ part.name }}</h1>
      <div class="oem-ref">
        <span class="oem-label">OEM CROSS-REF:</span>
        <span class="oem-value font-mono">{{ part.oemRef }}</span>
      </div>
    </div>

    <!-- Compatibility Status Banner -->
    <div class="fitment-banner" :class="isCompatible ? 'banner-compatible' : 'banner-check'">
      <div class="banner-icon">{{ isCompatible ? '✓' : '⚠' }}</div>
      <div class="banner-body">
        <div class="banner-title" v-if="selectedVehicle">
          {{ isCompatible ? 'GUARANTEED FITMENT' : 'FITMENT VERIFICATION REQUIRED' }}
        </div>
        <div class="banner-title" v-else>
          FITMENT SELECTOR UNSET
        </div>
        <div class="banner-desc" v-if="selectedVehicle">
          {{ selectedVehicle.year }} {{ selectedVehicle.make }} {{ selectedVehicle.model }} ({{ selectedVehicle.chassis }})
        </div>
        <div class="banner-desc" v-else>
          Select vehicle to confirm bolt-on compliance with axle specifications.
        </div>
      </div>
      <button class="banner-link-btn" @click="$emit('open:vehicleModal')">
        CHANGE
      </button>
    </div>

    <!-- Pricing & Commercial Availability -->
    <div class="price-availability-box">
      <div class="price-row">
        <div class="price-display">
          <span class="price-val">{{ formatPrice(part.price) }}</span>
          <span class="price-tax">NET EXCL. VAT // EX-WORKS</span>
        </div>
        <div class="stock-status">
          <span class="stock-pill in-stock">
            <span class="stock-dot"></span>
            {{ part.inStock }} UNITS READY
          </span>
          <span class="lead-time font-mono">{{ part.leadTime }}</span>
        </div>
      </div>

      <!-- Quick Metrics Bar -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="m-label">PART WEIGHT</div>
          <div class="m-val font-mono">{{ formatWeight(part.weightKg, unit) }}</div>
          <div class="m-sub">{{ part.weightSavings }}</div>
        </div>
        <div class="metric-card">
          <div class="m-label">MAX TEMP</div>
          <div class="m-val font-mono">{{ part.engineeringSpecs.maxOperatingTemp.split(' ')[0] }}</div>
          <div class="m-sub">Continuous Duty</div>
        </div>
        <div class="metric-card">
          <div class="m-label">RATING</div>
          <div class="m-val font-mono">TÜV / FIA</div>
          <div class="m-sub">Certified Bolt-On</div>
        </div>
      </div>

      <!-- Order Controls -->
      <div class="order-action-row">
        <div class="qty-selector">
          <button class="qty-btn" @click="decrementQty">-</button>
          <span class="qty-num font-mono">{{ quantity }}</span>
          <button class="qty-btn" @click="incrementQty">+</button>
        </div>
        <button class="btn-primary add-cart-btn" @click="addToCart">
          <span>ADD TO ORDER TRAY</span>
          <span class="btn-price">{{ formatPrice(part.price * quantity) }}</span>
        </button>
      </div>
    </div>

    <!-- Technical Data Sheets & Specification Tabs -->
    <div class="spec-tabs-container">
      <div class="tabs-header">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'specs' }"
          @click="activeTab = 'specs'"
        >
          ENGINEERING SPECS
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'materials' }"
          @click="activeTab = 'materials'"
        >
          METALLURGY
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'components' }"
          @click="activeTab = 'components'"
        >
          COMPONENTS ({{ part.componentsList?.length || 0 }})
        </button>
      </div>

      <div class="tab-content">
        <!-- Specs Tab -->
        <div v-if="activeTab === 'specs'" class="specs-list">
          <div class="spec-row" v-for="(val, key) in part.dimensions" :key="key">
            <span class="spec-key">{{ formatKey(key) }}</span>
            <span class="spec-val font-mono">{{ val }}</span>
          </div>
          <div class="spec-row" v-for="(val, key) in part.engineeringSpecs" :key="key">
            <span class="spec-key">{{ formatKey(key) }}</span>
            <span class="spec-val font-mono">{{ val }}</span>
          </div>
        </div>

        <!-- Materials Tab -->
        <div v-if="activeTab === 'materials'" class="materials-list">
          <div class="material-item" v-for="(mat, partName) in part.materials" :key="partName">
            <div class="mat-part-name">{{ formatKey(partName) }}</div>
            <div class="mat-composition font-mono">{{ mat }}</div>
          </div>
        </div>

        <!-- Components Hierarchy Tab -->
        <div v-if="activeTab === 'components'" class="components-hierarchy">
          <div 
            v-for="comp in part.componentsList" 
            :key="comp.id"
            class="comp-item"
          >
            <div class="comp-icon">⚙️</div>
            <div class="comp-meta">
              <div class="comp-name">{{ comp.name }}</div>
              <div class="comp-mat font-mono">{{ comp.material }}</div>
            </div>
            <span class="tech-badge-cyan">INSPECTED</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import { formatCurrency, formatWeight } from '../utils/formatters.js';
import { sound } from '../utils/audio.js';

const props = defineProps({
  part: { type: Object, required: true },
  selectedVehicle: { type: Object, default: null },
  isCompatible: { type: Boolean, default: true },
  currency: { type: String, default: 'USD' },
  unit: { type: String, default: 'metric' }
});

const emit = defineEmits(['add:cart', 'open:vehicleModal']);

const quantity = ref(1);
const activeTab = ref('specs');

const formatPrice = (amt) => formatCurrency(amt, props.currency);

const formatKey = (str) => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase());
};

const incrementQty = () => {
  if (quantity.value < props.part.inStock) {
    quantity.value++;
    sound.playClick();
  }
};

const decrementQty = () => {
  if (quantity.value > 1) {
    quantity.value--;
    sound.playClick();
  }
};

const addToCart = () => {
  sound.playSuccessChime();
  emit('add:cart', {
    part: props.part,
    quantity: quantity.value
  });
};
</script>

<style scoped>
.product-panel {
  background: var(--bg-surface);
  border-left: 1px solid var(--border-dim);
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 24px;
  gap: 20px;
}

.panel-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sku-tag {
  font-size: 11px;
  color: var(--text-dim);
}

.part-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 800;
  line-height: 1.25;
  color: #ffffff;
  letter-spacing: 0.04em;
}

.oem-ref {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}

.oem-label {
  color: var(--text-dim);
}

.oem-value {
  color: var(--accent-orange);
}

/* Fitment Banner */
.fitment-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 3px;
}

.banner-compatible {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.banner-check {
  background: rgba(255, 77, 0, 0.08);
  border: 1px solid rgba(255, 77, 0, 0.35);
}

.banner-icon {
  font-size: 16px;
  font-weight: 800;
}

.banner-compatible .banner-icon {
  color: var(--accent-green);
}

.banner-check .banner-icon {
  color: var(--accent-orange);
}

.banner-body {
  flex: 1;
}

.banner-title {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #ffffff;
}

.banner-desc {
  font-size: 12px;
  color: var(--text-muted);
}

.banner-link-btn {
  background: none;
  border: 1px solid var(--border-bright);
  color: var(--text-main);
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 2px;
  cursor: pointer;
}

.banner-link-btn:hover {
  border-color: var(--accent-orange);
}

/* Price Box */
.price-availability-box {
  background: #141721;
  border: 1px solid var(--border-bright);
  padding: 18px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.price-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.price-display {
  display: flex;
  flex-direction: column;
}

.price-val {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.price-tax {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
  margin-top: 4px;
}

.stock-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.stock-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--accent-green);
}

.stock-dot {
  width: 7px;
  height: 7px;
  background: var(--accent-green);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent-green);
}

.lead-time {
  font-size: 10px;
  color: var(--text-muted);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  border-top: 1px solid var(--border-dim);
  border-bottom: 1px solid var(--border-dim);
  padding: 12px 0;
}

.metric-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.m-label {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
}

.m-val {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
}

.m-sub {
  font-size: 10px;
  color: var(--accent-cyan);
}

.order-action-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.qty-selector {
  display: flex;
  align-items: center;
  background: #0f1118;
  border: 1px solid var(--border-dim);
  border-radius: 3px;
  height: 44px;
}

.qty-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 18px;
  width: 36px;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover {
  color: #ffffff;
}

.qty-num {
  font-size: 14px;
  font-weight: 700;
  width: 30px;
  text-align: center;
  color: #ffffff;
}

.add-cart-btn {
  flex: 1;
  height: 44px;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
}

.btn-price {
  font-family: var(--font-mono);
  font-size: 13px;
  background: rgba(0, 0, 0, 0.25);
  padding: 2px 8px;
  border-radius: 2px;
}

/* Tabs */
.spec-tabs-container {
  display: flex;
  flex-direction: column;
  background: #12141c;
  border: 1px solid var(--border-dim);
  border-radius: 4px;
  overflow: hidden;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid var(--border-dim);
  background: #0d0f15;
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 10px 6px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease;
}

.tab-btn:hover {
  color: var(--text-muted);
}

.tab-btn.active {
  color: #ffffff;
  border-bottom-color: var(--accent-orange);
  background: #141722;
}

.tab-content {
  padding: 16px;
  max-height: 260px;
  overflow-y: auto;
}

.spec-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 12px;
}

.spec-key {
  color: var(--text-muted);
}

.spec-val {
  color: #ffffff;
  font-weight: 600;
  text-align: right;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.material-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  padding-bottom: 8px;
}

.mat-part-name {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
}

.mat-composition {
  font-size: 11px;
  color: var(--accent-orange);
}

.components-hierarchy {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comp-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: #161924;
  border: 1px solid var(--border-dim);
  border-radius: 2px;
}

.comp-icon {
  font-size: 14px;
}

.comp-meta {
  flex: 1;
  margin: 0 10px;
}

.comp-name {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
}

.comp-mat {
  font-size: 10px;
  color: var(--text-dim);
}

@media (max-width: 1024px) {
  .product-panel {
    max-width: 100%;
    border-left: none;
    border-top: 1px solid var(--border-dim);
  }
}
</style>
