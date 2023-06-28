import React,{ lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import CircularProgressPage from "./components/CircularProgressPage";
import { useAuthState } from "./context/authContext";
import { ProductProvider } from "./providers/productProvider";
import { ImageProvider } from "./providers/imageProvider";

const SignInPage = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const NotFoundComponent = lazy(() => import("./components/NotFoundComponent"));
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Shop = lazy(() => import("./pages/Shop/Shop"));

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
          <Route
            element={
              <ProductProvider>
                <Outlet />
              </ProductProvider>
            }
          >
            <>
              <Route path={`/`} element={<Shop />} />
              <Route
                path={`/dashboard`}
                element={
                  <ImageProvider>
                      <Dashboard />
                  </ImageProvider>
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
