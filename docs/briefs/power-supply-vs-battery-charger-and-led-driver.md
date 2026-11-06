# Content brief: voltage supply, battery charger, and LED driver

- Primary keyword: power supply vs battery charger and LED driver.
- Secondary keywords: constant-voltage supply, constant-current LED driver, battery charging control, AC-DC adapter vs charger.
- Long-tail intent: why a matching voltage label is insufficient; why a USB adapter is not the cell charger; constant-voltage LED strip versus bare LED string.
- Audience: beginner/intermediate readers interpreting equipment ratings, not constructing mains electronics or battery charging circuits.
- Distinct purpose: compare regulated quantities and application-specific protection rather than generic rectification or supply-shopping recommendations.
- Entities/relationships: AC-DC front end → DC rail → application controller; current/voltage control, chemistry/series count/temperature/termination, LED compliance range, USB negotiation, automotive transient environment, PV DC/inverter direction.
- Questions: does rated current get forced into the load? Can a bench supply charge a battery? Do all LEDs need CC? Is EV charging always AC-DC? Does solar need rectification?
- Structure: regulated quantity table; adapter boundary; charger stages and limits; CC versus CV lighting; worked LED and power-budget examples; EV/automotive/solar contexts; matching checklist; FAQs; conclusion.
- Internal links: /blog/ac-voltage-does-not-determine-dc-current/, /blog/unregulated-vs-regulated-dc-supplies/, /blog/measuring-rectifier-output-voltage/, /blog/why-ac-to-dc-output-voltage-varies/, /ac-to-dc-calculator/.
- Visuals: featured three-branch control comparison; /images/education/application-control.svg supporting diagram distinguishing rail conversion from control. Caption must not imply a wiring prescription.
- Trust: manufacturer documentation for battery charging and LED current control; DOE for PV conversion direction; TI for automotive alternator context. Examples are arithmetic assumptions, not measured results, component recommendations or charge settings. No invented engineering qualifications.
- Sources: https://www.ti.com/lit/an/snva557/snva557.pdf ; https://www.ti.com/lit/an/slyt084/slyt084.pdf ; https://www.ti.com/video/5837776585001 ; https://www.ti.com/document-viewer/lit/html/slvaf88 ; https://www.energy.gov/cmei/systems/solar-power-electronic-devices ; https://www.ti.com/solution/led-power-supply ; https://afdc.energy.gov/vehicles/electric-school-buses-p4-m1 .
