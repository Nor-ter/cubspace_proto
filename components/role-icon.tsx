import {
  Target,
  Radio,
  Magnet,
  Cpu,
  BatteryCharging,
  Satellite,
  Sun,
  Antenna,
  Boxes,
  GitBranch,
  FileCheck2,
  ShieldCheck,
  Workflow,
  BookOpen,
  Link as LinkIcon,
  SlidersHorizontal,
} from 'lucide-react';
export function RoleIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  const Icon = /eps|power/.test(n)
    ? BatteryCharging
    : /solar|sun/.test(n)
      ? Sun
      : /antenna|comms|communication/.test(n)
        ? Antenna
        : /adcs|magnetorquer/.test(n)
          ? Magnet
          : /magnetometer|sensor/.test(n)
            ? Radio
            : /obc|software/.test(n)
              ? Cpu
              : /evidence|test|verif/.test(n)
                ? FileCheck2
                : /sign|review|approv/.test(n)
                  ? ShieldCheck
                  : /requirement|mission|purpose/.test(n)
                    ? Target
                    : /flow|function/.test(n)
                      ? Workflow
                      : /property/.test(n)
                        ? SlidersHorizontal
                        : /pair/.test(n)
                          ? LinkIcon
                          : /^all$|system|satellite|acrux/.test(n)
                            ? Satellite
                            : /model|physical|component|structure/.test(n)
                              ? Boxes
                              : /prolog|trace/.test(n)
                                ? GitBranch
                                : BookOpen;
  return <Icon className="role-icon" aria-hidden="true" />;
}
