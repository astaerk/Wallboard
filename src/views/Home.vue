<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <div id="appMenuContainer">
      <el-button type="infor">
        <router-link to="/settings"><img alt="Settings" src="../assets/settings.png"></router-link>
      </el-button>
    </div>
  </div>
</template>

<!--<el-tabs>
      <el-tab-pane label="Default Vue">
        <div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
          
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
    </el-tabs>-->

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {}
</script>
