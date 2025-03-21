import { SvgColor } from '@/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Grant request',
    path: '/grant-request',
    icon: icon('ic-user'),
  },
  {
    title: 'User list',
    path: '/users',
    guard: ['user', 'reviewer', 'reviewer', "grant_dep", 'finance'],
    icon: icon('ic-cart'),
    // info: (
    //   <Label color="error" variant="inverted">
    //     +3
    //   </Label>
    // ),
  },
  // {
  //   title: 'Apply',
  //   path: '/apply',
  //   guard: ["grant_dep", 'reviewer',"col_dean", "grant_dir"],
  //   icon: icon('ic-blog'),
  // },
  {
    title: 'Announcement Portal',
    path: '/announcement-portal',
    guard: ["grant_dep", 'user', 'reviewer', "col_dean", "finance"],
    icon: icon('ic-lock'),
  },
  {
    title: 'Chart',
    path: '/chart',
    guard: ['user', 'reviewer']
  }
];
