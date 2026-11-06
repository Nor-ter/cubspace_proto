import { RoleIcon } from './RoleIcon';

export function SectionHead({
  index,
  eyebrow,
  title,
  desc,
}: {
  index: string;
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="section-head">
      <div>
        <p className="eyebrow">
          {index} / {eyebrow}
        </p>
        <h2>
          <RoleIcon name={eyebrow} />
          {title}
        </h2>
        <p>{desc}</p>
      </div>
      <span className="section-index">{index}</span>
    </div>
  );
}
