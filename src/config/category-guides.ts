interface ReadingStep {href:string;title:string;description:string;}
interface CategoryGuide {title:string;description:string;intro:string;steps:ReadingStep[];}
/** Curated learning routes for topic archives, rather than repeated card-only introductions. */
export const categoryGuides:Partial<Record<string,CategoryGuide>>={
 'component-behavior':{
  title:'Rectifier Component Behavior: Losses, ESR & Transformer Regulation',
  description:'Understand how diode losses, capacitor ESR and transformer regulation affect a rectifier estimate and the questions a voltage calculation cannot answer.',
  intro:'A real component changes the operating point, not just one multiplier. Start with conduction losses, distinguish capacitor voltage ripple from ripple-current heating, then check how the source voltage changes with load. These guides explain the effects separately before you combine them.',
  steps:[
   {href:'/blog/bridge-rectifier-diode-losses/',title:'Trace the two conducting diode drops',description:'Separate the voltage-drop estimate from current-waveform and thermal analysis.'},
   {href:'/blog/capacitor-esr-and-ripple-current/',title:'Check capacitor ESR and ripple current',description:'Distinguish stored-charge ripple from resistive loss and component ratings.'},
   {href:'/blog/transformer-rms-voltage-and-rectifiers/',title:'Keep transformer voltage conventions explicit',description:'Use the correct secondary RMS voltage and its stated load condition.'},
  ],
 },
 'component-models':{
  title:'Diode Models & Forward-Voltage Assumptions',
  description:'Choose a diode forward-drop assumption, understand bridge conduction and compare ideal reference results with a fixed-drop rectifier model.',
  intro:'The diode model is a calculation choice. An ideal zero-drop reference, a fixed forward drop and a device characteristic curve answer different questions. Follow this route to select the assumption, trace the conducting path and compare the resulting voltage estimate.',
  steps:[
   {href:'/blog/diode-forward-voltage-drop/',title:'Choose the forward-voltage assumption',description:'Use operating-point information rather than treating a default as a device rating.'},
   {href:'/blog/bridge-rectifier-diode-losses/',title:'Count the conducting drops',description:'A bridge and a center-tapped path use different conduction conventions.'},
   {href:'/ac-to-dc-calculator/#methodology',title:'Compare ideal and fixed-drop calculations',description:'The methodology explains the conduction threshold and the clipped-sine average.'},
  ],
 },
 'voltage-measurement':{
  title:'Voltage Measurement: RMS, Peak, Average & Ripple Frequency',
  description:'Identify RMS, peak, average and ripple repetition before comparing a meter reading, an oscilloscope trace or a rectifier calculation.',
  intro:'A voltage value needs a measurement definition. Begin with the sine-wave quantities, then distinguish the average of rectified output from its total RMS. Use the timing guide when the question concerns ripple frequency rather than ripple amplitude.',
  steps:[
   {href:'/blog/rms-peak-average-voltage/',title:'Identify RMS, peak and average',description:'Keep the waveform and measurement interval attached to each voltage value.'},
   {href:'/blog/rectifier-average-vs-rms-output/',title:'Compare rectifier average and RMS output',description:'Read the same rectified waveform using two different mathematical operations.'},
   {href:'/blog/rectifier-ripple-frequency/',title:'Find the ripple repetition frequency',description:'Count pulses per AC cycle before choosing a frequency in the ripple equation.'},
  ],
 },
 'calculator-guides':{
  title:'AC to DC Calculator Methods, Examples & Limits',
  description:'Select the rectifier, filtering or regulator model, reproduce a worked example and understand what an accepted calculator result does not establish.',
  intro:'Choose the question before entering numbers: unfiltered average voltage, a capacitor-filtered estimate or a downstream regulator stage. This reading route connects the method to reproducible examples and makes the limits of each result explicit.',
  steps:[
   {href:'/calculators/',title:'Choose the calculator and output quantity',description:'Compare the supported models and their required assumptions.'},
   {href:'/blog/ac-to-dc-calculator-worked-examples/',title:'Reproduce the worked examples',description:'Follow input values through peak, average, valley and ripple calculations.'},
   {href:'/blog/limits-of-simple-ac-to-dc-calculators/',title:'Check the limits before using a result',description:'Separate a waveform estimate from source capability, ratings and physical validation.'},
  ],
 },
 'power-supply-concepts':{
  title:'AC to DC Power Supplies: Selection, Stages & Regulation',
  description:'Start with the load, compare linear and switching conversion stages, and distinguish a voltage supply from a charger or LED driver.',
  intro:'A useful power-supply choice starts with the required DC output and the documented AC input range. Work from load requirements to the conversion architecture, then check regulation, losses, isolation and operating conditions. A matching voltage label alone does not establish compatibility.',
  steps:[
   {href:'/blog/choosing-ac-to-dc-power-supply/',title:'Record the load and input requirements',description:'Check voltage, current profile, AC input range, connectors and operating conditions.'},
   {href:'/blog/power-supply-stages-explained/',title:'Follow AC input to DC output',description:'See where rectification, filtering, isolation and regulation occur.'},
   {href:'/blog/linear-vs-switching-power-supplies/',title:'Compare linear and switching supplies',description:'Compare the complete architecture instead of judging one stage in isolation.'},
  ],
 },
};
