import menuUI from './menus/ui.menu'
import menuApps from './menus/apps.menu'
import menuPages from './menus/pages.menu'

export default {
  // main navigation - side menu
  menu: [
    {
      text: 'Student',
      icon: 'mdi-human-greeting-variant',
      items: [
        {
          text: 'Dashboard',
          link: '/dashboard',
          icon: 'mdi-view-dashboard',
          color: 'blue'
        },
        {
          text: 'Classes',
          link: '/classes',
          icon: 'mdi-notebook-multiple',
          color: 'blue'
        },
        {
          text: 'Certificates',
          link: '/certificates',
          icon: 'mdi-certificate',
          color: 'green'
        },
        // {
        //   text: 'Qualifications',
        //   link: '/qualifications',
        //   icon: 'mdi-card-account-details-star-outline',
        //   color: 'green'
        // },
        {
          text: 'Jobs',
          link: '/jobs',
          icon: 'mdi-briefcase-search',
          color: 'green'
        },
      ]
    },
    {
      text: 'Teacher',
      icon: 'mdi-human-male-board',
      items: [
        {
          text: 'Teacher\'s Room',
          link: '/teacher',
          icon: 'mdi-notebook-edit',
          color: 'red'
        },
        {
          text: 'Alumni',
          link: '/students',
          icon: 'mdi-format-list-bulleted-square',
          color: 'red'
        },
      ]
    },
    {
      text: 'Admin',
      icon: 'mdi-account-wrench',
      items: [
        {
          text: 'Users',
          link: '/admin/users',
          icon: 'mdi-account-multiple',
          color: 'indigo'
        }
      ]
    },
    {
      items: [
        {
          text: 'Profile',
          link: '/profile',
          icon: 'mdi-account-edit',
          color: 'orange'
        },
      ]
    }
  ],

  // footer links
  footer: [
    // {
    // text: 'Docs',
    // key: 'menu.docs',
    // href: 'https://vuetifyjs.com',
    // target: '_blank'
    // }
  ]
}
