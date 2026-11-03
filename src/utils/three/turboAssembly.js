import * as THREE from 'three';

export function createTurboAssembly(materials) {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'turbo-assembly';

  const components = {};

  // 1. BEARING CARTRIDGE (CHRA) - CENTER
  const chraGroup = new THREE.Group();
  chraGroup.name = 'chra';
  components.chra = { group: chraGroup, basePos: new THREE.Vector3(0, 0, 0), explodeOffset: new THREE.Vector3(0, 0, 0) };

  // Center cast iron body
  const chraBodyGeo = new THREE.CylinderGeometry(0.7, 0.75, 0.9, 32);
  chraBodyGeo.rotateX(Math.PI / 2);
  const chraBody = new THREE.Mesh(chraBodyGeo, materials.castIron);
  chraGroup.add(chraBody);

  // Cooling fins around CHRA
  for (let f = -0.3; f <= 0.3; f += 0.15) {
    const finGeo = new THREE.TorusGeometry(0.76, 0.04, 8, 32);
    const fin = new THREE.Mesh(finGeo, materials.castIron);
    fin.position.z = f;
    chraGroup.add(fin);
  }

  // Top oil feed flange & brass fitting
  const oilFittingGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.4, 16);
  const oilFitting = new THREE.Mesh(oilFittingGeo, materials.anodizedGold);
  oilFitting.position.set(0, 0.85, 0);
  chraGroup.add(oilFitting);

  // Bottom oil drain flange
  const drainFlangeGeo = new THREE.BoxGeometry(0.4, 0.15, 0.6);
  const drainFlange = new THREE.Mesh(drainFlangeGeo, materials.castIron);
  drainFlange.position.set(0, -0.85, 0);
  chraGroup.add(drainFlange);

  // Water ports (side ports)
  const waterPortGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16);
  waterPortGeo.rotateZ(Math.PI / 2);
  const waterPort1 = new THREE.Mesh(waterPortGeo, materials.anodizedBlack);
  waterPort1.position.set(0.8, 0, 0);
  chraGroup.add(waterPort1);

  rootGroup.add(chraGroup);

  // 2. BILLET COMPRESSOR WHEEL (Impeller)
  const impellerGroup = new THREE.Group();
  impellerGroup.name = 'impeller';
  components.impeller = { group: impellerGroup, basePos: new THREE.Vector3(0, 0, 0.65), explodeOffset: new THREE.Vector3(0, 0, 1.2) };
  impellerGroup.position.set(0, 0, 0.65);

  // Central hub nose cone
  const coneGeo = new THREE.ConeGeometry(0.5, 0.85, 32);
  coneGeo.rotateX(Math.PI / 2);
  const coneMesh = new THREE.Mesh(coneGeo, materials.billetSilver);
  impellerGroup.add(coneMesh);

  // Center shaft nut (anodized left-hand thread lock nut)
  const nutGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.18, 6);
  nutGeo.rotateX(Math.PI / 2);
  const nutMesh = new THREE.Mesh(nutGeo, materials.anodizedRed);
  nutMesh.position.z = 0.46;
  impellerGroup.add(nutMesh);

  // 12 Curved Billet Impeller Blades (6 Full + 6 Splitter)
  const bladeCount = 12;
  for (let b = 0; b < bladeCount; b++) {
    const isSplitter = b % 2 === 1;
    const bAngle = (b / bladeCount) * Math.PI * 2;
    const bladeLength = isSplitter ? 0.6 : 0.8;
    const bladeGeo = new THREE.BoxGeometry(0.04, 0.35, bladeLength);
    const bladeMesh = new THREE.Mesh(bladeGeo, materials.billetSilver);

    bladeMesh.position.set(Math.cos(bAngle) * 0.4, Math.sin(bAngle) * 0.4, isSplitter ? -0.1 : 0);
    bladeMesh.rotation.z = bAngle + 0.55;
    bladeMesh.rotation.y = -0.35;
    impellerGroup.add(bladeMesh);
  }

  rootGroup.add(impellerGroup);

  // 3. COMPRESSOR HOUSING / VOLUTE (Front Cover)
  const compHousingGroup = new THREE.Group();
  compHousingGroup.name = 'compressor-cover';
  components['compressor-cover'] = { group: compHousingGroup, basePos: new THREE.Vector3(0, 0, 0.6), explodeOffset: new THREE.Vector3(0, 0, 2.3) };
  compHousingGroup.position.set(0, 0, 0.6);

  // Intake snout bellmouth
  const intakeBellGeo = new THREE.CylinderGeometry(0.9, 0.78, 1.1, 36, 1, true);
  intakeBellGeo.rotateX(Math.PI / 2);
  const intakeBell = new THREE.Mesh(intakeBellGeo, materials.billetSilver);
  intakeBell.position.z = 0.65;
  compHousingGroup.add(intakeBell);

  // Outer snail scroll (Torus shape wrapping around the impeller)
  const compScrollGeo = new THREE.TorusGeometry(1.15, 0.45, 24, 48);
  const compScroll = new THREE.Mesh(compScrollGeo, materials.billetSilver);
  compHousingGroup.add(compScroll);

  // Compressed air discharge pipe outlet (tangential)
  const dischargePipeGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.4, 24);
  const dischargePipe = new THREE.Mesh(dischargePipeGeo, materials.billetSilver);
  dischargePipe.position.set(1.4, 0.7, 0);
  dischargePipe.rotation.z = Math.PI / 4;
  compHousingGroup.add(dischargePipe);

  // Retaining V-Band clamp ring
  const compBackplateGeo = new THREE.CylinderGeometry(1.65, 1.65, 0.1, 36);
  compBackplateGeo.rotateX(Math.PI / 2);
  const compBackplate = new THREE.Mesh(compBackplateGeo, materials.titanium);
  compBackplate.position.z = -0.3;
  compHousingGroup.add(compBackplate);

  rootGroup.add(compHousingGroup);

  // 4. INCONEL TURBINE WHEEL & SHAFT
  const turbineWheelGroup = new THREE.Group();
  turbineWheelGroup.name = 'turbine-wheel';
  components['turbine-wheel'] = { group: turbineWheelGroup, basePos: new THREE.Vector3(0, 0, -0.65), explodeOffset: new THREE.Vector3(0, 0, -1.2) };
  turbineWheelGroup.position.set(0, 0, -0.65);

  const turbHubGeo = new THREE.CylinderGeometry(0.55, 0.4, 0.75, 24);
  turbHubGeo.rotateX(Math.PI / 2);
  const turbHub = new THREE.Mesh(turbHubGeo, materials.inconel);
  turbineWheelGroup.add(turbHub);

  // Inconel Turbine Blades
  for (let t = 0; t < 10; t++) {
    const tAngle = (t / 10) * Math.PI * 2;
    const tBladeGeo = new THREE.BoxGeometry(0.06, 0.38, 0.65);
    const tBlade = new THREE.Mesh(tBladeGeo, materials.inconel);
    tBlade.position.set(Math.cos(tAngle) * 0.45, Math.sin(tAngle) * 0.45, 0);
    tBlade.rotation.z = tAngle - 0.4;
    tBlade.rotation.y = 0.4;
    turbineWheelGroup.add(tBlade);
  }

  rootGroup.add(turbineWheelGroup);

  // 5. NI-RESIST TWIN-SCROLL TURBINE HOUSING
  const turbineHousingGroup = new THREE.Group();
  turbineHousingGroup.name = 'turbine-housing';
  components['turbine-housing'] = { group: turbineHousingGroup, basePos: new THREE.Vector3(0, 0, -0.6), explodeOffset: new THREE.Vector3(0, 0, -2.4) };
  turbineHousingGroup.position.set(0, 0, -0.6);

  // Heavy cast iron exhaust volute
  const turbScrollGeo = new THREE.TorusGeometry(1.2, 0.52, 24, 48);
  const turbScroll = new THREE.Mesh(turbScrollGeo, materials.castIron);
  turbineHousingGroup.add(turbScroll);

  // Exhaust gas inlet flange (T4 Twin-Scroll rectangular flange)
  const inletFlangeGeo = new THREE.BoxGeometry(1.2, 0.8, 0.25);
  const inletFlange = new THREE.Mesh(inletFlangeGeo, materials.castIron);
  inletFlange.position.set(-1.3, -0.8, 0);
  inletFlange.rotation.z = -0.4;
  turbineHousingGroup.add(inletFlange);

  // Twin-scroll divider in inlet
  const dividerGeo = new THREE.BoxGeometry(0.1, 0.7, 0.3);
  const divider = new THREE.Mesh(dividerGeo, materials.castIron);
  divider.position.set(-1.3, -0.8, 0);
  divider.rotation.z = -0.4;
  turbineHousingGroup.add(divider);

  // Exhaust downpipe V-Band outlet
  const downpipeVBandGeo = new THREE.CylinderGeometry(0.85, 0.9, 0.45, 32);
  downpipeVBandGeo.rotateX(Math.PI / 2);
  const downpipeVBand = new THREE.Mesh(downpipeVBandGeo, materials.castIron);
  downpipeVBand.position.z = -0.7;
  turbineHousingGroup.add(downpipeVBand);

  rootGroup.add(turbineHousingGroup);

  // 6. WASTEGATE ACTUATOR CANISTER & LINKAGE
  const actuatorGroup = new THREE.Group();
  actuatorGroup.name = 'actuator';
  components.actuator = { group: actuatorGroup, basePos: new THREE.Vector3(1.3, 1.2, 0.2), explodeOffset: new THREE.Vector3(1.8, 1.5, 0.4) };
  actuatorGroup.position.set(1.3, 1.2, 0.2);

  // Billet cylinder canister
  const canisterGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.65, 24);
  const canister = new THREE.Mesh(canisterGeo, materials.anodizedBlack);
  actuatorGroup.add(canister);

  // Actuator rod
  const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 12);
  const rod = new THREE.Mesh(rodGeo, materials.chrome);
  rod.position.set(0, -0.8, 0);
  actuatorGroup.add(rod);

  // Mounting bracket
  const bracketGeo = new THREE.BoxGeometry(0.2, 0.6, 0.05);
  const bracket = new THREE.Mesh(bracketGeo, materials.titanium);
  bracket.position.set(-0.25, 0.1, 0);
  actuatorGroup.add(bracket);

  rootGroup.add(actuatorGroup);

  return { rootGroup, components };
}
