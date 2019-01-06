<template>
  <div class="about">
    <h1>About Wallboard</h1>
    <a
      href="#"
      @click="openBrowser('https://github.com/astaerk/Wallboard/')"
    >https://github.com/astaerk/Wallboard/</a>
  </div>
</template>

<style>
.about {
  text-align: left;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { shell } from "electron";

@Component
export default class About extends Vue {
  public openBrowser(href: string): void {
    shell.openExternal(href);
  }
}
</script>