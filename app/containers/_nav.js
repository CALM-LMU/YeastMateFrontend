export default [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Start new job',
    to: '/job',
    icon: 'cil-speedometer',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Correct detections',
    to: '/correct',
    icon: 'cil-speedometer',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Settings']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Preprocessing',
    to: '/alignment',
    icon: 'cil-align-left',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Detection',
    to: '/detection',
    icon: 'cil-align-left',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Export',
    to: '/export',
    icon: 'cil-align-left',
  },
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-2'
  }
]

