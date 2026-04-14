export interface Unit {
  label: string;
  multiplier: number;
  offset?: number;
}

export interface UnitGroup {
  base: string;
  isDynamic?: boolean;
  units: Record<string, Unit>;
}

export interface CommonUnits {
  currencies: { label: string; value: string }[];
  measurements: Record<string, string[]>;
}

export const UNIT_GROUPS: Record<string, UnitGroup> = {
  Length: {
    base: "m",
    units: {
      "m": { label: "Meters (m)", multiplier: 1 },
      "cm": { label: "Centimeters (cm)", multiplier: 0.01 },
      "mm": { label: "Millimeters (mm)", multiplier: 0.001 },
      "km": { label: "Kilometers (km)", multiplier: 1000 },
      "in": { label: "Inches (in)", multiplier: 0.0254 },
      "ft": { label: "Feet (ft)", multiplier: 0.3048 },
      "yd": { label: "Yards (yd)", multiplier: 0.9144 },
      "mi": { label: "Miles (mi)", multiplier: 1609.344 },
      "nm": { label: "Nanometers (nm)", multiplier: 1e-9 },
      "μm": { label: "Micrometers (μm)", multiplier: 1e-6 },
      "ly": { label: "Light years (ly)", multiplier: 9.461e15 },
      "au": { label: "Astronomical Units (au)", multiplier: 1.496e11 },
    }
  },
  Weight: {
    base: "kg",
    units: {
      "kg": { label: "Kilograms (kg)", multiplier: 1 },
      "g": { label: "Grams (g)", multiplier: 0.001 },
      "mg": { label: "Milligrams (mg)", multiplier: 1e-6 },
      "μg": { label: "Micrograms (μg)", multiplier: 1e-9 },
      "t": { label: "Metric Tons (t)", multiplier: 1000 },
      "lb": { label: "Pounds (lb)", multiplier: 0.453592 },
      "oz": { label: "Ounces (oz)", multiplier: 0.0283495 },
      "st": { label: "Stones (st)", multiplier: 6.35029 },
    }
  },
  Volume: {
    base: "l",
    units: {
      "l": { label: "Liters (l)", multiplier: 1 },
      "ml": { label: "Milliliters (ml)", multiplier: 0.001 },
      "m³": { label: "Cubic Meters (m³)", multiplier: 1000 },
      "cm³": { label: "Cubic Centimeters (cm³)", multiplier: 0.001 },
      "gal": { label: "Gallons (US)", multiplier: 3.78541 },
      "qt": { label: "Quarts (US)", multiplier: 0.946353 },
      "pt": { label: "Pints (US)", multiplier: 0.473176 },
      "cup": { label: "Cups (US)", multiplier: 0.236588 },
      "fl oz": { label: "Fluid Ounces (US)", multiplier: 0.0295735 },
      "tbsp": { label: "Tablespoons", multiplier: 0.0147868 },
      "tsp": { label: "Teaspoons", multiplier: 0.00492892 },
    }
  },
  Area: {
    base: "m²",
    units: {
      "m²": { label: "Square Meters (m²)", multiplier: 1 },
      "cm²": { label: "Square Centimeters (cm²)", multiplier: 0.0001 },
      "km²": { label: "Square Kilometers (km²)", multiplier: 1e6 },
      "in²": { label: "Square Inches (in²)", multiplier: 0.00064516 },
      "ft²": { label: "Square Feet (ft²)", multiplier: 0.092903 },
      "yd²": { label: "Square Yards (yd²)", multiplier: 0.836127 },
      "ac": { label: "Acres (ac)", multiplier: 4046.86 },
      "ha": { label: "Hectares (ha)", multiplier: 10000 },
    }
  },
  Temperature: {
    base: "K",
    units: {
      "K": { label: "Kelvin (K)", multiplier: 1, offset: 0 },
      "°C": { label: "Celsius (°C)", multiplier: 1, offset: 273.15 },
      "°F": { label: "Fahrenheit (°F)", multiplier: 5/9, offset: 459.67 },
      "°R": { label: "Rankine (°R)", multiplier: 5/9, offset: 0 },
    }
  },
  Speed: {
    base: "m/s",
    units: {
      "m/s": { label: "Meters per second (m/s)", multiplier: 1 },
      "km/h": { label: "Kilometers per hour (km/h)", multiplier: 0.277778 },
      "mph": { label: "Miles per hour (mph)", multiplier: 0.44704 },
      "kn": { label: "Knots (kn)", multiplier: 0.514444 },
      "ft/s": { label: "Feet per second (ft/s)", multiplier: 0.3048 },
    }
  },
  Pressure: {
    base: "Pa",
    units: {
      "Pa": { label: "Pascal (Pa)", multiplier: 1 },
      "kPa": { label: "Kilopascal (kPa)", multiplier: 1000 },
      "bar": { label: "Bar", multiplier: 1e5 },
      "mbar": { label: "Millibar", multiplier: 100 },
      "atm": { label: "Atmosphere (atm)", multiplier: 101325 },
      "psi": { label: "PSI", multiplier: 6894.76 },
      "mmHg": { label: "mmHg", multiplier: 133.322 },
      "inHg": { label: "inHg", multiplier: 3386.39 },
    }
  },
  Energy: {
    base: "J",
    units: {
      "J": { label: "Joules (J)", multiplier: 1 },
      "kJ": { label: "Kilojoules (kJ)", multiplier: 1000 },
      "cal": { label: "Calories (cal)", multiplier: 4.184 },
      "kcal": { label: "Kilocalories (kcal)", multiplier: 4184 },
      "kWh": { label: "Kilowatt-hours (kWh)", multiplier: 3.6e6 },
      "BTU": { label: "BTU", multiplier: 1055.06 },
      "eV": { label: "Electronvolts (eV)", multiplier: 1.602e-19 },
    }
  },
  Power: {
    base: "W",
    units: {
      "W": { label: "Watts (W)", multiplier: 1 },
      "kW": { label: "Kilowatts (kW)", multiplier: 1000 },
      "hp": { label: "Horsepower (hp)", multiplier: 745.7 },
      "cal/s": { label: "Calories per second", multiplier: 4.184 },
      "BTU/h": { label: "BTU per hour", multiplier: 0.293071 },
    }
  },
  Force: {
    base: "N",
    units: {
      "N": { label: "Newtons (N)", multiplier: 1 },
      "kN": { label: "Kilonewtons (kN)", multiplier: 1000 },
      "lbf": { label: "Pound-force (lbf)", multiplier: 4.44822 },
      "kgf": { label: "Kilogram-force (kgf)", multiplier: 9.80665 },
    }
  },
  Angle: {
    base: "rad",
    units: {
      "rad": { label: "Radians (rad)", multiplier: 1 },
      "deg": { label: "Degrees (°)", multiplier: Math.PI / 180 },
      "grad": { label: "Gradians (grad)", multiplier: Math.PI / 200 },
      "arcmin": { label: "Arcminutes", multiplier: Math.PI / 10800 },
      "arcsec": { label: "Arcseconds", multiplier: Math.PI / 648000 },
    }
  },
  "Amount of Substance": {
    base: "mol",
    units: {
      "mol": { label: "Moles (mol)", multiplier: 1 },
      "mmol": { label: "Millimoles (mmol)", multiplier: 0.001 },
      "kmol": { label: "Kilomoles (kmol)", multiplier: 1000 },
    }
  },
  Density: {
    base: "kg/m³",
    units: {
      "kg/m³": { label: "kg/m³", multiplier: 1 },
      "g/cm³": { label: "g/cm³", multiplier: 1000 },
      "lb/ft³": { label: "lb/ft³", multiplier: 16.0185 },
      "g/L": { label: "g/L", multiplier: 1 },
    }
  },
  "Digital Storage": {
    base: "B",
    units: {
      "B": { label: "Bytes (B)", multiplier: 1 },
      "KB": { label: "Kilobytes (KB)", multiplier: 1000 },
      "MB": { label: "Megabytes (MB)", multiplier: 1e6 },
      "GB": { label: "Gigabytes (GB)", multiplier: 1e9 },
      "TB": { label: "Terabytes (TB)", multiplier: 1e12 },
      "KiB": { label: "Kibibytes (KiB)", multiplier: 1024 },
      "MiB": { label: "Mebibytes (MiB)", multiplier: 1024**2 },
      "GiB": { label: "Gibibytes (GiB)", multiplier: 1024**3 },
      "TiB": { label: "Tebibytes (TiB)", multiplier: 1024**4 },
    }
  },
  "Electricity: Current": {
    base: "A",
    units: {
      "A": { label: "Amperes (A)", multiplier: 1 },
      "mA": { label: "Milliamperes (mA)", multiplier: 0.001 },
      "μA": { label: "Microamperes (μA)", multiplier: 1e-6 },
      "kA": { label: "Kiloamperes (kA)", multiplier: 1000 },
    }
  },
  "Electricity: Voltage": {
    base: "V",
    units: {
      "V": { label: "Volts (V)", multiplier: 1 },
      "mV": { label: "Millivolts (mV)", multiplier: 0.001 },
      "kV": { label: "Kilovolts (kV)", multiplier: 1000 },
    }
  },
  "Electricity: Resistance": {
    base: "Ω",
    units: {
      "Ω": { label: "Ohms (Ω)", multiplier: 1 },
      "kΩ": { label: "Kilohms (kΩ)", multiplier: 1000 },
      "MΩ": { label: "Megohms (MΩ)", multiplier: 1e6 },
    }
  },
  Currency: {
    base: "USD",
    isDynamic: true,
    units: {
      "USD": { label: "US Dollar ($)", multiplier: 1 },
      "EUR": { label: "Euro (€)", multiplier: 1 },
      "GBP": { label: "British Pound (£)", multiplier: 1 },
      "JPY": { label: "Japanese Yen (¥)", multiplier: 1 },
      "INR": { label: "Indian Rupee (₹)", multiplier: 1 },
      "AUD": { label: "Australian Dollar (A$)", multiplier: 1 },
      "CAD": { label: "Canadian Dollar (C$)", multiplier: 1 },
      "CHF": { label: "Swiss Franc (CHF)", multiplier: 1 },
      "CNY": { label: "Chinese Yuan (¥)", multiplier: 1 },
      "HKD": { label: "Hong Kong Dollar (HK$)", multiplier: 1 },
      "NZD": { label: "New Zealand Dollar (NZ$)", multiplier: 1 },
      "KRW": { label: "South Korean Won (₩)", multiplier: 1 },
      "SGD": { label: "Singapore Dollar (S$)", multiplier: 1 },
      "BRL": { label: "Brazilian Real (R$)", multiplier: 1 },
      "ZAR": { label: "South African Rand (R)", multiplier: 1 },
      "MXN": { label: "Mexican Peso ($)", multiplier: 1 },
      "SEK": { label: "Swedish Krona (kr)", multiplier: 1 },
      "PKR": { label: "Pakistani Rupee (₨)", multiplier: 1 },
      "AED": { label: "UAE Dirham (د.إ)", multiplier: 1 },
      "SAR": { label: "Saudi Riyal (ر.س)", multiplier: 1 },
      "TRY": { label: "Turkish Lira (₺)", multiplier: 1 },
      "RUB": { label: "Russian Ruble (₽)", multiplier: 1 },
      "THB": { label: "Thai Baht (฿)", multiplier: 1 },
      "MYR": { label: "Malaysian Ringgit (RM)", multiplier: 1 },
      "IDR": { label: "Indonesian Rupiah (Rp)", multiplier: 1 },
      "PHP": { label: "Philippine Peso (₱)", multiplier: 1 },
      "VND": { label: "Vietnamese Dong (₫)", multiplier: 1 },
    }
  }
};

// Compatibility for Admin Panel popovers & Type safety
export interface CommonUnits {
  currencies: { label: string; value: string }[];
  measurements: Record<string, string[]>;
}

export const COMMON_UNITS: CommonUnits = {
  currencies: Object.entries(UNIT_GROUPS.Currency.units).map(([value, unit]) => ({
    label: unit.label,
    value: value
  })),
  measurements: {
    Length: Object.keys(UNIT_GROUPS.Length.units),
    Weight: Object.keys(UNIT_GROUPS.Weight.units),
    Volume: Object.keys(UNIT_GROUPS.Volume.units),
    Area: Object.keys(UNIT_GROUPS.Area.units),
    Temperature: Object.keys(UNIT_GROUPS.Temperature.units),
    Pressure: Object.keys(UNIT_GROUPS.Pressure.units),
    Energy: Object.keys(UNIT_GROUPS.Energy.units),
    Speed: Object.keys(UNIT_GROUPS.Speed.units),
  }
};
