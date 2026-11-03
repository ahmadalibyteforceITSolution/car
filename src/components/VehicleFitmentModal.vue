<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="fitment-modal-card">
      <div class="modal-header">
        <div class="header-left">
          <span class="tech-badge">OEM VEHICLE FITMENT SELECTOR</span>
          <h2 class="modal-title">Select Your Vehicle Platform</h2>
        </div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <p class="modal-intro">
          Verify 100% bolt-on compatibility with your chassis, hub pilot diameter, caliper radial mounts, and drivetrain specifications.
        </p>

        <!-- Vehicle Search Input -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search by Make, Model, Chassis (e.g. GT3, G80, RS6, Supra, R35)..."
          />
        </div>

        <!-- Vehicle Cards Grid -->
        <div class="vehicles-grid">
          <div 
            v-for="v in filteredVehicles" 
            :key="v.id"
            class="vehicle-card"
            :class="{ active: currentSelectedId === v.id }"
            @click="onSelect(v)"
          >
            <div class="card-top">
              <div class="car-name">
                <span class="car-year">{{ v.year }}</span>
                {{ v.make }} {{ v.model }}
              </div>
              <span class="chassis-pill font-mono">{{ v.chassis }}</span>
            </div>

            <div class="car-engine font-mono">
              {{ v.engine }}
            </div>

            <div class="car-specs-row">
              <span class="spec-chip">PCD: {{ v.oemPCD }}</span>
              <span class="spec-chip">TRIM: {{ v.trim }}</span>
            </div>

            <div class="card-footer">
              <span class="fitment-status">
                <span class="status-dot"></span>
                {{ v.compatibleParts.length }} MATCHING APEX COMPONENTS
              </span>
              <button class="select-btn">
                {{ currentSelectedId === v.id ? 'SELECTED' : 'SELECT VEHICLE' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { VEHICLES_DATABASE } from '../data/vehiclesData.js';
import { sound } from '../utils/audio.js';

const props = defineProps({
  selectedVehicleId: { type: String, default: null }
});

const emit = defineEmits(['close', 'select:vehicle']);

const searchQuery = ref('');
const currentSelectedId = ref(props.selectedVehicleId);

const filteredVehicles = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return VEHICLES_DATABASE;
  return VEHICLES_DATABASE.filter(v => 
    v.make.toLowerCase().includes(q) ||
    v.model.toLowerCase().includes(q) ||
    v.chassis.toLowerCase().includes(q) ||
    v.engine.toLowerCase().includes(q)
  );
});

const onSelect = (v) => {
  currentSelectedId.value = v.id;
  sound.playClick();
  emit('select:vehicle', v);
  emit('close');
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(4, 5, 8, 0.85);
  backdrop-filter: blur(8px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.fitment-modal-card {
  background: #11141c;
  border: 1px solid var(--border-bright);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8);
  max-width: 780px;
  width: 100%;
  border-radius: 4px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  background: #0d0f15;
  border-bottom: 1px solid var(--border-dim);
}

.modal-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
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

.modal-body {
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-intro {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #0b0c10;
  border: 1px solid var(--border-bright);
  padding: 10px 14px;
  border-radius: 3px;
}

.search-box input {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 13px;
  width: 100%;
  font-family: var(--font-body);
}

.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.vehicle-card {
  background: #141722;
  border: 1px solid var(--border-dim);
  padding: 14px;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s ease;
}

.vehicle-card:hover {
  border-color: var(--accent-orange);
  background: #1a1e2d;
  transform: translateY(-1px);
}

.vehicle-card.active {
  border-color: var(--accent-green);
  background: #152220;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.car-name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
}

.car-year {
  color: var(--accent-orange);
}

.chassis-pill {
  font-size: 10px;
  background: #0c0e14;
  padding: 2px 6px;
  border-radius: 2px;
  color: var(--text-muted);
  border: 1px solid var(--border-dim);
}

.car-engine {
  font-size: 11px;
  color: var(--text-dim);
}

.car-specs-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.spec-chip {
  font-family: var(--font-mono);
  font-size: 9px;
  background: #1c202d;
  padding: 2px 6px;
  border-radius: 2px;
  color: var(--text-muted);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 8px;
}

.fitment-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--accent-green);
}

.status-dot {
  width: 5px;
  height: 5px;
  background: var(--accent-green);
  border-radius: 50%;
}

.select-btn {
  background: #1d2230;
  border: 1px solid var(--border-bright);
  color: #ffffff;
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 2px;
}

@media (max-width: 680px) {
  .vehicles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
