"use client";

import dynamic from "next/dynamic";

const ProjectsBackdrop3D = dynamic(
  () => import("./ProjectsBackdrop3D").then((m) => m.ProjectsBackdrop3D),
  { ssr: false }
);

export function ProjectsBackdrop3DLoader({ containerId }: { containerId: string }) {
  return <ProjectsBackdrop3D containerId={containerId} />;
}