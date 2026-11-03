# APEX DYNAMICS // High-Performance Automotive 3D Spare Parts Platform

An engineering-grade, interactive 3D automotive spare parts showcase and e-commerce portal built with **Vue 3** and **Three.js**. Designed with authentic motorsport and OEM precision engineering aesthetics.

---

## ⚡ Highlights & Key Features

- **High-Fidelity 3D Interactive Workbench (Three.js)**:
  - **Procedural Automotive Assemblies**:
    1. **Carbon-Silicon Carbide (C/SiC) 6-Piston Caliper & 410mm Rotor Assembly**: Cross-drilled ventilated cooling vanes, floating titanium bobbins, titanium pistons, and sintered ceramic friction pads.
    2. **Vortex-850 Twin-Scroll Ceramic Ball-Bearing Turbocharger**: 5-axis point-milled billet compressor impeller, Ni-Resist cast iron twin-scroll turbine housing, Inconel 718 turbine wheel, and billet wastegate actuator.
    3. **Pro-Circuit Inverted Monotube 2-Way Adjustable Coilover Strut**: Threaded damper body, dual-rate linear racing springs + tender helper spring, CNC billet camber-adjustable pillowball top plate, and anodized lock perches.
    4. **Forged F-10 Monoblock 20" Center-Lock Track Wheel & Semi-Slick Tire**: 10,000-ton forged aerospace 6061-T6 aluminum rim with back-milled spoke weight pockets, competition semi-slick tire, and motorsport center-lock nut.
- **Dynamic CAD Assembly Explosion Scrubber (0% to 100%)**:
  - Smooth mechanical disassembling animation along component axes with pneumatic air release and mechanical ratchet sound effects.
- **Multiple Shader & Inspection Modes**:
  - **Studio PBR**: Photorealistic metallics, anisotropic brushed reflections, clearcoat calipers, and carbon composite textures.
  - **CAD Wireframe**: Technical vector blueprint overlay.
  - **FEA Thermal Simulation**: Real-time finite element heat dissipation gradient shader simulating dynamic thermal stress.
- **Interactive 3D Hotspot Pins**:
  - Live projected pins that follow 3D rotation, opening deep metallurgical, tolerance, and engineering analysis cards.
- **Vehicle Fitment / Compatibility Checker**:
  - Select vehicle platform (Porsche 911 GT3, BMW M3/M4, Audi RS6, Nissan GT-R Nismo, Toyota GR Supra, AMG GT) with instant bolt-on verification.
- **Synthesized Web Audio FX**:
  - Built-in mechanical clicks, ratchet scrubber sounds, and pneumatic wooshes (no external audio assets needed, with one-click mute/unmute).
- **Commercial Logistics & Order Tray**:
  - Full shopping drawer with live shipment weight calculation, dispatch hub estimation, and printable PO / Technical Spec Sheet Invoice.

---

## 🛠️ Tech Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Three.js** (WebGL PBR rendering, custom shaders, OrbitControls math)
- **GSAP** (Camera tweening, smooth explode interpolation)
- **Vite** (High-speed build tool)
- **Web Audio API** (Procedural sound synthesizer)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/ahmadalibyteforceITSolution/car.git
cd car

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 🌐 Deployment to Vercel

This repository is optimized for one-click deployment on [Vercel](https://vercel.com):
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
