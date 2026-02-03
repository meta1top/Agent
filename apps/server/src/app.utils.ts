import { networkInterfaces } from "node:os";

export function printBanner(port: number | string): void {
  const networkAddress = getNetworkAddress();
  console.log(`  NestJS Server`);
  console.log(`  - Local:   http://localhost:${port}`);
  if (networkAddress) {
    console.log(`  - Network: http://${networkAddress}:${port}`);
  }
  console.log(`  - Swagger: http://localhost:${port}/docs`);
}

function getNetworkAddress(): string | null {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    const netInfo = nets[name];
    if (!netInfo) continue;

    for (const net of netInfo) {
      const family = String(net.family);
      const isIPv4 = family === "IPv4" || family === "4";
      const isNotInternal = !net.internal;
      if (isIPv4 && isNotInternal) {
        return net.address;
      }
    }
  }
  return null;
}
