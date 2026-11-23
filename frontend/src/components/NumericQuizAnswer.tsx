import { useState } from 'react';
import './NumericQuizAnswer.css';

export function NumericQuizAnswer({
  fields,
  disabled,
  onSubmit,
}: {
  fields: { label: string; value: number }[];
  disabled: boolean;
  onSubmit: (correct: boolean) => void;
}) {
  const [values, setValues] = useState<string[]>(() => fields.map(() => ''));
  return (
    <form
      className="numeric-quiz-answer"
      onSubmit={(event) => {
        event.preventDefault();
        if (disabled) return;
        onSubmit(
          fields.every(
            (field, index) =>
              values[index].trim() !== '' &&
              Number.isFinite(Number(values[index])) &&
              Math.abs(Number(values[index]) - field.value) <= 0.005001,
          ),
        );
      }}
    >
      <div className="numeric-quiz-fields">
        {fields.map((field, index) => (
          <label key={field.label}>
            <span>{field.label}</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              required
              disabled={disabled}
              value={values[index]}
              onChange={(event) =>
                setValues((previous) =>
                  previous.map((value, i) =>
                    i === index ? event.target.value : value,
                  ),
                )
              }
            />
          </label>
        ))}
      </div>
      <button type="submit" disabled={disabled}>
        Check answer
      </button>
    </form>
  );
}
