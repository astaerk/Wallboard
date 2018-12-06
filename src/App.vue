<template>
  <div id="app">
    <el-tabs>
      <el-tab-pane label="Default Vue">
        <div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
          <router-view/>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element UI">
        <div>
          <p>
            If Element is successfully added to this project, you'll see an
            <code v-text="'<el-button>'"></code>
            below
          </p>
          <el-button>el-button</el-button>
          <el-button>el-button 2</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div id="appMenuContainer">
      <el-button type="infor">
        <img alt="Settings" src="./assets/settings.png">
      </el-button>
    </div>
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
