<template>
  <div v-if="hotspot" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="modal-header">
        <div class="header-tag">
          <span class="tech-badge">CAD SUB-ASSEMBLY INSPECTION</span>
          <span class="tag-sku font-mono">{{ hotspot.id }}</span>
        </div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <div class="title-row">
          <div class="hs-icon">🔍</div>
          <div>
            <h2 class="hs-title">{{ hotspot.title }}</h2>
            <div class="hs-spec-badge font-mono">{{ hotspot.spec }}</div>
          </div>
        </div>

        <p class="hs-details">
          {{ hotspot.details }}
        </p>

        <!-- Technical Telemetry Matrix -->
        <div class="telemetry-box">
          <div class="telemetry-header">METALLURGICAL & CAD VERIFICATION</div>
          <div class="telemetry-grid">
            <div class="tel-item">
              <span class="tel-key">COORDINATES:</span>
              <span class="tel-val font-mono">X:{{ hotspot.position[0] }} Y:{{ hotspot.position[1] }} Z:{{ hotspot.position[2] }}</span>
            </div>
            <div class="tel-item">
              <span class="tel-key">NON-DESTRUCTIVE TESTING:</span>
              <span class="tel-val font-mono">100% Eddy Current / Ultrasonic</span>
            </div>
            <div class="tel-item">
              <span class="tel-key">FINISH:</span>
              <span class="tel-val font-mono">Ra ≤ 0.2 µm Micro-Lapped</span>
            </div>
            <div class="tel-item">
              <span class="tel-key">CYCLE LIFE:</span>
              <span class="tel-val font-mono">> 100,000 Thermal Cycles</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-primary" @click="$emit('close')">
          RETURN TO 3D WORKBENCH
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  hotspot: { type: Object, default: null }
});

defineEmits(['close']);
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

.modal-card {
  background: #11141c;
  border: 1px solid var(--border-bright);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8), 0 0 24px rgba(255, 77, 0, 0.15);
  max-width: 540px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #0d0f15;
  border-bottom: 1px solid var(--border-dim);
}

.header-tag {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tag-sku {
  font-size: 11px;
  color: var(--text-dim);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
}

.close-btn:hover {
  color: #fff;
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.title-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.hs-icon {
  font-size: 24px;
  background: rgba(255, 77, 0, 0.1);
  border: 1px solid rgba(255, 77, 0, 0.3);
  padding: 10px;
  border-radius: 4px;
}

.hs-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
}

.hs-spec-badge {
  display: inline-block;
  font-size: 11px;
  color: var(--accent-orange);
  margin-top: 4px;
}

.hs-details {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
}

.telemetry-box {
  background: #0c0e14;
  border: 1px solid var(--border-dim);
  border-radius: 3px;
  padding: 14px;
}

.telemetry-header {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--accent-cyan);
  letter-spacing: 0.08em;
  margin-bottom: 10px;
}

.telemetry-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tel-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.tel-key {
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 11px;
}

.tel-val {
  color: #ffffff;
  font-weight: 600;
}

.modal-footer {
  padding: 16px 20px;
  background: #0d0f15;
  border-top: 1px solid var(--border-dim);
  display: flex;
  justify-content: flex-end;
}
</style>
