export const bdotSteps = [
  {
    label: 'why you need it',
    title: 'Reduce rotation immediately after separation',
    body: 'Satellites separated from the launch vehicle may have an initial rotation. If it rotates quickly, the antenna direction and solar incident angle will continue to change, and it may be difficult to meet the operating conditions required for measurement and deployment. The first goal of ADCS is to reduce rotation to a safe range rather than looking exactly in the desired direction.',
    check:
      'B-dot is a control law used for initial detumbling, not the entire ADCS. Communication/deployment conditions and low-power exceptions follow ConOps.',
    tex: '',
  },
  {
    label: 'measure',
    title: 'B is read by a magnetometer attached to the satellite.',
    body: "B is the magnetic field vector. Even if the direction of the Earth's magnetic field is almost constant for a while, the values ​​seen on the sensor's X, Y, and Z axes will change as the magnetometer rotates with the satellite. It is similar to the situation where you turn and look at a fixed arrow in a room.",
    check:
      "First check the magnetometer's coordinate axes, units, time display, and measurement validity. A single vector cannot uniquely determine the complete pose.",
    tex: '\\boldsymbol B_n=(B_x,B_y,B_z)_n',
  },
  {
    label: 'rate of change',
    title: 'Divide the change between two measurements by time',
    body: 'The dot on B is the time derivative, i.e. how fast it changes. For example, if 20 µT changes to 22 µT in 1 second on the same axis, the average rate of change is 2 µT/s. The actual calculations are performed on all three axes.',
    check:
      'Numerical differentiation also increases noise. Remember that you need to design sampling intervals and filter delays, and that magnetic field changes due to orbital movement are also included.',
    tex: '\\dot{\\boldsymbol B}_n\\approx\\frac{\\boldsymbol B_n-\\boldsymbol B_{n-1}}{t_n-t_{n-1}}',
  },
  {
    label: 'control command',
    title:
      'Commands the magnetic moment in the opposite direction of the rate of change.',
    body: 'Multiply by the positive gain k and add a minus sign. For axes with large changes, a larger magnetic moment command is given, but it does not exceed the range that the actuator can produce. This is different from sending an angle command directly to the satellite to “reverse rotation.”',
    check:
      'k is a design parameter with units. Do not use random numbers as flight settings. Current/magnetic moment saturation and heat generation limits must also be applied.',
    tex: '\\boldsymbol m_{\\mathrm{cmd}}=-k\\dot{\\boldsymbol B},\\qquad k>0',
  },
  {
    label: 'driving',
    title:
      "The magnetic moment created by the current creates the Earth's magnetic field and torque.",
    body: "The OBC's command is converted into current by the driving circuit, and the coil creates a magnetic moment m. The interaction of this magnetic moment with the Earth's magnetic field B creates a torque that changes the actual state of rotation. Software alone doesn't stop spinning.",
    check:
      'If m and B are parallel, the torque is 0. It is not possible to instantaneously create a torque in the direction of the magnetic field, and the command direction and torque direction are also different.',
    tex: '\\boldsymbol\\tau=\\boldsymbol m\\times\\boldsymbol B',
  },
  {
    label: 'Attenuation',
    title: 'It works in the direction of reducing rotational energy',
    body: 'Under ideal conditions, where rotational influences dominate the rate of magnetic field change, this control operates in the direction of robbing rotational kinetic energy. It can be compared to a brake, but it is not a brake that freely controls all axes at the same time.',
    check:
      'In real satellites with disturbances, saturation, and filter delays, there is no guarantee that energy will decrease at every moment. Performance must be verified under multiple initial conditions and orbital conditions.',
    tex: '\\frac{\\mathrm dE_{\\mathrm{rot}}}{\\mathrm dt}=\\boldsymbol\\tau\\cdot\\boldsymbol\\omega\\approx-k\\lVert\\boldsymbol\\omega\\times\\boldsymbol B\\rVert^2\\le0',
  },
  {
    label: 'remeasure',
    title:
      'Repeat measurement-command-operation and check termination condition',
    body: 'After driving, measure the magnetic field again and calculate the rate of change. Since the magnetic field from the magnetic actuator may mix with the magnetometer, measurement and actuation times must be separated or interference compensated. Rotation reduction is not a single command, but a process of repeated feedback.',
    check:
      "Just because the B-dot is small doesn't mean the rotation is small enough. Determine whether to proceed to the next operation stage based on verified angular velocity estimation, holding time, and sensor status/power conditions.",
    tex: '',
  },
];
