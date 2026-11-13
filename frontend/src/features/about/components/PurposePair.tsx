import type { Purpose } from '../data';

// Vision and mission side by side, ruled like a drawing's title block.
export function PurposePair({
  owner,
  purpose,
}: {
  owner: string;
  purpose: Purpose;
}) {
  return (
    <dl className="purpose-pair">
      <div>
        <dt>{owner} vision</dt>
        <dd>{purpose.vision}</dd>
      </div>
      <div>
        <dt>{owner} mission</dt>
        <dd>{purpose.mission}</dd>
      </div>
    </dl>
  );
}
