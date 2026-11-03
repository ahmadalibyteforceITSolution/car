<template>
  <header class="site-header">
    <!-- Top Engineering Status Bar (Responsive) -->
    <div class="top-bar">
      <div class="top-bar-inner">
        <div class="status-indicator">
          <span class="live-dot"></span>
          <span class="status-label desktop-only">GLOBAL ENGINEERING NETWORK</span>
          <span class="divider desktop-only">/</span>
          <span class="hub-text">HUB: MUNICH DE <span class="desktop-only">(LEIPZIG LOGISTICS ONLINE)</span></span>
        </div>

        <div class="top-bar-actions desktop-only">
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

        <!-- Mobile Sound Shortcut on Top Bar -->
        <div class="mobile-top-actions mobile-only">
          <button class="sound-toggle-micro" @click="toggleSound">
            <span>{{ isMuted ? '🔇' : '🔊' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="main-nav">
      <div class="nav-container">
        <!-- Brand Logo -->
        <div class="brand" @click="onBrandClick">
          <div class="logo-mark">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#ff4d00" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
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
            <div class="brand-subtitle desktop-tablet-only">OEM & MOTORSPORT ENGINEERING</div>
          </div>
        </div>

        <!-- Desktop Vehicle Fitment Pill -->
        <div class="vehicle-selector-pill desktop-only" @click="$emit('open:vehicleModal')">
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

        <!-- Tablet / Mobile Compact Vehicle Trigger -->
        <button 
          class="vehicle-pill-compact tablet-mobile-only" 
          @click="$emit('open:vehicleModal')"
          :title="selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'Select Vehicle'"
        >
          <span class="v-icon">🏎️</span>
          <span class="v-name" v-if="selectedVehicle">
            {{ selectedVehicle.make }} {{ selectedVehicle.model.split(' ')[0] }}
          </span>
          <span class="v-name" v-else>SELECT CAR</span>
          <span class="v-status-dot" :class="isCompatible ? 'dot-green' : 'dot-orange'"></span>
        </button>

        <!-- Right Action Cluster -->
        <div class="nav-right">
          <!-- Desktop Nav Links -->
          <nav class="nav-links desktop-only">
            <a href="#workbench" class="nav-link active">3D WORKBENCH</a>
            <a href="#catalog" class="nav-link">PARTS CATALOG</a>
            <a href="#specs" class="nav-link">TECH SPECS</a>
          </nav>

          <!-- Shopping Cart Trigger (Visible on ALL devices) -->
          <button class="cart-btn" @click="$emit('open:cart')" aria-label="Open Order Tray">
            <span class="cart-icon">🛒</span>
            <span class="cart-label desktop-only">ORDER TRAY</span>
            <span class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</span>
          </button>

          <!-- Mobile Hamburger Toggle Button -->
          <button 
            class="hamburger-btn mobile-tablet-only" 
            :class="{ 'is-active': isMobileMenuOpen }"
            @click="toggleMobileMenu"
            aria-label="Toggle navigation menu"
          >
            <span class="ham-line"></span>
            <span class="ham-line"></span>
            <span class="ham-line"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Slideout Navigation Drawer -->
    <transition name="drawer-fade">
      <div v-if="isMobileMenuOpen" class="mobile-drawer-backdrop" @click="closeMobileMenu">
        <div class="mobile-drawer-panel" @click.stop>
          <div class="mobile-drawer-header">
            <div class="mobile-drawer-brand">
              <span class="tech-badge">APEX PORTAL</span>
              <span class="m-version font-mono">v2.4 MOBILE</span>
            </div>
            <button class="mobile-close-btn" @click="closeMobileMenu">✕</button>
          </div>

          <div class="mobile-drawer-body">
            <!-- Mobile Vehicle Selector Card -->
            <div class="mobile-vehicle-card" @click="handleMobileVehicleClick">
              <div class="m-vc-top">
                <span class="m-vc-icon">🏎️</span>
                <span class="m-vc-badge" :class="isCompatible ? 'badge-verified' : 'badge-check'">
                  {{ isCompatible ? '✓ DIRECT FIT' : '⚠ VERIFY' }}
                </span>
              </div>
              <div class="m-vc-label">ACTIVE VEHICLE PLATFORM</div>
              <div class="m-vc-title" v-if="selectedVehicle">
                {{ selectedVehicle.year }} {{ selectedVehicle.make }} {{ selectedVehicle.model }}
              </div>
              <div class="m-vc-title text-dim" v-else>
                No Vehicle Selected
              </div>
              <div class="m-vc-engine font-mono" v-if="selectedVehicle">
                {{ selectedVehicle.engine }}
              </div>
              <button class="m-vc-action-btn">
                {{ selectedVehicle ? 'CHANGE VEHICLE PLATFORM ➔' : 'CONFIGURE VEHICLE ➔' }}
              </button>
            </div>

            <!-- Mobile Nav Navigation Links -->
            <div class="mobile-nav-section">
              <div class="mobile-sec-label">NAVIGATION</div>
              <nav class="mobile-nav-links">
                <a href="#workbench" class="mobile-nav-item" @click="onMobileLinkClick">
                  <span class="m-icon">🧊</span>
                  <div class="m-text">
                    <span class="m-title">3D CAD WORKBENCH</span>
                    <span class="m-sub">Interactive explosion, shaders & turntable</span>
                  </div>
                  <span class="m-arrow">›</span>
                </a>
                <a href="#catalog" class="mobile-nav-item" @click="onMobileLinkClick">
                  <span class="m-icon">📦</span>
                  <div class="m-text">
                    <span class="m-title">PARTS CATALOG</span>
                    <span class="m-sub">OEM cross-references & pricing</span>
                  </div>
                  <span class="m-arrow">›</span>
                </a>
                <a href="#specs" class="mobile-nav-item" @click="onMobileLinkClick">
                  <span class="m-icon">📊</span>
                  <div class="m-text">
                    <span class="m-title">METALLURGY & SPECS</span>
                    <span class="m-sub">TÜV / FIA certification parameters</span>
                  </div>
                  <span class="m-arrow">›</span>
                </a>
              </nav>
            </div>

            <!-- Mobile Preferences: Currency & Units -->
            <div class="mobile-preferences-section">
              <div class="mobile-sec-label">ENGINEERING PREFERENCES</div>

              <!-- Currency selector pills -->
              <div class="m-pref-row">
                <span class="m-pref-lbl">CURRENCY:</span>
                <div class="m-pref-pills">
                  <button 
                    v-for="curr in ['USD', 'EUR', 'GBP', 'JPY']" 
                    :key="curr"
                    class="m-pill-btn"
                    :class="{ active: currentCurrency === curr }"
                    @click="setCurrency(curr)"
                  >
                    {{ curr }}
                  </button>
                </div>
              </div>

              <!-- Unit measurement selector -->
              <div class="m-pref-row">
                <span class="m-pref-lbl">UNITS:</span>
                <div class="m-pref-pills">
                  <button 
                    class="m-pill-btn"
                    :class="{ active: currentUnit === 'metric' }"
                    @click="setUnit('metric')"
                  >
                    METRIC (MM/KG)
                  </button>
                  <button 
                    class="m-pill-btn"
                    :class="{ active: currentUnit === 'imperial' }"
                    @click="setUnit('imperial')"
                  >
                    IMPERIAL (IN/LBS)
                  </button>
                </div>
              </div>

              <!-- Audio FX Toggle -->
              <div class="m-pref-row">
                <span class="m-pref-lbl">SOUND EFFECTS:</span>
                <button class="m-sound-btn" :class="{ active: !isMuted }" @click="toggleSound">
                  <span>{{ isMuted ? '🔇 AUDIO DISABLED' : '🔊 AUDIO ENABLED' }}</span>
                </button>
              </div>
            </div>

            <!-- Mobile Logistics Status -->
            <div class="mobile-hub-status">
              <span class="live-dot"></span>
              <span class="font-mono">LEIPZIG & MUNICH HUBS: READY FOR DISPATCH</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
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
const isMobileMenuOpen = ref(false);

const setUnit = (val) => {
  currentUnit.value = val;
  sound.playClick();
  emit('update:unit', val);
};

const setCurrency = (val) => {
  currentCurrency.value = val;
  sound.playClick();
  emit('update:currency', val);
};

const toggleSound = () => {
  isMuted.value = sound.toggleMute();
  if (!isMuted.value) {
    sound.playClick();
  }
};

const toggleMobileMenu = () => {
  sound.playClick();
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = '';
};

const handleMobileVehicleClick = () => {
  closeMobileMenu();
  emit('open:vehicleModal');
};

const onMobileLinkClick = () => {
  sound.playClick();
  closeMobileMenu();
};

const onBrandClick = () => {
  sound.playClick();
  closeMobileMenu();
  emit('nav:home');
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

/* ---------------- Top Status Bar ---------------- */
.top-bar {
  background: #060709;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 5px 0;
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
  flex-shrink: 0;
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
  font-size: 10px;
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
  transition: all 0.2s;
}

.sound-toggle-btn:hover {
  border-color: var(--accent-orange);
  color: var(--text-main);
}

.sound-toggle-micro {
  background: #151822;
  border: 1px solid var(--border-dim);
  border-radius: 2px;
  padding: 2px 6px;
  font-size: 11px;
  cursor: pointer;
}

/* ---------------- Main Navigation Bar ---------------- */
.main-nav {
  background: rgba(14, 16, 21, 0.96);
  backdrop-filter: blur(14px);
  padding: 10px 0;
}

.nav-container {
  max-width: 1480px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  text-decoration: none;
  user-select: none;
  flex-shrink: 0;
}

.logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Desktop Vehicle Pill */
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

/* Tablet / Mobile Compact Vehicle Pill */
.vehicle-pill-compact {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #141722;
  border: 1px solid var(--border-bright);
  padding: 6px 10px;
  border-radius: 3px;
  cursor: pointer;
  color: #ffffff;
  font-family: var(--font-mono);
  font-size: 11px;
  max-width: 170px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vehicle-pill-compact:hover {
  border-color: var(--accent-orange);
}

.v-icon {
  font-size: 13px;
}

.v-name {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
}

.v-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-green {
  background: var(--accent-green);
  box-shadow: 0 0 6px var(--accent-green);
}

.dot-orange {
  background: var(--accent-orange);
  box-shadow: 0 0 6px var(--accent-orange);
}

/* Right Navigation Elements */
.nav-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 18px;
}

.nav-link {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.15s ease;
  white-space: nowrap;
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
  flex-shrink: 0;
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

/* Hamburger Toggle Button */
.hamburger-btn {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 38px;
  height: 36px;
  background: #141722;
  border: 1px solid var(--border-bright);
  border-radius: 3px;
  padding: 7px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hamburger-btn:hover {
  border-color: var(--accent-orange);
}

.ham-line {
  display: block;
  width: 100%;
  height: 2px;
  background-color: #ffffff;
  border-radius: 1px;
  transition: all 0.3s ease;
}

.hamburger-btn.is-active .ham-line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger-btn.is-active .ham-line:nth-child(2) {
  opacity: 0;
}

.hamburger-btn.is-active .ham-line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* ---------------- Mobile Drawer ---------------- */
.mobile-drawer-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(4, 5, 8, 0.85);
  backdrop-filter: blur(8px);
  z-index: 250;
  display: flex;
  justify-content: flex-end;
}

.mobile-drawer-panel {
  background: #10131c;
  border-left: 1px solid var(--border-bright);
  width: 100%;
  max-width: 380px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -12px 0 40px rgba(0, 0, 0, 0.85);
  animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.25s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.mobile-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  background: #0d0f15;
  border-bottom: 1px solid var(--border-dim);
}

.mobile-drawer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.m-version {
  font-size: 10px;
  color: var(--text-dim);
}

.mobile-close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
}

.mobile-close-btn:hover {
  color: #ffffff;
}

.mobile-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Mobile Vehicle Selector Card */
.mobile-vehicle-card {
  background: #141824;
  border: 1px solid var(--border-bright);
  border-radius: 4px;
  padding: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.2s ease;
}

.mobile-vehicle-card:hover {
  border-color: var(--accent-orange);
  background: #181d2c;
}

.m-vc-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.m-vc-icon {
  font-size: 20px;
}

.m-vc-badge {
  font-family: var(--font-mono);
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 2px;
}

.m-vc-label {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
  letter-spacing: 0.08em;
}

.m-vc-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
}

.m-vc-engine {
  font-size: 11px;
  color: var(--text-dim);
}

.m-vc-action-btn {
  background: #1d2232;
  border: 1px solid var(--border-dim);
  color: var(--accent-orange);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  padding: 8px 12px;
  border-radius: 2px;
  margin-top: 6px;
  text-align: center;
  cursor: pointer;
}

/* Mobile Nav Links */
.mobile-nav-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mobile-sec-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--accent-orange);
  letter-spacing: 0.1em;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #131620;
  border: 1px solid var(--border-dim);
  border-radius: 3px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.mobile-nav-item:hover {
  background: #1a1e2d;
  border-color: var(--border-bright);
}

.m-icon {
  font-size: 20px;
}

.m-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.m-title {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.05em;
}

.m-sub {
  font-size: 11px;
  color: var(--text-dim);
}

.m-arrow {
  color: var(--text-dim);
  font-size: 18px;
}

/* Mobile Preferences */
.mobile-preferences-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #0d0f16;
  padding: 16px;
  border: 1px solid var(--border-dim);
  border-radius: 4px;
}

.m-pref-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.m-pref-lbl {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
}

.m-pref-pills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.m-pill-btn {
  background: #161924;
  border: 1px solid var(--border-dim);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 6px 12px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.m-pill-btn.active {
  background: #23293c;
  border-color: var(--accent-cyan);
  color: #ffffff;
  font-weight: 700;
}

.m-sound-btn {
  background: #161924;
  border: 1px solid var(--border-dim);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 8px 12px;
  border-radius: 2px;
  cursor: pointer;
  text-align: left;
}

.m-sound-btn.active {
  border-color: var(--accent-orange);
  color: #ffffff;
}

.mobile-hub-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: var(--text-dim);
  padding: 10px 0;
  border-top: 1px solid var(--border-dim);
}

/* ---------------- Breakpoints & Media Queries ---------------- */
.desktop-only {
  display: flex;
}

.desktop-tablet-only {
  display: block;
}

.tablet-mobile-only {
  display: none;
}

.mobile-tablet-only {
  display: none;
}

.mobile-only {
  display: none;
}

/* Tablet Breakpoint (<= 1024px) */
@media (max-width: 1024px) {
  .desktop-only {
    display: none !important;
  }
  .tablet-mobile-only {
    display: flex !important;
  }
  .mobile-tablet-only {
    display: flex !important;
  }
}

/* Mobile Breakpoint (<= 640px) */
@media (max-width: 640px) {
  .desktop-tablet-only {
    display: none !important;
  }
  .mobile-only {
    display: flex !important;
  }
  .nav-container {
    padding: 0 14px;
    gap: 10px;
  }
  .brand-title {
    font-size: 17px;
  }
  .vehicle-pill-compact {
    max-width: 130px;
    padding: 4px 8px;
    font-size: 10px;
  }
  .cart-btn {
    padding: 6px 10px;
  }
}

/* Extra small screens (<= 380px) */
@media (max-width: 380px) {
  .vehicle-pill-compact {
    display: none !important;
  }
}
</style>
