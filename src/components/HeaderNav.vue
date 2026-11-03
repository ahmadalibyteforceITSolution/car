<template>
  <header class="site-header">
    <!-- Top Engineering Status Bar -->
    <div class="top-bar">
      <div class="top-bar-inner">
        <div class="status-indicator">
          <span class="live-dot"></span>
          <span class="status-label">GLOBAL ENGINEERING NETWORK</span>
          <span class="divider">/</span>
          <span class="hub-text">HUB: MUNICH DE (LEIPZIG LOGISTICS ONLINE)</span>
        </div>
        <div class="top-bar-actions">
          <!-- Currency Selector -->
          <div class="selector-group">
            <span class="selector-label">CURRENCY:</span>
            <select v-model="currentCurrency" @change="$emit('update:currency', currentCurrency)">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          <!-- Unit Selector -->
          <div class="selector-group">
            <span class="selector-label">UNITS:</span>
            <button 
              class="unit-btn" 
              :class="{ active: currentUnit === 'metric' }"
              @click="setUnit('metric')"
            >
              METRIC (MM/KG)
            </button>
            <span class="unit-pipe">|</span>
            <button 
              class="unit-btn" 
              :class="{ active: currentUnit === 'imperial' }"
              @click="setUnit('imperial')"
            >
              IMPERIAL (IN/LBS)
            </button>
          </div>

          <!-- Sound Toggle -->
          <button class="sound-toggle-btn" @click="toggleSound" :title="isMuted ? 'Unmute Audio' : 'Mute Audio'">
            <span class="sound-icon">{{ isMuted ? '🔇' : '🔊' }}</span>
            <span class="sound-text">{{ isMuted ? 'FX OFF' : 'FX ON' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="main-nav">
      <div class="nav-container">
        <!-- Brand Logo -->
        <div class="brand" @click="$emit('nav:home')">
          <div class="logo-mark">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#ff4d00" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="4"/>
              <path d="m4.93 4.93 4.24 4.24"/>
              <path d="m14.83 14.83 4.24 4.24"/>
              <path d="m14.83 9.17 4.24-4.24"/>
              <path d="m4.93 19.07 4.24-4.24"/>
            </svg>
          </div>
          <div class="brand-text">
            <div class="brand-title">APEX <span class="brand-accent">DYNAMICS</span></div>
            <div class="brand-subtitle">OEM & MOTORSPORT ENGINEERING</div>
          </div>
        </div>

        <!-- Vehicle Fitment Bar (Real-world automotive feature) -->
        <div class="vehicle-selector-pill" @click="$emit('open:vehicleModal')">
          <div class="pill-icon">🏎️</div>
          <div class="pill-content">
            <div class="pill-label">COMPATIBILITY CHECKER</div>
            <div class="pill-car" v-if="selectedVehicle">
              {{ selectedVehicle.year }} {{ selectedVehicle.make }} {{ selectedVehicle.model }}
              <span class="chassis-tag">[{{ selectedVehicle.chassis }}]</span>
            </div>
            <div class="pill-placeholder" v-else>
              Select Your Vehicle for Guaranteed Fitment
            </div>
          </div>
          <div class="pill-badge" :class="isCompatible ? 'badge-verified' : 'badge-check'">
            {{ selectedVehicle ? (isCompatible ? '✓ DIRECT FIT' : '⚠ VERIFY FIT') : 'CONFIGURE +' }}
          </div>
        </div>

        <!-- Quick Nav Links & Cart -->
        <div class="nav-right">
          <nav class="nav-links">
            <a href="#workbench" class="nav-link active">3D WORKBENCH</a>
            <a href="#catalog" class="nav-link">PARTS CATALOG</a>
            <a href="#specs" class="nav-link">TECH SPECS</a>
          </nav>

          <!-- Shopping Cart Trigger -->
          <button class="cart-btn" @click="$emit('open:cart')">
            <span class="cart-icon">🛒</span>
            <span class="cart-label">ORDER TRAY</span>
            <span class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { sound } from '../utils/audio.js';

const props = defineProps({
  selectedVehicle: { type: Object, default: null },
  isCompatible: { type: Boolean, default: true },
  cartCount: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  unit: { type: String, default: 'metric' }
});

const emit = defineEmits(['update:currency', 'update:unit', 'open:vehicleModal', 'open:cart', 'nav:home']);

const currentCurrency = ref(props.currency);
const currentUnit = ref(props.unit);
const isMuted = ref(sound.isMuted);

const setUnit = (val) => {
  currentUnit.value = val;
  sound.playClick();
  emit('update:unit', val);
};

const toggleSound = () => {
  isMuted.value = sound.toggleMute();
  if (!isMuted.value) {
    sound.playClick();
  }
};
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-dim);
}

.top-bar {
  background: #060709;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 4px 0;
  font-size: 11px;
}

.top-bar-inner {
  max-width: 1480px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  color: var(--text-muted);
}

.live-dot {
  width: 7px;
  height: 7px;
  background: var(--accent-green);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent-green);
  animation: pulseGreen 2s infinite;
}

@keyframes pulseGreen {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.status-label {
  color: var(--text-muted);
  letter-spacing: 0.08em;
}

.divider {
  color: var(--border-bright);
}

.hub-text {
  color: var(--text-dim);
}

.top-bar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.selector-group {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
}

.selector-label {
  color: var(--text-dim);
  font-size: 10px;
  letter-spacing: 0.05em;
}

select {
  background: #111319;
  color: var(--text-main);
  border: 1px solid var(--border-dim);
  border-radius: 2px;
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 2px 6px;
  cursor: pointer;
  outline: none;
}

select:focus {
  border-color: var(--accent-orange);
}

.unit-btn {
  background: none;
  border: none;
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.05em;
  cursor: pointer;
  padding: 2px 4px;
  transition: color 0.15s;
}

.unit-btn.active {
  color: var(--accent-cyan);
  font-weight: 600;
}

.unit-pipe {
  color: var(--border-dim);
  font-size: 10px;
}

.sound-toggle-btn {
  background: #151822;
  border: 1px solid var(--border-dim);
  border-radius: 2px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  cursor: pointer;
}

.sound-toggle-btn:hover {
  border-color: var(--accent-orange);
  color: var(--text-main);
}

.main-nav {
  background: rgba(14, 16, 21, 0.95);
  backdrop-filter: blur(12px);
  padding: 10px 0;
}

.nav-container {
  max-width: 1480px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-decoration: none;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: #ffffff;
  line-height: 1.1;
}

.brand-accent {
  color: var(--accent-orange);
}

.brand-subtitle {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  color: var(--text-dim);
  text-transform: uppercase;
}

.vehicle-selector-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #13161f;
  border: 1px solid var(--border-bright);
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 440px;
  flex: 1;
}

.vehicle-selector-pill:hover {
  border-color: var(--accent-orange);
  background: #171b26;
  box-shadow: 0 0 16px rgba(255, 77, 0, 0.15);
}

.pill-icon {
  font-size: 16px;
}

.pill-content {
  flex: 1;
  overflow: hidden;
}

.pill-label {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.pill-car {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chassis-tag {
  color: var(--accent-orange);
  font-size: 11px;
  font-family: var(--font-mono);
  margin-left: 4px;
}

.pill-placeholder {
  font-size: 13px;
  color: var(--text-muted);
}

.pill-badge {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 2px;
  white-space: nowrap;
}

.badge-verified {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid var(--accent-green);
  color: var(--accent-green);
}

.badge-check {
  background: rgba(255, 77, 0, 0.15);
  border: 1px solid var(--accent-orange);
  color: var(--accent-orange);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.15s ease;
}

.nav-link:hover, .nav-link.active {
  color: #ffffff;
}

.cart-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-bright);
  padding: 7px 14px;
  border-radius: 3px;
  color: #ffffff;
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  position: relative;
  transition: all 0.2s ease;
}

.cart-btn:hover {
  border-color: var(--accent-orange);
  background: var(--bg-card-hover);
}

.cart-badge {
  background: var(--accent-orange);
  color: #fff;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  padding: 0 4px;
}

@media (max-width: 900px) {
  .vehicle-selector-pill {
    display: none;
  }
  .nav-links {
    display: none;
  }
}
</style>
