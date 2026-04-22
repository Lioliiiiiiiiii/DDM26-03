export const siteConfig = {
  name: 'Digital Disruption Matrix 2026',
  shortName: 'DDM 2026',
  description:
    'A yearly barometer from the ESSEC Digital Disruption Chair combining data analysis and expert insight to track disruption across industries.',
  navigation: [
    { label: 'Heatmatrix', href: '/' },
    { label: 'Key Findings', href: '/key-findings' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ],
  logos: {
    primary: {
      src: 'https://essecapac.blog/wp-content/uploads/2024/08/ESSEC_BS_logo_BLANC_grand_format.png',
      alt: 'ESSEC Business School'
    },
    partners: [
      {
        src: 'https://vnjxsixxxkexpwmxfety.supabase.co/storage/v1/object/public/images//bnpplogo.png',
        alt: 'BNP Paribas'
      },
      {
        src: 'https://vnjxsixxxkexpwmxfety.supabase.co/storage/v1/object/public/images//SIA_Logo_White.png',
        alt: 'Sia'
      }
    ]
  },
  contact: {
    email: 'digitaldisruption@essec.edu',
    website: 'digitaldisruptionmatrix.com',
    location: 'ESSEC Business School · Digital Disruption Chair'
  }
};

export const heroStats = [
  { label: 'Technologies tracked', value: '5' },
  { label: 'Industries mapped', value: '10' },
  { label: 'Priority intersections', value: '50' },
  { label: 'Survey responses analyzed', value: '1,000+' }
];

export const featuredHotspots = [
  'agentic-gen-ai::information-technology',
  'blockchain-decentralized-systems::financial-services',
  'robotics-automation::information-technology',
  'quantum-computing::information-technology'
];
