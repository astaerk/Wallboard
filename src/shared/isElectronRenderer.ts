export default function isElectronRenderer(): boolean {
  // running in a web browser
  if (typeof process === "undefined") {
    return true;
  }

  // node-integration is disabled
  if (!process) {
    return true;
  }

  // we're in node.js somehow
  if (!process.type) {
    return false;
  }

  return process.type === "renderer";
}
