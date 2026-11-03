<template>
  <div class="viewer-container" ref="viewerContainer">
    <!-- Three.js Canvas Container -->
    <div class="canvas-viewport" ref="canvasViewport"></div>

    <!-- Dynamic 2D Hotspot Pins (projected in real time) -->
    <div 
      v-for="hs in visibleHotspots" 
      :key="hs.id"
      class="hotspot-pin"
      :style="{ left: `${hs.screenX}px`, top: `${hs.screenY}px` }"
      @click="onPinClick(hs)"
    >
      <div class="hotspot-pulse">
        <div class="hotspot-ring"></div>
        <div class="hotspot-core"></div>
      </div>
      <div class="hotspot-tag">
        <div class="hs-name">{{ hs.name }}</div>
        <div class="hs-spec">{{ hs.spec }}</div>
      </div>
    </div>

    <!-- CAD Telemetry Overlay (corners) -->
    <div class="cad-overlay-top-left">
      <div class="cad-data-row">
        <span class="cad-label desktop-only">MODEL:</span>
        <span class="cad-val font-mono">{{ activePart?.sku }}</span>
      </div>
      <div class="cad-data-row desktop-tablet-only">
        <span class="cad-label">TOLERANCE:</span>
        <span class="cad-val">±0.005 mm ISO 2768</span>
      </div>
    </div>

    <div class="cad-overlay-bottom-left desktop-tablet-only">
      <div class="cad-hint">
        <span class="cad-hint-icon">🖱️</span>
        <span class="cad-hint-text">DRAG TO ORBIT // PIN TO INSPECT</span>
      </div>
    </div>

    <div class="cad-overlay-top-right">
      <div class="cad-telemetry-badge">
        <span class="cad-indicator"></span>
        <span class="desktop-only">CAD LIVE</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { ThreeSceneManager } from '../utils/three/sceneManager.js';
import { sound } from '../utils/audio.js';

const props = defineProps({
  activePart: { type: Object, required: true },
  explodeValue: { type: Number, default: 0 },
  viewMode: { type: String, default: 'studio' },
  cameraPreset: { type: String, default: 'iso' },
  isAutoRotating: { type: Boolean, default: true }
});

const emit = defineEmits(['select:hotspot']);

const viewerContainer = ref(null);
const canvasViewport = ref(null);
let sceneManager = null;

const hotspotCoords = ref({});
let rafCoordsId = null;

const onPinClick = (hotspot) => {
  sound.playHotspotPing();
  if (sceneManager) {
    sceneManager.focusHotspot(hotspot);
  }
  emit('select:hotspot', hotspot);
};

// Compute screen positions of hotspots dynamically
const updateHotspotPositions = () => {
  if (sceneManager && props.activePart?.hotspots) {
    const coords = {};
    for (const hs of props.activePart.hotspots) {
      const screen = sceneManager.getHotspotScreenCoords(hs);
      if (screen) {
        coords[hs.id] = screen;
      }
    }
    hotspotCoords.value = coords;
  }
  rafCoordsId = requestAnimationFrame(updateHotspotPositions);
};

const visibleHotspots = computed(() => {
  if (!props.activePart?.hotspots) return [];
  return props.activePart.hotspots
    .map((hs) => {
      const coord = hotspotCoords.value[hs.id];
      if (coord && coord.isVisible) {
        return {
          ...hs,
          screenX: coord.x,
          screenY: coord.y
        };
      }
      return null;
    })
    .filter(Boolean);
});

onMounted(() => {
  if (canvasViewport.value) {
    sceneManager = new ThreeSceneManager(canvasViewport.value);
    sceneManager.loadPart(props.activePart);
    sceneManager.isAutoRotating = props.isAutoRotating;

    updateHotspotPositions();
  }
});

onBeforeUnmount(() => {
  if (rafCoordsId) {
    cancelAnimationFrame(rafCoordsId);
  }
  if (sceneManager) {
    sceneManager.destroy();
  }
});

watch(() => props.activePart, (newPart) => {
  if (sceneManager && newPart) {
    sceneManager.loadPart(newPart);
  }
});

watch(() => props.explodeValue, (newVal) => {
  if (sceneManager) {
    sceneManager.setExplode(newVal);
  }
});

watch(() => props.viewMode, (newMode) => {
  if (sceneManager) {
    sceneManager.setViewMode(newMode);
  }
});

watch(() => props.cameraPreset, (preset) => {
  if (sceneManager) {
    sceneManager.setCameraPreset(preset);
  }
});

watch(() => props.isAutoRotating, (autoRotate) => {
  if (sceneManager) {
    sceneManager.isAutoRotating = autoRotate;
  }
});

defineExpose({
  resetCamera: () => sceneManager?.resetCameraView(),
  focusHotspot: (hs) => sceneManager?.focusHotspot(hs)
});
</script>

<style scoped>
.viewer-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 480px;
  background: #0c0d10;
  overflow: hidden;
  user-select: none;
}

.canvas-viewport {
  width: 100%;
  height: 100%;
  cursor: grab;
  touch-action: none;
}

.canvas-viewport:active {
  cursor: grabbing;
}

.hs-name {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.1;
}

.hs-spec {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--accent-orange);
}

.cad-overlay-top-left {
  position: absolute;
  top: 14px;
  left: 14px;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 5;
}

.cad-data-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  background: rgba(14, 16, 21, 0.75);
  padding: 3px 6px;
  border-left: 2px solid var(--accent-orange);
  backdrop-filter: blur(6px);
  border-radius: 2px;
}

.cad-label {
  color: var(--text-dim);
}

.cad-val {
  color: #ffffff;
  font-weight: 600;
}

.cad-overlay-bottom-left {
  position: absolute;
  bottom: 14px;
  left: 14px;
  pointer-events: none;
  z-index: 5;
}

.cad-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(14, 16, 21, 0.75);
  border: 1px solid var(--border-dim);
  padding: 4px 8px;
  border-radius: 2px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
}

.cad-overlay-top-right {
  position: absolute;
  top: 14px;
  right: 14px;
  pointer-events: none;
  z-index: 5;
}

.cad-telemetry-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(14, 16, 21, 0.8);
  border: 1px solid var(--border-bright);
  padding: 3px 8px;
  border-radius: 2px;
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--accent-cyan);
  letter-spacing: 0.08em;
}

.cad-indicator {
  width: 6px;
  height: 6px;
  background: var(--accent-cyan);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--accent-cyan);
}

@media (max-width: 640px) {
  .viewer-container {
    min-height: 380px;
  }
  .cad-overlay-top-left {
    top: 8px;
    left: 8px;
  }
  .cad-overlay-top-right {
    top: 8px;
    right: 8px;
  }
  .hotspot-tag {
    display: none; /* Keep clean pins on small mobile to avoid screen crowding */
  }
}
</style>
