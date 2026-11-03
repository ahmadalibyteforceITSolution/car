<template>
  <div class="app-container">
    <!-- Main Header -->
    <HeaderNav 
      :selectedVehicle="selectedVehicle"
      :isCompatible="isCurrentPartCompatible"
      :cartCount="cartItemsCount"
      :currency="currentCurrency"
      :unit="currentUnit"
      @update:currency="currentCurrency = $event"
      @update:unit="currentUnit = $event"
      @open:vehicleModal="isVehicleModalOpen = true"
      @open:cart="isCartOpen = true"
      @nav:home="scrollToTop"
    />

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- 3D Interactive Workbench Section -->
      <section id="workbench" class="workbench-section">
        <!-- 3D Interactive Viewport -->
        <div class="viewport-wrapper">
          <ThreeViewer 
            ref="threeViewerRef"
            :activePart="currentPart"
            :explodeValue="explodeValue"
            :viewMode="viewMode"
            :cameraPreset="cameraPreset"
            :isAutoRotating="isAutoRotating"
            @select:hotspot="onSelectHotspot"
          />

          <!-- Floating Inspector HUD Controls -->
          <PartInspectorOverlay 
            :partsList="partsData"
            :currentPartId="currentPart.id"
            :explodeValue="explodeValue"
            :viewMode="viewMode"
            :isAutoRotating="isAutoRotating"
            @update:currentPart="onSwitchPart"
            @update:explodeValue="explodeValue = $event"
            @update:viewMode="viewMode = $event"
            @update:cameraPreset="cameraPreset = $event"
            @update:isAutoRotating="isAutoRotating = $event"
          />
        </div>

        <!-- Right Side Product Detail & Engineering Specs Panel -->
        <ProductDetailPanel 
          :part="currentPart"
          :selectedVehicle="selectedVehicle"
          :isCompatible="isCurrentPartCompatible"
          :currency="currentCurrency"
          :unit="currentUnit"
          @add:cart="onAddToCart"
          @open:vehicleModal="isVehicleModalOpen = true"
        />
      </section>

      <!-- Full Commercial Spare Parts Catalog Grid -->
      <PartsCatalogGrid 
        :parts="partsData"
        :currentPartId="currentPart.id"
        :currency="currentCurrency"
        :unit="currentUnit"
        @select:part="onSwitchPart"
        @add:cart="onAddToCart"
      />
    </main>

    <!-- Technical Site Footer -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-col brand-col">
          <div class="f-brand">APEX <span class="brand-accent">DYNAMICS</span></div>
          <p class="f-desc">
            Precision engineering division specializing in motorsport and high-performance OEM spare parts, carbon-ceramic friction systems, twin-scroll forced induction, and race chassis dynamics.
          </p>
          <div class="cert-badges">
            <span class="tech-badge">ISO 9001:2015</span>
            <span class="tech-badge">TÜV RHEINLAND</span>
            <span class="tech-badge">FIA HOMOLOGATED</span>
          </div>
        </div>

        <div class="footer-col">
          <div class="f-title">GLOBAL WAREHOUSE HUBS</div>
          <ul class="f-list">
            <li><span>🇩🇪 Munich Logistics Central:</span> Ready</li>
            <li><span>🇯🇵 Tokyo Narita Distribution:</span> Ready</li>
            <li><span>🇺🇸 Indianapolis Motorsport Hub:</span> Ready</li>
            <li><span>🇬🇧 Silverstone Tech Corridor:</span> Ready</li>
          </ul>
        </div>

        <div class="footer-col">
          <div class="f-title">ENGINEERING SUPPORT</div>
          <ul class="f-list font-mono">
            <li>CAD STEP / IGES Export Available</li>
            <li>Billet Material Traceability EN 10204 3.1</li>
            <li>Direct Technical Desk: engineering@apex-dynamics.de</li>
            <li>Dyno & Telemetry Certification Included</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="copy-text font-mono">
          © 2026 APEX DYNAMICS OEM & MOTORSPORT GMBH. ALL RIGHTS RESERVED.
        </div>
        <div class="built-tag font-mono">
          HIGH-FIDELITY 3D SPARE PARTS PLATFORM // VUE 3 + THREE.JS
        </div>
      </div>
    </footer>

    <!-- Modals & Drawers -->
    <VehicleFitmentModal 
      v-if="isVehicleModalOpen"
      :selectedVehicleId="selectedVehicle?.id"
      @close="isVehicleModalOpen = false"
      @select:vehicle="selectedVehicle = $event"
    />

    <HotspotDetailModal 
      v-if="activeHotspot"
      :hotspot="activeHotspot"
      @close="activeHotspot = null"
    />

    <CartDrawer 
      :isOpen="isCartOpen"
      :items="cartItems"
      :currency="currentCurrency"
      :unit="currentUnit"
      @close="isCartOpen = false"
      @update:qty="onUpdateCartQty"
      @remove="onRemoveCartItem"
      @checkout="onProceedOrder"
    />

    <OrderSuccessModal 
      v-if="confirmedOrder"
      :orderData="confirmedOrder"
      :selectedVehicle="selectedVehicle"
      :currency="currentCurrency"
      @close="confirmedOrder = null"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { SPARE_PARTS_DATA } from './data/partsData.js';
import { VEHICLES_DATABASE } from './data/vehiclesData.js';
import HeaderNav from './components/HeaderNav.vue';
import ThreeViewer from './components/ThreeViewer.vue';
import PartInspectorOverlay from './components/PartInspectorOverlay.vue';
import ProductDetailPanel from './components/ProductDetailPanel.vue';
import PartsCatalogGrid from './components/PartsCatalogGrid.vue';
import VehicleFitmentModal from './components/VehicleFitmentModal.vue';
import HotspotDetailModal from './components/HotspotDetailModal.vue';
import CartDrawer from './components/CartDrawer.vue';
import OrderSuccessModal from './components/OrderSuccessModal.vue';

// Reactive Data State
const partsData = ref(SPARE_PARTS_DATA);
const currentPart = ref(SPARE_PARTS_DATA[0]);

// Default vehicle selected for realistic OEM fitment demonstration (Porsche 992 GT3)
const selectedVehicle = ref(VEHICLES_DATABASE[0]);

// 3D Viewer Controls State
const explodeValue = ref(0);
const viewMode = ref('studio');
const cameraPreset = ref('iso');
const isAutoRotating = ref(true);

const threeViewerRef = ref(null);
const activeHotspot = ref(null);

// User Preferences
const currentCurrency = ref('USD');
const currentUnit = ref('metric');

// Modals and Drawers
const isVehicleModalOpen = ref(false);
const isCartOpen = ref(false);
const confirmedOrder = ref(null);

// Shopping Cart Tray
const cartItems = ref([
  {
    part: SPARE_PARTS_DATA[0],
    quantity: 1
  }
]);

const cartItemsCount = computed(() => {
  return cartItems.value.reduce((acc, curr) => acc + curr.quantity, 0);
});

// Fitment check for the currently displayed 3D part
const isCurrentPartCompatible = computed(() => {
  if (!selectedVehicle.value) return true;
  return selectedVehicle.value.compatibleParts.includes(currentPart.value.id);
});

// Part Switching
const onSwitchPart = (part) => {
  currentPart.value = part;
  explodeValue.value = 0;
  activeHotspot.value = null;
};

const onSelectHotspot = (hs) => {
  activeHotspot.value = hs;
};

// Cart Actions
const onAddToCart = ({ part, quantity }) => {
  const existing = cartItems.value.find(item => item.part.id === part.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cartItems.value.push({ part, quantity });
  }
  isCartOpen.value = true;
};

const onUpdateCartQty = ({ partId, quantity }) => {
  const item = cartItems.value.find(i => i.part.id === partId);
  if (item) {
    item.quantity = quantity;
  }
};

const onRemoveCartItem = (partId) => {
  cartItems.value = cartItems.value.filter(i => i.part.id !== partId);
};

const onProceedOrder = (orderInfo) => {
  confirmedOrder.value = orderInfo;
  isCartOpen.value = false;
  cartItems.value = [];
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

/* 3D Workbench Section */
.workbench-section {
  display: flex;
  height: calc(100vh - 84px);
  min-height: 620px;
  max-height: 920px;
  background: #090a0d;
  border-bottom: 1px solid var(--border-dim);
}

.viewport-wrapper {
  position: relative;
  flex: 1;
  height: 100%;
  overflow: hidden;
}

/* Footer */
.site-footer {
  background: #07080b;
  border-top: 1px solid var(--border-dim);
  padding: 48px 20px 24px;
}

.footer-inner {
  max-width: 1480px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--border-dim);
}

.brand-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.f-brand {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #ffffff;
}

.f-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 480px;
}

.cert-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.f-title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.08em;
  margin-bottom: 14px;
}

.f-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.f-list li span {
  color: #ffffff;
  font-weight: 600;
}

.footer-bottom {
  max-width: 1480px;
  margin: 20px auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: var(--text-dim);
  flex-wrap: wrap;
  gap: 12px;
}

.built-tag {
  color: var(--accent-orange);
}

@media (max-width: 1024px) {
  .workbench-section {
    flex-direction: column;
    height: auto;
    max-height: none;
  }
  .viewport-wrapper {
    height: 520px;
  }
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

@media (max-width: 640px) {
  .viewport-wrapper {
    height: 420px;
  }
  .site-footer {
    padding: 32px 16px 20px;
  }
}

@media (max-width: 420px) {
  .viewport-wrapper {
    height: 360px;
  }
}
</style>
