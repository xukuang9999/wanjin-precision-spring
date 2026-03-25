export interface ProductSeoProfile {
  title: string;
  description: string;
  overview: string;
  keywords: string[];
}

const PRODUCT_KEYWORDS = {
  'compression-springs': [
    'compression spring manufacturer',
    'custom compression springs',
    'compression spring supplier',
    'OEM compression spring factory',
  ],
  'extension-springs': [
    'extension spring manufacturer',
    'custom extension springs',
    'tension spring manufacturer',
    'extension spring supplier',
  ],
  'torsion-springs': [
    'torsion spring manufacturer',
    'custom torsion springs',
    'torsion spring supplier',
    'OEM torsion spring factory',
  ],
  'wave-springs': [
    'wave spring manufacturer',
    'wave spring supplier',
    'custom wave springs',
    'precision wave spring factory',
  ],
  'retaining-rings': [
    'retaining ring manufacturer',
    'retaining ring supplier',
    'snap ring supplier',
    'custom retaining rings',
  ],
  'custom-wire-forms': [
    'custom wire form manufacturer',
    'wire form manufacturer',
    'custom wire forms',
    'special shaped spring supplier',
  ],
  'constant-force-springs': [
    'constant force spring manufacturer',
    'constant force spring supplier',
    'custom constant force springs',
    'motion control spring manufacturer',
  ],
  'disc-springs': [
    'disc spring manufacturer',
    'belleville spring manufacturer',
    'disc spring supplier',
    'heavy duty disc springs',
  ],
  'disc-spring-stacks': [
    'disc spring stack manufacturer',
    'disc spring stack assemblies',
    'belleville washer stack supplier',
    'heavy load spring stack',
  ],
  'hot-coil-springs': [
    'hot coil spring manufacturer',
    'large wire spring manufacturer',
    'heavy duty coil spring supplier',
    'industrial hot coiled springs',
  ],
  'die-springs': [
    'die spring manufacturer',
    'die spring supplier',
    'tooling spring manufacturer',
    'stamping die springs',
  ],
  'contact-springs': [
    'contact spring manufacturer',
    'electrical contact spring supplier',
    'precision contact springs',
    'switchgear contact springs',
  ],
  'garter-springs': [
    'garter spring manufacturer',
    'garter spring supplier',
    'seal garter spring',
    'custom garter springs',
  ],
  'flat-springs': [
    'flat spring manufacturer',
    'flat spring supplier',
    'strip spring manufacturer',
    'custom flat springs',
  ],
  'power-springs': [
    'power spring manufacturer',
    'power spring supplier',
    'clock spring manufacturer',
    'spiral power springs',
  ],
  'variable-force-springs': [
    'variable force spring manufacturer',
    'variable force spring supplier',
    'custom variable force springs',
    'progressive force spring',
  ],
  'spiral-springs': [
    'spiral spring manufacturer',
    'spiral spring supplier',
    'flat spiral spring',
    'custom spiral springs',
  ],
  'contact-clips': [
    'contact clip manufacturer',
    'conductive spring clip supplier',
    'battery contact clip manufacturer',
    'metal contact clips',
  ],
  'multi-turn-wave-springs': [
    'multi turn wave spring manufacturer',
    'wave spring supplier',
    'multi wave spring',
    'compact preload spring',
  ],
};

const buildFallbackKeywords = (productName: string) => {
  const normalizedName = productName.trim().toLowerCase();
  return [
    `${normalizedName} manufacturer`,
    `custom ${normalizedName}`,
    `${normalizedName} supplier`,
    `oem ${normalizedName}`,
  ];
};

const PRODUCT_SEO_COPY = {
  zh: {
    titleSuffix: '制造与项目配套',
    description: (productName: string) => `万锦围绕${productName}项目提供图纸评审、工艺规划、样件验证与批量交付支持。`,
    overview: (productName: string) => `${productName}项目通常需要围绕载荷目标、安装空间、材料路径和验证计划做前置确认，再进入打样与报价阶段。`,
  },
  en: {
    titleSuffix: 'Manufacturing and Supply',
    description: (productName: string) => `Wanjin supports ${productName.toLowerCase()} programs with drawing review, process planning, sample validation, and batch delivery for industrial and OEM sourcing.`,
    overview: (productName: string) => `${productName} programs are usually reviewed around load target, installation space, material route, and validation planning before quotation or sampling begins.`,
  },
  ru: {
    titleSuffix: 'производство и поставка',
    description: (productName: string) => `Wanjin поддерживает проекты по ${productName} с анализом чертежей, планированием процесса, валидацией образцов и серийными поставками.`,
    overview: (productName: string) => `Проекты по ${productName} обычно оцениваются по нагрузке, монтажному пространству, выбору материала и плану валидации до начала котировки и образцов.`,
  },
  es: {
    titleSuffix: 'fabricacion y suministro',
    description: (productName: string) => `Wanjin respalda proyectos de ${productName} con revision de planos, planificacion del proceso, validacion de muestras y entrega por lotes para compras OEM e industriales.`,
    overview: (productName: string) => `Los programas de ${productName} suelen revisarse en torno a la carga objetivo, el espacio de instalacion, la ruta del material y el plan de validacion antes de cotizar o muestrear.`,
  },
  ar: {
    titleSuffix: 'التصنيع والتوريد',
    description: (productName: string) => `تدعم Wanjin مشاريع ${productName} من خلال مراجعة الرسومات وتخطيط العملية والتحقق من العينات والتوريد الدفعي للمشتريات الصناعية وOEM.`,
    overview: (productName: string) => `عادة ما تتم مراجعة برامج ${productName} من حيث الحمل المستهدف ومساحة التركيب ومسار المواد وخطة التحقق قبل بدء التسعير أو العينات.`,
  },
  hi: {
    titleSuffix: 'निर्माण और आपूर्ति',
    description: (productName: string) => `Wanjin ${productName} परियोजनाओं के लिए ड्रॉइंग समीक्षा, प्रक्रिया योजना, सैंपल सत्यापन और बैच डिलीवरी का समर्थन करता है।`,
    overview: (productName: string) => `${productName} परियोजनाओं में आमतौर पर कोटेशन या सैंपलिंग से पहले लक्ष्य लोड, इंस्टॉलेशन स्पेस, सामग्री मार्ग और वैलिडेशन योजना की समीक्षा की जाती है।`,
  },
  pt: {
    titleSuffix: 'fabricacao e fornecimento',
    description: (productName: string) => `A Wanjin apoia programas de ${productName} com revisao de desenhos, planejamento de processo, validacao de amostras e entrega em lote para compras OEM e industriais.`,
    overview: (productName: string) => `Os programas de ${productName} normalmente sao analisados quanto a carga alvo, espaco de instalacao, rota de material e plano de validacao antes da cotacao ou da amostragem.`,
  },
  ja: {
    titleSuffix: '製造と供給',
    description: (productName: string) => `Wanjin は ${productName} の案件に対して、図面レビュー、工程計画、サンプル検証、量産供給を支援します。`,
    overview: (productName: string) => `${productName} の案件では、通常、見積もりや試作の前に、荷重目標、取付スペース、材料方針、検証計画を確認します。`,
  },
  de: {
    titleSuffix: 'Fertigung und Lieferung',
    description: (productName: string) => `Wanjin unterstutzt ${productName}-Projekte mit Zeichnungsprufung, Prozessplanung, Musterfreigabe und Serienlieferung fur industrielle und OEM-Beschaffung.`,
    overview: (productName: string) => `${productName}-Programme werden in der Regel im Hinblick auf Ziellast, Bauraum, Werkstoffpfad und Validierungsplanung gepruft, bevor Angebot oder Bemusterung startet.`,
  },
  fr: {
    titleSuffix: 'fabrication et fourniture',
    description: (productName: string) => `Wanjin accompagne les projets ${productName} avec revue de plans, planification du procede, validation d'echantillons et livraison en serie pour les achats OEM et industriels.`,
    overview: (productName: string) => `Les programmes ${productName} sont generalement examines selon la charge cible, l'espace d'installation, la filiere matiere et le plan de validation avant devis ou echantillonnage.`,
  },
};

export const getProductSeoProfile = (slug: string, productName: string, language: string): ProductSeoProfile => {
  const keywords = PRODUCT_KEYWORDS[slug] ?? buildFallbackKeywords(productName);
  const copy = PRODUCT_SEO_COPY[language] ?? PRODUCT_SEO_COPY.en;

  return {
    title: language === 'zh' ? `${productName}${copy.titleSuffix}` : `${productName} ${copy.titleSuffix}`,
    description: copy.description(productName),
    overview: copy.overview(productName),
    keywords,
  };
};
