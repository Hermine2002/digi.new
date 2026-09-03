"use client";

import dynamic from "next/dynamic";

const AboutBackdrop3D = dynamic(
  () => import("./AboutBackdrop3D").then((m) => m.AboutBackdrop3D),
  { ssr: false }
);

export function AboutBackdrop3DLoader({
  containerId,
  activeIndexRef,
}: {
  containerId: string;
  activeIndexRef: React.MutableRefObject<number>;
}) {
  return <AboutBackdrop3D containerId={containerId} activeIndexRef={activeIndexRef} />;
}