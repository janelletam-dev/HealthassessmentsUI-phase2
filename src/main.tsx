
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { DemoDriver, IS_DEMO } from "./app/demo-driver.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <>
      <App />
      {IS_DEMO && <DemoDriver />}
    </>,
  );
