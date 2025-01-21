import { z } from 'zod';

export const EVChargingStationSchema = z.object({
  /**
   * Acronym/Initialism of City agency or entity the station is located at
   */
  agency: z.string(),

  /**
   * Street number of station's address.
   */
  station_name: z.string(),

  /**
   * The type of charger at the station
   */
  type_of_charger: z.string(),

  /**
   * The # of ports at the station
   */
  no_of_ports: z.coerce.number(),

  /**
   * The street address of the station
   */
  street: z.string().optional(),

  /**
   * The city of the station's location.
   */
  city: z.string().optional(),

  /**
   * ZIP code of the station's location.
   */
  postcode: z.coerce.number().optional(),

  /**
   * New York City's boroughs are five county-level administrative divisions,
   * with each one also being a state county. (Manhattan - New York County;
   * Bronx - Bronx County; Brooklyn - Kings County; Queens - Queens County;
   * Staten Island - Richmond County). NYC's boroughs have existed since the
   * consolidation of the city in 1898.
   */
  borough: z.string().optional(),

  /**
   * Is the charging station open to the general public?
   */
  public_charger: z.string().optional(),

  /**
   * Is there a fee to use the charger at the station for City drivers?
   */
  fee_for_city_drivers: z.string().optional(),

  /**
   * Latitude of station's address.
   */
  latitude: z.coerce.number().optional(),

  /**
   * Longitude of station's address.
   */
  longitude: z.coerce.number().optional(),

  /**
   * Community Districts are geographic areas created under the City Charter
   * that are used for the delivery of municipal services, to facilitate
   * community engagement, and as a common unit of analysis. The City is
   * divided into 59 community districts. Each Community District has a
   * Community Board.
   */
  community_district: z.coerce.number().optional(),

  /**
   * The City Council is the lawmaking body of NYC, on equal footing with
   * the mayor in terms of governing power. Besides legislating, the Council
   * has sole approval power over the city budget, and is the final
   * decision-maker in land use matters. There are 51 City Council members
   * in total, each representing a unique geographical area, called a
   * Council District.
   */
  council_district: z.coerce.number().optional(),

  /**
   * Geographic area defined by the U.S. Census Bureau for the various
   * decennial censuses. Census tracts for a particular census year are
   * numbered uniquely within borough. Please note that as part of the
   * geocoding process, leading and trailing zeros are dropped.
   */
  census_tract: z.coerce.number().optional(),

  /**
   * A unique 7-digit number assigned to every known building by the
   * Department of City Planning (DCP), the first digit of which is the
   * borough code. BINs allow city agencies to process and match
   * building-related data easily and in a consistent manner.
   */
  bin: z.coerce.number().optional(),

  /**
   * A combination of three numeric codes -- a 1-digit borough number, a
   * block number (up to 5 digits) and a lot number (up to 4 digits) --
   * designated and modified by the Department of Finance (DOF). BBLs are
   * used by various city agencies to identify real estate for taxes,
   * zoning, construction, and other purposes.
   */
  bbl: z.coerce.number().optional(),

  /**
   * NTAs are small area boundaries, created by the Department of City
   * Planning (DCP) to aggregate population projections in a small area.
   * Each NTA approximates a minimum population of 15,000. While NTAs were
   * initially created to support PlaNYC, the thirty-year (2000-2030)
   * sustainability plan for NYC, NTAs are now also being used to present
   * data from the Decennial Census and American Community Survey. NTA
   * boundaries and their associated names do not definitively represent
   * neighborhood boundaries.
   */
  nta: z.string().optional(),
});

export type EVChargingStation = z.infer<typeof EVChargingStationSchema>;

export const EVChargingStationsSchema = z.array(EVChargingStationSchema);
