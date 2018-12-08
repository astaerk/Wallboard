<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
#appMenuContainer {
  position: absolute;
  top: 10px;
  right: 8px;
  height: 36px;
  z-index: 1000;
  background: white;
}
#appMenuContainer .el-button {
  padding: 2px;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ipcRenderer, Event } from "electron";

@Component({})
export default class App extends Vue {
  constructor() {
    super();

    this.bindIPCEvents();
  }

  private bindIPCEvents() {
    ipcRenderer.on("navigationRequest", (e: Event, url: string) =>
      this.onNavigationRequest(url)
    );
  }

  private onNavigationRequest(url: string) {
    this.$router.push(url);
  }
}
</script>