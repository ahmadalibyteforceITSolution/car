import * as THREE from 'three';

export function createCoiloverAssembly(materials) {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'coilover-assembly';

  const components = {};

  // 1. THREADED DAMPER BODY & LOWER MOUNT
  const damperGroup = new THREE.Group();
  damperGroup.name = 'damper-body';
  components['damper-body'] = { group: damperGroup, basePos: new THREE.Vector3(0, -0.6, 0), explodeOffset: new THREE.Vector3(0, -1.6, 0) };
  damperGroup.position.set(0, -0.6, 0);

  // Main threaded shock cartridge
  const shockBodyGeo = new THREE.CylinderGeometry(0.55, 0.55, 2.2, 32);
  const shockBody = new THREE.Mesh(shockBodyGeo, materials.anodizedBlack);
  damperGroup.add(shockBody);

  // Thread ridges along the body
  for (let y = -0.6; y <= 0.8; y += 0.08) {
    const threadGeo = new THREE.TorusGeometry(0.56, 0.015, 6, 24);
    threadGeo.rotateX(Math.PI / 2);
    const thread = new THREE.Mesh(threadGeo, materials.titanium);
    thread.position.y = y;
    damperGroup.add(thread);
  }

  // Lower mounting bracket / clevis
  const clevisGeo = new THREE.BoxGeometry(0.8, 0.9, 0.8);
  const clevis = new THREE.Mesh(clevisGeo, materials.anodizedGold);
  clevis.position.set(0, -1.35, 0);
  damperGroup.add(clevis);

  // Lower eyelet hole & polyurethane bushing
  const bushGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.9, 24);
  bushGeo.rotateZ(Math.PI / 2);
  const bush = new THREE.Mesh(bushGeo, materials.tireRubber);
  bush.position.set(0, -1.45, 0);
  damperGroup.add(bush);

  const innerSleeveGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.95, 16);
  innerSleeveGeo.rotateZ(Math.PI / 2);
  const innerSleeve = new THREE.Mesh(innerSleeveGeo, materials.titanium);
  innerSleeve.position.set(0, -1.45, 0);
  damperGroup.add(innerSleeve);

  rootGroup.add(damperGroup);

  // 2. LOCK RINGS & LOWER SPRING SEAT
  const lockRingsGroup = new THREE.Group();
  lockRingsGroup.name = 'lock-perches';
  components['lock-perches'] = { group: lockRingsGroup, basePos: new THREE.Vector3(0, -0.4, 0), explodeOffset: new THREE.Vector3(0, -0.8, 0) };
  lockRingsGroup.position.set(0, -0.4, 0);

  // Lower spanner lock collar
  const lockCollar1Geo = new THREE.CylinderGeometry(0.72, 0.72, 0.12, 32);
  const lockCollar1 = new THREE.Mesh(lockCollar1Geo, materials.anodizedRed);
  lockCollar1.position.y = -0.15;
  lockRingsGroup.add(lockCollar1);

  // Upper spring seat collar with notched teeth
  const seatCollarGeo = new THREE.CylinderGeometry(0.82, 0.72, 0.16, 32);
  const seatCollar = new THREE.Mesh(seatCollarGeo, materials.anodizedRed);
  seatCollar.position.y = 0.05;
  lockRingsGroup.add(seatCollar);

  rootGroup.add(lockRingsGroup);

  // 3. INVERTED DAMPER ROD & HELPER SPRING
  const helperGroup = new THREE.Group();
  helperGroup.name = 'helper-spring';
  components['helper-spring'] = { group: helperGroup, basePos: new THREE.Vector3(0, 0.0, 0), explodeOffset: new THREE.Vector3(0, -0.2, 0) };

  // Tender/helper flat-wire spring (3 coils)
  for (let h = 0; h < 3; h++) {
    const coilGeo = new THREE.TorusGeometry(0.7, 0.05, 8, 32);
    coilGeo.rotateX(Math.PI / 2);
    const coil = new THREE.Mesh(coilGeo, materials.anodizedBlack);
    coil.position.y = -0.15 + h * 0.12;
    helperGroup.add(coil);
  }

  // Intermediate aluminum spring divider spacer
  const dividerGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.08, 32);
  const divider = new THREE.Mesh(dividerGeo, materials.anodizedGold);
  divider.position.y = 0.22;
  helperGroup.add(divider);

  rootGroup.add(helperGroup);

  // 4. MAIN PROGRESSIVE RACING SPRING
  const mainSpringGroup = new THREE.Group();
  mainSpringGroup.name = 'main-spring';
  components['main-spring'] = { group: mainSpringGroup, basePos: new THREE.Vector3(0, 0.9, 0), explodeOffset: new THREE.Vector3(0, 0.7, 0) };
  mainSpringGroup.position.set(0, 0.9, 0);

  // Mirror-polished chrome internal piston shaft inside spring
  const shaftGeo = new THREE.CylinderGeometry(0.28, 0.28, 2.0, 24);
  const shaft = new THREE.Mesh(shaftGeo, materials.chrome);
  mainSpringGroup.add(shaft);

  // Main helical racing spring (Swift/Bilstein yellow powdercoat)
  // Procedural helical curve
  const springRadius = 0.72;
  const springHeight = 1.6;
  const turns = 6;
  const points = [];
  for (let i = 0; i <= 140; i++) {
    const t = i / 140;
    const angle = t * turns * Math.PI * 2;
    const y = (t - 0.5) * springHeight;
    points.push(new THREE.Vector3(Math.cos(angle) * springRadius, y, Math.sin(angle) * springRadius));
  }
  const springCurve = new THREE.CatmullRomCurve3(points);
  const springGeo = new THREE.TubeGeometry(springCurve, 120, 0.075, 12, false);
  const springMesh = new THREE.Mesh(springGeo, materials.springYellow);
  mainSpringGroup.add(springMesh);

  rootGroup.add(mainSpringGroup);

  // 5. BUMP STOP & TOP SPRING PERCH
  const bumpStopGroup = new THREE.Group();
  bumpStopGroup.name = 'bump-stop';
  components['bump-stop'] = { group: bumpStopGroup, basePos: new THREE.Vector3(0, 1.8, 0), explodeOffset: new THREE.Vector3(0, 1.2, 0) };
  bumpStopGroup.position.set(0, 1.8, 0);

  // Microcellular polyurethane bump stop (conical fluted)
  const bumpGeo = new THREE.CylinderGeometry(0.25, 0.45, 0.5, 24);
  const bumpMat = new THREE.MeshStandardMaterial({ color: 0xd35400, roughness: 0.65 });
  const bump = new THREE.Mesh(bumpGeo, bumpMat);
  bumpStopGroup.add(bump);

  // Upper spring perch
  const topPerchGeo = new THREE.CylinderGeometry(0.82, 0.75, 0.12, 32);
  const topPerch = new THREE.Mesh(topPerchGeo, materials.anodizedGold);
  topPerch.position.y = 0.28;
  bumpStopGroup.add(topPerch);

  rootGroup.add(bumpStopGroup);

  // 6. PILLOWBALL CAMBER TOP MOUNT PLATE
  const topPlateGroup = new THREE.Group();
  topPlateGroup.name = 'top-plate';
  components['top-plate'] = { group: topPlateGroup, basePos: new THREE.Vector3(0, 2.3, 0), explodeOffset: new THREE.Vector3(0, 1.9, 0) };
  topPlateGroup.position.set(0, 2.3, 0);

  // Billet top mount triangle/circular plate
  const plateGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.18, 36);
  const plate = new THREE.Mesh(plateGeo, materials.anodizedBlack);
  topPlateGroup.add(plate);

  // Camber adjustment slot sliders
  const sliderGeo = new THREE.BoxGeometry(0.7, 0.12, 0.85);
  const slider = new THREE.Mesh(sliderGeo, materials.anodizedRed);
  slider.position.set(0.1, 0.08, 0);
  topPlateGroup.add(slider);

  // Spherical bearing center housing
  const bearingGeo = new THREE.SphereGeometry(0.32, 24, 16);
  const bearing = new THREE.Mesh(bearingGeo, materials.chrome);
  bearing.position.set(0.1, 0.08, 0);
  topPlateGroup.add(bearing);

  // 3 Hardened mounting studs with titanium nuts
  for (let s = 0; s < 3; s++) {
    const sAngle = (s / 3) * Math.PI * 2;
    const studGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.45, 12);
    const stud = new THREE.Mesh(studGeo, materials.titanium);
    stud.position.set(Math.cos(sAngle) * 0.95, 0.22, Math.sin(sAngle) * 0.95);
    topPlateGroup.add(stud);

    const nutGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.12, 6);
    const nut = new THREE.Mesh(nutGeo, materials.anodizedGold);
    nut.position.set(Math.cos(sAngle) * 0.95, 0.3, Math.sin(sAngle) * 0.95);
    topPlateGroup.add(nut);
  }

  // Top damper rebound adjustment clicker knob
  const clickerGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.18, 16);
  const clicker = new THREE.Mesh(clickerGeo, materials.anodizedRed);
  clicker.position.set(0.1, 0.35, 0);
  topPlateGroup.add(clicker);

  rootGroup.add(topPlateGroup);

  return { rootGroup, components };
}
