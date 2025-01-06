import osUtils from "os-utils";
import fs from "fs";
import os from "os";
import { BrowserWindow } from "electron";
const POLLING_INTERVAL = 500;
export function pollResource(mainWindow: BrowserWindow) {
    setInterval(async() => {
        const cpuUsage = await getCpuUsage();
        const ramUsage = await getRamUsage();
        const storageData = getStorageData();
        mainWindow.webContents.send('statistics',{
            cpuUsage,
            ramUsage,
            storageData
        });    }, POLLING_INTERVAL);
}

function getCpuUsage() {
    return new Promise(resolve => {
        osUtils.cpuUsage(resolve);  
    });
}

export function getStaticData() {
    const totalStorage = getStorageData().total;
    const cpuModel = os.cpus()[0].model;
    const totalMemoryGB = Math.floor(osUtils.totalmem()/1024);

    return {
        cpuModel,
        totalMemoryGB,
        totalStorage,
    }
    }

function getRamUsage() {
    return 1-osUtils.freememPercentage();
}

function getStorageData() {
    const stats = fs.statfsSync(process.platform === 'win32' ? 'C:\\' : '/');
    const total = stats.bsize * stats.blocks;
    const free = stats.bsize * stats.bfree;

    return{
        total: Math.floor(total/1_000_000_000), //get in GB
        usage: 1-free/total,
    };
}