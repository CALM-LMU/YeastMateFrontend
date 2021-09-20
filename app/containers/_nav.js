export default [
  {
    _tag: 'CSidebarNavItem',
    name: 'Start new job',
    to: '/job',
    icon: 'cil-speedometer',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-align-left',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Visualize / Annotate',
    to: '/annotate',
    icon: 'cil-layers',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Settings']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Backends',
    to: '/backend',
    icon: 'cil-settings',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Detection',
    to: '/detection',
    icon: 'cil-settings',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Preprocessing',
    to: '/preprocessing',
    icon: 'cil-settings',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Save Crops',
    to: '/export',
    icon: 'cil-settings',
  },
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-2'
  }
]

