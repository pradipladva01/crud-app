import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React from "react";
import Posts from "./components/Posts";
import "./css/HomePage.css";
import { SnackbarProvider } from "notistack";

const App = () => {
  return (
    <>
      <SnackbarProvider
        maxSnack={3}
        classes={{
          root: "custom-snackbar",
        }}
      >
        <section className="main_section">
          <Posts />
        </section>
      </SnackbarProvider>
    </>
  );
};

export default App;
