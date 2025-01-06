import { isDev } from "./util.js";
import path from "path";
import { app } from "electron";

export function getPreloadPath() {
    return path.join(
        app.getAppPath(), //path of the electron app
        isDev() ? '.':'..',
        '/dist-electron/preload.cjs'

    )
}