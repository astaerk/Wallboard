<template>
  <div id="settings">
    <el-tabs>
      <el-tab-pane label="Sites">
        <div>
          <el-form
            v-if="settingsWrapper.settings"
            :model="settingsWrapper.settings"
            :rules="rules"
            ref="settingsForm"
          >
            <el-form-item v-for="(site, index) in settingsWrapper.settings.sites" :key="site.id">
              <el-row :gutter="5">
                <el-col :span="12">
                  <el-form-item
                    :prop="'sites.' + index + '.name'"
                    :rules="{required: true, message: 'Please input a site name', trigger: 'blur'}"
                  >
                    <el-input v-model="site.name" placeholder="www.example.com"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item
                    :prop="'sites.' + index + '.displayId'"
                    :rules="{required: true, message: 'Please select a monitor', trigger: 'blur'}"
                  >
                    <el-select v-model="site.displayId" value-key="name" placeholder="Monitor">
                      <el-option
                        v-for="(monitor) in settingsWrapper.settings.monitors"
                        :key="monitor.id"
                        :label="monitor.displayName"
                        :value="monitor.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1">
                  <el-button @click="deleteSite(site.id)">X</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>

          <el-row>
            <el-col :span="1">
              <el-button @click="addSite()" :disabled="settingsWrapper.settings === null">+</el-button>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="General Settings">
        <!--<div>
          <p>
            If Element is successfully added to this project, you'll see an
            <code v-text="'<el-button>'"></code>
            below
          </p>
          <el-button>el-button</el-button>
          <el-button>el-button 2</el-button>
        </div>-->
      </el-tab-pane>
    </el-tabs>
    <div id="appMenuContainer">
      <el-button type="infor" @click="cancel()">
        <img alt="Cancel" src="../assets/cancel.png">
      </el-button>
      <el-button type="infor" @click="save()">
        <img alt="Save" src="../assets/ok.png">
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Settings from "../shared/settings";
import Site from "../shared/site";
import SettingsStore from "../render/settingsStore";
import { ipcRenderer, screen } from "electron";
import { isNumber } from "util";

@Component({ name: "settings" })
export default class SettingsComponent extends Vue {
  private settingsStore = new SettingsStore();

  public settingsWrapper: { settings: Settings | null } = {
    settings: null
  };

  constructor() {
    super();

    this.settingsStore.loadSettings().then((value: Settings) => {
      if (value) {
        this.settingsWrapper.settings = value;
      } else {
        this.settingsWrapper.settings = new Settings();
      }
    });
  }

  public rules: any = {
    /*name: [
      {
        required: true,
        message: "Please input Activity name",
        trigger: "blur"
      },
      { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" }
    ]*/
  };

  public save(): void {
    if (!this.settingsWrapper.settings) {
      return;
    }

    let settings: Settings = this.settingsWrapper.settings;

    (<any>this.$refs["settingsForm"]).validate(
      (valid: boolean): boolean => {
        if (valid) {
          this.settingsStore.saveSettings(settings);
          return true;
        } else {
          return false;
        }
      }
    );
  }

  public cancel(): void {
    (<any>this.$refs["settingsForm"]).resetFields();
    this.settingsStore.clearCache();
    this.$router.push("/");
  }

  public deleteSite(siteId: any): void {
    if (this.settingsWrapper.settings === null) {
      return;
    }
    let sites = this.settingsWrapper.settings.sites;
    let idx = sites.findIndex(s => s.id === siteId);
    sites.splice(idx, 1);
  }

  public addSite(): void {
    if (this.settingsWrapper.settings === null) {
      return;
    }

    let sites = this.settingsWrapper.settings.sites;

    let newId: number;

    if (sites && sites.length > 0) {
      let maxId = Math.max(...sites.map(s => s.id));
      newId = maxId + 1;
      if (!isNumber(newId)) {
        newId = 0;
      }
    } else {
      newId = 0;
    }

    let site = new Site(newId, "", screen.getPrimaryDisplay().id);

    sites.push(site);
  }
}
</script>