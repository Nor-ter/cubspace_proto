import { Tooltip } from '@base-ui/react/tooltip';
import { useId } from 'react';
import { Cited } from '@/components/Cited';

const DEFINITIONS: Readonly<Partial<Record<string, string>>> = {
  'NASA CubeSat 101 (2017)':
    'NASA’s introductory guide for first-time CubeSat teams. It explains how to plan a mission, prepare for flight and arrange a launch.',
  'CubeSat Design Specification (CDS)':
    'Cal Poly’s guide to standard CubeSat dimensions, interfaces and safety checks. It helps teams design a satellite that fits and can be released safely from its deployer.',
  'International Space Station (ISS) deployment route':
    'A cargo spacecraft carries the CubeSat to the International Space Station. A deployer on the station then releases it into its own orbit.',
  'State-of-the-Art Small Spacecraft Technology report':
    'A NASA report that surveys small spacecraft technology, from satellite size and mass classes to the systems used to build and operate them.',
};

const TERMS =
  /(NASA CubeSat 101 \(2017\)|CubeSat Design Specification \(CDS\)|International Space Station \(ISS\) deployment route|State-of-the-Art Small Spacecraft Technology report)/;

export function CubesatText({ text }: { text: string }) {
  return text.split(TERMS).map((part, index) => {
    const definition = DEFINITIONS[part];
    if (!definition) return <Cited key={index} text={part} />;

    return <TermTooltip key={index} term={part} definition={definition} />;
  });
}

function TermTooltip({
  term,
  definition,
}: {
  term: string;
  definition: string;
}) {
  const id = useId();
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        className="cubesat-term"
        delay={180}
        aria-describedby={id}
      >
        {term}
      </Tooltip.Trigger>
      <Tooltip.Portal keepMounted>
        <Tooltip.Positioner
          className="cubesat-tooltip-positioner"
          sideOffset={8}
        >
          <Tooltip.Popup id={id} role="tooltip" className="cubesat-tooltip">
            {definition}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
