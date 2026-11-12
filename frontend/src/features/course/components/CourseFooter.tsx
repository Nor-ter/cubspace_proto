import { BrandLogo } from '@/components/BrandLogo';

export function CourseFooter() {
  return (
    <footer className="course-footer">
      <div className="footer-brand">
        <BrandLogo />
        <strong>CubSpace</strong>
      </div>
      <p>
        Onboarding Web v2.1 for the Melbourne Space Program ACRUX-II 1U CubeSat.
        Educational model and content: human engineering review required before
        use as a design reference.
      </p>
      <p className="footer-line">Engineers may leave. The mission carries on.</p>
    </footer>
  );
}
