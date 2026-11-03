export const SPARE_PARTS_DATA = [
  {
    id: 'apex-ccb-01',
    modelType: 'brake',
    sku: 'APX-BRK-992-CCB',
    oemRef: 'OEM-992.351.405.AE / BRE-09.C892.13',
    name: 'Apex Carbon-Silicon Carbide (C/SiC) 6-Piston Caliper & 410mm Rotor Assembly',
    category: 'Braking & Friction',
    shortCategory: 'Brakes',
    badge: 'FIA / TÜV Certified',
    price: 3450,
    currency: 'USD',
    inStock: 8,
    leadTime: 'Same Day Dispatch (Munich Logistics Hub)',
    weightKg: 6.85,
    weightLbs: 15.1,
    weightSavings: '-4.6 kg (-41%) vs Cast Iron OEM',
    dimensions: {
      diameter: '410 mm (16.14 in)',
      thickness: '36.0 mm (1.42 in)',
      minThickness: '34.2 mm Wear Limit',
      caliperPistons: '6-Piston Monoblock (30/34/38 mm staggered)',
      mountingPitch: '225 mm Radial Mount'
    },
    materials: {
      rotorFrictionRing: 'Carbon-Silicon Carbide (C/SiC) 3D Woven Matrix',
      bellHat: 'Forged 6061-T6 Aircraft Grade Billet Aluminum (Hard Anodized Type III)',
      caliperBody: 'Monoblock Forged Aluminum-Lithium Alloy Al-Li 2099',
      pistons: 'Titanium Ti-6Al-4V with Ceramic Thermal Barrier Coating (TBC)',
      hardware: 'Grade 5 Titanium M8 Drive Bobbins & Inconel Anti-Rattle Leaf Springs'
    },
    engineeringSpecs: {
      maxOperatingTemp: '1,020°C (1,868°F) Continuous',
      thermalDissipationRate: '48.2 kJ/s Peak at 280 km/h deceleration',
      frictionCoefficient: 'µ = 0.46 - 0.52 (Stable hot & cold)',
      clampingForce: '24,800 N at 120 bar hydraulic pressure',
      fluidCompatibility: 'DOT 4 / DOT 5.1 Racing Brake Fluid (Dry Boiling > 325°C)'
    },
    description: 'Engineered for endurance motorsport and hypercar street applications, the Apex C/SiC assembly eliminates brake fade under continuous high-g deceleration. Continuous 3D carbon matrix fibers infused with molten silicon carbide form a diamond-hard surface that resists grooving, reduces unsprung rotating mass by 41%, and delivers exceptional pedal modulation.',
    features: [
      'Directional curved internal cooling vanes optimized via CFD computational fluid dynamics',
      'Floating bobbin rotor hat assembly accommodating radial thermal expansion up to 1.8mm',
      'Dual-circuit titanium crossover fluid bridge minimizing hydraulic lag',
      'Staggered piston bore diameters (30mm / 34mm / 38mm) preventing tapered pad wear',
      'Quick-release stainless steel central pad retaining bridge for rapid pitstop pad changes'
    ],
    hotspots: [
      {
        id: 'caliper-pistons',
        name: 'Staggered Titanium Pistons',
        title: 'Tri-Diameter Piston Array',
        spec: 'Ti-6Al-4V | 30/34/38mm',
        position: [1.8, 1.2, 0.5],
        camTarget: [1.5, 0.8, 0.4],
        details: 'Constructed from aerospace titanium with laser-drilled thermal dissipation crowns and castellated contact lips that reduce heat transfer into the hydraulic fluid by 68%.'
      },
      {
        id: 'rotor-vanes',
        name: 'CFD Curved Air Vanes',
        title: 'Centrifugal Cooling Geometry',
        spec: '72-Vane Airfoil Architecture',
        position: [0.0, -1.8, 0.0],
        camTarget: [0.0, -1.2, 0.5],
        details: 'Directs high-velocity cooling air outward like a centrifugal pump, achieving up to 35% higher air mass flow rate at 200 km/h than conventional straight radial vanes.'
      },
      {
        id: 'floating-bobbins',
        name: 'Floating Drive Pins',
        title: 'Thermal Float Bobbin System',
        spec: 'Grade 5 Titanium M8 Fasteners',
        position: [0.0, 0.9, 0.3],
        camTarget: [0.0, 0.6, 0.4],
        details: 'Allows the carbon-ceramic friction ring to expand and contract freely along the radial plane without inducing stress bending into the forged aluminum mounting bell.'
      },
      {
        id: 'pad-friction',
        name: 'Sintered Ceramic Friction Pads',
        title: 'High-Mu Endurance Compound',
        spec: 'Bedded µ=0.49 @ 600°C',
        position: [1.3, -0.2, 0.6],
        camTarget: [1.2, -0.1, 0.5],
        details: 'Synthetic Kevlar-reinforced ceramic matrix pads backed by stainless steel perforated thermal insulator shims.'
      }
    ],
    componentsList: [
      { id: 'caliper', name: 'Monoblock 6-Piston Caliper Body', material: 'Forged Al-Li 2099', explodedOffset: [1.8, 0.2, 0.3] },
      { id: 'pads', name: 'Ceramic Composite Brake Pads (Pair)', material: 'Sintered Carbon-Kevlar', explodedOffset: [1.1, 0.1, 0.8] },
      { id: 'rotor', name: '410mm Carbon-Silicon Carbide Friction Ring', material: 'C/SiC Woven Composite', explodedOffset: [0, 0, 0] },
      { id: 'bell', name: 'Forged Rotor Hat Center Bell', material: 'Anodized 6061-T6 Billet', explodedOffset: [0, 0, 1.2] },
      { id: 'bobbins', name: 'Titanium Floating Drive Bobbins & Pins', material: 'Grade 5 Ti-6Al-4V', explodedOffset: [0, 0, 1.7] }
    ]
  },
  {
    id: 'apex-turbo-02',
    modelType: 'turbo',
    sku: 'APX-TURBO-BB-850R',
    oemRef: 'OEM-06K.145.722.T / GAR-G30-770-V',
    name: 'Apex Vortex-850 Twin-Scroll Ceramic Ball-Bearing Turbocharger',
    category: 'Forced Induction & Airflow',
    shortCategory: 'Turbos',
    badge: 'Stage 3 Motorsport / 850 HP',
    price: 2890,
    currency: 'USD',
    inStock: 5,
    leadTime: 'Dispatch in 24 Hours (Frankfurt Aerowerks Hub)',
    weightKg: 8.4,
    weightLbs: 18.5,
    weightSavings: '-2.8 kg vs Cast Steel OEM Turbo',
    dimensions: {
      diameter: '76 mm (Inducer) / 102 mm (Exducer)',
      thickness: 'A/R 0.83 Twin-Scroll V-Band',
      minThickness: 'Blade Tip Clearance: 0.12 mm',
      caliperPistons: 'Dual Ceramic Hybrid Ball Bearings',
      mountingPitch: 'T4 Twin-Scroll Flange / Dual V-Band'
    },
    materials: {
      rotorFrictionRing: '5-Axis CNC Milled Point-Milled Forged 7075-T6 Billet Aluminum',
      bellHat: 'Ductile Ni-Resist D-5S Cast Iron Turbine Housing',
      caliperBody: 'Gravity Cast A356-T6 Aluminum Compressor Housing',
      pistons: 'Silicon Nitride (Si3N4) Ceramic Balls with PEEK Cages',
      hardware: 'Inconel 718 High-Nickel Exhaust Turbine Wheel & Shaft'
    },
    engineeringSpecs: {
      maxOperatingTemp: '1,050°C (1,922°F) Turbine Exhaust Gas',
      thermalDissipationRate: 'Spool Threshold: 2,650 RPM (Full 2.4 Bar Boost)',
      frictionCoefficient: 'Max Rotor Speed: 165,000 RPM Dynamic Balance',
      clampingForce: 'Compressor Efficiency: 79% Peak Isentropic',
      fluidCompatibility: 'Synthesized Water & High-Pressure Oil Journal Cooling'
    },
    description: 'A benchmark in forced induction responsiveness, the Vortex-850 pairs an ultra-lightweight point-milled billet compressor impeller with dual silicon nitride ceramic ball bearings. Friction is reduced by 40% compared to standard brass sleeve bearings, yielding near-instantaneous transient spool response across the mid-range powerband.',
    features: [
      'Point-milled 5-axis aerospace billet compressor wheel with extended tip aero technology',
      'Twin-scroll divided exhaust volute for pulse-scavenging cylinder isolation',
      'Integral ceramic hybrid ball bearing cartridge with CNC brass oil restrictor',
      'Electronic billet high-speed wastegate actuator with closed-loop PWM position sensor',
      'Speed sensor port and port shrouded anti-surge ring to eliminate compressor surge'
    ],
    hotspots: [
      {
        id: 'billet-impeller',
        name: '5-Axis Billet Impeller',
        title: 'Aero Point-Milled Compressor Wheel',
        spec: 'Forged 7075-T6 | 62mm Inducer',
        position: [0.0, 0.0, 1.4],
        camTarget: [0.0, 0.0, 1.0],
        details: 'Sculpted from a single solid billet of aircraft aluminum with razor-sharp leading edges and splitter blades for maximum mass flow up to 88 lbs/min.'
      },
      {
        id: 'chra-bearings',
        name: 'Dual Ceramic Bearing Center',
        title: 'Hybrid Silicon Nitride Bearing Cartridge',
        spec: 'Si3N4 Ceramic Balls | 165k RPM',
        position: [0.0, 0.0, 0.0],
        camTarget: [0.0, 0.4, 0.2],
        details: 'Generates negligible rotational drag and requires 30% less oil volume, sustaining extreme g-forces during high-speed cornering without oil starvation.'
      },
      {
        id: 'turbine-wheel',
        name: 'Inconel 718 Turbine',
        title: 'Superalloy Exhaust Wheel',
        spec: 'Inconel 718 | 1,050°C Continuous',
        position: [0.0, 0.0, -1.4],
        camTarget: [0.0, 0.0, -1.0],
        details: 'Cast from vacuum-induction melted Inconel 718 superalloy that withstands extreme exhaust backpressure and anti-lag flame cycles without micro-cracking.'
      },
      {
        id: 'wastegate-actuator',
        name: 'Billet Wastegate Canister',
        title: 'Precision Boost Actuator',
        spec: 'Pre-loaded 1.2 Bar Base Spring',
        position: [1.2, 1.1, 0.2],
        camTarget: [0.9, 0.8, 0.2],
        details: 'Anodized CNC actuator with reinforced fluorosilicone diaphragm and micrometer-threaded adjustment linkage rod.'
      }
    ],
    componentsList: [
      { id: 'compressor-cover', name: 'Anti-Surge Compressor Volute', material: 'Cast A356-T6 Aluminum', explodedOffset: [0, 0, 1.9] },
      { id: 'impeller', name: 'Point-Milled Billet Compressor Wheel', material: 'Forged 7075-T6 Billet', explodedOffset: [0, 0, 1.1] },
      { id: 'chra', name: 'Water-Cooled Bearing Cartridge (CHRA)', material: 'Cast Iron & Brass Cartridge', explodedOffset: [0, 0, 0] },
      { id: 'turbine-wheel', name: 'Inconel 718 Turbine Wheel & Shaft', material: 'High-Nickel Inconel 718', explodedOffset: [0, 0, -1.0] },
      { id: 'turbine-housing', name: 'Twin-Scroll Ni-Resist Turbine Housing', material: 'Ni-Resist D-5S Cast Iron', explodedOffset: [0, 0, -2.1] },
      { id: 'actuator', name: 'Billet Pneumatic Wastegate Assembly', material: '6061 Billet & Fluorosilicone', explodedOffset: [1.6, 1.4, 0.3] }
    ]
  },
  {
    id: 'apex-susp-03',
    modelType: 'coilover',
    sku: 'APX-SUSP-MT-992-CS',
    oemRef: 'OEM-992.411.025.D / BIL-48-265147',
    name: 'Apex Pro-Circuit Inverted Monotube 2-Way Adjustable Coilover Damper',
    category: 'Chassis & Suspension',
    shortCategory: 'Suspension',
    badge: 'Nürburgring Nordschleife Tuned',
    price: 1980,
    currency: 'USD',
    inStock: 12,
    leadTime: 'In Stock - Dispatched within 12h (Munich Hub)',
    weightKg: 4.9,
    weightLbs: 10.8,
    weightSavings: '-3.1 kg vs OEM Adaptive Strut',
    dimensions: {
      diameter: '52 mm Threaded Body / 46 mm Piston',
      thickness: 'Stroke: 115 mm / Lowering: 15-45 mm',
      minThickness: 'Inverted Chrome Shaft: 40 mm O.D.',
      caliperPistons: 'Independent 24-Click Rebound & Bump',
      mountingPitch: 'Radial Monoball Camber Top Mount'
    },
    materials: {
      rotorFrictionRing: 'High-Tensile Cold-Coiled Silicon Chrome Spring Steel (SAE 9254)',
      bellHat: 'Heavy-Duty Electro-Plated Zinc-Nickel Steel Threaded Cartridge',
      caliperBody: 'Billet 7075-T6 Aluminum Pillowball Camber Plate',
      pistons: 'Polished Induction-Hardened 40mm Inverted Chrome Damper Shaft',
      hardware: 'Hard-Anodized Aluminum Lock Rings with Delrin Thrust Washers'
    },
    engineeringSpecs: {
      maxOperatingTemp: '160°C Operating Range (High Viscosity Synthetic Fluid)',
      thermalDissipationRate: 'Dynamic Damping Force: Up to 5,200 N @ 0.52 m/s',
      frictionCoefficient: 'Gas Charge: 20 Bar Nitrogen High-Pressure Reservoir',
      clampingForce: 'Spring Rate: 120 N/mm (685 lbs/in) Linear Track Spec',
      fluidCompatibility: 'Red Line Synthetic Low-Cavitation Shock Oil'
    },
    description: 'Built for track-day enthusiasts and competitive circuit racers, the Pro-Circuit Monotube coilover offers independent rebound and compression damping with 24 calibrated clicks of adjustment. The inverted 46mm piston layout relocates heavy damping components to the sprung chassis side, vastly improving steering agility and tire contact patch compliance.',
    features: [
      '46mm precision-honed inverted monotube piston eliminating lateral strut deflection',
      'Dual-spring system: Main linear race spring paired with tender helper spring',
      'Laser-etched camber adjustment scale (-3.2° to +0.8°) with Teflon-lined spherical bearing',
      'Zinc-nickel anti-corrosion coating tested to 1,000+ hours salt-spray resistance',
      'Delrin thrust isolator rings eliminating spring binding and steering groan'
    ],
    hotspots: [
      {
        id: 'top-mount',
        name: 'Pillowball Camber Mount',
        title: 'CNC Camber-Adjustable Top Plate',
        spec: 'Billet 7075-T6 | -3.2° Max Camber',
        position: [0.0, 2.2, 0.0],
        camTarget: [0.0, 1.8, 0.5],
        details: 'Eliminates rubber deflection for razor-sharp steering feedback. Features stainless steel spherical bearing encased in self-lubricating PTFE.'
      },
      {
        id: 'spring-assembly',
        name: 'Progressive Spring Pack',
        title: 'SAE 9254 Dual Spring System',
        spec: 'Main 120 N/mm + Helper Spring',
        position: [0.0, 0.4, 0.0],
        camTarget: [0.0, 0.4, 0.8],
        details: 'Cold-wound silicon chrome spring steel preserves exact ride height throughout grueling endurance sessions without spring settling or sagging.'
      },
      {
        id: 'lock-perches',
        name: 'Anodized Lock Rings',
        title: 'Dual Billet Height Perches',
        spec: 'Acme High-Pitch Trapezoid Threads',
        position: [0.0, -0.6, 0.0],
        camTarget: [0.0, -0.6, 0.6],
        details: 'Rounded Acme thread design prevents dirt jamming and enables millimeter-precise corner balance cross-weight tuning.'
      },
      {
        id: 'lower-bracket',
        name: 'Radial Mounting Fork',
        title: 'Forged Lower Spindle Bracket',
        spec: 'Polyurethane High-Durometer Bushing',
        position: [0.0, -2.1, 0.0],
        camTarget: [0.0, -1.8, 0.5],
        details: 'Engineered with double-shear mounting brackets to withstand extreme lateral cornering loads without geometry deflection.'
      }
    ],
    componentsList: [
      { id: 'top-plate', name: 'Pillowball Camber Top Plate & Studs', material: 'Billet 7075-T6 Aluminum', explodedOffset: [0, 1.4, 0] },
      { id: 'bump-stop', name: 'Microcellular Polyurethane Bump Stop', material: 'Cellasto PUR Elastomer', explodedOffset: [0, 0.9, 0] },
      { id: 'main-spring', name: '120 N/mm Track Linear Racing Spring', material: 'Silicon Chrome Steel SAE 9254', explodedOffset: [0, 0.5, 0] },
      { id: 'helper-spring', name: 'Zero-Rate Tender Helper Spring', material: 'Flat-Wire High-Tensile Steel', explodedOffset: [0, -0.1, 0] },
      { id: 'lock-perches', name: 'Billet Aluminum Height Lock Rings (Pair)', material: 'Anodized 6061-T6 Billet', explodedOffset: [0, -0.6, 0] },
      { id: 'damper-body', name: 'Threaded Inverted Monotube Damper Body', material: 'Zinc-Nickel Plated Seamless Steel', explodedOffset: [0, -1.2, 0] }
    ]
  },
  {
    id: 'apex-wheel-04',
    modelType: 'wheel',
    sku: 'APX-WHL-F10-20X',
    oemRef: 'OEM-992.601.025.S / BBS-FI-R-EVO',
    name: 'Apex Forged F-10 Monoblock 20" Center-Lock Track Wheel & Semi-Slick Tire',
    category: 'Wheels & Running Gear',
    shortCategory: 'Wheels',
    badge: '10,000-Ton Forged Aerospace 6061-T6',
    price: 2150,
    currency: 'USD',
    inStock: 16,
    leadTime: 'Ready to Ship (Tokyo & Munich Warehouses)',
    weightKg: 8.9,
    weightLbs: 19.6,
    weightSavings: '-4.2 kg (-32%) Unsprung Mass per Corner',
    dimensions: {
      diameter: '20 inch x 11.5J (Rear Track Spec)',
      thickness: 'ET52 Offset / 5x130 or Center-Lock Hub',
      minThickness: 'Spoke Thickness: 4.8 mm Flank Cavity',
      caliperPistons: 'Tire: 305/30ZR20 (103Y) XL Semi-Slick',
      mountingPitch: 'OEM Porsche / AMG GT / R35 Hub Pilot'
    },
    materials: {
      rotorFrictionRing: 'Aramid-Belted High-Grip Synthetic Rubber Matrix (Treadwear 100)',
      bellHat: '10,000-Ton Forged 6061-T6 Aluminum Billet',
      caliperBody: 'Satin Titanium Ceramic Cerakote / Brushed Clearcoat',
      pistons: 'Billet 7075-T6 Red Anodized Center-Lock Nut with Safety Spring',
      hardware: 'Ultra-Lightweight Billet Aluminum Air Valve Stem with O-Ring'
    },
    engineeringSpecs: {
      maxOperatingTemp: 'Cornering Force: 1.45g Lateral Grip Threshold',
      thermalDissipationRate: 'Max Load Rating: 890 kg (1,962 lbs) per wheel',
      frictionCoefficient: 'Impact Resistance: Exceeds JWL / VIA / TÜV Standards by 25%',
      clampingForce: 'Center-Lock Torque: 600 Nm (443 lb-ft) Required',
      fluidCompatibility: 'Nitrogen Dry Gas Filled / Direct TPMS Compatible'
    },
    description: 'Forged under 10,000 tons of extreme hydraulic pressure, the F-10 Monoblock is the ultimate balance of structural rigidity, lightweight rotational inertia, and caliper clearance. Features sculpted scalloped spoke pockets inspired by Le Mans prototypes, knurled anti-slip bead seats, and track-engineered semi-slick rubber for phenomenal mechanical grip.',
    features: [
      'Flow-formed deep drop center barrel with back-milled spoke side windows',
      'Knurled bead seat ribs mechanically preventing tire rotation on the rim during 1.5g launches',
      'High-clearance inner barrel barrel geometry clearing up to 420mm carbon-ceramic calipers',
      'Center-lock cone with anti-galling dry film lubricant coating',
      'Micro-etched laser technical specifications along the inner lip with serial authenticity'
    ],
    hotspots: [
      {
        id: 'spoke-pockets',
        name: 'Milled Weight Pockets',
        title: 'CNC Back-Milled Spoke Windows',
        spec: 'Stress-Relieved Forged 6061-T6',
        position: [0.9, 0.9, 0.4],
        camTarget: [0.7, 0.7, 0.6],
        details: 'Material is strategically hollowed out from low-stress areas of each spoke, eliminating 1.2kg of rotating rotational mass without sacrificing radial load rating.'
      },
      {
        id: 'center-lock',
        name: 'Center-Lock Hub Mechanism',
        title: 'Motorsport Center-Lock Assembly',
        spec: '600 Nm Torque Spec | Safety Clip',
        position: [0.0, 0.0, 0.8],
        camTarget: [0.0, 0.0, 0.8],
        details: 'Direct motorsport heritage allowing sub-3-second wheel swaps. Includes stainless locking mechanism and conical centering washer.'
      },
      {
        id: 'tire-tread',
        name: 'Semi-Slick Tread Pattern',
        title: 'Asymmetrical Competition Tread',
        spec: 'Treadwear 100 | Dual Compound',
        position: [-1.4, 0.8, 0.0],
        camTarget: [-1.2, 0.6, 0.4],
        details: 'Features an ultra-stiff outer shoulder for razor-sharp steering turn-in and two wide longitudinal grooves for aquaplaning resistance in damp track conditions.'
      },
      {
        id: 'bead-seat',
        name: 'Knurled Bead Grips',
        title: 'Anti-Slip Knurling Texture',
        spec: 'High-Friction Machined Serrations',
        position: [0.0, -1.3, -0.4],
        camTarget: [0.0, -1.0, -0.3],
        details: 'Prevents wheel-tire rotational slip caused by the massive instantaneous torque spikes of high-boost launches and extreme carbon-ceramic braking.'
      }
    ],
    componentsList: [
      { id: 'lock-nut', name: 'Anodized Billet Center-Lock Nut & Spring', material: 'Forged 7075-T6 Aluminum', explodedOffset: [0, 0, 1.5] },
      { id: 'centering-cone', name: 'Motorsport Hub Centering Cone', material: 'Heat-Treated Hardened Steel', explodedOffset: [0, 0, 1.0] },
      { id: 'rim', name: '20" Forged Monoblock F-10 Wheel Rim', material: 'Forged 6061-T6 Aerospace Aluminum', explodedOffset: [0, 0, 0.3] },
      { id: 'tire', name: '305/30ZR20 Competition Semi-Slick Tire', material: 'High-Grip Aramid Silica Matrix', explodedOffset: [0, 0, -1.4] },
      { id: 'valve-stem', name: 'Lightweight Billet TPMS Valve Stem', material: 'Anodized Black Aluminum', explodedOffset: [0.9, -0.8, 0.8] }
    ]
  }
];
