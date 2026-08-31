import type { RefObject } from "react";
import type { projects as projectsType } from "@/lib/content";
import { projectRegistryId } from "./project.config";

type Project = (typeof projectsType)[number];

type ProjectIndexRailProps = {
  projects: readonly Project[];
  activeIndex: number;
  progressFillRef: RefObject<HTMLDivElement | null>;
};

export function ProjectIndexRail({
  projects,
  activeIndex,
  progressFillRef,
}: ProjectIndexRailProps) {
  return (
    <>
      {/* Desktop vertical rail */}
      <nav
        className="hidden flex-col justify-between border-r border-line pr-6 md:flex lg:pr-8"
        aria-label="Case dossier index"
      >
        <ul className="space-y-1">
          {projects.map((project, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={project.id}>
                <div
                  className={`border-l-2 py-3 pl-4 transition-colors duration-200 ${
                    isActive
                      ? "border-signal text-paper"
                      : "border-transparent text-paper-faint"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className="block font-mono text-[10px] tracking-wider text-paper-faint lg:text-xs">
                    {projectRegistryId(index)}
                  </span>
                  <span
                    className={`mt-1 block font-display text-sm lg:text-base ${
                      isActive ? "font-medium" : "font-normal"
                    }`}
                  >
                    {project.name}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 pr-2">
          <div className="h-px w-full bg-line">
            <div
              ref={progressFillRef}
              className="h-full origin-left scale-x-0 bg-signal"
            />
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
            Scroll dossier
          </p>
        </div>
      </nav>

      {/* Mobile horizontal stepper */}
      <nav
        className="mb-6 flex gap-2 overflow-x-auto border-b border-line pb-4 md:hidden"
        aria-label="Case dossier index"
      >
        {projects.map((project, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={project.id}
              className={`shrink-0 border-l-2 py-1 pl-3 pr-4 transition-colors duration-200 ${
                isActive ? "border-signal text-paper" : "border-transparent text-paper-faint"
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="block font-mono text-[10px] tracking-wider">
                {projectRegistryId(index)}
              </span>
              <span className="mt-0.5 block text-sm font-medium">{project.name}</span>
            </div>
          );
        })}
      </nav>
    </>
  );
}
