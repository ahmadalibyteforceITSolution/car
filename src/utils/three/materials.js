import * as THREE from 'three';

// Procedural textures generator
function createPerlinCanvas(width = 256, height = 256, mode = 'carbon') {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  if (mode === 'carbon') {
    ctx.fillStyle = '#111215';
    ctx.fillRect(0, 0, width, height);

    const step = 8;
    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {
        const isOdd = ((x / step) + (y / step)) % 2 === 0;
        ctx.fillStyle = isOdd ? '#1a1c22' : '#0d0e12';
        ctx.fillRect(x, y, step, step);

        // Subtle weave highlight
        ctx.strokeStyle = isOdd ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + step, y + step);
        ctx.stroke();
      }
    }
  } else if (mode === 'brushed') {
    ctx.fillStyle = '#777777';
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 4000; i++) {
      const y = Math.random() * height;
      const alpha = Math.random() * 0.15;
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
      ctx.fillRect(0, y, width, 1 + Math.random() * 1.5);
    }
  } else if (mode === 'rubber') {
    ctx.fillStyle = '#141416';
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 6000; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const val = Math.floor(Math.random() * 30 + 15);
      ctx.fillStyle = `rgb(${val},${val},${val})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  return canvas;
}

const carbonCanvas = typeof document !== 'undefined' ? createPerlinCanvas(256, 256, 'carbon') : null;
const brushedCanvas = typeof document !== 'undefined' ? createPerlinCanvas(256, 256, 'brushed') : null;
const rubberCanvas = typeof document !== 'undefined' ? createPerlinCanvas(256, 256, 'rubber') : null;

export function getProceduralTextures() {
  if (!carbonCanvas) return { carbonTex: null, brushedTex: null, rubberTex: null };

  const carbonTex = new THREE.CanvasTexture(carbonCanvas);
  carbonTex.wrapS = THREE.RepeatWrapping;
  carbonTex.wrapT = THREE.RepeatWrapping;
  carbonTex.repeat.set(12, 12);

  const brushedTex = new THREE.CanvasTexture(brushedCanvas);
  brushedTex.wrapS = THREE.RepeatWrapping;
  brushedTex.wrapT = THREE.RepeatWrapping;
  brushedTex.repeat.set(4, 8);

  const rubberTex = new THREE.CanvasTexture(rubberCanvas);
  rubberTex.wrapS = THREE.RepeatWrapping;
  rubberTex.wrapT = THREE.RepeatWrapping;
  rubberTex.repeat.set(6, 6);

  return { carbonTex, brushedTex, rubberTex };
}

// Thermal FEA Vertex and Fragment Shaders for real-time stress/heat visualization
export function createThermalShaderMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      heatIntensity: { value: 0.85 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float heatIntensity;
      varying vec3 vNormal;
      varying vec3 vPosition;

      // Color mapping from 0 (cool blue) to 1 (incandescent white-hot)
      vec3 getFEAColor(float t) {
        // Clamp and map through Blue -> Cyan -> Green -> Yellow -> Red -> Incandescent White
        t = clamp(t, 0.0, 1.0);
        if (t < 0.2) {
          return mix(vec3(0.05, 0.1, 0.45), vec3(0.0, 0.6, 0.85), t / 0.2);
        } else if (t < 0.45) {
          return mix(vec3(0.0, 0.6, 0.85), vec3(0.1, 0.85, 0.3), (t - 0.2) / 0.25);
        } else if (t < 0.7) {
          return mix(vec3(0.1, 0.85, 0.3), vec3(1.0, 0.8, 0.0), (t - 0.45) / 0.25);
        } else if (t < 0.88) {
          return mix(vec3(1.0, 0.8, 0.0), vec3(0.95, 0.15, 0.05), (t - 0.7) / 0.18);
        } else {
          return mix(vec3(0.95, 0.15, 0.05), vec3(1.0, 0.98, 0.9), (t - 0.88) / 0.12);
        }
      }

      void main() {
        // Calculate radial heat distribution based on radial distance and normal angle
        float radius = length(vPosition.xy);
        float heat = sin(radius * 3.5 - time * 0.5) * 0.15 + (radius * 0.45);
        heat = clamp(heat * heatIntensity, 0.08, 0.98);

        vec3 color = getFEAColor(heat);
        
        // Add subtle edge contour lines for CAD/FEA look
        float contour = mod(heat * 18.0, 1.0);
        if (contour < 0.08) {
          color *= 0.75;
        }

        // Lighting model
        vec3 lightDir = normalize(vec3(1.0, 1.5, 1.0));
        float diff = max(dot(vNormal, lightDir), 0.35);

        gl_FragColor = vec4(color * (diff * 0.6 + 0.5), 0.95);
      }
    `,
    transparent: false,
    side: THREE.DoubleSide
  });
}

// CAD Blueprint / Wireframe Shader
export function createCadWireMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    wireframe: true,
    wireframeLinewidth: 1.2,
    emissive: 0x005577,
    emissiveIntensity: 0.3,
    roughness: 0.4,
    metalness: 0.8
  });
}

// Full Material Library
export function createMaterialLibrary() {
  const { carbonTex, brushedTex, rubberTex } = getProceduralTextures();

  return {
    // 1. Carbon-Silicon Carbide (Rotor)
    carbonCeramic: new THREE.MeshStandardMaterial({
      color: 0x222328,
      roughness: 0.62,
      metalness: 0.25,
      map: carbonTex,
      bumpScale: 0.04
    }),

    // Rotor contact friction track (mirror-glazed composite)
    rotorFrictionTrack: new THREE.MeshStandardMaterial({
      color: 0x2c2d33,
      roughness: 0.38,
      metalness: 0.55,
      map: brushedTex
    }),

    // 2. Anodized Billet Aluminum (Center Bell / Lock Rings)
    anodizedGold: new THREE.MeshStandardMaterial({
      color: 0xc8963e,
      roughness: 0.25,
      metalness: 0.88,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2
    }),
    anodizedBlack: new THREE.MeshStandardMaterial({
      color: 0x18191c,
      roughness: 0.28,
      metalness: 0.85,
      clearcoat: 0.2
    }),
    anodizedRed: new THREE.MeshStandardMaterial({
      color: 0xd62828,
      roughness: 0.22,
      metalness: 0.82,
      clearcoat: 0.4
    }),

    // 3. Caliper Body (High-Gloss Motorsport Red or Titan)
    caliperRed: new THREE.MeshStandardMaterial({
      color: 0xdc143c,
      roughness: 0.18,
      metalness: 0.15,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1
    }),
    caliperAcidYellow: new THREE.MeshStandardMaterial({
      color: 0xf1c40f,
      roughness: 0.18,
      metalness: 0.12,
      clearcoat: 0.85
    }),

    // 4. Titanium / Hardware Fasteners
    titanium: new THREE.MeshStandardMaterial({
      color: 0x8a919e,
      roughness: 0.3,
      metalness: 0.92
    }),
    titaniumBurnt: new THREE.MeshStandardMaterial({
      color: 0x5a6375,
      roughness: 0.35,
      metalness: 0.95
    }),

    // 5. Inconel 718 Superalloy (Turbine wheel)
    inconel: new THREE.MeshStandardMaterial({
      color: 0x4a4a50,
      roughness: 0.42,
      metalness: 0.85
    }),

    // 6. Polished Chrome / Damper Rod
    chrome: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.98
    }),

    // 7. Cast Ductile Ni-Resist Iron (Turbo housing)
    castIron: new THREE.MeshStandardMaterial({
      color: 0x3a3c42,
      roughness: 0.75,
      metalness: 0.72
    }),

    // 8. Billet 7075-T6 CNC Milled Aluminum (Compressor wheel / Wheel rim)
    billetSilver: new THREE.MeshStandardMaterial({
      color: 0xd6dade,
      roughness: 0.2,
      metalness: 0.92,
      map: brushedTex
    }),

    // Satin Wheel Titanium Cerakote
    wheelTitanium: new THREE.MeshStandardMaterial({
      color: 0x3d414a,
      roughness: 0.28,
      metalness: 0.82,
      clearcoat: 0.4,
      clearcoatRoughness: 0.25
    }),

    // 9. Powder-coated Racing Spring (Gloss Bilstein Yellow / Swift Bronze)
    springYellow: new THREE.MeshStandardMaterial({
      color: 0xfbc531,
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 0.6
    }),

    // 10. Vulcanized Competition Rubber Tire
    tireRubber: new THREE.MeshStandardMaterial({
      color: 0x161619,
      roughness: 0.88,
      metalness: 0.05,
      map: rubberTex
    }),

    // 11. Brake Pad Friction Block
    padFriction: new THREE.MeshStandardMaterial({
      color: 0x362f2d,
      roughness: 0.78,
      metalness: 0.35
    })
  };
}
