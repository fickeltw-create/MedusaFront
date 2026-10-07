export interface StatItem {
  title: string;
  value: string;
  desc: string;
}

export interface StatsCard {
  title: string;
  description: string;
}

export interface StatsSection {
  badge: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  paragraph4: string;
  cards: StatsCard[];
  exploreModels: string;
  requestQuote: string;
}

export interface StatsNumbers {
    houses: string;
    countries: string;
    savings: string;
    satisfaction: string;
  }

export interface Translations {
  statsSection: StatsSection;
  statsNumbers: StatsNumbers;
  nav: {
    home: string;
    catalogue: string;
    configurateur: string;
    financement: string;
    energie: string;
    distributeurs: string;
    faq: string;
    contact: string;
    devis: string;
    promotion: string;
    langFr: string;
    langNl: string;
    langEn: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    subtitle: string;
    cta1: string;
    cta2: string;
    badge: string;
  };
  why: {
    title: string;
    subtitle: string;
    items: Array<{ title: string; desc: string }>;
  };
  stats: {
    badge: string;
    title: string;
    paragraphs: string[];
    cards: Array<{ title: string; desc: string }>;
    cta1: string;
    cta2: string;
  };
  catalog: {
    catalogTitle: string;
    catalogSubtitle: string;
    catalogCta: string;
    ctaTitle: string;
    ctaSubtitle: string;
    configure: string;
    exploreModels: string;
    viewAll: string;
    from: string;
    perMonth: string;
    size: string;
    models: string;
    previewBadge: string;
    previewTitle: string;
    boutiqueTitle: string;
    boutiqueSubtitle: string;
    visitShop: string;
    discover: string;
    marketPrice: string;
    ourPrice: string;
    financing: string;
    months: string;
    reserve: string;
    download: string;
    features: string;
    specs: string;
    delivery: string;
    stockDelivery: string;
    factoryDelivery: string;
    discount: string;
    marketPriceLabel: string;
    ourPriceLabel: string;
    financingLabel: string;
    newLabel: string;
    gallery: string;
    floorPlan: string;
    video: string;
    techSpecs: string;
  };
  models: {
    student: {
      name: string;
      tagline: string;
      features: string[];
      description: string;
    };
    tiny: {
      name: string;
      tagline: string;
      features: string[];
      description: string;
    };
    apartment: {
      name: string;
      tagline: string;
      features: string[];
      description: string;
    };
    family: {
      name: string;
      tagline: string;
      features: string[];
      description: string;
    };
    foldable: {
      name: string;
      tagline: string;
      features: string[];
      description: string;
    };
    capsule: {
      name: string;
      tagline: string;
      features: string[];
      description: string;
    };
  };
  configurator: any;
  financing: any;
  energy: {
    title: string;
    subtitle: string;
    addToHouse: string;
    learnMore: string;
    stats: StatItem[];
    products: any;
  };
  faq: {
    title: string;
    subtitle: string;
    search: string;
    filters: {
      all: string;
      technical: string;
      delivery: string;
      financing: string;
      warranty: string;
      legal: string;
    };
    noAnswer: string;
    contactTeam: string;
    contactUs: string;
    items: Array<{ q: string; a: string }>;
  };
  testimonials: {
    title: string;
    items: Array<{
      name: string;
      role: string;
      text: string;
      rating: number;
    }>;
  };
  videoSection: {
    title: string;
    subtitle: string;
  };
  distributeurs: any;
  promotions: {
    exclusiveOffers: string;
    heroDescription: string;
    discoverOffer: string;
    needMoreInfo: string;
    ctaDescription: string;
    home: string;
    promotions: string;
    promotionStudentHousing: string;
    heroHeadline: string;
    heroDescriptionDetail: string;
    viewFinancing: string;
    seeTheHouse: string;
    size: string;
    price: string;
    delivery: string;
    floorPlanTopView: string;
    livingSurface: string;
    structure: string;
    structureValue: string;
    certification: string;
    certificationValue: string;
    deliveryLabel: string;
    squareMeters: string;
    oneWeek: string;
    weeks: string;
    houseDescription: string;
    process: string;
    howItWorks: string;
    processDescription: string;
    reserve: string;
    reserveDesc: string;
    prepare: string;
    prepareDesc: string;
    deliver: string;
    deliverDesc: string;
    enjoy: string;
    enjoyDesc: string;
    limitedOffer: string;
    discount: string;
    fastDelivery: string;
    deliveryWeeks: string;
    warranty: string;
    warrantyYears: string;
    premiumQuality: string;
    durableMaterials: string;
    turnkey: string;
    readyToLive: string;
    bookNow: string;
    requestQuote: string;
    depositToReserve: string;
    financing: string;
    accessibleMonthlyPayments: string;
    financingDescription: string;
    formula: string;
    monthlyPayment: string;
    duration: string;
    classic: string;
    extended: string;
    longterm: string;
    months: string;
    readyToStart: string;
    contactUs: string;
    securePayment: string;
    fullyRefundableDeposit: string;
    warranty10Years: string;
    frenchBuilder: string;
    fastDeliveryShort: string;
    weeksOnly: string;
  };
  contact: {
    title: string;
    subtitle: string;
    generalContact: string;
    generalContactDesc: string;
    requestQuote: string;
    requestQuoteDesc: string;
    becomeDistributor: string;
    becomeDistributorDesc: string;
    becomeInstaller: string;
    becomeInstallerDesc: string;
    formTypes: {
      contact: { label: string; desc: string };
      quote: { label: string; desc: string };
      distributor: { label: string; desc: string };
      installer: { label: string; desc: string };
    };
    form: any;
    info: {
      addressLabel: string;
      address: string;
      phoneLabel: string;
      phone: string[];
      emailLabel: string;
      email: string;
      hoursLabel: string;
      hours: string;
    };
  };
  cta: {
    title: string;
    subtitle: string;
    reserve: string;
    quote: string;
  };
  footer: {
    slogan: string;
    quickLinks: string;
    links: {
      company: string;
      about: string;
      careers: string;
      press: string;
      products: string;
      catalog: string;
      configurator: string;
      energy: string;
      services: string;
      financing: string;
      installation: string;
      distributor: string;
      legal: string;
      privacy: string;
      terms: string;
    };
    rights: string;
    belgium: string;
  };
  forms: any;
};

const fr: Translations = {
  nav: {
    home: 'Accueil',
    catalogue: 'Catalogue',
    configurateur: 'Configurateur',
    financement: 'Financement',
    energie: '\u00c9co+',
    distributeurs: 'Distributeurs',
    faq: 'FAQ',
    contact: 'Contact',
    devis: 'Demander un devis',
    promotion: 'Promotions',
    langFr: 'Fran\u00e7ais',
    langNl: 'Nederlands',
    langEn: 'English',
  },
  hero: {
    headline: 'Votre maison modulaire en quelques semaines',
    subheadline: 'Design moderne, livraison rapide, prix transparents.',
    subtitle: 'Maison \u00e0 ossature m\u00e9tallique \u2022 design moderne \u2022 livraison rapide',
    cta1: 'D\u00e9couvrir les mod\u00e8les',
    cta2: 'Demander un devis',
    badge: 'Livraison 8\u201312 semaines',
  },
  stats: {
    badge: '\u00c0 propos de Modura',
    title: 'Constructeur de maisons \u00e0 ossature m\u00e9tallique : une expertise premium au service de votre projet',
    paragraphs: [
      'Modura con\u00e7oit et fabrique des maisons modulaires \u00e0 ossature m\u00e9tallique pour des projets r\u00e9sidentiels modernes, durables et parfaitement int\u00e9gr\u00e9s \u00e0 leur environnement.',
      'Notre \u00e9quipe r\u00e9unit architectes, ing\u00e9nieurs et professionnels de la construction autour d\u2019une vision claire : cr\u00e9er des maisons performantes, esth\u00e9tiques et livr\u00e9es avec une qualit\u00e9 de fabrication \u00e9lev\u00e9e.',
      'Nous accompagnons chaque projet depuis la conception jusqu\u2019\u00e0 la livraison, avec un fort accent sur la personnalisation, la rapidit\u00e9 de mise en \u0153uvre et la conformit\u00e9 technique.',
      'Chez Modura, chaque maison est pens\u00e9e comme une solution de construction modulaire certifi\u00e9e, et non comme un container maritime r\u00e9habilit\u00e9.'
    ],
    cards: [
      {
        title: 'Architectes et designers',
        desc: 'Des maisons \u00e0 ossature m\u00e9tallique modernes, \u00e9l\u00e9gantes et pens\u00e9es pour un confort optimal au quotidien.'
      },
      {
        title: 'Ing\u00e9nieurs et planning',
        desc: 'Une organisation pr\u00e9cise pour garantir une construction modulaire performante, rapide et ma\u00eetris\u00e9e.'
      },
      {
        title: '\u00c9quipe de chantier',
        desc: 'Des professionnels exp\u00e9riment\u00e9s pour une mise en \u0153uvre fiable, propre et conforme aux standards de qualit\u00e9.'
      },
      {
        title: 'Maisons certifi\u00e9es',
        desc: 'Modura d\u00e9veloppe des maisons modulaires certifi\u00e9es \u00e0 ossature m\u00e9tallique, con\u00e7ues pour durer et r\u00e9pondre aux attentes du march\u00e9.'
      }
    ],
    cta1: 'Explorer les mod\u00e8les',
    cta2: 'Demander un devis'
  },
  why: {
    title: 'Pourquoi choisir MODURA ?',
    subtitle: 'Une nouvelle fa\u00e7on de devenir propri\u00e9taire, simple et accessible.',
    items: [
      { title: 'Livraison Rapide', desc: 'Stock disponible en 1 semaine, fabrication sur commande en 8\u201312 semaines.' },
      { title: 'Prix Accessibles', desc: 'Jusqu\'\u00e0 50% moins cher que le march\u00e9 traditionnel. Financement disponible.' },
      { title: '\u00c9cologique', desc: 'Construction durable, mat\u00e9riaux responsables, options solaires int\u00e9gr\u00e9es.' },
      { title: 'Fabrication Moderne', desc: 'Con\u00e7u en usine avec pr\u00e9cision, livr\u00e9 pr\u00eat \u00e0 installer sur votre terrain.' },
      { title: 'Garantie Constructeur', desc: 'Garantie compl\u00e8te sur toutes nos maisons. Service apr\u00e8s-vente d\u00e9di\u00e9.' },
      { title: 'Personnalisable', desc: 'Configurez votre maison : couleurs, toit, \u00e9nergie, selon vos besoins.' },
    ],
  },
  statsNumbers: {
    houses: 'Maisons livr\u00e9es',
    countries: 'Pays couverts',
    savings: 'D\'\u00e9conomies vs march\u00e9',
    satisfaction: 'Satisfaction client',
  },
  catalog: {
    catalogTitle: 'Le Catalogue Modura',
    catalogSubtitle: 'Parcourez la collection officielle de mod\u00e8les Modura \u2014 des mod\u00e8les pens\u00e9s et fabriqu\u00e9s pour la qualit\u00e9 et la durabilit\u00e9.',
    catalogCta: 'Explorer les mod\u00e8les',
    ctaTitle: 'Cr\u00e9ez votre maison sur mesure',
    ctaSubtitle: 'Configurez chaque d\u00e9tail et visualisez en temps r\u00e9el.',
    configure: 'Configurer',
    exploreModels: 'Explorer les mod\u00e8les',
    viewAll: 'Voir tout le catalogue',
    from: '\u00c0 partir de',
    perMonth: '/mois',
    size: 'Taille',
    models: 'mod\u00e8le(s)',
    discover: 'D\u00e9couvrir',
    marketPrice: 'Prix du march\u00e9',
    ourPrice: 'Notre prix',
    financing: 'Financement',
    months: 'mois',
    reserve: 'R\u00e9server maintenant',
    download: 'T\u00e9l\u00e9charger la brochure',
    features: 'Caract\u00e9ristiques',
    specs: 'Sp\u00e9cifications',
    delivery: 'Livraison',
    stockDelivery: '1 semaine (stock)',
    factoryDelivery: '8\u201312 semaines (sur commande)',
    discount: 'de remise',
    marketPriceLabel: 'Prix du march\u00e9',
    ourPriceLabel: 'Notre prix',
    financingLabel: 'Financement',
    newLabel: 'Nouveau',
    gallery: 'Galerie photos',
    floorPlan: 'Plan d\'\u00e9tage',
    video: 'Vid\u00e9o de pr\u00e9sentation',
    techSpecs: 'Fiche technique',
    previewBadge: 'Mod\u00e8les premium',
    previewTitle: 'Les mod\u00e8les Modura',
    boutiqueTitle: 'La Boutique Modura',
    boutiqueSubtitle: 'Trouvez les accessoires, options et services pour finaliser votre mod\u00e8le directement dans la boutique Modura.',
    visitShop: 'Visiter notre boutique',
  },
  models: {
    student: {
      name: 'Maison \u00c9tudiante',
      tagline: 'Id\u00e9ale pour les \u00e9tudiants et la location Airbnb',
      features: ['Studio', 'Salle de bain', 'Kitchenette', 'Logement \u00e9tudiant', 'Usage Airbnb'],
      description: 'La solution parfaite pour les \u00e9tudiants en qu\u00eate d\'ind\u00e9pendance ou les investisseurs souhaitant g\u00e9n\u00e9rer des revenus locatifs. Compacte, moderne et enti\u00e8rement \u00e9quip\u00e9e.',
    },
    tiny: {
      name: 'Mini-Maison',
      tagline: 'Devenez propri\u00e9taire pour moins que votre loyer',
      features: ['1 chambre', 'Salle de bain', 'Salon', 'Cuisine'],
      description: 'Compacte, intelligente et pr\u00eate \u00e0 habiter. Cette maison modulaire de 40 m\u00b2 allie design moderne et vie fonctionnelle. Que vous soyez un \u00e9tudiant cherchant votre premier espace ind\u00e9pendant, un jeune professionnel qui veut arr\u00eater de payer un loyer, ou un investisseur \u00e0 la recherche d\'un bien locatif \u00e0 haut rendement \u2014 cette maison offre valeur, qualit\u00e9 et rapidit\u00e9. Construction durable \u00e0 ossature acier, certifi\u00e9e CE, livr\u00e9e sur votre terrain en quelques semaines.',
    },
    apartment: {
      name: 'Maison Appartement',
      tagline: 'Le parfait \u00e9quilibre entre espace et budget',
      features: ['2 chambres', 'Salle de bain', 'Salon', 'Salle \u00e0 manger'],
      description: 'Le parfait \u00e9quilibre entre espace et budget. Cette maison appartement de 60 m\u00b2 offre deux chambres spacieuses, une cuisine fonctionnelle et une agencement intelligente qui optimise chaque m\u00e8tre carr\u00e9. Que vous soyez une jeune famille \u00e0 la recherche de votre premi\u00e8re maison, un professionnel qui souhaite investir dans l\'immobilier, ou quelqu\'un qui veut simplement plus d\'espace sans payer le prix fort \u2014 cette maison est la solution id\u00e9ale. Ossature acier durable, certifi\u00e9e CE, livr\u00e9e en quelques semaines.',
    },
    family: {
      name: 'Maison Familiale',
      tagline: 'L\'espace que votre famille m\u00e9rite',
      features: ['4 chambres', '2 salles de bain', 'Grande cuisine', 'Espaces de vie g\u00e9n\u00e9reux'],
      description: 'L\'espace que votre famille m\u00e9rite. Cette maison familiale de 120 m\u00b2 offre quatre chambres spacieuses, deux salles de bain modernes et des espaces de vie g\u00e9n\u00e9reux con\u00e7us pour passer du temps de qualit\u00e9 ensemble. Que vous soyez une famille grandissante qui a besoin de place pour tout le monde, ou que vous refusiez simplement de faire des compromis sur le confort et la qualit\u00e9 \u2014 cette maison est parfaite. Construite avec une ossature acier durable, certifi\u00e9e CE, et finie selon les normes les plus \u00e9lev\u00e9es. Plus de loyer. Plus d\'attente. L\'avenir de votre famille commence ici.',
    },
    foldable: {
      name: 'Maison Pliable',
      tagline: 'Portable, flexible et d\u00e9ployable en quelques heures',
      features: ['Portable', 'Pliable', 'D\u00e9ploiement rapide', 'Maison de vacances'],
      description: 'La r\u00e9volution dans le logement modulaire. Cette maison se d\u00e9ploie en quelques heures seulement, vous permettant de l\'installer o\u00f9 vous le souhaitez.',
    },
    capsule: {
      name: 'Capsule Spatiale',
      tagline: 'Un habitat non conventionnel pour les audacieux',
      features: ['40 m\u00b2', '1 chambre', 'Ossature acier', 'Design futuriste', 'Id\u00e9ale pour les nomades', 'Vie minimaliste'],
      description: 'Un habitat non conventionnel pour les audacieux. La Space Capsule n\'est pas seulement une maison \u2014 c\'est un statement. Con\u00e7ue pour ceux qui pensent diff\u00e9remment, cet espace de vie modulaire de 40 m\u00b2 allie esth\u00e9tique futuriste et fonctionnalit\u00e9 pratique. Parfait pour les nomades digitaux, les minimalistes, ou comme un investissement Airbnb unique. Construite avec une ossature acier durable, certifi\u00e9e CE, et finie selon les normes les plus \u00e9lev\u00e9es. Sortez du lot. Vivez diff\u00e9remment.',
    },
  },
  configurator: {
    title: 'Configurez Votre Maison',
    subtitle: 'Personnalisez chaque d\u00e9tail et obtenez votre prix en temps r\u00e9el.',
    open3D: 'Ouvrir le configurateur 3D',
    selectModel: 'Choisissez votre mod\u00e8le',
    ourModels: 'Nos mod\u00e8les :',
    edit: 'Modifier',
    summary: 'R\u00e9capitulatif',
    base: 'Base',
    exterior: 'Rev\u00eatement ext\u00e9rieur',
    roof: 'Type de toit',
    energy: 'Solutions \u00e9nerg\u00e9tiques',
    climate: 'Climatisation',
    basePrice: 'Prix de base',
    options: 'Options s\u00e9lectionn\u00e9es',
    total: 'Prix total',
    getQuote: 'Obtenir mon devis',
    sizeFilters: {
      all: 'Tous',
      compact: 'Compact (\u226420 m\u00b2)',
      medium: 'Moyen (20\u201360 m\u00b2)',
      large: 'Grand (>60 m\u00b2)',
    },
    months: 'mois',
    perMonth: '/mois',
    included: 'Inclus',
    exteriorOptions: {
      'blanc-mat': 'Blanc Mat',
      'anthracite': 'Anthracite',
      'bois-brule': 'Bois Br\u00fbl\u00e9',
      'chene-naturel': 'Ch\u00eane Naturel',
    },
    roofOptions: {
      flat: 'Toit plat',
      pitched: 'Pente moderne',
      metal: 'M\u00e9tal premium',
    },
    energyOptions: {
      solar5: 'Kit solaire 5kW',
      solar10: 'Kit solaire 10kW',
      battery: 'Batteries',
      rainwater: 'R\u00e9cup\u00e9ration eau pluie',
    },
    climateOptions: {
      ventilation: 'Ventilation',
      heating: 'Chauffage',
      cooling: 'Climatisation',
    },
    steps: {
      model: 'Mod\u00e8le',
      exterior: 'Ext\u00e9rieur',
      energy: '\u00c9nergie',
      quote: 'Devis',
    },
  },
  financing: {
    title: 'Calculateur de Financement',
    subtitle: 'Calculez vos mensualit\u00e9s en temps r\u00e9el et trouvez la formule adapt\u00e9e.',
    annualRate: 'Taux annuel',
    aprNote: 'Taux annuel effectif global indicatif',
    maxDuration: 'Dur\u00e9e maximum',
    maxPayments: '420 mensualit\u00e9s maximum',
    minDeposit: 'Acompte minimum',
    reserveText: 'Pour r\u00e9server votre maison',
    rate: '3,9%',
    maxYears: '35 ans',
    minDepositAmount: '1.000\u20ac',
    selectHouse: 'Choisissez votre maison',
    deposit: 'Apport personnel',
    duration: 'Dur\u00e9e du financement',
    monthlyPayment: 'Mensualit\u00e9 estim\u00e9e',
    totalCost: 'Co\u00fbt total',
    totalInterest: 'Int\u00e9r\u00eats totaux',
    requestFinancing: 'Demander un financement',
    monthly: '/mois',
    years: 'ans',
    months: 'mois',
    monthlyByDuration: 'Mensualit\u00e9 selon la dur\u00e9e',
    summaryHouse: 'Maison',
    summaryPrice: 'Prix',
    summaryDeposit: 'Apport',
    summaryMonthly: 'Mensualit\u00e9',
    modeCredit: 'Simuler un cr\u00e9dit',
    modeCreditTitle: 'Voir la mensualit\u00e9 et le co\u00fbt total',
    modeCreditDesc: 'Choisissez un apport et une dur\u00e9e, puis voyez ce que vous remboursez chaque mois.',
    modeInvestment: 'Simuler un investissement',
    modeInvestmentTitle: 'Projection sur 1 \u00e0 10 ans',
    modeInvestmentDesc: "Comparez stats, courbe et d\u00e9tails pour pousser la d\u00e9cision d'investir.",
    modelMonthlyTitle: 'Mensualit\u00e9s du mod\u00e8le',
    investmentHeadline: 'Projection sur 1 \u00e0 10 ans avec dividendes',
    investmentMode: 'Mode investissement',
    statsTab: 'Stats',
    detailsTab: 'D\u00e9tails',
    currentValue: 'Valeur actuelle',
    annualDividend: 'Dividende annuel',
    annualGrowth: 'Croissance annuelle',
    tenYearReturn: 'Retour potentiel 10 ans',
    modelPrice: 'Prix du mod\u00e8le',
    annualGain: 'Plus-value annuelle',
    cautiousEstimate: 'Estimation prudente',
    currentPayoutBase: 'Base cible 15 %',
    curveTitle: 'Projection du rendement sur 10 ans',
    allocationTitle: 'R\u00e9partition du potentiel',
    yearLabel: 'Ann\u00e9e',
    projectionTitle: 'Projection du rendement',
    dividendsCumulative: 'Dividendes cumul\u00e9s',
    projectedValue: 'Valeur projet\u00e9e',
    estimatedGain: 'Plus-value estim\u00e9e',
    totalPotentialReturn: 'Rendement total potentiel',
    responseUnder24h: 'R\u00e9ponse sous 24h',
    modeLabel: 'Mode',
    creditLabel: 'Cr\u00e9dit',
    investmentLabel: 'Investissement',
    estimatedAnnualDividend: 'Dividende annuel estim\u00e9',
    requestInvestmentSim: 'Demander une simulation investisseur',
    submitSimulation: 'Demander la simulation',
  },
  energy: {
    title: 'Solutions \u00c9nerg\u00e9tiques',
    subtitle: 'Rendez votre maison modulaire encore plus \u00e9cologique et \u00e9conomique.',
    addToHouse: 'Ajouter \u00e0 ma maison',
    learnMore: 'En savoir plus',
    stats: [
      { title: '\u00c9conomies annuelles', value: 'jusqu\'\u00e0 2.400\u20ac', desc: 'Avec un kit solaire 10kW' },
      { title: 'Retour sur investissement', value: '4\u20137 ans', desc: 'Selon consommation et ensoleillement' },
      { title: 'Garantie panneaux', value: '25 ans', desc: 'Performance garantie \u00e0 80%' },
    ],
    products: {
      solar5: {
        name: 'Kit Solaire 5kW',
        desc: 'Production d\'\u00e9nergie solaire pour couvrir vos besoins quotidiens. Id\u00e9al pour les petites et moyennes maisons.',
      },
      solar10: {
        name: 'Kit Solaire 10kW',
        desc: 'Puissance maximale pour une autonomie \u00e9nerg\u00e9tique compl\u00e8te. Adapt\u00e9 aux grandes maisons.',
      },
      heating: {
        name: 'Syst\u00e8me Chauffage & Climatisation',
        desc: 'Pompe \u00e0 chaleur air/air ultra-efficace. Chauffez en hiver, rafra\u00eechissez en \u00e9t\u00e9.',
      },
      ventilation: {
        name: 'Syst\u00e8me de Ventilation',
        desc: 'VMC double flux avec r\u00e9cup\u00e9ration de chaleur. Air sain et \u00e9conomies d\'\u00e9nergie.',
      },
      rainwater: {
        name: 'R\u00e9cup\u00e9ration Eau de Pluie',
        desc: 'Syst\u00e8me de r\u00e9cup\u00e9ration et filtration de l\'eau de pluie pour usage domestique.',
      },
    },
  },
  statsSection: {
    badge: '\u00c0 propos de Modura',
    title: 'Constructeur de maisons \u00e0 ossature m\u00e9tallique : une expertise premium au service de votre projet',
    paragraph1: 'Modura con\u00e7oit et fabrique des maisons modulaires \u00e0 ossature m\u00e9tallique pour des projets r\u00e9sidentiels modernes, durables et parfaitement int\u00e9gr\u00e9s \u00e0 leur environnement.',
    paragraph2: 'Notre \u00e9quipe r\u00e9unit architectes, ing\u00e9nieurs et professionnels de la construction autour d\u2019une vision claire : cr\u00e9er des maisons performantes, esth\u00e9tiques et livr\u00e9es avec une qualit\u00e9 de fabrication \u00e9lev\u00e9e.',
    paragraph3: 'Nous accompagnons chaque projet depuis la conception jusqu\u2019\u00e0 la livraison, avec un fort accent sur la personnalisation, la rapidit\u00e9 de mise en \u0153uvre et la conformit\u00e9 technique.',
    paragraph4: 'Chez Modura, chaque maison est pens\u00e9e comme une solution de construction modulaire certifi\u00e9e, et non comme un container maritime r\u00e9habilit\u00e9.',
    cards: [
      {
        title: 'Architectes et designers',
        description: 'Des maisons \u00e0 ossature m\u00e9tallique modernes, \u00e9l\u00e9gantes et pens\u00e9es pour un confort optimal au quotidien.'
      },
      {
        title: 'Ing\u00e9nieurs et planning',
        description: 'Une organisation pr\u00e9cise pour garantir une construction modulaire performante, rapide et ma\u00eetris\u00e9e.'
      },
      {
        title: '\u00c9quipe de chantier',
        description: 'Des professionnels exp\u00e9riment\u00e9s pour une mise en \u0153uvre fiable, propre et conforme aux standards de qualit\u00e9.'
      },
      {
        title: 'Maisons certifi\u00e9es',
        description: 'Modura d\u00e9veloppe des maisons modulaires certifi\u00e9es \u00e0 ossature m\u00e9tallique, con\u00e7ues pour durer et r\u00e9pondre aux attentes du march\u00e9.'
      }
    ],
    exploreModels: 'Explorer les mod\u00e8les',
    requestQuote: 'Demander un devis'
  },
  testimonials: {
    title: 'Ce que disent nos clients',
    items: [
      {
        name: 'Sophie Lecomte',
        role: '\u00c9tudiante, Bruxelles',
        text: 'J\'ai achet\u00e9 la maison \u00e9tudiante pour mes \u00e9tudes et c\'est la meilleure d\u00e9cision de ma vie. Payer 300\u20ac/mois au lieu d\'un loyer, c\'est r\u00e9volutionnaire !',
        rating: 5,
      },
      {
        name: 'Marc Dubois',
        role: 'Investisseur, Li\u00e8ge',
        text: 'J\'ai command\u00e9 3 tiny houses pour de la location saisonni\u00e8re. La qualit\u00e9 est impeccable et les d\u00e9lais ont \u00e9t\u00e9 respect\u00e9s. ROI excellent.',
        rating: 5,
      },
      {
        name: 'Familie Van den Berg',
        role: 'Familie, Gent',
        text: 'We waren sceptisch maar de kwaliteit van de Family House overtrof al onze verwachtingen. Binnen 10 weken hadden we ons droomhuis!',
        rating: 5,
      },
      {
        name: 'Pierre Martin',
        role: 'Entrepreneur, Namur',
        text: 'La Space Capsule est incroyable. Mes clients adorent s\u00e9journer dans cette maison futuriste. C\'est un investissement tr\u00e8s rentable pour l\'Airbnb premium.',
        rating: 5,
      },
    ],
  },
  videoSection: {
    title: "Comment \u00e7a marche ?",
    subtitle: "D\u00e9couvrez comment votre projet de maison modulaire va se d\u00e9rouler, de la conception \u00e0 la livraison"
  },
  faq: {
    title: 'Questions Fr\u00e9quentes',
    subtitle: 'Tout ce que vous devez savoir sur les maisons modulaires MODURA.',
    search: 'Rechercher une question...',
    filters: {
      all: 'Tous',
      technical: 'Technique',
      delivery: 'Livraison',
      financing: 'Financement',
      warranty: 'Garantie',
      legal: 'L\u00e9gal',
    },
    noAnswer: "Vous n'avez pas trouv\u00e9 votre r\u00e9ponse ?",
    contactTeam: 'Notre \u00e9quipe r\u00e9pond \u00e0 toutes vos questions sous 24h.',
    contactUs: 'Nous contacter',
    items: [
      {
        q: 'Qu\'est-ce qu\'une maison modulaire ?',
        a: 'Une maison modulaire est fabriqu\u00e9e en usine en sections (modules), puis transport\u00e9e et assembl\u00e9e sur votre terrain. Cette m\u00e9thode offre une qualit\u00e9 sup\u00e9rieure, des d\u00e9lais plus courts et des co\u00fbts r\u00e9duits par rapport \u00e0 la construction traditionnelle.',
      },
      {
        q: 'Quels sont les d\u00e9lais de livraison ?',
        a: 'Pour les mod\u00e8les en stock, la livraison est possible sous 1 semaine. Pour les commandes sur mesure, comptez 8 \u00e0 12 semaines \u00e0 partir de la confirmation de commande.',
      },
      {
        q: 'Ai-je besoin d\'un permis de construire ?',
        a: 'Oui, dans la plupart des cas un permis de construire est n\u00e9cessaire. Nous vous accompagnons dans les d\u00e9marches administratives et pouvons vous mettre en contact avec des experts locaux.',
      },
      {
        q: 'Quelle est la durabilit\u00e9 d\'une maison MODURA ?',
        a: 'Nos maisons sont con\u00e7ues pour durer plus de 50 ans avec un entretien minimal. Elles r\u00e9sistent aux conditions climatiques belges et sont conformes aux normes de construction europ\u00e9ennes.',
      },
      {
        q: 'Puis-je personnaliser ma maison ?',
        a: 'Absolument ! Utilisez notre configurateur en ligne pour choisir le rev\u00eatement ext\u00e9rieur, le type de toit, les solutions \u00e9nerg\u00e9tiques et bien plus encore. Nous pouvons \u00e9galement cr\u00e9er des configurations sur mesure.',
      },
      {
        q: 'Comment fonctionne le financement ?',
        a: 'Nous proposons des solutions de financement flexibles sur 120 ou 420 mois selon le mod\u00e8le. Le taux d\'int\u00e9r\u00eat annuel est de 3,9%. Un acompte de 1.000\u20ac est requis pour r\u00e9server votre maison.',
      },
      {
        q: 'Que comprend la garantie ?',
        a: 'Toutes nos maisons b\u00e9n\u00e9ficient d\'une garantie constructeur de 10 ans sur la structure et de 2 ans sur les \u00e9quipements. Notre service apr\u00e8s-vente est disponible 7j/7.',
      },
      {
        q: 'Peut-on installer une maison MODURA partout en Belgique ?',
        a: 'Oui, nous livrons et installons dans toute la Belgique, la France et les Pays-Bas. Notre r\u00e9seau d\'installateurs certifi\u00e9s garantit une installation professionnelle sur l\'ensemble du territoire.',
      },
    ],
  },
  contact: {
    title: 'Contactez-nous',
    subtitle: 'Notre \u00e9quipe est disponible pour r\u00e9pondre \u00e0 toutes vos questions.',
    generalContact: 'Contact g\u00e9n\u00e9ral',
    generalContactDesc: 'Une question, un renseignement',
    requestQuote: 'Demander un devis',
    requestQuoteDesc: 'Recevoir un devis personnalis\u00e9',
    becomeDistributor: 'Devenir distributeur',
    becomeDistributorDesc: 'Rejoindre notre r\u00e9seau',
    becomeInstaller: 'Devenir installateur',
    becomeInstallerDesc: 'Proposer vos services',
    formTypes: {
      contact: { label: 'Contact g\u00e9n\u00e9ral', desc: 'Une question, un renseignement' },
      quote: { label: 'Demander un devis', desc: 'Recevoir un devis personnalis\u00e9' },
      distributor: { label: 'Devenir distributeur', desc: 'Rejoindre notre r\u00e9seau' },
      installer: { label: 'Devenir installateur', desc: 'Proposer vos services' },
    },
    form: {
      name: 'Nom complet',
      email: 'Email',
      phone: 'T\u00e9l\u00e9phone',
      subject: 'Sujet',
      message: 'Message',
      send: 'Envoyer le message',
      newMessage: 'Nouveau message',
      successTitle: 'Message envoy\u00e9 !',
      success: 'Votre message a bien \u00e9t\u00e9 envoy\u00e9. Nous vous r\u00e9pondons dans les 24h.',
      error: 'Une erreur est survenue. Veuillez r\u00e9essayer.',
    },
    info: {
      addressLabel: 'Adresse',
      address: 'Chauss\u00e9e De Mons, 778B, 1660 Sint Pieters Leeuw, Belgique',
      phoneLabel: 'T\u00e9l\u00e9phones',
      phone: [
        'CEO \u2014 +32 472 72 34 76',
        'Architecture & Technical \u2014 Dirk \u2014 +32 472 41 23 40',
        'Engineer \u2014 Andr\u00e9 \u2014 +32 470 57 60 03',
      ],
      emailLabel: 'Email',
      email: 'info@modura.be',
      hoursLabel: 'Horaires',
      hours: 'Lun\u2013Ven: 9h\u201318h',
    },
  },
  distributeurs: {
    title: 'Devenir Distributeur',
    subtitle: 'Rejoignez notre r\u00e9seau de distributeurs et installez des maisons MODURA.',
    howItWorks: 'Comment \u00e7a marche',
    partners: 'Nos Partenaires',
    steps: [
      {
        number: '01',
        title: 'Candidature',
        desc: 'Remplissez le formulaire de candidature en ligne',
      },
      {
        number: '02',
        title: 'Formation',
        desc: 'Formation de 2 jours sur nos produits et process',
      },
      {
        number: '03',
        title: 'Certification',
        desc: 'Obtenez votre certificat partenaire officiel',
      },
      {
        number: '04',
        title: 'Ventes',
        desc: 'Commencez \u00e0 vendre et g\u00e9n\u00e9rez des revenus',
      },
   ],
    benefits: ['33% de remise sur tous les mod\u00e8les', 'Formation et support d\u00e9di\u00e9s', 'Acc\u00e8s au portail distributeur', 'Leads qualifi\u00e9s dans votre r\u00e9gion', 'Mat\u00e9riaux marketing exclusifs'],
    form: {
      company: 'Soci\u00e9t\u00e9',
      name: 'Nom complet',
      email: 'Email professionnel',
      phone: 'T\u00e9l\u00e9phone',
      region: 'R\u00e9gion',
      type: 'Type de partenariat',
      typeOptions: ['Distributeur', 'Installateur', 'Apporteur d\'affaires'],
      message: 'Pr\u00e9sentez votre projet',
      submit: 'Soumettre ma candidature',
    },
    portal: {
      title: 'Portail Distributeur',
      welcome: 'Bienvenue',
      dashboard: 'Tableau de bord',
      leads: 'Mes Leads',
      commissions: 'Commissions',
      downloads: 'T\u00e9l\u00e9chargements',
      marketing: 'Marketing',
      login: 'Se connecter',
      email: 'Email',
      password: 'Mot de passe',
    },
  },
  cta: {
    title: 'Pr\u00eat \u00e0 devenir propri\u00e9taire ?',
    subtitle: 'R\u00e9servez votre maison d\u00e8s aujourd\'hui avec un acompte de 1.000\u20ac.',
    reserve: 'R\u00e9server pour 1.000\u20ac',
    quote: 'Demander un devis gratuit',
  },
  footer: {
    slogan: 'Des maisons modulaires modernes accessibles \u00e0 tous.',
    quickLinks: 'Liens rapides',
    links: {
      company: 'Soci\u00e9t\u00e9',
      about: '\u00c0 propos',
      careers: 'Carri\u00e8res',
      press: 'Presse',
      products: 'Produits',
      catalog: 'Catalogue',
      configurator: 'Configurateur',
      energy: '\u00c9nergie',
      services: 'Services',
      financing: 'Financement',
      installation: 'Installation',
      distributor: 'Devenir distributeur',
      legal: 'Mentions l\u00e9gales',
      privacy: 'Confidentialit\u00e9',
      terms: 'CGV',
    },
    rights: 'Tous droits r\u00e9serv\u00e9s.',
    belgium: 'Belgique',
  },
  forms: {
    quote: {
      title: 'Demander un devis',
      subtitle: 'Recevez votre devis personnalis\u00e9 sous 24h.',
      name: 'Nom complet',
      email: 'Email',
      phone: 'T\u00e9l\u00e9phone',
      model: 'Mod\u00e8le souhait\u00e9',
      budget: 'Budget',
      message: 'Informations compl\u00e9mentaires',
      submit: 'Demander mon devis',
      success: 'Votre demande a \u00e9t\u00e9 envoy\u00e9e. Vous recevrez votre devis sous 24h.',
    },
    reservation: {
      title: 'R\u00e9server votre maison',
      subtitle: 'R\u00e9servez votre maison avec un acompte de 1.000\u20ac.',
      secure: 'Paiement s\u00e9curis\u00e9 via Stripe',
      deposit: 'Acompte de r\u00e9servation',
      amount: '1.000 \u20ac',
      pay: 'Payer l\'acompte',
    },
  },
  promotions: {
    exclusiveOffers: 'Offres exclusives',
    heroDescription: 'D\u00e9couvrez nos offres promotionnelles sur nos maisons modulaires. Des prix exceptionnels pour une dur\u00e9e limit\u00e9e.',
    discoverOffer: 'D\u00e9couvrir l\'offre',
    needMoreInfo: 'Besoin d\'informations compl\u00e9mentaires?',
    ctaDescription: 'Nos conseillers sont disponibles pour r\u00e9pondre \u00e0 toutes vos questions et vous accompagner dans votre projet.',
    home: 'Accueil',
    promotions: 'Promotions',
    promotionStudentHousing: 'Promotion \u2014 Logement \u00e9tudiant',
    heroHeadline: 'Poss\u00e9dez-la pour moins cher que votre loyer.',
    heroDescriptionDetail: 'Une maison certifi\u00e9e de 15 m\u00b2 \u00e0 structure m\u00e9tallique pour les \u00e9tudiants, les primo-acc\u00e9dants et les h\u00f4tes Airbnb. Livraison en 8 \u00e0 12 semaines.',
    viewFinancing: 'Voir le financement',
    seeTheHouse: 'D\u00e9couvrir la maison',
    size: 'Taille',
    price: 'Prix',
    delivery: 'Livraison',
    floorPlanTopView: 'Plan / Vue du dessus',
    livingSurface: 'Surface habitable',
    structure: 'Structure',
    structureValue: 'Structure en acier',
    certification: 'Certification',
    certificationValue: 'Certifi\u00e9 CE',
    deliveryLabel: 'Livraison',
    houseDescription: 'Une maison \u00e9tudiante compacte et moderne, con\u00e7ue pour optimiser chaque m\u00e8tre carr\u00e9. Id\u00e9ale pour les \u00e9tudiants ou comme investissement locatif. Construction durable et livraison rapide.',
    process: 'Processus',
    howItWorks: 'Comment \u00e7a marche',
    processDescription: 'Un processus simplifi\u00e9 pour rendre votre projet accessible et sans stress.',
    reserve: 'R\u00e9servez',
    reserveDesc: 'Versement de l\'acompte de 1.000\u20ac pour s\u00e9curiser votre maison.',
    prepare: 'Pr\u00e9parez',
    prepareDesc: 'Mise en place de votre terrain et des connexions n\u00e9cessaires.',
    deliver: 'Livraison',
    deliverDesc: 'Transport et installation sur votre terrain.',
    enjoy: 'Profitez',
    enjoyDesc: 'Votre maison est pr\u00eate \u00e0 \u00eatre habit\u00e9e imm\u00e9diatement.',
    limitedOffer: 'Offre limit\u00e9e',
    discount: 'REMISE',
    fastDelivery: 'Livraison rapide',
    deliveryWeeks: '8-12 semaines',
    warranty: 'Garantie',
    warrantyYears: '10 ans',
    premiumQuality: 'Qualit\u00e9 premium',
    durableMaterials: 'Mat\u00e9riaux durables',
    turnkey: 'Cl\u00e9 en main',
    readyToLive: 'Pr\u00eate \u00e0 habiter',
    bookNow: 'R\u00e9server maintenant',
    requestQuote: 'Demander un devis',
    depositToReserve: 'Acompte de 1.000\u20ac pour r\u00e9server',
    financing: 'Financement',
    accessibleMonthlyPayments: 'Des mensualit\u00e9s accessibles',
    financingDescription: 'Financez votre maison avec des conditions adapt\u00e9es \u00e0 votre budget.',
    formula: 'Formule',
    monthlyPayment: 'Mensualit\u00e9',
    duration: 'Dur\u00e9e',
    classic: 'Classique',
    extended: '\u00c9tendue',
    longterm: 'Longue dur\u00e9e',
    months: 'mois',
    readyToStart: 'Pr\u00eat \u00e0 commencer votre projet? Contactez nos conseillers.',
    contactUs: 'Nous contacter',
    securePayment: 'Paiement s\u00e9curis\u00e9',
    fullyRefundableDeposit: 'Acompte 100% remboursable',
    warranty10Years: 'Garantie 10 ans',
    frenchBuilder: 'Constructeur fran\u00e7ais',
    fastDeliveryShort: 'Livraison rapide',
    weeksOnly: 'semaines seulement',
    squareMeters: 'm\u00b2',
    oneWeek: '1 semaine',
    weeks: 'semaines',
  },
};

export default fr;
