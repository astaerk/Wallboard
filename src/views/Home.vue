<template>
  <div class="home">
    <SiteRenderer/>
    <div id="appMenuContainer">
      <el-button type="infor">
        <router-link to="/settings">
          <img alt="Settings" src="../assets/settings.png">
        </router-link>
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SiteRenderer from "@/components/SiteRenderer.vue"; // @ is an alias to /src

@Component({
  components: {
    SiteRenderer
  }
})
export default class Home extends Vue {}
</script>
