import * as THREE from 'three';

export function createWheelAssembly(materials) {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'wheel-assembly';

  const components = {};

  // 1. WHEEL RIM (Forged Monoblock Billet 6061-T6)
  const rimGroup = new THREE.Group();
  rimGroup.name = 'rim';
  components.rim = { group: rimGroup, basePos: new THREE.Vector3(0, 0, 0), explodeOffset: new THREE.Vector3(0, 0, 0.4) };

  // Outer rim barrel
  const barrelGeo = new THREE.CylinderGeometry(2.1, 2.05, 1.4, 48, 1, true);
  barrelGeo.rotateX(Math.PI / 2);
  const barrel = new THREE.Mesh(barrelGeo, materials.wheelTitanium);
  rimGroup.add(barrel);

  // Outer front lip & drop center
  const lipGeo = new THREE.TorusGeometry(2.1, 0.08, 16, 48);
  const lip = new THREE.Mesh(lipGeo, materials.wheelTitanium);
  lip.position.z = 0.7;
  rimGroup.add(lip);

  // Rear barrel lip
  const rearLip = lip.clone();
  rearLip.position.z = -0.7;
  rimGroup.add(rearLip);

  // Center hub housing (deep concave recess)
  const centerHubGeo = new THREE.CylinderGeometry(0.7, 0.85, 0.4, 32);
  centerHubGeo.rotateX(Math.PI / 2);
  const centerHub = new THREE.Mesh(centerHubGeo, materials.wheelTitanium);
  centerHub.position.z = 0.25;
  rimGroup.add(centerHub);

  // 10 Forged Concave Spokes
  const spokeCount = 10;
  for (let s = 0; s < spokeCount; s++) {
    const angle = (s / spokeCount) * Math.PI * 2;
    // Main tapered spoke
    const spokeGeo = new THREE.BoxGeometry(0.24, 1.45, 0.16);
    const spoke = new THREE.Mesh(spokeGeo, materials.wheelTitanium);

    const midRadius = 1.35;
    spoke.position.set(Math.cos(angle) * midRadius, Math.sin(angle) * midRadius, 0.45);
    spoke.rotation.z = angle + Math.PI / 2;
    spoke.rotation.x = -0.22; // Deep concave rake inwards towards hub
    rimGroup.add(spoke);

    // Milled weight pocket cutout
    const pocketGeo = new THREE.BoxGeometry(0.12, 0.8, 0.05);
    const pocketMat = new THREE.MeshStandardMaterial({ color: 0x1f2228, roughness: 0.5 });
    const pocket = new THREE.Mesh(pocketGeo, pocketMat);
    pocket.position.set(Math.cos(angle) * midRadius, Math.sin(angle) * midRadius, 0.52);
    pocket.rotation.z = angle + Math.PI / 2;
    pocket.rotation.x = -0.22;
    rimGroup.add(pocket);
  }

  rootGroup.add(rimGroup);

  // 2. COMPETITION SEMI-SLICK TIRE
  const tireGroup = new THREE.Group();
  tireGroup.name = 'tire';
  components.tire = { group: tireGroup, basePos: new THREE.Vector3(0, 0, 0), explodeOffset: new THREE.Vector3(0, 0, -1.6) };

  // Main tire torus / tread body
  const tireTreadGeo = new THREE.CylinderGeometry(2.65, 2.65, 1.35, 52, 1, true);
  tireTreadGeo.rotateX(Math.PI / 2);
  const tireTread = new THREE.Mesh(tireTreadGeo, materials.tireRubber);
  tireGroup.add(tireTread);

  // Tire sidewalls (curved tori on front and back)
  const sidewallGeo = new THREE.TorusGeometry(2.38, 0.28, 24, 48);
  const frontSidewall = new THREE.Mesh(sidewallGeo, materials.tireRubber);
  frontSidewall.position.z = 0.62;
  tireGroup.add(frontSidewall);

  const rearSidewall = frontSidewall.clone();
  rearSidewall.position.z = -0.62;
  tireGroup.add(rearSidewall);

  // Circumferential water displacement grooves (semi-slick tread grooves)
  const grooveMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
  [-0.25, 0.15].forEach(zPos => {
    const grooveGeo = new THREE.RingGeometry(2.645, 2.655, 48);
    const groove = new THREE.Mesh(grooveGeo, grooveMat);
    groove.position.z = zPos;
    tireGroup.add(groove);
  });

  rootGroup.add(tireGroup);

  // 3. CENTER-LOCK CENTERING CONE & WASHER
  const coneGroup = new THREE.Group();
  coneGroup.name = 'centering-cone';
  components['centering-cone'] = { group: coneGroup, basePos: new THREE.Vector3(0, 0, 0.35), explodeOffset: new THREE.Vector3(0, 0, 1.2) };
  coneGroup.position.set(0, 0, 0.35);

  const centeringConeGeo = new THREE.CylinderGeometry(0.55, 0.42, 0.22, 32);
  centeringConeGeo.rotateX(Math.PI / 2);
  const centeringCone = new THREE.Mesh(centeringConeGeo, materials.titaniumBurnt);
  coneGroup.add(centeringCone);

  rootGroup.add(coneGroup);

  // 4. ANODIZED BILLET CENTER-LOCK NUT
  const lockNutGroup = new THREE.Group();
  lockNutGroup.name = 'lock-nut';
  components['lock-nut'] = { group: lockNutGroup, basePos: new THREE.Vector3(0, 0, 0.52), explodeOffset: new THREE.Vector3(0, 0, 2.0) };
  lockNutGroup.position.set(0, 0, 0.52);

  // Octagonal center lock nut (Apex Motorsport Red)
  const nutGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.24, 8);
  nutGeo.rotateX(Math.PI / 2);
  const nut = new THREE.Mesh(nutGeo, materials.anodizedRed);
  lockNutGroup.add(nut);

  // Safety retention wire / clip ring
  const clipGeo = new THREE.TorusGeometry(0.35, 0.02, 8, 32);
  const clip = new THREE.Mesh(clipGeo, materials.chrome);
  clip.position.z = 0.13;
  lockNutGroup.add(clip);

  rootGroup.add(lockNutGroup);

  // 5. BILLET TPMS AIR VALVE STEM
  const valveGroup = new THREE.Group();
  valveGroup.name = 'valve-stem';
  components['valve-stem'] = { group: valveGroup, basePos: new THREE.Vector3(1.2, -1.2, 0.65), explodeOffset: new THREE.Vector3(1.8, -1.8, 1.2) };
  valveGroup.position.set(1.2, -1.2, 0.65);
  valveGroup.rotation.z = -Math.PI / 4;

  const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12);
  stemGeo.rotateX(Math.PI / 2);
  const stem = new THREE.Mesh(stemGeo, materials.anodizedBlack);
  valveGroup.add(stem);

  const capGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.12, 12);
  capGeo.rotateX(Math.PI / 2);
  const cap = new THREE.Mesh(capGeo, materials.anodizedRed);
  cap.position.z = 0.2;
  valveGroup.add(cap);

  rootGroup.add(valveGroup);

  return { rootGroup, components };
}
