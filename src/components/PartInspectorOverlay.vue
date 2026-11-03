<template>
  <div class="inspector-dock">
    <!-- Top Part Selector Tabs (Horizontal Scrollable on Mobile) -->
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
          <div class="part-tab-sku desktop-tablet-only">{{ part.sku }}</div>
        </div>
      </button>
    </div>

    <!-- Bottom Controls HUD Bar with Mobile Collapse Toggle -->
    <div class="hud-container">
      <!-- Mobile HUD Toggle Button -->
      <button class="mobile-hud-toggle" @click="isHudExpanded = !isHudExpanded">
        <span>⚙️ 3D CONTROLS ({{ Math.round(explodeValue * 100) }}% EXPLODE)</span>
        <span class="toggle-arrow">{{ isHudExpanded ? '▼' : '▲' }}</span>
      </button>

      <div class="controls-hud" :class="{ 'hud-collapsed': !isHudExpanded }">
        <!-- 1. Exploded View Slider -->
        <div class="hud-control-group explode-group">
          <div class="control-header">
            <span class="control-label">EXPLOSION</span>
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
            <span class="control-label">SHADER</span>
          </div>
          <div class="btn-group">
            <button 
              class="mode-btn" 
              :class="{ active: viewMode === 'studio' }"
              @click="setViewMode('studio')"
            >
              PBR
            </button>
            <button 
              class="mode-btn" 
              :class="{ active: viewMode === 'wireframe' }"
              @click="setViewMode('wireframe')"
            >
              WIRE
            </button>
            <button 
              class="mode-btn" 
              :class="{ active: viewMode === 'thermal' }"
              @click="setViewMode('thermal')"
            >
              FEA
            </button>
          </div>
        </div>

        <!-- 3. Camera Presets -->
        <div class="hud-control-group desktop-tablet-only">
          <div class="control-header">
            <span class="control-label">CAMERA</span>
          </div>
          <div class="btn-group">
            <button class="mode-btn" @click="setCamera('iso')">ISO</button>
            <button class="mode-btn" @click="setCamera('front')">FRONT</button>
            <button class="mode-btn" @click="setCamera('side')">SIDE</button>
            <button class="mode-btn" @click="setCamera('top')">TOP</button>
          </div>
        </div>

        <!-- 4. Turntable Auto-Rotate -->
        <div class="hud-control-group toggle-group">
          <div class="control-header">
            <span class="control-label">SPIN</span>
          </div>
          <button 
            class="turntable-btn"
            :class="{ active: isAutoRotating }"
            @click="toggleTurntable"
          >
            <span class="spin-icon" :class="{ spinning: isAutoRotating }">🔄</span>
            <span class="desktop-only">{{ isAutoRotating ? 'ROTATING' : 'PAUSED' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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

const isHudExpanded = ref(true);

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
  padding: 12px 14px;
  z-index: 10;
}

/* Part Tabs Bar */
.part-selector-bar {
  pointer-events: auto;
  align-self: center;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(14, 16, 22, 0.92);
  border: 1px solid var(--border-bright);
  padding: 4px;
  border-radius: 4px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  max-width: 98%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.part-tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid transparent;
  padding: 6px 10px;
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
  font-size: 15px;
}

.part-tab-info {
  text-align: left;
}

.part-tab-title {
  font-family: var(--font-display);
  font-size: 12px;
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

/* HUD Container */
.hud-container {
  pointer-events: auto;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 98%;
  gap: 4px;
}

.mobile-hud-toggle {
  display: none;
  background: rgba(14, 16, 22, 0.9);
  border: 1px solid var(--border-bright);
  color: var(--text-main);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  gap: 6px;
}

/* Bottom Controls HUD */
.controls-hud {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(14, 16, 22, 0.94);
  border: 1px solid var(--border-bright);
  padding: 10px 16px;
  border-radius: 4px;
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.7);
  flex-wrap: wrap;
  justify-content: center;
  transition: all 0.25s ease;
}

.hud-control-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.explode-group {
  min-width: 200px;
}

.control-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 9px;
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
  gap: 8px;
}

.explode-presets {
  display: flex;
  gap: 3px;
}

.preset-btn {
  background: #171b26;
  border: 1px solid var(--border-dim);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 9px;
  padding: 3px 5px;
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
  gap: 3px;
}

.mode-btn {
  background: #171b26;
  border: 1px solid var(--border-dim);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 600;
  padding: 5px 8px;
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
  gap: 5px;
  background: #171b26;
  border: 1px solid var(--border-dim);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 600;
  padding: 5px 8px;
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

@media (max-width: 640px) {
  .mobile-hud-toggle {
    display: inline-flex;
  }
  .controls-hud.hud-collapsed {
    display: none;
  }
  .controls-hud {
    gap: 8px;
    padding: 8px 12px;
  }
  .explode-group {
    min-width: 100%;
  }
}
</style>
