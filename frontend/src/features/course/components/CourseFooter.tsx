import { Box } from 'lucide-react';

export function CourseFooter({ visible }: { visible: boolean }) {
  return (
    <footer className={visible ? '' : 'page-hidden'}>
      <div className="brand">
        <span className="brand-cube">
          <Box />
        </span>
        <strong>CubSpace</strong>
      </div>
      <p>Engineers may leave. The mission carries on.</p>
      <span>Educational model · Human engineering review required</span>
    </footer>
  );
}
