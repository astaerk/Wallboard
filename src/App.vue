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
#appMenuContainer .appMenuSeparator {
  display: inline-block;
  border: 1px solid #e4e7ed;
  width: 0px;
  height: 20px;
  margin-left: 10px;
}
#appMenuContainer .appMenuSeparator + .el-button {
  margin-left: 10px;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ipcRenderer, Event } from "electron";
import SerializerConfigManager from "./shared/serializerConfigManager";

SerializerConfigManager.registerSerializableTypes();

@Component({})
export default class App extends Vue {
  constructor() {
    super();

    this.bindIPCEvents();
  }

  private bindIPCEvents(): void {
    ipcRenderer.on("navigationRequest", (e: Event, url: string) =>
      this.onNavigationRequest(url)
    );
  }

  private onNavigationRequest(url: string): void {
    this.$router.push(url);
  }
}
</script>