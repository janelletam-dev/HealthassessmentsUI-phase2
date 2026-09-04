
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { DemoDriver, IS_DEMO } from "./app/demo-driver.tsx";
  import { GlobalGuideArrow } from "./app/guide-arrow.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <>
      <App />
      <GlobalGuideArrow />
      {IS_DEMO && <DemoDriver />}
    </>,
  );
