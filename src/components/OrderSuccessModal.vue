<template>
  <div v-if="orderData" class="modal-backdrop" @click.self="$emit('close')">
    <div class="invoice-card" id="printable-invoice">
      <!-- Invoice Header -->
      <div class="inv-header">
        <div class="inv-brand">
          <div class="inv-title">APEX DYNAMICS // ENGINEERING</div>
          <div class="inv-sub font-mono">AUTOMOTIVE OEM & MOTORSPORT SPARE PARTS DIVISION</div>
          <div class="inv-loc">Munich Logistics Center • Flurstraße 48, 85356 Freising Germany</div>
        </div>
        <div class="inv-meta">
          <div class="inv-po-badge font-mono">CONFIRMED PO #{{ poNumber }}</div>
          <div class="inv-date font-mono">DATE: {{ currentDate }}</div>
          <div class="inv-status-pill">✓ ALLOCATED TO DISPATCH</div>
        </div>
      </div>

      <div class="inv-body">
        <!-- Vehicle Platform Spec -->
        <div class="inv-section-box">
          <div class="sec-label">PLATFORM FITMENT SPECIFICATION:</div>
          <div class="sec-val" v-if="selectedVehicle">
            {{ selectedVehicle.year }} {{ selectedVehicle.make }} {{ selectedVehicle.model }} ({{ selectedVehicle.chassis }}) — Engine: {{ selectedVehicle.engine }}
          </div>
          <div class="sec-val" v-else>
            Universal Technical Order // Hub Pilot Verified
          </div>
        </div>

        <!-- Line Items Table -->
        <table class="inv-table">
          <thead>
            <tr>
              <th>SKU / COMPONENT</th>
              <th>OEM CROSS-REF</th>
              <th>QTY</th>
              <th>UNIT PRICE</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in orderData.items" :key="item.part.id">
              <td>
                <div class="tbl-name">{{ item.part.name }}</div>
                <div class="tbl-sku font-mono">{{ item.part.sku }}</div>
              </td>
              <td class="font-mono text-dim">{{ item.part.oemRef }}</td>
              <td class="font-mono">{{ item.quantity }}</td>
              <td class="font-mono">{{ formatPrice(item.part.price) }}</td>
              <td class="font-mono font-bold">{{ formatPrice(item.part.price * item.quantity) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Totals & Logistics -->
        <div class="inv-bottom-grid">
          <div class="barcode-box">
            <div class="barcode-lines">
              <span v-for="n in 36" :key="n" :style="{ width: `${(n % 4) + 1.5}px` }"></span>
            </div>
            <div class="barcode-text font-mono">TRK-DE-LH94820194820-APX</div>
            <div class="cert-text">DIN EN ISO 9001:2015 & TÜV RHEINLAND CERTIFIED</div>
          </div>

          <div class="inv-calc-box">
            <div class="calc-row">
              <span>NET SUB-TOTAL:</span>
              <span class="font-mono">{{ formatPrice(orderData.subtotal) }}</span>
            </div>
            <div class="calc-row">
              <span>EXPRESS FREIGHT:</span>
              <span class="font-mono">{{ formatPrice(orderData.shippingCost) }}</span>
            </div>
            <div class="calc-row total-row">
              <span>TOTAL INVOICE (EX-VAT):</span>
              <span class="font-mono font-bold text-orange">{{ formatPrice(orderData.grandTotal) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="inv-actions">
        <button class="btn-secondary" @click="printInvoice">
          🖨️ PRINT / EXPORT TECHNICAL SPEC SHEET
        </button>
        <button class="btn-primary" @click="$emit('close')">
          RETURN TO 3D SHOWROOM
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatCurrency } from '../utils/formatters.js';

const props = defineProps({
  orderData: { type: Object, default: null },
  selectedVehicle: { type: Object, default: null },
  currency: { type: String, default: 'USD' }
});

defineEmits(['close']);

const poNumber = computed(() => {
  return 'APX-' + Math.floor(100000 + Math.random() * 900000);
});

const currentDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit'
});

const formatPrice = (amt) => formatCurrency(amt, props.currency);

const printInvoice = () => {
  window.print();
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(4, 5, 8, 0.88);
  backdrop-filter: blur(8px);
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.invoice-card {
  background: #11141c;
  border: 1px solid var(--border-bright);
  max-width: 740px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
  animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.inv-header {
  display: flex;
  justify-content: space-between;
  padding: 24px;
  background: #0b0d13;
  border-bottom: 2px solid var(--border-bright);
}

.inv-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
}

.inv-sub {
  font-size: 9px;
  color: var(--accent-orange);
  letter-spacing: 0.08em;
  margin-top: 2px;
}

.inv-loc {
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 4px;
}

.inv-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.inv-po-badge {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
}

.inv-date {
  font-size: 11px;
  color: var(--text-dim);
}

.inv-status-pill {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--accent-green);
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid var(--accent-green);
  padding: 2px 8px;
  border-radius: 2px;
}

.inv-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.inv-section-box {
  background: #141722;
  border-left: 3px solid var(--accent-orange);
  padding: 10px 14px;
  font-size: 12px;
}

.sec-label {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
}

.sec-val {
  color: #ffffff;
  font-weight: 600;
  margin-top: 2px;
}

.inv-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.inv-table th {
  text-align: left;
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
  border-bottom: 1px solid var(--border-bright);
  padding: 8px 6px;
}

.inv-table td {
  padding: 12px 6px;
  border-bottom: 1px solid var(--border-dim);
  color: #ffffff;
}

.tbl-name {
  font-weight: 600;
}

.tbl-sku {
  font-size: 10px;
  color: var(--text-dim);
}

.text-dim {
  color: var(--text-dim);
}

.font-bold {
  font-weight: 700;
}

.inv-bottom-grid {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
}

.barcode-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.barcode-lines {
  display: flex;
  height: 36px;
  gap: 3px;
  align-items: stretch;
  background: #fff;
  padding: 4px;
  border-radius: 2px;
}

.barcode-lines span {
  background: #000;
  display: inline-block;
}

.barcode-text {
  font-size: 10px;
  color: var(--text-dim);
}

.cert-text {
  font-size: 9px;
  color: var(--text-dim);
}

.inv-calc-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 260px;
}

.calc-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
}

.total-row {
  border-top: 1px solid var(--border-bright);
  padding-top: 8px;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
}

.text-orange {
  color: var(--accent-orange) !important;
  font-size: 18px;
}

.inv-actions {
  padding: 18px 24px;
  background: #0b0d13;
  border-top: 1px solid var(--border-dim);
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

@media print {
  body * {
    visibility: hidden;
  }
  #printable-invoice, #printable-invoice * {
    visibility: visible;
  }
  #printable-invoice {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: #ffffff !important;
    color: #000000 !important;
  }
  .inv-actions {
    display: none;
  }
}
</style>
