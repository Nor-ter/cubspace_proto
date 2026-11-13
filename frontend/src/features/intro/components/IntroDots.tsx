import { scrollToElement } from '@/lib/smoothScroll';

const SECTIONS = ['Opening', 'Problem', 'Shift', 'Modules', 'Launch'];

/** Fixed page indicator: one dot per intro section, the current one turns white. */
export function IntroDots({ active }: { active: number }) {
  function goTo(index: number) {
    const section = document.querySelectorAll('[data-intro-section]')[index];
    if (section) scrollToElement(section);
  }

  return (
    <nav className="intro-dots" aria-label="Intro sections">
      {SECTIONS.map((label, index) => (
        <button
          key={label}
          className={index === active ? 'active' : ''}
          aria-label={`${label} (${index + 1} of ${SECTIONS.length})`}
          aria-current={index === active ? 'step' : undefined}
          onClick={() => goTo(index)}
        />
      ))}
    </nav>
  );
}
