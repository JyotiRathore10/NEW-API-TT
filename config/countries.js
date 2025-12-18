

const COUNTRIES = {
  // Version for cache control
  version: "1.0.0",
  lastUpdated: "2025-10-07T11:00:00.000Z",

  // ✅ Phone Countries List (with flags and codes)
  phoneCountries: [
    // South Asia
    { name: 'India', flag: '🇮🇳', code: '+91', iso: 'IN', region: 'South Asia' },
    { name: 'Pakistan', flag: '🇵🇰', code: '+92', iso: 'PK', region: 'South Asia' },
    { name: 'Bangladesh', flag: '🇧🇩', code: '+880', iso: 'BD', region: 'South Asia' },
    { name: 'Sri Lanka', flag: '🇱🇰', code: '+94', iso: 'LK', region: 'South Asia' },
    { name: 'Nepal', flag: '🇳🇵', code: '+977', iso: 'NP', region: 'South Asia' },
    { name: 'Bhutan', flag: '🇧🇹', code: '+975', iso: 'BT', region: 'South Asia' },
    { name: 'Maldives', flag: '🇲🇻', code: '+960', iso: 'MV', region: 'South Asia' },

    // Middle East
    { name: 'UAE', flag: '🇦🇪', code: '+971', iso: 'AE', region: 'Middle East' },
    { name: 'Saudi Arabia', flag: '🇸🇦', code: '+966', iso: 'SA', region: 'Middle East' },
    { name: 'Qatar', flag: '🇶🇦', code: '+974', iso: 'QA', region: 'Middle East' },
    { name: 'Kuwait', flag: '🇰🇼', code: '+965', iso: 'KW', region: 'Middle East' },
    { name: 'Oman', flag: '🇴🇲', code: '+968', iso: 'OM', region: 'Middle East' },
    { name: 'Bahrain', flag: '🇧🇭', code: '+973', iso: 'BH', region: 'Middle East' },
    { name: 'Jordan', flag: '🇯🇴', code: '+962', iso: 'JO', region: 'Middle East' },
    { name: 'Lebanon', flag: '🇱🇧', code: '+961', iso: 'LB', region: 'Middle East' },
    { name: 'Iraq', flag: '🇮🇶', code: '+964', iso: 'IQ', region: 'Middle East' },
    { name: 'Iran', flag: '🇮🇷', code: '+98', iso: 'IR', region: 'Middle East' },
    { name: 'Turkey', flag: '🇹🇷', code: '+90', iso: 'TR', region: 'Middle East' },
    { name: 'Israel', flag: '🇮🇱', code: '+972', iso: 'IL', region: 'Middle East' },
    { name: 'Palestine', flag: '🇵🇸', code: '+970', iso: 'PS', region: 'Middle East' },

    // Southeast Asia
    { name: 'Singapore', flag: '🇸🇬', code: '+65', iso: 'SG', region: 'Southeast Asia' },
    { name: 'Malaysia', flag: '🇲🇾', code: '+60', iso: 'MY', region: 'Southeast Asia' },
    { name: 'Indonesia', flag: '🇮🇩', code: '+62', iso: 'ID', region: 'Southeast Asia' },
    { name: 'Thailand', flag: '🇹🇭', code: '+66', iso: 'TH', region: 'Southeast Asia' },
    { name: 'Philippines', flag: '🇵🇭', code: '+63', iso: 'PH', region: 'Southeast Asia' },
    { name: 'Vietnam', flag: '🇻🇳', code: '+84', iso: 'VN', region: 'Southeast Asia' },
    { name: 'Myanmar', flag: '🇲🇲', code: '+95', iso: 'MM', region: 'Southeast Asia' },
    { name: 'Cambodia', flag: '🇰🇭', code: '+855', iso: 'KH', region: 'Southeast Asia' },
    { name: 'Laos', flag: '🇱🇦', code: '+856', iso: 'LA', region: 'Southeast Asia' },
    { name: 'Brunei', flag: '🇧🇳', code: '+673', iso: 'BN', region: 'Southeast Asia' },

    // East Asia
    { name: 'China', flag: '🇨🇳', code: '+86', iso: 'CN', region: 'East Asia' },
    { name: 'Japan', flag: '🇯🇵', code: '+81', iso: 'JP', region: 'East Asia' },
    { name: 'South Korea', flag: '🇰🇷', code: '+82', iso: 'KR', region: 'East Asia' },
    { name: 'North Korea', flag: '🇰🇵', code: '+850', iso: 'KP', region: 'East Asia' },
    { name: 'Taiwan', flag: '🇹🇼', code: '+886', iso: 'TW', region: 'East Asia' },
    { name: 'Hong Kong', flag: '🇭🇰', code: '+852', iso: 'HK', region: 'East Asia' },
    { name: 'Macau', flag: '🇲🇴', code: '+853', iso: 'MO', region: 'East Asia' },
    { name: 'Mongolia', flag: '🇲🇳', code: '+976', iso: 'MN', region: 'East Asia' },

    // North America
    { name: 'United States', flag: '🇺🇸', code: '+1', iso: 'US', region: 'North America' },
    { name: 'Canada', flag: '🇨🇦', code: '+1', iso: 'CA', region: 'North America' },
    { name: 'Mexico', flag: '🇲🇽', code: '+52', iso: 'MX', region: 'North America' },

    // Europe
    { name: 'United Kingdom', flag: '🇬🇧', code: '+44', iso: 'GB', region: 'Europe' },
    { name: 'Germany', flag: '🇩🇪', code: '+49', iso: 'DE', region: 'Europe' },
    { name: 'France', flag: '🇫🇷', code: '+33', iso: 'FR', region: 'Europe' },
    { name: 'Italy', flag: '🇮🇹', code: '+39', iso: 'IT', region: 'Europe' },
    { name: 'Spain', flag: '🇪🇸', code: '+34', iso: 'ES', region: 'Europe' },
    { name: 'Netherlands', flag: '🇳🇱', code: '+31', iso: 'NL', region: 'Europe' },
    { name: 'Belgium', flag: '🇧🇪', code: '+32', iso: 'BE', region: 'Europe' },
    { name: 'Switzerland', flag: '🇨🇭', code: '+41', iso: 'CH', region: 'Europe' },
    { name: 'Austria', flag: '🇦🇹', code: '+43', iso: 'AT', region: 'Europe' },
    { name: 'Sweden', flag: '🇸🇪', code: '+46', iso: 'SE', region: 'Europe' },
    { name: 'Norway', flag: '🇳🇴', code: '+47', iso: 'NO', region: 'Europe' },
    { name: 'Denmark', flag: '🇩🇰', code: '+45', iso: 'DK', region: 'Europe' },
    { name: 'Finland', flag: '🇫🇮', code: '+358', iso: 'FI', region: 'Europe' },
    { name: 'Poland', flag: '🇵🇱', code: '+48', iso: 'PL', region: 'Europe' },
    { name: 'Portugal', flag: '🇵🇹', code: '+351', iso: 'PT', region: 'Europe' },
    { name: 'Greece', flag: '🇬🇷', code: '+30', iso: 'GR', region: 'Europe' },
    { name: 'Ireland', flag: '🇮🇪', code: '+353', iso: 'IE', region: 'Europe' },
    { name: 'Russia', flag: '🇷🇺', code: '+7', iso: 'RU', region: 'Europe' },

    // Oceania
    { name: 'Australia', flag: '🇦🇺', code: '+61', iso: 'AU', region: 'Oceania' },
    { name: 'New Zealand', flag: '🇳🇿', code: '+64', iso: 'NZ', region: 'Oceania' },
    { name: 'Fiji', flag: '🇫🇯', code: '+679', iso: 'FJ', region: 'Oceania' },
    { name: 'Papua New Guinea', flag: '🇵🇬', code: '+675', iso: 'PG', region: 'Oceania' },

    // Africa
    { name: 'South Africa', flag: '🇿🇦', code: '+27', iso: 'ZA', region: 'Africa' },
    { name: 'Egypt', flag: '🇪🇬', code: '+20', iso: 'EG', region: 'Africa' },
    { name: 'Nigeria', flag: '🇳🇬', code: '+234', iso: 'NG', region: 'Africa' },
    { name: 'Kenya', flag: '🇰🇪', code: '+254', iso: 'KE', region: 'Africa' },
    { name: 'Ethiopia', flag: '🇪🇹', code: '+251', iso: 'ET', region: 'Africa' },
    { name: 'Ghana', flag: '🇬🇭', code: '+233', iso: 'GH', region: 'Africa' },
    { name: 'Morocco', flag: '🇲🇦', code: '+212', iso: 'MA', region: 'Africa' },
    { name: 'Tanzania', flag: '🇹🇿', code: '+255', iso: 'TZ', region: 'Africa' },
    { name: 'Uganda', flag: '🇺🇬', code: '+256', iso: 'UG', region: 'Africa' },
    { name: 'Algeria', flag: '🇩🇿', code: '+213', iso: 'DZ', region: 'Africa' },

    // South America
    { name: 'Brazil', flag: '🇧🇷', code: '+55', iso: 'BR', region: 'South America' },
    { name: 'Argentina', flag: '🇦🇷', code: '+54', iso: 'AR', region: 'South America' },
    { name: 'Chile', flag: '🇨🇱', code: '+56', iso: 'CL', region: 'South America' },
    { name: 'Colombia', flag: '🇨🇴', code: '+57', iso: 'CO', region: 'South America' },
    { name: 'Peru', flag: '🇵🇪', code: '+51', iso: 'PE', region: 'South America' },
    { name: 'Venezuela', flag: '🇻🇪', code: '+58', iso: 'VE', region: 'South America' },
  ],

  // ✅ Get country by ISO code
  getCountryByISO: function(isoCode) {
    return this.phoneCountries.find(c => c.iso === isoCode.toUpperCase());
  },

  // ✅ Get country by phone code
  getCountryByPhone: function(phoneCode) {
    return this.phoneCountries.find(c => c.code === phoneCode);
  },

  // ✅ Get countries by region
  getCountriesByRegion: function(region) {
    return this.phoneCountries.filter(c => c.region === region);
  },

  // ✅ Search countries by name
  searchCountries: function(query) {
    const lowerQuery = query.toLowerCase();
    return this.phoneCountries.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.iso.toLowerCase().includes(lowerQuery) ||
      c.code.includes(query)
    );
  },

  // ✅ Get all regions
  getAllRegions: function() {
    return [...new Set(this.phoneCountries.map(c => c.region))].sort();
  },

  // ✅ Get popular countries (top 10)
  getPopularCountries: function() {
    const popular = ['IN', 'US', 'GB', 'AE', 'AU', 'CA', 'SG', 'MY', 'SA', 'PK'];
    return popular.map(iso => this.getCountryByISO(iso)).filter(Boolean);
  }
};

module.exports = COUNTRIES;
