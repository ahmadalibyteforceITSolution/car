<template>
  <section id="catalog" class="catalog-section">
    <div class="catalog-container">
      <!-- Section Header -->
      <div class="section-header">
        <div>
          <div class="header-pre">APEX COMPONENT PORTFOLIO</div>
          <h2 class="section-title">ENGINEERED OEM & MOTORSPORT SPARE PARTS</h2>
        </div>
        <p class="section-desc">
          Every component is subjected to multi-axis dynamometer testing, ultrasonic metallurgical scanning, and verified for direct bolt-on installation.
        </p>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="catalog-toolbar">
        <div class="category-pills">
          <button 
            class="filter-pill" 
            :class="{ active: selectedCategory === 'all' }"
            @click="setCategory('all')"
          >
            ALL COMPONENTS ({{ parts.length }})
          </button>
          <button 
            v-for="cat in categories" 
            :key="cat"
            class="filter-pill" 
            :class="{ active: selectedCategory === cat }"
            @click="setCategory(cat)"
          >
            {{ cat.toUpperCase() }}
          </button>
        </div>

        <div class="catalog-search">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search SKU, Part Name, Material..."
          />
        </div>
      </div>

      <!-- Parts Grid -->
      <div class="parts-grid">
        <div 
          v-for="item in filteredParts" 
          :key="item.id"
          class="part-card"
          :class="{ 'card-active-3d': currentPartId === item.id }"
        >
          <div class="card-header">
            <span class="tech-badge">{{ item.badge }}</span>
            <span class="stock-indicator font-mono">
              <span class="dot"></span>
              {{ item.inStock }} IN STOCK
            </span>
          </div>

          <div class="card-body">
            <div class="sku-row font-mono">{{ item.sku }}</div>
            <h3 class="item-name">{{ item.name }}</h3>
            <div class="oem-ref-row">
              <span class="oem-lbl">OEM:</span>
              <span class="oem-txt font-mono">{{ item.oemRef }}</span>
            </div>

            <!-- Specs Grid -->
            <div class="item-specs">
              <div class="spec-col">
                <span class="spec-l">WEIGHT</span>
                <span class="spec-v font-mono">{{ formatWeight(item.weightKg, unit) }}</span>
              </div>
              <div class="spec-col">
                <span class="spec-l">CATEGORY</span>
                <span class="spec-v">{{ item.shortCategory }}</span>
              </div>
              <div class="spec-col">
                <span class="spec-l">LEAD TIME</span>
                <span class="spec-v">READY</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <div class="item-price">
              <span class="price-val">{{ formatPrice(item.price) }}</span>
              <span class="price-lbl">NET EX-WORKS</span>
            </div>
            <div class="footer-actions">
              <button 
                class="btn-secondary inspect-btn"
                @click="inspectIn3D(item)"
              >
                <span>3D WORKBENCH</span>
                <span class="cube-icon">🧊</span>
              </button>
              <button 
                class="btn-primary buy-btn"
                @click="onAddToCart(item)"
              >
                + ORDER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formatCurrency, formatWeight } from '../utils/formatters.js';
import { sound } from '../utils/audio.js';

const props = defineProps({
  parts: { type: Array, required: true },
  currentPartId: { type: String, required: true },
  currency: { type: String, default: 'USD' },
  unit: { type: String, default: 'metric' }
});

const emit = defineEmits(['select:part', 'add:cart']);

const selectedCategory = ref('all');
const searchQuery = ref('');

const categories = computed(() => {
  const set = new Set(props.parts.map(p => p.shortCategory));
  return Array.from(set);
});

const filteredParts = computed(() => {
  return props.parts.filter(p => {
    const matchCat = selectedCategory.value === 'all' || p.shortCategory === selectedCategory.value;
    const q = searchQuery.value.toLowerCase().trim();
    const matchSearch = !q || 
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.oemRef.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
});

const formatPrice = (amt) => formatCurrency(amt, props.currency);

const setCategory = (cat) => {
  sound.playClick();
  selectedCategory.value = cat;
};

const inspectIn3D = (part) => {
  sound.playClick();
  emit('select:part', part);
  const el = document.getElementById('workbench');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const onAddToCart = (part) => {
  sound.playSuccessChime();
  emit('add:cart', { part, quantity: 1 });
};
</script>

<style scoped>
.catalog-section {
  background: #090b10;
  border-top: 1px solid var(--border-dim);
  padding: 64px 20px;
}

.catalog-container {
  max-width: 1480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  border-bottom: 1px solid var(--border-dim);
  padding-bottom: 20px;
  flex-wrap: wrap;
}

.header-pre {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--accent-orange);
  letter-spacing: 0.1em;
}

.section-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.05em;
  margin-top: 4px;
}

.section-desc {
  max-width: 520px;
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}

.catalog-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.category-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-pill {
  background: #11141c;
  border: 1px solid var(--border-dim);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 8px 14px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-pill:hover {
  border-color: var(--border-bright);
  color: #ffffff;
}

.filter-pill.active {
  background: #181d2a;
  border-color: var(--accent-orange);
  color: #ffffff;
}

.catalog-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #11141c;
  border: 1px solid var(--border-dim);
  padding: 8px 14px;
  border-radius: 2px;
  min-width: 280px;
}

.catalog-search input {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-family: var(--font-body);
  font-size: 13px;
  width: 100%;
}

.parts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.part-card {
  background: #12151f;
  border: 1px solid var(--border-dim);
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  transition: all 0.25s ease;
}

.part-card:hover {
  border-color: var(--border-bright);
  background: #161a26;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.card-active-3d {
  border-color: var(--accent-orange) !important;
  box-shadow: 0 0 20px rgba(255, 77, 0, 0.15) !important;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stock-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--accent-green);
}

.stock-indicator .dot {
  width: 6px;
  height: 6px;
  background: var(--accent-green);
  border-radius: 50%;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sku-row {
  font-size: 11px;
  color: var(--text-dim);
}

.item-name {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}

.oem-ref-row {
  display: flex;
  gap: 6px;
  font-size: 11px;
}

.oem-lbl {
  color: var(--text-dim);
}

.oem-txt {
  color: var(--accent-orange);
}

.item-specs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: #0d0f16;
  padding: 10px;
  border-radius: 2px;
  margin-top: 6px;
}

.spec-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.spec-l {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
}

.spec-v {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-dim);
  padding-top: 14px;
}

.item-price {
  display: flex;
  flex-direction: column;
}

.price-val {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
}

.price-lbl {
  font-family: var(--font-mono);
  font-size: 8px;
  color: var(--text-dim);
}

.footer-actions {
  display: flex;
  gap: 8px;
}

.inspect-btn {
  padding: 6px 10px;
  font-size: 11px;
}

.buy-btn {
  padding: 6px 12px;
  font-size: 11px;
}
</style>
