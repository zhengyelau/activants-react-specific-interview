import React, { useCallback, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Home from "./routes/home";
import BackdropFilter from "react-backdrop-filter";
import "./App.css";
import Alert from "@mui/material/Alert";

function App() {
  const [loading, setLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMSG, setErrorMSG] = useState("");

  return (
    <div className="App">
      <Container disableGutters component="main" sx={{ pt: 20, pb: 6 }}>
        <div className="video-bg">
          <video className={"video"} autoPlay loop muted>
            <source
              src={"https://assets.codepen.io/3364143/7btrrd.mp4"}
              type={"video/mp4"}
            />
          </video>
        </div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          onClick={() => setLoading(false)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {errorAlert === true && (
          <Alert variant="filled" severity="error">
            {errorMSG}
          </Alert>
        )}

        <Card
          style={{
            backgroundColor: "rgba(16,18,27,0.5)",
            borderRadius: 20,
            margin: 20,
            marginVertical: 0,
          }}
        >
          <BackdropFilter
            className="bluredForm"
            filter={"blur(20px)"}
            canvasFallback={true}
            html2canvasOpts={{
              allowTaint: true,
            }}
          >
            <Home
              loading={loading}
              loadingCallback={(childData) => {
                setLoading(childData);
              }}
              errorAlert={errorAlert}
              errorAlertCB={(childData) => {
                setErrorAlert(childData);
              }}
              errorMSG={errorMSG}
              errorMSGCB={(childData) => {
                setErrorMSG(childData);
              }}
            />
          </BackdropFilter>
        </Card>
      </Container>
    </div>
  );
}

export default App;
