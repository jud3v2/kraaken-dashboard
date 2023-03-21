// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Gestion Des Clients',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Gestion Des Categories',
    path: '/dashboard/categories',
    icon: icon('ic_cart'),
  },
  {
    title: 'Gestion Des Produits',
    path: '/dashboard/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'Gestion Des Tags',
    path: '/dashboard/tags',
    icon: icon('ic_cart'),
  },
  {
    title: 'Gestion Des Commandes',
    path: '/dashboard/order',
    icon: icon('ic_cart'),
  },
  {
    title: 'Gestion Du Blog',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'Paramètres',
    path: '/dashboard/settings',
    icon: icon('ic_user'),
  },
];

export default navConfig;
