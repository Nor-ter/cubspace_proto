import { useEffect, useRef } from 'react';
import type { Course } from '@/types/course';
import type { TheorySubsystem } from '../data';
import { SubsystemPanel } from './SubsystemPanel';

export function SubsystemDrawer({
  subsystem,
  course,
  onClose,
}: {
  subsystem: TheorySubsystem;
  course: Course;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement;
    element?.show();
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
      }
    };
    window.addEventListener('keydown', escape);
    return () => {
      window.removeEventListener('keydown', escape);
      element?.close();
      if (trigger instanceof HTMLElement && trigger.isConnected)
        trigger.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="subsystem-drawer"
      aria-labelledby="pass-title"
      data-lenis-prevent
    >
      <SubsystemPanel
        key={subsystem.id}
        subsystem={subsystem}
        course={course}
        onClose={onClose}
      />
    </dialog>
  );
}
