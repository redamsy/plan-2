import { lazy } from "react";

enum Params {
  categoryparam= 'categoryparam',
  subcategoryparam= 'subcategoryparam',
  itemcode= 'itemcode'
};

export const unauthenticatedRoutes = [
  {
    path: "/",
    component: lazy(() => import("../pages/Home")),
  },
  {
    path: `/shop/:${Params.categoryparam}?/:${Params.subcategoryparam}?`,
    component: lazy(() => import("../pages/Shop/Shop")),
  },
  {
    path: `/shopv2/:${Params.categoryparam}?/:${Params.subcategoryparam}?`,
    component: lazy(() => import("../pages/Shop/Shopv2")),
  },
  {
    path: `product/:${Params.itemcode}`,
    component: lazy(() => import("../pages/Product")),
  },
];