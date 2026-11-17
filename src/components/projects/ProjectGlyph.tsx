import {
  Activity,
  Bot,
  BookOpen,
  Boxes,
  BrainCircuit,
  Braces,
  Camera,
  CircuitBoard,
  Cloud,
  Code2,
  Database,
  FileChartColumn,
  Film,
  Gamepad2,
  GitBranch,
  Globe2,
  HeartPulse,
  Keyboard,
  Languages,
  Monitor,
  Music2,
  Package,
  Palette,
  Puzzle,
  RadioTower,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Terminal,
  UtensilsCrossed,
  WandSparkles,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { Project } from "../../data/lorapok";
import { createElement } from "react";

type ProjectIdentity = Pick<Project, "name" | "category">;

const nameRules: Array<[RegExp, LucideIcon]> = [
  [/automate|hospital|medical/i, Stethoscope],
  [/lorahost|hosting|server/i, Cloud],
  [/homedyn|restaurant/i, UtensilsCrossed],
  [/seeyou|search|seo|crawler/i, Search],
  [/reportkit|report|analytics/i, FileChartColumn],
  [/dcursor|cursor/i, Terminal],
  [/inventory|retail|stock/i, Boxes],
  [/sorcerer/i, WandSparkles],
  [/mindnode|brain/i, BrainCircuit],
  [/git geek|github|git /i, GitBranch],
  [/bible|documentation|memoriam/i, BookOpen],
  [/arduino|laser/i, CircuitBoard],
  [/smilo|camera/i, Camera],
  [/subtitle|media downloader|xsnap|xnav/i, Film],
  [/keyboard/i, Keyboard],
  [/loragent|ai agent|red bot/i, Bot],
  [/freqghost|wifi/i, Wifi],
  [/cloramf|monitor/i, Activity],
  [/larvox|language/i, Languages],
  [/security|scan/i, ShieldCheck],
  [/api atlas|atlas/i, Globe2],
  [/database|querycraft/i, Database],
  [/local.?sync|backup/i, Server],
  [/music|arbovirus/i, Music2],
  [/radio|signal/i, RadioTower],
];

const categoryIcons: Record<Project["category"], LucideIcon> = {
  AI: Bot,
  "Developer Tools": Code2,
  "Engineering Craft": FileChartColumn,
  Media: Film,
  "Language/Input": Keyboard,
  "Laravel/PHP": Braces,
  "Desktop/Linux": Monitor,
  "Browser Extensions": Puzzle,
  "Games/Utilities": Gamepad2,
  "Mobile Apps": Smartphone,
  "Sensory & Hardware": HeartPulse,
  "3D Art & Design": Palette,
};

function getProjectIcon(project: ProjectIdentity): LucideIcon {
  return nameRules.find(([pattern]) => pattern.test(project.name))?.[1]
    ?? categoryIcons[project.category]
    ?? Package;
}

export function ProjectGlyph({
  project,
  size = 24,
  strokeWidth = 1.8,
  className,
}: {
  project: ProjectIdentity;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return createElement(getProjectIcon(project), {
    "aria-hidden": true,
    className,
    size,
    strokeWidth,
  });
}
