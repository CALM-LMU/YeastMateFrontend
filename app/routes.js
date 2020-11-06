import React from 'react';
import { observable } from 'mobx';

const Store = require('electron-store');

const AlignSettings = React.lazy(() => import('./views/settings/AlignmentSettingsForm'));
const DetectionSettings = React.lazy(() => import('./views/settings/DetectionSettingsForm'));
const ExportSettings = React.lazy(() => import('./views/settings/ExportSettingsForm'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const StartNewJob = React.lazy(() => import('./views/newjob/NewJob'));
const CorrectDetections = React.lazy(() => import('./views/correction/Correction'));

const store = new Store();

var sidebarShow = observable(new Map())
var alignPresetList = observable(new Map())
var detectPresetList = observable(new Map())
var exportPresetList = observable(new Map())

sidebarShow.set('show', 'responsive')

alignPresetList.set("1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed", {
  name: "Default",
  alignment: true,
  inputFileFormat: '.nd2',
  channels: [
    {"Camera":1,"Channel":1,"DIC":"True","Delete":"Keep"},
    {"Camera":2,"Channel":2,"DIC":"True","Delete":"Delete"},
    {"Camera":1,"Channel":3,"DIC":"False","Delete":"Keep"},
    {"Camera":2,"Channel":4,"DIC":"False","Delete":"Keep"}
  ],
  dimensions: [
    {"Dimension":"FOV","index":0,"status":"Existing"},
    {"Dimension":"Time","index":1,"status":"Existing"},
    {"Dimension":"Z-Stack","index":2,"status":"Existing"},
    {"Dimension":"Channels","index":3,"status":"Existing"},
    {"Dimension":"Height","index":4,"status":"Existing"},
    {"Dimension":"Width","index":5,"status":"Existing"}
  ] 
})

detectPresetList.set("a809ff23-4235-484f-86f2-e5d87da8333d", {
    name: "Default",
    graychannel: 0,
    boxsize: 200,
    zstack: false,
    video: false,
    boxExpansion: true,
    frameSelection: "all",
    ip: "10.153.168.3:5000",
 })

exportPresetList.set("1ed8c0c5-a4d9-4e63-a43b-b3bdaddd970f", {
  name: "Default",
  crop: true,
  mask: true,
  classes: [
    {"Class ID":1,"Tag":"single_cell","Crop":"False", "Mask": "False"},
    {"Class ID":2,"Tag":"mating","Crop":"True", "Mask": "True"},
  ]
})

if (typeof store.get('alignment') !== 'undefined') {
  for (let [key, value] of Object.entries(store.get('alignment'))) {
    if (key !== "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed") {
      alignPresetList.set(key, value)
    }
  }
}

if (typeof store.get('detection') !== 'undefined') {
  for (let [key, value] of Object.entries(store.get('detection'))) {
    if (key !== "a809ff23-4235-484f-86f2-e5d87da8333d") {
      detectPresetList.set(key, value)
    }
  }
}

if (typeof store.get('export') !== 'undefined') {
  for (let [key, value] of Object.entries(store.get('export'))) {
    if (key !== "1ed8c0c5-a4d9-4e63-a43b-b3bdaddd970f") {
      exportPresetList.set(key, value)
    }
  }
}

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/job', name: 'New Job', component: StartNewJob, data: { alignment: alignPresetList, detection: detectPresetList, export: exportPresetList} },
  { path: '/correct', name: 'Correct detections', component: CorrectDetections },
  { path: '/alignment', name: 'Alignment Settings', component: AlignSettings, data: alignPresetList },
  { path: '/detection', name: 'Detection Settings', component: DetectionSettings, data: detectPresetList },
  { path: '/export', name: 'Export Settings', component: ExportSettings, data: exportPresetList },
];

const prop =  {routes: routes, store: store, sidebarShow: sidebarShow, lists: { alignment: alignPresetList, detection: detectPresetList, export: exportPresetList }}

export default prop;
