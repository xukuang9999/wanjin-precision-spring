export interface ProductSeoProfile {
  title: string;
  description: string;
  overview: string;
  keywords: string[];
}

const DEFAULT_OVERVIEW_SUFFIX =
  'The page is written for OEM buyers and engineering teams comparing manufacturing fit, load targets, material options, and batch delivery readiness.';

const PRODUCT_SEO_PROFILES: Record<string, ProductSeoProfile> = {
  'compression-springs': {
    title: 'Custom Compression Spring Manufacturer',
    description:
      'Source custom compression springs from Wanjin for industrial equipment, automotive parts, and OEM assemblies with drawing review, material selection, and batch production support.',
    overview:
      'Compression spring projects usually start with load, stroke, free length, and end-form requirements. This page aligns those engineering inputs with custom compression spring manufacturing and supplier selection.',
    keywords: [
      'compression spring manufacturer',
      'custom compression springs',
      'compression spring supplier',
      'OEM compression spring factory',
    ],
  },
  'extension-springs': {
    title: 'Custom Extension Spring Manufacturer',
    description:
      'Order custom extension springs with hook design, corrosion-resistant finishes, and batch consistency support for industrial doors, machinery, and engineered assemblies.',
    overview:
      'Extension spring sourcing depends on hook geometry, initial tension, cycle life, and corrosion control. The content here is tuned to buyers comparing custom extension spring manufacturers and suppliers.',
    keywords: [
      'extension spring manufacturer',
      'custom extension springs',
      'tension spring manufacturer',
      'extension spring supplier',
    ],
  },
  'torsion-springs': {
    title: 'Custom Torsion Spring Manufacturer',
    description:
      'Work with a torsion spring manufacturer for custom leg geometry, torque control, preload targets, and repeatable production for hinges, latches, and industrial mechanisms.',
    overview:
      'Torsion spring programs are usually evaluated by torque angle, leg configuration, installation direction, and fatigue life. This page helps buyers match those needs to a custom torsion spring supplier.',
    keywords: [
      'torsion spring manufacturer',
      'custom torsion springs',
      'torsion spring supplier',
      'OEM torsion spring factory',
    ],
  },
  'wave-springs': {
    title: 'Wave Spring Manufacturer',
    description:
      'Source wave springs for compact assemblies, preload control, and limited axial space with precision manufacturing and engineering support for OEM programs.',
    overview:
      'Wave spring buyers normally compare axial space savings, preload stability, and tolerance control. The page is positioned around those search and sourcing priorities.',
    keywords: [
      'wave spring manufacturer',
      'wave spring supplier',
      'custom wave springs',
      'precision wave spring factory',
    ],
  },
  'retaining-rings': {
    title: 'Retaining Ring Manufacturer',
    description:
      'Custom retaining rings and snap rings for axial positioning, locking, and installation stability with size customization and industrial batch supply support.',
    overview:
      'Retaining ring sourcing often includes snap ring equivalents, groove fit, installation style, and material selection. This page is tuned to that buyer language and application logic.',
    keywords: [
      'retaining ring manufacturer',
      'retaining ring supplier',
      'snap ring supplier',
      'custom retaining rings',
    ],
  },
  'custom-wire-forms': {
    title: 'Custom Wire Form Manufacturer',
    description:
      'Develop custom wire forms and special-shaped springs from drawings or samples with feasibility review, process planning, and batch production for industrial assemblies.',
    overview:
      'Custom wire form projects usually involve drawing review, interference checks, bend sequence, and revision control. This page is written for buyers sourcing custom wire form manufacturers for non-standard parts.',
    keywords: [
      'custom wire form manufacturer',
      'wire form manufacturer',
      'custom wire forms',
      'special shaped spring supplier',
    ],
  },
  'constant-force-springs': {
    title: 'Constant Force Spring Manufacturer',
    description:
      'Constant force springs for retraction, counterbalance, and motion-control mechanisms with long-travel output consistency and custom end configuration support.',
    overview:
      'Constant force spring sourcing usually centers on output stability, travel, drum fit, and life targets. The page is aligned with those engineering and procurement search terms.',
    keywords: [
      'constant force spring manufacturer',
      'constant force spring supplier',
      'custom constant force springs',
      'motion control spring manufacturer',
    ],
  },
  'disc-springs': {
    title: 'Disc Spring Manufacturer',
    description:
      'Disc springs and Belleville spring solutions for heavy-load clamping, buffering, and compact high-force applications in power and industrial equipment.',
    overview:
      'Disc spring buyers often search for Belleville spring manufacturers when they need high load in short travel. This page connects that search behavior to heavy-duty spring applications.',
    keywords: [
      'disc spring manufacturer',
      'belleville spring manufacturer',
      'disc spring supplier',
      'heavy duty disc springs',
    ],
  },
  'disc-spring-stacks': {
    title: 'Disc Spring Stack Assemblies',
    description:
      'Disc spring stack assemblies in series, parallel, or combined arrangements for tuned load-deflection performance in heavy-duty industrial systems.',
    overview:
      'Stacked disc spring projects are usually sourced around force curve tuning, stack arrangement, and installation constraints. The page now reflects that buyer intent more directly.',
    keywords: [
      'disc spring stack manufacturer',
      'disc spring stack assemblies',
      'belleville washer stack supplier',
      'heavy load spring stack',
    ],
  },
  'hot-coil-springs': {
    title: 'Hot Coil Spring Manufacturer',
    description:
      'Hot coil springs for large wire diameters, heavy machinery, and power equipment with medium-frequency induction capability and heavy-load validation support.',
    overview:
      'Large wire spring sourcing is usually driven by load density, fatigue resistance, and hot coiling capability. This page speaks directly to hot coil spring manufacturer searches.',
    keywords: [
      'hot coil spring manufacturer',
      'large wire spring manufacturer',
      'heavy duty coil spring supplier',
      'industrial hot coiled springs',
    ],
  },
  'die-springs': {
    title: 'Die Spring Manufacturer',
    description:
      'Die springs for stamping dies, tooling systems, and high-cycle industrial assemblies with color-coded load classes and repeatable batch production support.',
    overview:
      'Die spring buyers usually compare load class, installation space, fatigue life, and tooling-cycle stability. This page is tuned to teams sourcing die spring manufacturers for production tooling programs.',
    keywords: [
      'die spring manufacturer',
      'die spring supplier',
      'tooling spring manufacturer',
      'stamping die springs',
    ],
  },
  'contact-springs': {
    title: 'Contact Spring Manufacturer',
    description:
      'Precision contact springs for electrical reliability, stable contact force, and repeatable production in switchgear, connectors, and control assemblies.',
    overview:
      'Contact spring sourcing usually depends on force stability, finish selection, conductivity, and assembly tolerance. This page is positioned around those electrical-contact buying terms.',
    keywords: [
      'contact spring manufacturer',
      'electrical contact spring supplier',
      'precision contact springs',
      'switchgear contact springs',
    ],
  },
  'garter-springs': {
    title: 'Garter Spring Manufacturer',
    description:
      'Garter springs for sealing preload, circular retention, and compensation in cylindrical assemblies with custom diameter and material support.',
    overview:
      'Garter spring projects are usually sourced around seal performance, ring geometry, material choice, and corrosion resistance. The page now matches that supplier-selection language more closely.',
    keywords: [
      'garter spring manufacturer',
      'garter spring supplier',
      'seal garter spring',
      'custom garter springs',
    ],
  },
  'flat-springs': {
    title: 'Flat Spring Manufacturer',
    description:
      'Flat springs and strip-formed elastic components for contact systems, locking mechanisms, and compact precision assemblies with custom forming support.',
    overview:
      'Flat spring buyers often compare strip material, forming repeatability, contact performance, and burr control. This page addresses those manufacturing and sourcing priorities.',
    keywords: [
      'flat spring manufacturer',
      'flat spring supplier',
      'strip spring manufacturer',
      'custom flat springs',
    ],
  },
  'power-springs': {
    title: 'Power Spring Manufacturer',
    description:
      'Power springs for energy storage, rewind mechanisms, and controlled return motion with custom torque output and batch production support.',
    overview:
      'Power spring programs are usually evaluated by torque curve, rewind life, drum fit, and material route. This page is written for buyers comparing power spring manufacturers and suppliers.',
    keywords: [
      'power spring manufacturer',
      'power spring supplier',
      'clock spring manufacturer',
      'spiral power springs',
    ],
  },
  'variable-force-springs': {
    title: 'Variable Force Spring Manufacturer',
    description:
      'Variable force springs for progressive load response, staged return force, and engineered motion systems with custom force-curve support.',
    overview:
      'Variable force spring sourcing usually centers on force curve design, travel behavior, and installation geometry. The page is aligned with that custom engineering intent.',
    keywords: [
      'variable force spring manufacturer',
      'variable force spring supplier',
      'custom variable force springs',
      'progressive force spring',
    ],
  },
  'spiral-springs': {
    title: 'Spiral Spring Manufacturer',
    description:
      'Spiral springs for rewind, torque storage, and compact motion-control mechanisms with custom material and geometry options for OEM assemblies.',
    overview:
      'Spiral spring buyers typically compare torque output, winding geometry, life target, and space envelope. This page helps connect those requirements to supplier capability.',
    keywords: [
      'spiral spring manufacturer',
      'spiral spring supplier',
      'flat spiral spring',
      'custom spiral springs',
    ],
  },
  'contact-clips': {
    title: 'Contact Clip Manufacturer',
    description:
      'Contact clips and conductive spring clips for electrical connection, retention, and contact compensation in precision and industrial assemblies.',
    overview:
      'Contact clip projects are usually sourced around conductivity, retention force, stamping consistency, and finish choice. This page maps to that procurement language.',
    keywords: [
      'contact clip manufacturer',
      'conductive spring clip supplier',
      'battery contact clip manufacturer',
      'metal contact clips',
    ],
  },
  'multi-turn-wave-springs': {
    title: 'Multi Turn Wave Spring Manufacturer',
    description:
      'Multi turn wave springs for compact axial assemblies needing higher travel, stable preload, and precision manufacturing support.',
    overview:
      'Multi turn wave spring sourcing usually depends on preload stability, travel range, and tolerance control in space-limited assemblies. This page is positioned around those buyer priorities.',
    keywords: [
      'multi turn wave spring manufacturer',
      'wave spring supplier',
      'multi wave spring',
      'compact preload spring',
    ],
  },
};

export const getProductSeoProfile = (slug: string, productName: string): ProductSeoProfile => {
  const profile = PRODUCT_SEO_PROFILES[slug];

  if (profile) {
    return profile;
  }

  return {
    title: `${productName} Manufacturer`,
    description: `Source ${productName.toLowerCase()} from Wanjin for industrial, OEM, and custom manufacturing programs with engineering review and batch delivery support.`,
    overview: `${productName} sourcing usually depends on drawing clarity, manufacturing route, material selection, and validation planning. ${DEFAULT_OVERVIEW_SUFFIX}`,
    keywords: [
      `${productName.toLowerCase()} manufacturer`,
      `custom ${productName.toLowerCase()}`,
      `${productName.toLowerCase()} supplier`,
      `OEM ${productName.toLowerCase()}`,
    ],
  };
};
