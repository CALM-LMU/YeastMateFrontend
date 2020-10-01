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
    name: 'Paths',
    to: '/paths',
    icon: 'cil-align-left',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Alignment',
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
    _tag: 'CSidebarNavDivider',
    className: 'm-2'
  }
]

