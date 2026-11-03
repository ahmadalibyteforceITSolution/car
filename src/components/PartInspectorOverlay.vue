<template>
  <div class="inspector-dock">
    <!-- Top Part Selector Tabs -->
    <div class="part-selector-bar">
      <button 
        v-for="part in partsList" 
        :key="part.id"
        class="part-tab-btn"
        :class="{ active: currentPartId === part.id }"
        @click="selectPart(part)"
      >
        <span class="part-tab-icon">{{ getPartIcon(part.modelType) }}</span>
        <div class="part-tab-info">
          <div class="part-tab-title">{{ part.shortCategory }}</div>
          <div class="part-tab-sku">{{ part.sku }}</div>
        </div>
      </button>
    </div>

    <!-- Bottom Controls HUD Bar -->
    <div class="controls-hud">
      <!-- 1. Exploded View Slider -->
      <div class="hud-control-group explode-group">
        <div class="control-header">
          <span class="control-label">ASSEMBLY EXPLOSION</span>
          <span class="control-value font-mono">{{ Math.round(explodeValue * 100) }}%</span>
        </div>
        <div class="slider-row">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            :value="explodeValue"
            @input="onExplodeInput"
          />
          <div class="explode-presets">
            <button class="preset-btn" :class="{ active: explodeValue === 0 }" @click="setExplode(0)">0%</button>
            <button class="preset-btn" :class="{ active: Math.abs(explodeValue - 0.5) < 0.05 }" @click="setExplode(0.5)">50%</button>
            <button class="preset-btn" :class="{ active: explodeValue === 1 }" @click="setExplode(1)">100%</button>
          </div>
        </div>
      </div>

      <!-- 2. View Mode Switcher -->
      <div class="hud-control-group">
        <div class="control-header">
          <span class="control-label">SHADER MODE</span>
        </div>
        <div class="btn-group">
          <button 
            class="mode-btn" 
            :class="{ active: viewMode === 'studio' }"
            @click="setViewMode('studio')"
            title="Real-time PBR Surface Shaders"
          >
            STUDIO PBR
          </button>
          <button 
            class="mode-btn" 
            :class="{ active: viewMode === 'wireframe' }"
            @click="setViewMode('wireframe')"
            title="CAD Technical Wireframe Blueprint"
          >
            CAD WIRE
          </button>
          <button 
            class="mode-btn" 
            :class="{ active: viewMode === 'thermal' }"
            @click="setViewMode('thermal')"
            title="FEA Thermal & Stress Heat Gradient Simulation"
          >
            FEA THERMAL
          </button>
        </div>
      </div>

      <!-- 3. Camera Presets -->
      <div class="hud-control-group">
        <div class="control-header">
          <span class="control-label">CAMERA VIEW</span>
        </div>
        <div class="btn-group">
          <button class="mode-btn" @click="setCamera('iso')">ISO 45°</button>
          <button class="mode-btn" @click="setCamera('front')">FRONT</button>
          <button class="mode-btn" @click="setCamera('side')">SIDE</button>
          <button class="mode-btn" @click="setCamera('top')">TOP</button>
        </div>
      </div>

      <!-- 4. Turntable Auto-Rotate -->
      <div class="hud-control-group toggle-group">
        <div class="control-header">
          <span class="control-label">TURNTABLE</span>
        </div>
        <button 
          class="turntable-btn"
          :class="{ active: isAutoRotating }"
          @click="toggleTurntable"
        >
          <span class="spin-icon" :class="{ spinning: isAutoRotating }">🔄</span>
          <span>{{ isAutoRotating ? 'ROTATING' : 'PAUSED' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { sound } from '../utils/audio.js';

const props = defineProps({
  partsList: { type: Array, required: true },
  currentPartId: { type: String, required: true },
  explodeValue: { type: Number, default: 0 },
  viewMode: { type: String, default: 'studio' },
  isAutoRotating: { type: Boolean, default: true }
});

const emit = defineEmits([
  'update:currentPart',
  'update:explodeValue',
  'update:viewMode',
  'update:cameraPreset',
  'update:isAutoRotating'
]);

const getPartIcon = (type) => {
  switch (type) {
    case 'brake': return '🛑';
    case 'turbo': return '🌀';
    case 'coilover': return '🔩';
    case 'wheel': return '🛞';
    default: return '⚙️';
  }
};

const selectPart = (part) => {
  sound.playClick();
  emit('update:currentPart', part);
};

const onExplodeInput = (e) => {
  const val = parseFloat(e.target.value);
  sound.playRatchetTick();
  emit('update:explodeValue', val);
};

const setExplode = (val) => {
  sound.playPneumaticWoosh(val > props.explodeValue);
  emit('update:explodeValue', val);
};

const setViewMode = (mode) => {
  sound.playClick();
  emit('update:viewMode', mode);
};

const setCamera = (preset) => {
  sound.playClick();
  emit('update:cameraPreset', preset);
};

const toggleTurntable = () => {
  sound.playClick();
  emit('update:isAutoRotating', !props.isAutoRotating);
};
</script>

<style scoped>
.inspector-dock {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 20px;
}

/* Part Tabs Bar */
.part-selector-bar {
  pointer-events: auto;
  align-self: center;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(14, 16, 22, 0.88);
  border: 1px solid var(--border-bright);
  padding: 6px;
  border-radius: 4px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  max-width: 95%;
  overflow-x: auto;
}

.part-tab-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: 1px solid transparent;
  padding: 7px 14px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.part-tab-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--border-bright);
}

.part-tab-btn.active {
  background: #1b1f2b;
  border-color: var(--accent-orange);
  box-shadow: inset 0 0 12px rgba(255, 77, 0, 0.2);
}

.part-tab-icon {
  font-size: 16px;
}

.part-tab-info {
  text-align: left;
}

.part-tab-title {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.05em;
  line-height: 1.1;
}

.part-tab-sku {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
}

.part-tab-btn.active .part-tab-sku {
  color: var(--accent-orange);
}

/* Bottom Controls HUD */
.controls-hud {
  pointer-events: auto;
  align-self: center;
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(14, 16, 22, 0.92);
  border: 1px solid var(--border-bright);
  padding: 12px 20px;
  border-radius: 4px;
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.7);
  max-width: 95%;
  flex-wrap: wrap;
  justify-content: center;
}

.hud-control-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.explode-group {
  min-width: 240px;
}

.control-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 10px;
}

.control-label {
  color: var(--text-dim);
  letter-spacing: 0.08em;
}

.control-value {
  color: var(--accent-orange);
  font-weight: 700;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.explode-presets {
  display: flex;
  gap: 4px;
}

.preset-btn {
  background: #171b26;
  border: 1px solid var(--border-dim);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 9px;
  padding: 3px 6px;
  border-radius: 2px;
  cursor: pointer;
}

.preset-btn:hover, .preset-btn.active {
  border-color: var(--accent-orange);
  color: #fff;
  background: #23293a;
}

.btn-group {
  display: flex;
  gap: 4px;
}

.mode-btn {
  background: #171b26;
  border: 1px solid var(--border-dim);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 2px;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: all 0.15s ease;
}

.mode-btn:hover {
  border-color: var(--border-bright);
  color: #fff;
}

.mode-btn.active {
  background: #252b3c;
  border-color: var(--accent-orange);
  color: var(--accent-orange);
}

.turntable-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #171b26;
  border: 1px solid var(--border-dim);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.turntable-btn:hover {
  border-color: var(--border-bright);
  color: #fff;
}

.turntable-btn.active {
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
  background: rgba(0, 229, 255, 0.08);
}

.spin-icon.spinning {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .controls-hud {
    gap: 12px;
    padding: 10px;
  }
  .explode-group {
    min-width: 100%;
  }
}
</style>
