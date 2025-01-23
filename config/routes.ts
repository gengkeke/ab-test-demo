export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/chat', component: './Chat' },
  {
    path: '/dataset',
    routes: [
      { path: '/dataset', component: './DataSet' },
      { path: '/dataset/detail', component: './DataSet/detail' },
      { path: '/dataset/documentDetail', component: './DataSet/DocumentDetail' },
    ],
  },
  { path: '/', redirect: '/chat' },
  { path: '*', layout: false, component: './404' },
];
