<template>
  <div>
    <h1 v-if="!sites">Loading sites...</h1>
    <h1 v-if="sites && sites.length <= 0">No configured pages found.</h1>
    <el-tabs v-if="sites && sites.length > 0" :model="sites">
      <el-tab-pane v-for="(site, index) in sites" :key="site.id" :label="site.name">
        <span>{{ index }}</span>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Site from "@/shared/site";
import { screen } from "electron";
import Settings from "../shared/settings";
import SettingsStore from "../render/settingsStore";
import { ipcRenderer, Event } from "electron";

@Component
export default class SiteRenderer extends Vue {
  public sites: Site[] | null = null;

  constructor() {
    super();
    ipcRenderer.on("navigationRequest", (e: Event, url: string) =>
      this.loadSites()
    );
    this.loadSites();
  }

  public loadSites(): void {
    let windowBounds = require("electron")
      .remote.getCurrentWindow()
      .getBounds();
    let currentDisplay = screen.getDisplayMatching(windowBounds);
    let displayId = currentDisplay.id;

    let settingsStore = new SettingsStore();

    settingsStore.loadSettings().then(
      (settings: Settings): void => {
        if (settings.sites) {
          this.sites = settings.sites.filter(
            (value: Site, index: number, array: Site[]): any => {
              return value.displayId === displayId;
            }
          );
        } else {
          // null or undefined on this.sites means "currently loading" because
          // normally settings.sites should never be null/undefined.
          // To ensure this behavior set this.sites to an empty array if
          // settings.sites should really be null/undefined.
          this.sites = [];
        }
      }
    );
  }
}
</script>

<style scoped lang="scss">
</style>
