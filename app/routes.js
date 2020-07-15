import React from 'react';
import { observable, toJS } from 'mobx';

const Store = require('electron-store');

const PathsSettings = React.lazy(() => import('./views/settings/PathsSettingsForm'));
const AlignSettings = React.lazy(() => import('./views/settings/AlignmentSettingsForm'));
const DetectionSettings = React.lazy(() => import('./views/settings/DetectionSettingsForm'));
const MaskSettings = React.lazy(() => import('./views/settings/MaskSettingsForm'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const StartNewJob = React.lazy(() => import('./views/newjob/NewJob'));
const CorrectDetections = React.lazy(() => import('./views/correction/Correction'));

const store = new Store();

var sidebarShow = observable(new Map())
var pathList = observable(new Map())
var alignPresetList = observable(new Map())
var detectPresetList = observable(new Map())
var maskPresetList = observable(new Map())

sidebarShow.set('show', 'responsive')

if (typeof store.get('paths') !== 'undefined') {
  pathList.set('pathList', store.get('paths'))
}
else {
  pathList.set('pathList', [
    { Path: "Placeholder", Server: "False", id: "d401b8ea-2e03-4b37-a3a1-243a1c538882" }
  ])
}

alignPresetList.set("1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed", {
  name: "Default",
  alignment: true,
  videoSplit: true,
  inputFileFormat: 'nd2',
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
    channels: [
      {"Type":"DIC","index":0},
      {"Type":"Red","index":1},
      {"Type":"Green","index":2}
    ],
    boxsize: 200,
    video: false,
    videoSplit: true
 })

maskPresetList.set("2166753e-e6e0-4092-b0d1-38e84060033c", {
    name: "Default",
    channels: [
      {"Type":"Green","index":0},
      {"Type":"Red","index":0},
      {"Type":"DIC","index":0}
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

if (typeof store.get('mask') !== 'undefined') {
  for (let [key, value] of Object.entries(store.get('mask'))) {
    if (key !== "2166753e-e6e0-4092-b0d1-38e84060033c") {
      maskPresetList.set(key, value)
    }
  }
}

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/job', name: 'New Job', component: StartNewJob, data: {paths: pathList, alignment: alignPresetList, detection: detectPresetList, mask: maskPresetList} },
  { path: '/correct', name: 'Correct detections', component: CorrectDetections },
  { path: '/paths', name: 'Paths Settings', component: PathsSettings, data: pathList },
  { path: '/alignment', name: 'Alignment Settings', component: AlignSettings, data: alignPresetList },
  { path: '/detection', name: 'Detection Settings', component: DetectionSettings, data: detectPresetList },
  { path: '/mask', name: 'Mask Settings', component: MaskSettings, data: maskPresetList },
];

const prop =  {routes: routes, store: store, sidebarShow: sidebarShow, lists: { paths: pathList, alignment: alignPresetList, detection: detectPresetList, mask: maskPresetList }}

export default prop;
