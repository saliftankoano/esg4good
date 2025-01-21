import { z } from 'zod';

export const ProjectSchema = z.object({
  /** The date the dataset was refreshed */
  data_through_date: z.coerce.date(),

  /**
   * Either Maintenance, Non-Tier 1, Tier 1, Tier 2, Tier 4, OREC, or N/A.
   * Maintenance represents existing baseline resources. Non-Tier 1 are
   * facilities with a commercial operation date before 1/1/2015, and Tier 1
   * are facilities with a commercial operation date after 1/1/2015. Tier 2
   * facilities are from wind and non-state-owned run-of-river hydroelectric
   * generating facilities located within New York State that entered
   * commercial operation prior to January 1, 2015. OREC represents projects
   * in the offshore wind program. Tier 4 represents renewable energy and
   * transmission projects.
   */
  eligibility: z.string(),

  /**
   * Name of project. Project names with an asterisk have the same project
   * name as projects awarded under different solicitations
   */
  project_name: z.string(),

  /**
   * Request for Proposal (RFP) number, or Maintenance Agreement number under
   * Renewable Portfolio Standard (RPS) or Tier 2 Maintenance under the
   * Renewable Energy Standard (RES)
   */
  solicitation_name: z.string(),

  /**
   * Certain solicitations provided for an optional or mandatory adjustment to
   * the Index REC Strike Price or Fixed REC Price based on changes in
   * certain commodity price indices as described in each RFP. Proposers
   * awarded under these solicitations whose proposals were subject to this
   * adjustment may have their Index REC Strike Price or Fixed REC Price
   * adjusted consistent with the methodology described in each applicable RFP.
   */
  inflation_adjustment: z.string().optional(),

  /**
   * The Fixed REC bid price of Tier 1 and Non-Tier 1 awarded projects in US
   * dollars. Blank cells represent data that was not required or is not
   * currently available.
   */
  fixed_rec_price: z.coerce.number().optional(),

  /**
   * The Index OREC bid price or the Index REC Conversion Offer Price of
   * Tier 1 or Off-shore wind awarded projects in US dollars. Blank cells
   * represent data that was not required or is not currently available.
   */
  index_orec_strike_price: z.coerce.number().optional(),

  /**
   * Indicates if a Non-Tier 1 or Tier 1 Project claimed Incremental Economic
   * Benefits as part of its Bid Proposal, and these claims were accepted by
   * NYSERDA as part of its award. Blank cells represent data that was not
   * required or is not currently available. For more information, please
   * refer to each specific RFP's Section on Incremental Economic Benefits to
   * New York State.
   */
  incremental_economic_benefits_claimed: z.string().optional(),

  /**
   * For Non-Tier 1 or Tier I Projects, indicates the verification status of
   * the Incremental Economic Benefits included in the projects Agreement.
   * Incremental Economic Benefits are verified following three years of
   * operation and must meet a threshold of 85% of claim accepted by NYSERDA.
   * Yes - indicates verification complete and project met threshold. No –
   * verification complete and project did not meet threshold. Blank cells
   * represent – verification not due yet/ not yet complete; no economic
   * benefit claim; or project cancelled/terminated.
   */
  project_met_economic_benefits_threshold: z.string().optional(),

  /**
   * The type of renewable energy technology for the project currently under
   * contract or installed; either Land Based Wind, Offshore Wind,
   * Hydroelectric, Biomass, Biogas-LFG, Biogas-ADG, Fuel Cell, Solar,
   * Geothermal, Maintenance Biomass, or Maintenance Hydroelectric.
   */
  renewable_technology: z.string().optional(),

  /**
   * Indicates the type of eligible generation, either Existing or New
   * Generation. Blank cells represent data that was not required or is not
   * currently available.
   */
  generation_type: z.string().optional(),

  /**
   * Vintage Generation Facility (VGS). VGFs are projects that are either
   * upgraded, returned to service, relocated, or repowered, and must meet
   * the specified requirements
   */
  type_of_existing: z.string().optional(),

  /**
   * Name of the Seller in NYSERDA's agreement. A counterparty is the other
   * party to a NYSERDA agreement. Blank cells represent data that was not
   * required or is not currently available.
   */
  counterparty: z.string().optional(),

  /**
   * Name of Developer responsible for developing the project. Blank cells
   * represent data that was not required or is not currently available.
   */
  developer_name: z.string().optional(),

  /**
   * Rating of the electric power to be delivered from an energy storage
   * project in alternating current (AC) power. Blank cells represent data
   * that was not required or is not currently available.
   */
  energy_storage_power_capacity_mwac: z.coerce.number().optional(),

  /**
   * Usable installed energy storage capacity measured in alternating current
   * (AC) power. It is equal to the total capacity measured during a complete
   * discharge from a 100% usable state of charge, performed in accordance
   * with the storage manufacturer's specifications, on the commercial
   * operation date. Blank cells represent data that was not required or is
   * not currently available. This category does not include pumped storage.
   */
  energy_storage_energy_capacity_mwh: z.coerce.number().optional(),

  /**
   * Indicates the New York Control Area Load Zone into which the Bid
   * Facility will interconnect or deliver. Blank cells represent data that
   * was not required or is not currently available.
   */
  nyiso_zone: z.string().optional(),

  /**
   * Indicates the NYISO Generator Point Identifier. A Point Identifier is a
   * resource-specific numerical identifier used by the NYISO's software
   * systems to identify Generators and other Suppliers and only applies to
   * Operating Projects. Blank cells represent data that was not required or
   * is not currently available.
   */
  ptid: z.string().optional(),

  /**
   * For the NYISO Interconnection Queue, indicates the number on the list of
   * transmission and generation projects seeking to join the grid.
   * Additional information is located at:
   * https://www.nyiso.com/interconnections. Tier 4 projects include both
   * Resources and Transmission numbers.
   */
  interconnection_queue_number: z.string().optional(),

  /**
   * The applicable federal, state, or local permitting requirements that the
   * Bid Facility is subject to. Blank cells represent data that was not
   * required or is not currently available.
   */
  permit_process: z.string().optional(),

  /**
   * For Offshore Wind and Tier 4 projects, the Federal Permitting Mechanism
   * related to Environmental Review and Permitting. For Tier 1 projects, the
   * Name of Article 10 or Article VIII Case Number. Blank cells represent
   * data that were not required, applicable or are not currently available
   */
  regulatory_permitting: z
    .object({
      url: z.string(),
    })
    .optional(),

  /** Name of Article VII pertaining to Offshore Wind Project or Tier 4 Project. */
  article_vii: z
    .object({
      url: z.string(),
    })
    .optional(),

  /**
   * ZIP code of project. Blank cells represent data that was not required or
   * is not currently available.
   */
  zip_code: z.string().optional(),

  /**
   * Name of US county or Canadian Province for project. Blank cells
   * represent data that was not required or is not currently available.
   */
  county_province: z.string().optional(),

  /**
   * Name of US state or Canadian Province for project. Blank cells represent
   * data that was not required or is not currently available.
   */
  state_province: z.string().optional(),

  /**
   * Regional Economic Development Council of project. In 2011, 10 Regional
   * Councils were established and charged with developing long-term
   * strategic plans for economic growth in their regions. Blank cells
   * indicate the project is not located in New York State.
   */
  redc: z.string().optional(),

  /**
   * The phase/status of which the project is in as of the Data Through
   * Date; either Cancelled, Completed, Under Development, or Operational. A
   * status of Cancelled means that NYSERDA's award or contract with the
   * counterparty was cancelled or terminated. A status of Completed means
   * the project has fulfilled their contractual obligation to NYSERDA. A
   * status of Under Development means that the project has not yet entered
   * operation. A status of Operational means that the project has entered
   * operation.
   */
  project_status: z.string(),

  /**
   * Date declared as the Commercial Operation date of facility by NYISO or
   * local utility. Blank cells represent data that was not required or is
   * not currently available.
   */
  year_of_commercial_operation: z.string().optional(),

  /**
   * Date NYSERDA's payments started or are expected to start. For projects
   * Under Development, the dates are reflective of the current status of
   * NYSERDA agreements and are subject to change based on project
   * development progress. Blank cells represent data that was not required
   * or is not currently available.
   */
  year_of_delivery_start_date: z.string().optional(),

  /** Number of years of performance under the NYSERDA Agreement. */
  contract_duration: z.coerce.number().optional(),

  /**
   * For a new facility, the New Renewable Capacity equals the nameplate
   * capacity of the installed equipment. For a repowered facility, End of
   * Useful Life Bid Capacity is reported. For an upgraded facility, only the
   * renewable capacity resulting from the upgrade of a facility is provided.
   * For a single facility that was awarded multiple contracts, each for a
   * percentage of the facility's output under multiple RFPs, the total New
   * Renewable Capacity for the facility is listed once to avoid
   * over-counting. Therefore, the same facility appearing in multiple
   * instances may show a New Renewable Capacity of zero. Blank cells
   * represent projects with expired contracts with NYSERDA.
   */
  new_renewable_capacity_mw: z.coerce.number().optional(),

  /**
   * The NYSERDA-contracted portion of the New Renewable Capacity in
   * Megawatts. Blank cells represent data that were not applicable,
   * required or are not currently available.
   */
  bid_capacity_mw: z.coerce.number().optional(),

  /**
   * The annual production of the project in Megawatt hours that NYSERDA and
   * the Counterparty agree on constitutes performance in an Agreement. The
   * Bid Quantity may not constitute the entire output of a project. Blank
   * cells represent data that was not required or is not currently
   * available.
   */
  bid_quantity_mwh: z.coerce.number().optional(),

  /**
   * The maximum annual contractual obligation of the project in Megawatt
   * hours. Blank cells represent data that was not required or is not
   * currently available.
   */
  max_annual_contract_quantity: z.coerce.number().optional(),

  /**
   * An amount of electrical energy (in MWh), such that the estimated
   * probability in any given year that generation from the Selected Project
   * delivered to the Delivery Point would exceed that amount is 10 percent.
   * Applicable to Offshore Wind projects only. Blank cells represent data
   * that was not required or is not currently available.
   */
  p10_annual_orec_exceedance: z.coerce.number().optional(),

  /**
   * A NYSERDA calculation based on a 10.5 meter/second average Hub Height
   * (m/s avgHH) wind speed. Weibull parameters of A = 11.3 and K = 2.2 were
   * used to create an annual wind frequency distribution table. The
   * resulting frequency distribution was then applied in the NREL 15 MW
   * turbine power curve assuming 22% losses. Blank cells represent data
   * there were not required or is not currently available.
   */
  p50_generation_calculated_by_nyserda_mwh_yr: z.coerce.number().optional(),

  /**
   * Capacity of a project's new HVDC transmission line. Applicable to Tier 4
   * projects only. Blank cells represent data that was not required or is
   * not currently available.
   */
  transmission_capacity_hvdc: z.coerce.number().optional(),

  /**
   * Open Data/Socrata-generated geocoding information based on supplied
   * address components.
   */
  georeference: z
    .object({
      coordinates: z.tuple([z.number(), z.number()]),
      type: z.literal('Point'),
    })
    .optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ProjectsSchema = z.array(ProjectSchema);
