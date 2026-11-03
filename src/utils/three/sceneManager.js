import * as THREE from 'three';
import gsap from 'gsap';
import { createMaterialLibrary, createThermalShaderMaterial, createCadWireMaterial } from './materials.js';
import { createBrakeAssembly } from './brakeAssembly.js';
import { createTurboAssembly } from './turboAssembly.js';
import { createCoiloverAssembly } from './coiloverAssembly.js';
import { createWheelAssembly } from './wheelAssembly.js';

export class ThreeSceneManager {
  constructor(containerElement, onHotspotClick = null) {
    this.container = containerElement;
    this.onHotspotClick = onHotspotClick;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.materials = null;
    this.thermalMaterial = null;
    this.cadWireMaterial = null;

    this.currentModelGroup = null;
    this.currentComponents = {};
    this.currentPartData = null;
    this.activeHotspots = [];

    this.explodeValue = 0;
    this.viewMode = 'studio'; // 'studio' | 'wireframe' | 'thermal'
    this.isAutoRotating = true;
    this.rotationSpeed = 0.003;

    // Interaction controls state
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.cameraDistance = 7.5;
    this.cameraAngle = { theta: 0.6, phi: 1.1 };
    this.cameraTarget = new THREE.Vector3(0, 0, 0);

    this.animationFrameId = null;
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c0d10);
    this.scene.fog = new THREE.FogExp2(0x0c0d10, 0.045);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.updateCameraTransform();

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Materials
    this.materials = createMaterialLibrary();
    this.thermalMaterial = createThermalShaderMaterial();
    this.cadWireMaterial = createCadWireMaterial();

    // 5. Studio Lighting Setup
    this.setupLighting();

    // 6. CAD Engineering Floor Grid
    this.setupFloorGrid();

    // 7. Event listeners
    this.setupEventListeners();

    // 8. Start loop
    this.animate();
  }

  setupLighting() {
    // Soft studio ambient fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    // Key Light (top-right directional)
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.4);
    keyLight.position.set(6, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0002;
    this.scene.add(keyLight);

    // Cool Rim / Kicker Light (motorsport blue/cyan edge)
    const rimLight = new THREE.DirectionalLight(0x70a1ff, 2.2);
    rimLight.position.set(-6, 3, -6);
    this.scene.add(rimLight);

    // Warm Under-glow Kicker Light
    const underLight = new THREE.DirectionalLight(0xff6b4a, 0.85);
    underLight.position.set(0, -5, 2);
    this.scene.add(underLight);

    // Overhead diffuse softbox
    const topLight = new THREE.PointLight(0xffffff, 1.2, 20);
    topLight.position.set(0, 7, 0);
    this.scene.add(topLight);
  }

  setupFloorGrid() {
    // Circular radial CAD grid
    const gridHelper = new THREE.PolarGridHelper(7.5, 16, 8, 64, 0x242a35, 0x141820);
    gridHelper.position.y = -2.6;
    this.scene.add(gridHelper);

    // Floor shadow receiver disc
    const floorGeo = new THREE.CircleGeometry(8, 64);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.55 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -2.61;
    floorMesh.receiveShadow = true;
    this.scene.add(floorMesh);
  }

  loadPart(partData) {
    this.currentPartData = partData;
    this.activeHotspots = partData.hotspots || [];

    // Remove previous model
    if (this.currentModelGroup) {
      this.scene.remove(this.currentModelGroup);
      this.disposeObject(this.currentModelGroup);
      this.currentModelGroup = null;
      this.currentComponents = {};
    }

    // Build new assembly based on modelType
    let assemblyData;
    switch (partData.modelType) {
      case 'brake':
        assemblyData = createBrakeAssembly(this.materials);
        break;
      case 'turbo':
        assemblyData = createTurboAssembly(this.materials);
        break;
      case 'coilover':
        assemblyData = createCoiloverAssembly(this.materials);
        break;
      case 'wheel':
        assemblyData = createWheelAssembly(this.materials);
        break;
      default:
        assemblyData = createBrakeAssembly(this.materials);
    }

    this.currentModelGroup = assemblyData.rootGroup;
    this.currentComponents = assemblyData.components;

    // Center model in scene
    this.currentModelGroup.position.set(0, 0, 0);
    this.scene.add(this.currentModelGroup);

    // Apply view mode
    this.applyViewMode(this.viewMode);

    // Reset explosion to 0
    this.setExplode(0);

    // Animate camera to focus position
    this.resetCameraView();
  }

  setExplode(val) {
    this.explodeValue = Math.max(0, Math.min(1, val));

    for (const [key, comp] of Object.entries(this.currentComponents)) {
      if (!comp || !comp.group) continue;
      const targetPos = new THREE.Vector3().copy(comp.basePos).addScaledVector(comp.explodeOffset, this.explodeValue);
      comp.group.position.copy(targetPos);
    }
  }

  animateExplosionTo(targetVal, duration = 0.8) {
    gsap.to(this, {
      explodeValue: targetVal,
      duration: duration,
      ease: 'power2.out',
      onUpdate: () => {
        this.setExplode(this.explodeValue);
      }
    });
  }

  setViewMode(mode) {
    this.viewMode = mode;
    this.applyViewMode(mode);
  }

  applyViewMode(mode) {
    if (!this.currentModelGroup) return;

    this.currentModelGroup.traverse((child) => {
      if (child.isMesh) {
        // Save original material
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material;
        }

        if (mode === 'wireframe') {
          child.material = this.cadWireMaterial;
        } else if (mode === 'thermal') {
          child.material = this.thermalMaterial;
        } else {
          child.material = child.userData.originalMaterial;
        }
      }
    });
  }

  setCameraPreset(preset) {
    let targetTheta = 0.6;
    let targetPhi = 1.1;
    let targetDist = 7.5;
    let targetLook = new THREE.Vector3(0, 0, 0);

    switch (preset) {
      case 'iso':
        targetTheta = 0.785; // 45 deg
        targetPhi = 1.05;
        targetDist = 7.2;
        break;
      case 'front':
        targetTheta = 0;
        targetPhi = Math.PI / 2;
        targetDist = 6.8;
        break;
      case 'side':
        targetTheta = Math.PI / 2;
        targetPhi = Math.PI / 2;
        targetDist = 6.8;
        break;
      case 'top':
        targetTheta = 0;
        targetPhi = 0.15;
        targetDist = 7.5;
        break;
      case 'detail':
        targetTheta = this.cameraAngle.theta;
        targetPhi = this.cameraAngle.phi;
        targetDist = 4.2;
        break;
    }

    gsap.to(this.cameraAngle, {
      theta: targetTheta,
      phi: targetPhi,
      duration: 1.0,
      ease: 'power3.out',
      onUpdate: () => this.updateCameraTransform()
    });

    gsap.to(this, {
      cameraDistance: targetDist,
      duration: 1.0,
      ease: 'power3.out',
      onUpdate: () => this.updateCameraTransform()
    });

    gsap.to(this.cameraTarget, {
      x: targetLook.x,
      y: targetLook.y,
      z: targetLook.z,
      duration: 1.0,
      ease: 'power3.out',
      onUpdate: () => this.updateCameraTransform()
    });
  }

  focusHotspot(hotspot) {
    if (!hotspot) return;

    this.isAutoRotating = false;

    const [tx, ty, tz] = hotspot.camTarget || [0, 0, 0];
    const [px, py, pz] = hotspot.position || [0, 0, 0];

    gsap.to(this.cameraTarget, {
      x: tx,
      y: ty,
      z: tz,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => this.updateCameraTransform()
    });

    gsap.to(this, {
      cameraDistance: 4.5,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => this.updateCameraTransform()
    });
  }

  resetCameraView() {
    gsap.to(this.cameraAngle, {
      theta: 0.6,
      phi: 1.1,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => this.updateCameraTransform()
    });
    gsap.to(this, {
      cameraDistance: 7.5,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => this.updateCameraTransform()
    });
    gsap.to(this.cameraTarget, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => this.updateCameraTransform()
    });
  }

  updateCameraTransform() {
    if (!this.camera) return;

    // Clamp phi to prevent gimbal lock
    this.cameraAngle.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.cameraAngle.phi));

    const x = this.cameraTarget.x + this.cameraDistance * Math.sin(this.cameraAngle.phi) * Math.sin(this.cameraAngle.theta);
    const y = this.cameraTarget.y + this.cameraDistance * Math.cos(this.cameraAngle.phi);
    const z = this.cameraTarget.z + this.cameraDistance * Math.sin(this.cameraAngle.phi) * Math.cos(this.cameraAngle.theta);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.cameraTarget);
  }

  // Calculate 2D screen positions for HTML hotspot pins
  getHotspotScreenCoords(hotspot) {
    if (!this.camera || !this.container) return null;
    const pos = new THREE.Vector3(...hotspot.position);

    // If part is exploded, factor in offset if attached to a component
    pos.project(this.camera);

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    const x = (pos.x * 0.5 + 0.5) * width;
    const y = (-(pos.y * 0.5) + 0.5) * height;

    const isVisible = pos.z < 1.0;
    return { x, y, isVisible };
  }

  setupEventListeners() {
    const el = this.container;

    // Mouse Drag for Orbit
    const onMouseDown = (e) => {
      this.isDragging = true;
      this.isAutoRotating = false;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.cameraAngle.theta -= deltaX * 0.006;
      this.cameraAngle.phi -= deltaY * 0.006;

      this.updateCameraTransform();
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      this.isDragging = false;
    };

    // Wheel for Zoom
    const onWheel = (e) => {
      e.preventDefault();
      this.cameraDistance += e.deltaY * 0.005;
      this.cameraDistance = Math.max(2.8, Math.min(14, this.cameraDistance));
      this.updateCameraTransform();
    };

    // Touch events for mobile
    let touchStartDist = 0;
    const onTouchStart = (e) => {
      this.isAutoRotating = false;
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        this.isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

        this.cameraAngle.theta -= deltaX * 0.006;
        this.cameraAngle.phi -= deltaY * 0.006;

        this.updateCameraTransform();
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const factor = (touchStartDist - dist) * 0.01;
        this.cameraDistance = Math.max(2.8, Math.min(14, this.cameraDistance + factor));
        touchStartDist = dist;
        this.updateCameraTransform();
      }
    };

    const onTouchEnd = () => {
      this.isDragging = false;
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);

    // Resize handler
    this.resizeHandler = () => this.onResize();
    window.addEventListener('resize', this.resizeHandler);

    this.cleanupListeners = () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', this.resizeHandler);
    };
  }

  onResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Auto rotate turntable if enabled
    if (this.isAutoRotating && !this.isDragging) {
      this.cameraAngle.theta += this.rotationSpeed;
      this.updateCameraTransform();
    }

    // Update FEA thermal shader uniform
    if (this.thermalMaterial && this.viewMode === 'thermal') {
      this.thermalMaterial.uniforms.time.value = elapsedTime;
    }

    this.renderer.render(this.scene, this.camera);
  }

  disposeObject(obj) {
    if (!obj) return;
    obj.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.cleanupListeners) {
      this.cleanupListeners();
    }
    if (this.currentModelGroup) {
      this.disposeObject(this.currentModelGroup);
    }
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
