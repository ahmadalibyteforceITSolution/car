import * as THREE from 'three';

export function createBrakeAssembly(materials) {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'brake-assembly';

  // Sub-groups for explosion animation
  const components = {};

  // 1. ROTOR FRICTION RING (Ventilated Carbon-Silicon Carbide)
  const rotorGroup = new THREE.Group();
  rotorGroup.name = 'rotor';
  components.rotor = { group: rotorGroup, basePos: new THREE.Vector3(0, 0, 0), explodeOffset: new THREE.Vector3(0, 0, 0) };

  // Outer ventilated rotor disc
  const discOuterRadius = 2.1;
  const discInnerRadius = 1.35;
  const discThickness = 0.22;

  // Front friction plate
  const frontPlateGeo = new THREE.RingGeometry(discInnerRadius, discOuterRadius, 64);
  const frontPlateMesh = new THREE.Mesh(frontPlateGeo, materials.rotorFrictionTrack);
  frontPlateMesh.position.z = discThickness / 2;
  rotorGroup.add(frontPlateMesh);

  // Back friction plate
  const backPlateMesh = frontPlateMesh.clone();
  backPlateMesh.position.z = -discThickness / 2;
  backPlateMesh.rotation.y = Math.PI;
  rotorGroup.add(backPlateMesh);

  // Outer cylindrical rim
  const rimGeo = new THREE.CylinderGeometry(discOuterRadius, discOuterRadius, discThickness, 64, 1, true);
  rimGeo.rotateX(Math.PI / 2);
  const rimMesh = new THREE.Mesh(rimGeo, materials.carbonCeramic);
  rotorGroup.add(rimMesh);

  // Inner ventilated cooling vanes (72 internal curved aerodynamic vanes)
  const vaneGeo = new THREE.BoxGeometry(0.55, 0.04, discThickness - 0.02);
  const vaneCount = 48;
  for (let i = 0; i < vaneCount; i++) {
    const angle = (i / vaneCount) * Math.PI * 2;
    const vaneMesh = new THREE.Mesh(vaneGeo, materials.carbonCeramic);
    const radius = (discOuterRadius + discInnerRadius) / 2;
    vaneMesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    vaneMesh.rotation.z = angle + 0.35; // curved aerodynamic sweep
    rotorGroup.add(vaneMesh);
  }

  // Cross-drilled holes pattern (simulated with dark cylindrical inserts on the friction ring)
  const holeGeo = new THREE.CylinderGeometry(0.022, 0.022, discThickness + 0.01, 12);
  holeGeo.rotateX(Math.PI / 2);
  const holeMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
  for (let r = 1.48; r <= 1.95; r += 0.14) {
    const countAtRadius = Math.floor(r * 22);
    for (let j = 0; j < countAtRadius; j++) {
      if ((j + Math.floor(r * 10)) % 3 === 0) {
        const theta = (j / countAtRadius) * Math.PI * 2;
        const hole = new THREE.Mesh(holeGeo, holeMat);
        hole.position.set(Math.cos(theta) * r, Math.sin(theta) * r, 0);
        rotorGroup.add(hole);
      }
    }
  }

  rootGroup.add(rotorGroup);

  // 2. ROTOR BELL / HAT (Billet 6061-T6 Anodized Aluminum)
  const bellGroup = new THREE.Group();
  bellGroup.name = 'bell';
  components.bell = { group: bellGroup, basePos: new THREE.Vector3(0, 0, 0), explodeOffset: new THREE.Vector3(0, 0, 1.4) };

  // Center hat disc
  const hatFlangeGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.06, 48);
  hatFlangeGeo.rotateX(Math.PI / 2);
  const hatFlangeMesh = new THREE.Mesh(hatFlangeGeo, materials.anodizedGold);
  hatFlangeMesh.position.z = 0.12;
  bellGroup.add(hatFlangeMesh);

  // Center hub cylinder
  const hubGeo = new THREE.CylinderGeometry(0.85, 1.1, 0.35, 48);
  hubGeo.rotateX(Math.PI / 2);
  const hubMesh = new THREE.Mesh(hubGeo, materials.anodizedGold);
  hubMesh.position.z = 0.28;
  bellGroup.add(hubMesh);

  // Center bore hole (dark cutout)
  const boreGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 32);
  boreGeo.rotateX(Math.PI / 2);
  const boreMesh = new THREE.Mesh(boreGeo, materials.anodizedBlack);
  boreMesh.position.z = 0.3;
  bellGroup.add(boreMesh);

  // Lug bolt holes (5-stud pattern)
  const lugRadius = 0.68;
  for (let k = 0; k < 5; k++) {
    const lugAngle = (k / 5) * Math.PI * 2;
    const studGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.42, 16);
    studGeo.rotateX(Math.PI / 2);
    const studHole = new THREE.Mesh(studGeo, materials.anodizedBlack);
    studHole.position.set(Math.cos(lugAngle) * lugRadius, Math.sin(lugAngle) * lugRadius, 0.3);
    bellGroup.add(studHole);
  }

  rootGroup.add(bellGroup);

  // 3. TITANIUM FLOATING BOBBINS & PINS
  const bobbinsGroup = new THREE.Group();
  bobbinsGroup.name = 'bobbins';
  components.bobbins = { group: bobbinsGroup, basePos: new THREE.Vector3(0, 0, 0), explodeOffset: new THREE.Vector3(0, 0, 2.0) };

  const bobbinCount = 10;
  const bobbinRadius = 1.34;
  for (let b = 0; b < bobbinCount; b++) {
    const bAngle = (b / bobbinCount) * Math.PI * 2;
    const pinGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 16);
    pinGeo.rotateX(Math.PI / 2);
    const pinMesh = new THREE.Mesh(pinGeo, materials.titanium);
    pinMesh.position.set(Math.cos(bAngle) * bobbinRadius, Math.sin(bAngle) * bobbinRadius, 0.15);
    bobbinsGroup.add(pinMesh);

    // Retaining washer/nut
    const nutGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.06, 6);
    nutGeo.rotateX(Math.PI / 2);
    const nutMesh = new THREE.Mesh(nutGeo, materials.titanium);
    nutMesh.position.set(Math.cos(bAngle) * bobbinRadius, Math.sin(bAngle) * bobbinRadius, 0.31);
    bobbinsGroup.add(nutMesh);
  }
  rootGroup.add(bobbinsGroup);

  // 4. MONOBLOCK 6-PISTON CALIPER (Apex Racing Spec)
  const caliperGroup = new THREE.Group();
  caliperGroup.name = 'caliper';
  caliperGroup.position.set(1.75, 0.85, 0.0);
  caliperGroup.rotation.z = -0.42;
  components.caliper = { group: caliperGroup, basePos: caliperGroup.position.clone(), explodeOffset: new THREE.Vector3(1.6, 0.8, 0.0) };

  // Caliper body main arch
  const caliperArchGeo = new THREE.BoxGeometry(0.75, 2.2, 0.65);
  const caliperArchMesh = new THREE.Mesh(caliperArchGeo, materials.caliperRed);
  caliperGroup.add(caliperArchMesh);

  // Chamfered bridge stiffeners
  const bridgeTopGeo = new THREE.BoxGeometry(0.68, 0.3, 0.72);
  const bridgeTop = new THREE.Mesh(bridgeTopGeo, materials.caliperRed);
  bridgeTop.position.set(0, 0.95, 0);
  caliperGroup.add(bridgeTop);

  const bridgeBottom = bridgeTop.clone();
  bridgeBottom.position.y = -0.95;
  caliperGroup.add(bridgeBottom);

  // 6 Pistons (3 on outer face, 3 on inner face)
  const pistonDiameters = [0.18, 0.20, 0.22]; // Staggered 30mm, 34mm, 38mm
  const pistonSpacing = [-0.55, 0, 0.55];

  pistonSpacing.forEach((posY, idx) => {
    const diam = pistonDiameters[idx];
    const pistonGeo = new THREE.CylinderGeometry(diam, diam, 0.1, 24);
    pistonGeo.rotateX(Math.PI / 2);

    // Front pistons
    const pistonFront = new THREE.Mesh(pistonGeo, materials.titanium);
    pistonFront.position.set(-0.15, posY, 0.24);
    caliperGroup.add(pistonFront);

    // Rear pistons
    const pistonRear = pistonFront.clone();
    pistonRear.position.z = -0.24;
    caliperGroup.add(pistonRear);
  });

  // Apex brand logo plate on caliper face
  const logoPlateGeo = new THREE.BoxGeometry(0.42, 0.9, 0.02);
  const logoMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.3,
    metalness: 0.8
  });
  const logoPlate = new THREE.Mesh(logoPlateGeo, logoMat);
  logoPlate.position.set(0.38, 0, 0);
  logoPlate.rotation.y = Math.PI / 2;
  caliperGroup.add(logoPlate);

  // Titanium crossover fluid pipe & bleeder screws
  const pipeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.38, 0.8, 0.25),
    new THREE.Vector3(0.42, 0.4, 0.3),
    new THREE.Vector3(0.42, -0.4, 0.3),
    new THREE.Vector3(0.38, -0.8, 0.25)
  ]);
  const pipeGeo = new THREE.TubeGeometry(pipeCurve, 20, 0.025, 8, false);
  const pipeMesh = new THREE.Mesh(pipeGeo, materials.titanium);
  caliperGroup.add(pipeMesh);

  // Bleeder screw
  const bleederGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.2, 12);
  const bleeder = new THREE.Mesh(bleederGeo, materials.titaniumBurnt);
  bleeder.position.set(0.2, 1.15, 0.2);
  caliperGroup.add(bleeder);

  rootGroup.add(caliperGroup);

  // 5. BRAKE PADS (Front and Rear Pair)
  const padsGroup = new THREE.Group();
  padsGroup.name = 'pads';
  padsGroup.position.copy(caliperGroup.position);
  padsGroup.rotation.copy(caliperGroup.rotation);
  components.pads = { group: padsGroup, basePos: padsGroup.position.clone(), explodeOffset: new THREE.Vector3(0.8, 0.4, 0.9) };

  // Front pad backing plate & friction material
  const backPlateGeo = new THREE.BoxGeometry(0.3, 1.5, 0.04);
  const frontBackPlate = new THREE.Mesh(backPlateGeo, materials.titanium);
  frontBackPlate.position.set(-0.15, 0, 0.16);
  padsGroup.add(frontBackPlate);

  const padFrictionGeo = new THREE.BoxGeometry(0.28, 1.4, 0.05);
  const frontFriction = new THREE.Mesh(padFrictionGeo, materials.padFriction);
  frontFriction.position.set(-0.15, 0, 0.12);
  padsGroup.add(frontFriction);

  // Rear pad
  const rearBackPlate = frontBackPlate.clone();
  rearBackPlate.position.z = -0.16;
  padsGroup.add(rearBackPlate);

  const rearFriction = frontFriction.clone();
  rearFriction.position.z = -0.12;
  padsGroup.add(rearFriction);

  rootGroup.add(padsGroup);

  return { rootGroup, components };
}
