import { render } from "preact";
import { App } from "./App";
import "./styles/index.css";
import { registerSW } from "virtual:pwa-register";

// 注册 service worker
registerSW({
  onNeedRefresh() {
    if (confirm("新版本可用，是否立即更新？")) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log("应用已准备好离线使用");
  },
});

render(<App />, document.getElementById("root")!);
