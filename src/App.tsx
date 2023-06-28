import React,{ lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import CircularProgressPage from "./components/CircularProgressPage";
import { useAuthState } from "./context/authContext";
import { ProductProvider } from "./providers/productProvider";
import { unauthenticatedRoutes} from "./routes";
import { CategoryProvider } from "./providers/categoryProvider";
import { SubCategoryProvider } from "./providers/subCategoryProvider";
import { AddItemNotificationProvider } from "./providers/AddItemNotificationProvider";
import { ColorProvider } from "./providers/colorProvider";
import { SizeProvider } from "./providers/SizeProvider";
import { ImageProvider } from "./providers/imageProvider";
import { VendorProvider } from "./providers/vendorProvider";
import { PageProvider } from "./providers/pageProvider";

const SignInPage = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const NotFoundComponent = lazy(() => import("./components/NotFoundComponent"));
const Dashboard = lazy(() => import("./pages/Dashboard"))

const App = (): JSX.Element => {
  const { isAuthenticated } = useAuthState();

  useEffect(() => {
    console.log("App.tsx: isAuthenticated", isAuthenticated);
  }, [isAuthenticated])
  return (
    <Router>
      <Suspense fallback={<CircularProgressPage />}>
        <Routes>
          <Route
            path="/signin"
            element={
              !isAuthenticated ? (
                <SignInPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isAuthenticated ? (
                <SignUp />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          {/* You'll only need the trailing * (path='/*) when there is another <Routes> */}
          {/* if we don't want to include path : "/" then use <Outlet/>, see : https://reactrouter.com/en/main/components/outlet */}
          <Route
            element={
              <PageProvider>
                <ProductProvider>
                  <CategoryProvider>
                    <AddItemNotificationProvider>
                      <Outlet />
                    </AddItemNotificationProvider>
                  </CategoryProvider>
                </ProductProvider>
              </PageProvider>
            }
          >
            <>
              {/* we can't make this as a component since any direct child of <Route> should be exactly <Route> or <Routes>   */}
              {unauthenticatedRoutes.map(({ component: Component, path }) => (
                <Route path={`/${path}`} key={path} element={<Component />} />
              ))}
              {/* <Outlet/> */}
              <Route
                path={`/dashboard`}
                element={
                  <SubCategoryProvider>
                    <ColorProvider>
                      <SizeProvider>
                        <ImageProvider>
                          <VendorProvider>
                            <Dashboard />
                          </VendorProvider>
                        </ImageProvider>
                      </SizeProvider>
                    </ColorProvider>
                  </SubCategoryProvider>
                }
              />
            </>
          </Route>
          <Route path="/*" element={<NotFoundComponent />}/>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
