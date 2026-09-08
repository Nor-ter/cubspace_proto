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
  const Icon = /eps|power|전력/.test(n)
    ? BatteryCharging
    : /solar|태양/.test(n)
      ? Sun
      : /antenna|comms|통신/.test(n)
        ? Antenna
        : /adcs|magnetorquer|자기구동/.test(n)
          ? Magnet
          : /magnetometer|센서/.test(n)
            ? Radio
            : /obc|software|소프트/.test(n)
              ? Cpu
              : /evidence|test|검증|근거/.test(n)
                ? FileCheck2
                : /sign|review|승인/.test(n)
                  ? ShieldCheck
                  : /requirement|mission|목적|요구/.test(n)
                    ? Target
                    : /flow|function|기능/.test(n)
                      ? Workflow
                      : /property|속성/.test(n)
                        ? SlidersHorizontal
                        : /pair/.test(n)
                          ? LinkIcon
                          : /^all$|system|위성|acrux/.test(n)
                            ? Satellite
                            : /model|physical|component|structure/.test(n)
                              ? Boxes
                              : /prolog|trace/.test(n)
                                ? GitBranch
                                : BookOpen;
  return <Icon className="role-icon" aria-hidden="true" />;
}
