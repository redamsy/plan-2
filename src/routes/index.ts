import { lazy } from "react";

enum Params {
  categoryparam= 'categoryparam',
  subcategoryparam= 'subcategoryparam',
  itemcode= 'itemcode'
};

export const unauthenticatedRoutes = [
  {
    path: "/",
    component: lazy(() => import("../pages/Shop/Shop")),
  },

];