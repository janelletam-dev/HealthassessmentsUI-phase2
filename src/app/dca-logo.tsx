// The DCA logo, drawn from Figma's own vectors rather than an exported PNG.
//
// IT LIVES HERE NOW BECAUSE FOUR SCREENS DRAW IT. The app header, the app
// footer, the AXA lockup and, since the portal Uploads page, the member
// portal's purple bar and its dark footer. It was inside App.tsx, which the
// portal cannot import without a cycle.
//
// The wordmark is white, so it only reads on a dark ground.

import svgPaths from "../assets/svg-paths";

export function LogoLayer() {
  return (
    <div className="absolute inset-[0.65%_10.81%_0_0.04%]" data-name="Layer 1">
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        height="35.7653"
        preserveAspectRatio="none"
        viewBox="0 0 122.932 35.7653"
        width="122.932"
      >
        <g id="Layer 1">
          <path d={svgPaths.p2a6c3980} fill="#FFB306" />
          <path d={svgPaths.p2eda5f80} fill="#FFB306" />
          <path d={svgPaths.pdf57f0} fill="url(#logo_grad)" />
        </g>
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="logo_grad"
            x1="5.2374"
            x2="30.5205"
            y1="30.5268"
            y2="5.24374"
          >
            <stop stopColor="#0E73DD" />
            <stop offset="0.18" stopColor="#1684DF" />
            <stop offset="0.47" stopColor="#219AE0" />
            <stop offset="0.74" stopColor="#27A7E2" />
            <stop offset="1" stopColor="#29ABE2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function LogoGroup() {
  return (
    <div className="absolute inset-[9.87%_0.11%_7.62%_29.61%]" data-name="Group">
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        height="29.7022"
        preserveAspectRatio="none"
        viewBox="0 0 96.9004 29.7022"
        width="96.9004"
      >
        <g>
          <path d={svgPaths.pedc1e00} fill="white" />
          <path d={svgPaths.p31f94e00} fill="white" />
          <path d={svgPaths.p27ad900} fill="white" />
          <path d={svgPaths.p3bfd2400} fill="white" />
          <path d={svgPaths.p369fbf80} fill="white" />
          <path d={svgPaths.p3de47100} fill="white" />
          <path d={svgPaths.p2ebe5970} fill="white" />
          <path d={svgPaths.p231ab580} fill="white" />
          <path d={svgPaths.pd85ab00} fill="white" />
          <path d={svgPaths.p34382df0} fill="white" />
          <path d={svgPaths.p60abc00} fill="white" />
          <path d={svgPaths.p328c8e00} fill="white" />
          <path d={svgPaths.p3041f280} fill="white" />
          <path d={svgPaths.p33936770} fill="white" />
          <path d={svgPaths.pc2dae00} fill="white" />
          <path d={svgPaths.p2453a200} fill="white" />
          <path d={svgPaths.p12dc1180} fill="white" />
          <path d={svgPaths.p293d8230} fill="white" />
        </g>
      </svg>
    </div>
  );
}

export function Logo() {
  return (
    <div className="h-[36px] overflow-clip relative shrink-0 w-[137.895px]">
      <LogoLayer />
      <LogoGroup />
    </div>
  );
}

