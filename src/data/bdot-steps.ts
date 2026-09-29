export const bdotSteps = [
  {
    label: 'Why it is needed',
    title: 'Reduce rotation first, right after separation',
    body: 'A satellite separated from the launch vehicle may have an initial rotation. If it spins quickly, the antenna direction and solar incidence angle keep changing, and it can be difficult to meet the operating conditions needed for measurement and deployment. The first goal of the ADCS is to bring rotation down to a safe range, rather than to point accurately in a desired direction.',
    check:
      'B-dot is not the whole ADCS; it is a control law used for initial rotation reduction (detumbling). Communication and deployment conditions and the low-power exception follow the ConOps.',
    tex: '',
  },
  {
    label: 'Measure',
    title: 'Read B with the magnetometer mounted on the satellite',
    body: 'B is the magnetic field vector. Even if the direction of the geomagnetic field is almost constant for a moment, the values seen on the sensor X, Y and Z axes change as the magnetometer rotates with the satellite. It is similar to looking at a fixed arrow in a room while turning your body.',
    check:
      'First check the magnetometer axes, units, timestamps and measurement validity. A single vector alone cannot uniquely determine the full attitude.',
    tex: '\\boldsymbol B_n=(B_x,B_y,B_z)_n',
  },
  {
    label: 'Rate of change',
    title: 'Divide the change between two measurements by time',
    body: 'The dot over B denotes the time derivative, that is, how quickly it changes. For example, if the same axis changes from 20 µT to 22 µT over 1 second, the average rate of change is 2 µT/s. The actual calculation is performed on all three axes.',
    check:
      'Numerical differentiation also amplifies noise. The sampling interval and filter delay must be designed, and remember that the change includes magnetic field variation due to orbital motion.',
    tex: '\\dot{\\boldsymbol B}_n\\approx\\frac{\\boldsymbol B_n-\\boldsymbol B_{n-1}}{t_n-t_{n-1}}',
  },
  {
    label: 'Control command',
    title: 'Command a magnetic moment opposite to the rate of change',
    body: 'Multiply by a positive gain k and apply a minus sign. Axes with larger change receive a larger magnetic moment command, without exceeding what the actuator can produce. This is different from sending the satellite an angle command to “rotate the other way”.',
    check:
      'k is a design parameter with units. Do not use an arbitrary number as a flight setting. Current and magnetic moment saturation and heating limits must also be applied.',
    tex: '\\boldsymbol m_{\\mathrm{cmd}}=-k\\dot{\\boldsymbol B},\\qquad k>0',
  },
  {
    label: 'Actuate',
    title: 'The magnetic moment produced by current creates torque with the geomagnetic field',
    body: 'The drive circuit converts the OBC command into current, and the coil produces a magnetic moment m. The interaction of this magnetic moment with the geomagnetic field B produces the torque that changes the actual rotational state. Software alone does not stop the rotation.',
    check:
      'If m and B are parallel, the torque is zero. Torque along the magnetic field direction cannot be produced at any instant, and the command direction and torque direction also differ.',
    tex: '\\boldsymbol\\tau=\\boldsymbol m\\times\\boldsymbol B',
  },
  {
    label: 'Damping',
    title: 'It acts in the direction that reduces rotational energy',
    body: 'Under ideal conditions where rotation dominates the rate of change of the magnetic field, this control acts to remove rotational kinetic energy. It can be likened to a brake, but not a brake that freely controls all axes at once.',
    check:
      'On a real satellite with disturbances, saturation and filter delay, energy is not guaranteed to decrease at every instant. Performance must be verified across multiple initial conditions and orbital conditions.',
    tex: '\\frac{\\mathrm dE_{\\mathrm{rot}}}{\\mathrm dt}=\\boldsymbol\\tau\\cdot\\boldsymbol\\omega\\approx-k\\lVert\\boldsymbol\\omega\\times\\boldsymbol B\\rVert^2\\le0',
  },
  {
    label: 'Re-measure',
    title: 'Repeat measure, command, actuate and check the exit condition',
    body: 'After actuation, measure the magnetic field again and compute the rate of change. Because the magnetorquer field can contaminate the magnetometer, separate the measurement and actuation periods or compensate for the interference. Rotation reduction is not a single command but a repeated feedback process.',
    check:
      'Do not conclude that rotation is small enough just because B-dot is small. Decide whether to move to the next operating phase using a verified angular rate estimate, dwell time, sensor health and power conditions.',
    tex: '',
  },
];
