import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProductFormView from "../views/products/ProductFormView.vue";
import ProductsListView from "../views/products/ProductsListView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/products",
      name: "products",
      component: ProductsListView,
    },
    {
      path: "/products/new",
      name: "product-create",
      component: ProductFormView,
      props: { mode: "create" },
    },
    {
      path: "/products/:id",
      name: "product-view",
      component: ProductFormView,
      props: (route) => ({ mode: "view", id: route.params.id }),
    },
    {
      path: "/products/:id/edit",
      name: "product-edit",
      component: ProductFormView,
      props: (route) => ({ mode: "edit", id: route.params.id }),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;