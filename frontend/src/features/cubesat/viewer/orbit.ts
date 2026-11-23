export const EARTH_RADIUS_KM = 6371;
export const EARTH_SIDEREAL_SECONDS = 86164;
const EARTH_MU = 398600.4418;

export const ORBIT_SOURCES = {
  leo: 'https://disasters.nasa.gov/sites/default/files/2020-11/healthmonitoringpart1.pdf#page=21',
  catalog:
    'https://science.nasa.gov/earth/earth-observatory/catalog-of-earth-satellite-orbits/',
  basics: 'https://science.nasa.gov/learn/basics-of-space-flight/chapter5-1/',
  aqua: 'https://airs.jpl.nasa.gov/data/guides-docs/climcaps-science/instruments-data-overview-1/airs-on-aqua/copy_of_airs-guide/airs-asmu-hsb-instrument-suite-with-fov',
};

/** Definitions and illustrative spacecraft parameters are deliberately separate. */
export const ORBIT_PRESETS = [
  {
    label: 'LEO',
    altitudeKm: 500,
    displayRadius: 1.5,
    inclinationDeg: 28.5,
    definitionLabel: 'LEO altitude range',
    definitionValue: '160–2,000',
    definitionUnit: 'km',
    definitionNote:
      'Approximate altitude above Earth’s surface (NASA ARSET). The lower boundary varies between references.',
    source: ORBIT_SOURCES.leo,
    detail:
      'Low Earth orbit is approximately 160–2,000 km above the surface in NASA ARSET training material. Our 500 km spacecraft is one example within that band, not the definition of LEO.',
  },
  {
    label: 'MEO',
    altitudeKm: 20200,
    displayRadius: 2.3,
    inclinationDeg: 55,
    definitionLabel: 'MEO approximate altitude band',
    definitionValue: '2,000–<35,786',
    definitionUnit: 'km',
    definitionNote:
      'Between LEO and geosynchronous altitude. The 20,200 km GPS-like orbit below is an example.',
    source: ORBIT_SOURCES.catalog,
    detail:
      'Medium Earth orbit lies above LEO and below geosynchronous altitude: approximately 2,000 km to below 35,786 km. NASA gives GPS as an example at about 20,200 km with a roughly 12-hour period.',
  },
  {
    label: 'GEO',
    altitudeKm: 35786,
    displayRadius: 3.2,
    inclinationDeg: 0,
    definitionLabel: 'Geostationary altitude',
    definitionValue: '≈35,786',
    definitionUnit: 'km',
    definitionNote:
      'Circular, prograde and equatorial (0° inclination); period 23 h 56 min 4 s. Geosynchronous alone does not mean geostationary.',
    source: ORBIT_SOURCES.basics,
    detail:
      'Here GEO means geostationary: a circular prograde equatorial orbit at about 35,786 km, with a period matching Earth’s sidereal rotation. It stays above one longitude. Inclined or elliptical geosynchronous orbits do not remain fixed in the sky.',
  },
  {
    label: 'Polar',
    altitudeKm: 600,
    displayRadius: 1.8,
    inclinationDeg: 90,
    definitionLabel: 'Polar orbit inclination',
    definitionValue: '90',
    definitionUnit: '°',
    definitionNote:
      'Defined by its plane crossing both poles, not by a fixed altitude band. Near-polar orbits have inclinations close to 90°.',
    source: ORBIT_SOURCES.basics,
    detail:
      'A polar orbit has 90° inclination; near-polar orbits pass close to the poles. Polar describes the orbital plane, not a particular altitude. The 600 km altitude shown here is an illustrative LEO example.',
  },
  {
    label: 'Sun-sync',
    altitudeKm: 705,
    displayRadius: 2,
    inclinationDeg: 98.2,
    definitionLabel: 'Sun-synchronous defining property',
    definitionValue: 'Same local solar time',
    definitionUnit: '',
    definitionNote:
      'Orbit-plane precession preserves approximately the same local solar time on corresponding passes. Inclination depends on altitude; it is not universally 98.2°.',
    source: ORBIT_SOURCES.aqua,
    detail:
      'A Sun-synchronous orbit precesses to preserve approximately the same local solar time on corresponding passes. Common Earth-observation examples are near-polar and retrograde. NASA’s nominal Aqua parameters, 705 km and 98.2°, are used as an example, not a universal definition.',
  },
] as const;

export function orbitPeriodSeconds(index: number) {
  if (index === 2) return EARTH_SIDEREAL_SECONDS;
  const radius = EARTH_RADIUS_KM + ORBIT_PRESETS[index].altitudeKm;
  return 2 * Math.PI * Math.sqrt(radius ** 3 / EARTH_MU);
}

export type OrbitReadout = { altitudeKm: number; angleDeg: number };
