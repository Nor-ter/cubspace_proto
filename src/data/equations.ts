export const equations: Record<string, string[]> = {
  '02': [
    '\\frac{GM}{r^2}=\\frac{v^2}{r}\\quad\\Longrightarrow\\quad v=\\sqrt{\\frac{GM}{r}}',
    '\\Delta E_{\\mathrm{battery}}=\\int_{t_0}^{t_1}\\left(P_{\\mathrm{charge}}-P_{\\mathrm{load}}-P_{\\mathrm{loss}}\\right)\\,\\mathrm{d}t',
    'E\\,[\\mathrm{Wh}]=\\frac{P\\,[\\mathrm{W}]\\,t\\,[\\mathrm{s}]}{3600}',
  ],
  '03': [
    '\\boldsymbol H=\\mathbf I\\boldsymbol\\omega',
    '\\mathbf I\\frac{\\mathrm{d}\\boldsymbol\\omega}{\\mathrm{d}t}+\\boldsymbol\\omega\\times(\\mathbf I\\boldsymbol\\omega)=\\boldsymbol\\tau_{\\mathrm{ext}}',
    '\\boldsymbol\\tau_{\\mathrm{mag}}=\\boldsymbol m\\times\\boldsymbol B,\\qquad |\\boldsymbol\\tau|=|\\boldsymbol m|\\,|\\boldsymbol B|\\sin\\theta',
  ],
  '04': [
    '\\lVert\\boldsymbol\\omega\\rVert<\\omega_{\\mathrm{lim}},\\qquad t\\leq T_{\\mathrm{lim}}',
  ],
  '05': [
    '\\frac{\\mathrm{d}\\boldsymbol B_{\\mathrm{body}}}{\\mathrm{d}t}\\approx-\\boldsymbol\\omega\\times\\boldsymbol B',
    '\\boldsymbol m_{\\mathrm{cmd}}=-k\\frac{\\mathrm{d}\\boldsymbol B_{\\mathrm{body}}}{\\mathrm{d}t},\\quad k>0',
    '\\boldsymbol\\tau=\\boldsymbol m\\times\\boldsymbol B',
    '\\frac{\\mathrm{d}E_{\\mathrm{rot}}}{\\mathrm{d}t}=\\boldsymbol\\tau\\cdot\\boldsymbol\\omega\\approx-k\\lVert\\boldsymbol\\omega\\times\\boldsymbol B\\rVert^2\\leq0',
  ],
};
