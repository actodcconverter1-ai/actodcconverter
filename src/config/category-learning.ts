/** Practical archive guidance, separate from article cards and search metadata. */
export const categoryLearning:Partial<Record<string,string[]>>={
 'measurement-guides':[
  'Start by naming the quantity you want to measure: the average DC level, the total RMS voltage, or the AC ripple around the average. These are different operations on the same waveform. Record whether a meter is in AC or DC mode and whether its AC measurement removes the DC component. A reading without that information cannot reliably confirm or contradict a calculator result. Keep the source waveform and the measurement location in your notes.',
  'For a useful comparison, hold the input voltage, load and capacitor value constant, then compare like quantities. Ripple amplitude needs a stated convention, such as peak to peak; ripple frequency needs a time interval. Check instrument bandwidth, coupling and input ratings before interpreting the result. These guides explain the definitions and common comparison errors. They do not provide a safe procedure for probing mains circuits or replace appropriate equipment and qualified measurement practice.',
 ],
 'worked-examples':[
  'Reproduce an example with its original inputs before changing anything. Write down the AC RMS voltage, rectifier arrangement, diode assumption, load and any smoothing capacitance. Then identify which result the example calculates: an unfiltered average, a crest voltage, a filtered estimate or regulator headroom. Keep the units beside each number. A correct calculation using the wrong input convention can still produce a plausible-looking answer that describes a different circuit.',
  'After reproducing the baseline, change one input at a time and predict the direction of the result before recalculating. Increasing load current normally increases the discharge ripple in the simplified capacitor model; increasing capacitance reduces that estimate. Do not carry those relationships outside the stated operating range or treat them as component ratings. If your result differs, first compare model choices and units, then rounding. A worked numerical example demonstrates the calculation, not a physically tested power supply.',
 ],
 'component-behavior':[
  'Keep three questions separate when assessing a component: what it does to the voltage estimate, how much power it dissipates, and whether its ratings suit the operating conditions. A diode forward drop can change the predicted output, but that number alone does not establish junction temperature. Similarly, a capacitor value in microfarads helps estimate charge storage while its ESR, allowable ripple current and temperature rating require separate checks in the device documentation.',
  'Follow the operating point through the whole chain. A transformer secondary voltage can change with load, which changes the rectifier crest and the regulator input valley. Charging pulses can stress the source and diodes differently from the average current delivered to a load. Use the linked guides to understand each effect before combining estimates. Record the assumptions you supplied, the quantities the calculator actually computes, and the device or circuit checks that still remain outside its scope.',
 ],
 'capacitor-filtering':[
  'Begin with the load current and the allowed change in voltage between charging peaks. For an approximate constant-current discharge, capacitance, ripple frequency and peak-to-peak ripple are connected through the charge balance. Use farads in the equation, converting microfarads explicitly, and choose the charging repetition frequency of the rectifier rather than automatically using the mains frequency. A single-phase full-wave bridge has two charging opportunities per AC cycle in the idealized model.',
  'Next check whether the resulting approximation is appropriate. A large predicted ripple, a strongly varying load or significant source impedance can make the simplified discharge model inadequate. More capacitance does not automatically mean a better complete design: charging-current pulses, inrush and capacitor ripple-current capability also matter. Use this category to connect the formula to a worked example and then to the limitations of real components. Treat voltage rating, temperature and allowable ripple current as separate datasheet questions.',
  'A resistive load does not draw exactly constant current as the capacitor voltage falls. Choose the supported resistance-load option when that assumption better describes the problem, rather than reusing a constant-current result without checking its meaning.',
 ],
 'component-models':[
  'Choose a model that matches the question before selecting a numerical value. An ideal diode is useful for checking a textbook waveform relationship. A fixed forward drop can estimate the effect of conduction thresholds, but it does not reproduce a complete current-voltage curve. A manufacturer characteristic depends on its specified test conditions. Record which model you used so that another reader can reproduce the calculation and compare its result with the same assumptions.',
  'Count the conducting devices in the actual current path. A conventional bridge passes load current through two diodes at a time; a center-tapped arrangement uses a different voltage and conduction convention. Do not transfer the same multiplier between those arrangements without checking what the input voltage represents. If a result changes after changing a diode assumption, distinguish the modeled output-voltage change from questions about current capability, reverse-voltage rating and heat. Those require information beyond a single forward-drop input.',
 ],
 'calculator-guides':[
  'Select the result you need before choosing a calculator. The ideal reference tools describe unfiltered rectified waveforms. The main workbench can include fixed diode drops and a simplified smoothing stage, while a regulator estimate concerns a downstream stage rather than the entire supply. Enter the voltage convention requested by the chosen model. RMS, peak and average values are not interchangeable, even when all of them describe the same source waveform.',
  'Use a worked example as a reproducibility check, then review every active input with its unit and operating assumption. When comparing two tools, make their rectifier arrangement, diode model, load and filter choices agree first. Keep the model limits beside the saved result so that the number is not separated from the conditions that produced it. A successful input check means the calculation can run within its defined scope; it does not confirm safe component selection, source current capacity or a complete electrical design.',
 ],
 'voltage-measurement':[
  'Attach a waveform and a measurement definition to every voltage value. RMS relates to a mean-square operation; peak is the maximum level; average depends on the waveform and the interval being averaged. The familiar sine-wave relationships cannot simply be applied to an arbitrary rectified or capacitor-filtered waveform. State whether you are describing the transformer secondary, the rectifier output before filtering, or the load terminals after filtering or regulation.',
  'When comparing a calculation with an instrument reading, check whether the instrument reports total RMS, AC-only RMS or a DC average. A large DC level with a small ripple is not the same quantity as the ripple amplitude itself. Frequency describes repetition, not voltage magnitude. The reading path above separates those definitions so you can identify the relevant formula before entering values. Instrument bandwidth, coupling, waveform shape and the circuit operating point still matter when deciding whether two reported numbers are comparable.',
 ],
};

export const categoryReading:Partial<Record<string,{href:string;title:string;description:string}[]>>={
 'measurement-guides':[
  {href:'/blog/measuring-rectifier-output-voltage/',title:'Identify the measurement before comparing results',description:'Distinguish DC average, total RMS and AC ripple in a meter reading.'},
  {href:'/blog/rectifier-average-vs-rms-output/',title:'Compare rectifier average and RMS output',description:'Read the same rectified waveform using two different mathematical operations.'},
  {href:'/blog/rectifier-ripple-frequency/',title:'Find the ripple repetition frequency',description:'Count pulses per AC cycle before choosing a frequency in the ripple equation.'},
 ],
 'capacitor-filtering':[
  {href:'/blog/smoothing-capacitor-calculation/',title:'Calculate the smoothing capacitance',description:'Connect load current, ripple frequency and allowed peak-to-peak ripple.'},
  {href:'/blog/capacitor-ripple-explained/',title:'Check the ripple formula with an example',description:'Keep frequency conventions and capacitance units explicit.'},
  {href:'/blog/capacitor-esr-and-ripple-current/',title:'Check capacitor ESR and ripple current',description:'Distinguish stored-charge ripple from resistive loss and component ratings.'},
 ],
 'worked-examples':[
  {href:'/calculators/',title:'Choose the calculator and output quantity',description:'Compare the supported models and their required assumptions.'},
  {href:'/blog/ac-to-dc-calculator-worked-examples/',title:'Reproduce the worked examples',description:'Follow input values through peak, average, valley and ripple calculations.'},
  {href:'/blog/limits-of-simple-ac-to-dc-calculators/',title:'Check the limits before using a result',description:'Separate a waveform estimate from source capability, ratings and physical validation.'},
 ],
};
