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
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { purple } from "@mui/material/colors";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import MsgReader from "@kenjiuno/msgreader";
import BackdropFilter from "react-backdrop-filter";
import { styled as styled_mui } from "@mui/material/styles";
import "../App.css";
import axios from "axios";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import RatingAlert from "../components/RatingAlert";
import SimpleDialogDemo from "../components/RatingSelectCategory";
import NewCategoryAlert from "../components/NewCategoryAlert";

const getColor = (props) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isFocused) {
    return "#2196f3";
  }
  return "#eeeeee";
};

const DropzoneContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  padding: 20px;
  border-radius: 20px;
  border-color: ${(props) => getColor(props)};

  background-color: rgba(16, 18, 27, 0.5);
  color: white;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

const Home = ({
  loading,
  loadingCallback,
  errorAlert,
  errorAlertCB,
  errorMSG,
  errorMSGCB,
}) => {
  const url = "https://email-classification-flask.herokuapp.com/predict";
  const [parsedStr, setParsedStr] = useState(null);
  // variables for DB injection and UI handling
  const [classification, setClassification] = useState("");
  const [inputStr, setInputStr] = useState(null);
  const [percentageOutput, setPercentageOutput] = useState(null);
  const [allCats, setAllCats] = useState(null);
  const [user_rating, set_user_rating] = useState(false);
  const [correct_cat, set_correct_cat] = useState(null);

  const [rating_status, set_rating_status] = useState(null);

  const [user_rating_alert_state, set_user_rating_alert_status] =
    useState(false);
  const [
    user_rating_alert_choose_cat_state,
    set_user_rating_alert_choose_cat_state,
  ] = useState(false);
  const [new_cat_rating_alert_state, set_new_cat_rating_alert_state] =
    useState(false);

  // variables for UI handling
  const [showParsedStr, setShowParsedStr] = useState(false);
  const [ClfModeToggle, setClfMode] = useState(true);
  const [currentPredModeToggle, setCurrentPredModeToggle] = useState(null);
  const [currentFileName, setCurrentFileName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [recEmail, setRecEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");

  const handleSenderEmail = (event) => {
    setSenderEmail(event.target.value);
  };
  const handleRecEmail = (event) => {
    setRecEmail(event.target.value);
  };
  const handleSubject = (event) => {
    setSubject(event.target.value);
  };
  const handleContent = (event) => {
    setEmailContent(event.target.value);
  };

  const prediction_correct = async () => {
    loadingCallback(true);
    const resp = await fetch(
      // 'https://email-classification-flask.herokuapp.com/rate_prediction',
      "https://email-classification-flask.herokuapp.com/rate_prediction",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          outputs: percentageOutput,
          input_str: inputStr,
          categories: allCats,
          target_cat: classification,
          correct_cat: classification,
        }),
      }
    );

    setClassification("");
    set_user_rating(true);
    setEmailContent("");
    setCurrentPredModeToggle(null);
    // console.log(`prediction_correct_post: ${resp.status}`)
    set_rating_status(true);
    errorAlertCB(false);
    loadingCallback(false);
  };

  const prediction_false = async (correct_category) => {
    loadingCallback(true);
    const resp = await fetch(
      "https://email-classification-flask.herokuapp.com/rate_prediction",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          outputs: percentageOutput,
          input_str: inputStr,
          categories: allCats,
          target_cat: classification,
          correct_cat: correct_category,
        }),
      }
    );
    setClassification("");
    setCurrentPredModeToggle(null);
    setEmailContent("");
    set_user_rating(true);
    // console.log(`prediction_false_post: ${resp.status}`)
    set_rating_status(true);
    errorAlertCB(false);
    loadingCallback(false);
  };

  // predict by user inputs
  const predictByInput = async () => {
    errorAlertCB(false);

    if (rating_status == false) {
      // console.log('Not Rated')
      errorMSGCB("Please Specify if the last prediction is correct");
      errorAlertCB(true);
      set_user_rating_alert_status(true);
    } else {
      if (emailContent.length < 10) {
        errorMSGCB(
          "Please input a meaningful message in the email content input area"
        );
        errorAlertCB(true);
      } else {
        loadingCallback(true);
        const resp = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: emailContent,
          }),
        });
        const content = await resp.json();
        // console.log(content)
        setCurrentPredModeToggle(false);
        setParsedStr(content["parsed_str"]);
        setInputStr(content["input_str"]);
        setClassification(content["target_cat"]);
        setPercentageOutput(content["outputs"]);
        set_user_rating(null);
        loadingCallback(false);
        set_rating_status(false);
      }
    }
  };

  const uploadFile = async (msg) => {
    // console.log(JSON.stringify({
    //     message: msg
    // }))
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: msg,
      }),
    });
    const content = await resp.json();
    // console.log(content)
    set_user_rating(null);
    setCurrentPredModeToggle(true);
    setParsedStr(content["parsed_str"]);
    setInputStr(content["input_str"]);
    setPercentageOutput(content["outputs"]);
    setAllCats(content["categories"]);
    return content["target_cat"];
  };

  const uploadFile_ = async (msg) => {
    // console.log(JSON.stringify({
    //     message: msg
    // }))
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: msg,
      }),
    })
      .then((res) => {
        const statusCode = res.status;
        let data = res.json();
        return Promise.all([statusCode, data]);
      })
      .then(([statusCode, data]) => {
        set_user_rating(null);
        setCurrentPredModeToggle(true);
        setParsedStr(data["parsed_str"]);
        setInputStr(data["input_str"]);
        setPercentageOutput(data["outputs"]);
        setAllCats(data["categories"]);
        setClassification(data["target_cat"]);
      });
  };

  const parseTxt = (file) => {
    // console.log(file);
    return new Promise((resolve) => {
      var textType = /text.*/;

      if (file[0].type.match(textType)) {
        var reader = new FileReader();

        reader.onload = function (e) {
          var content = reader.result;
          resolve(content);
        };
        reader.readAsText(file[0]);
      }
    });
  };

  const onDrop = useCallback((acceptedFiles) => {
    errorAlertCB(false);
    // console.log('==========================')
    // console.log(acceptedFiles[0].name)
    // console.log(acceptedFiles[0].type)
    // console.log(acceptedFiles.length)
    // console.log(classification)
    // console.log(rating_status)
    // console.log('==========================')

    if (rating_status == false) {
      // console.log('Not Rated')
      errorMSGCB("Please Specify if the last prediction is correct");
      errorAlertCB(true);
      set_user_rating_alert_status(true);
    } else {
      set_rating_status(false);
      setCurrentFileName("");
      if (acceptedFiles.length > 1) {
        errorMSGCB("Please only input one email");
        errorAlertCB(true);
      } else if (acceptedFiles[0].type !== "text/plain") {
        errorMSGCB('Please only upload text file | file end with ".txt"');
        errorAlertCB(true);
      } else {
        setCurrentFileName(acceptedFiles[0].name);
        loadingCallback(true);
        parseTxt(acceptedFiles)
          .then((result) => uploadFile(result))
          .then((result) => setClassification(result))
          .catch((error) => console.log(error))
          .finally(() => loadingCallback(false));
      }
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop });

  const ColorButton = styled_mui(Button)(({ theme, active }) => ({
    color: active === "true" ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.5)",
    // backgroundColor: '#fff',
    borderBottomWidth: 10,
    borderBottomColor: "#000",
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 20,
  }));

  const SubmitButton = styled_mui(Button)(({ theme, active }) => ({
    color: theme.palette.getContrastText("#000"),
    backgroundColor: "#000",
    "&:hover": {
      backgroundColor: purple[700],
    },
    borderBottomWidth: 10,
    borderBottomColor: "#000",
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 25,
    margin: 20,
  }));

  const callDecisions = () => {
    fetch(
      "http://10.10.10.207:8080/Primary/restapi/Flow/08da63e3-1812-ba3f-c4ff-b8022004ec63",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic YWRtaW5AZGVjaXNpb25zLmNvbTphZG1pbg==",
        },
        body: JSON.stringify({
          outputtype: "Json",
          ReactAPI: {
            Name: "LM",
            Attachment: {
              Id: "T001",
              FileName: "MEFILE.pdf",
              Contents: "asdasdasdasdasd",
            },
            guest: false,
          },
        }),
      }
    )
      .then((response) => console.log(response))
      .catch(() => alert("error!"));
  };

  return (
    <div>
      <NewCategoryAlert
        open={new_cat_rating_alert_state}
        setOpenCB={(childData) => set_new_cat_rating_alert_state(childData)}
        setOpenCB_RatingSelectCategory={(childData) =>
          set_user_rating_alert_choose_cat_state(childData)
        }
        loadingCB={(childData) => loadingCallback(childData)}
      />
      <SimpleDialogDemo
        open={user_rating_alert_choose_cat_state}
        setOpenCB={(childData) => {
          set_user_rating_alert_choose_cat_state(childData);
        }}
        selectedValue={correct_cat}
        setSelectedValueCB={(childData) => {
          // console.log('========================')
          // console.log(childData)
          // console.log('========================')
          if (childData != null) {
            prediction_false(childData);
          }
        }}
        setNewCategoryCB={(childData) => {
          set_new_cat_rating_alert_state(childData);
        }}
      />
      <RatingAlert
        open={user_rating_alert_state}
        setOpenCB={(childData) => {
          set_user_rating_alert_status(childData);
        }}
        ChooseAnotherCategoryCB={(childData) => {
          set_user_rating_alert_choose_cat_state(childData);
        }}
        Prediction_Correct_CB={() => {
          prediction_correct();
          set_user_rating_alert_status(false);
          set_user_rating_alert_choose_cat_state(false);
        }}
      />

      <CardHeader
        title="Email Classifier"
        titleTypographyProps={{
          component: "h1",
          variant: "h3",
          align: "center",
          color: "white",
          fontWeight: "Bold",
        }}
      />

      <CardContent>
        <ColorButton
          active={(ClfModeToggle === true).toString()}
          onClick={() => {
            errorAlertCB(false);
            setClfMode(true);
          }}
        >
          Upload File
        </ColorButton>

        <ColorButton
          active={(ClfModeToggle === false).toString()}
          onClick={() => {
            errorAlertCB(false);
            setClfMode(false);
          }}
        >
          Type in Content
        </ColorButton>

        {ClfModeToggle === true && (
          <div>
            <DropzoneContainer
              {...getRootProps({ isFocused, isDragAccept, isDragReject })}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className={"classification"}>Drop the files here ...</p>
              ) : (
                <pre className={"classification"}>
                  {classification === ""
                    ? "Drag & drop an email file here, or click to select a file"
                    : `Current file: ${currentFileName} \nDrag & drop an email file here, or click to select a file`}
                </pre>
              )}
            </DropzoneContainer>
          </div>
        )}

        {ClfModeToggle === false && (
          <div>
            <p className="label">Sender's Email</p>
            <TextField
              placeholder={"From: email (Optional)"}
              multiline
              style={{
                width: "95%",
                backgroundColor: "rgba(16, 18, 27, 0.5)",
              }}
              InputProps={{
                style: {
                  color: "#fff",
                  placeholderColor: "#fff",
                },
              }}
              value={senderEmail}
              onChange={handleSenderEmail}
            />
            <p className="label">Recipient's Email</p>
            <TextField
              placeholder={"To: email (Optional)"}
              multiline
              style={{
                width: "95%",
                backgroundColor: "rgba(16, 18, 27, 0.5)",
              }}
              InputProps={{
                style: {
                  color: "#fff",
                  placeholderColor: "#fff",
                },
              }}
              value={recEmail}
              onChange={handleRecEmail}
            />

            <p className="label">Subject</p>
            <TextField
              placeholder={"Email Subject (Optional)"}
              multiline
              style={{
                width: "95%",
                backgroundColor: "rgba(16, 18, 27, 0.5)",
              }}
              InputProps={{
                style: {
                  color: "#fff",
                  placeholderColor: "#fff",
                },
              }}
              value={subject}
              onChange={handleSubject}
            />

            <p className="label">Content</p>
            <TextField
              placeholder={"Email Body (Required)"}
              multiline
              style={{
                width: "95%",
                backgroundColor: "rgba(16, 18, 27, 0.5)",
              }}
              InputProps={{
                style: {
                  color: "#fff",
                  placeholderColor: "#fff",
                  minHeight: 200,
                  alignItems: "flex-start",
                },
              }}
              value={emailContent}
              onChange={handleContent}
            />

            <SubmitButton onClick={callDecisions}>Classify email</SubmitButton>
          </div>
        )}

        {classification !== "" && ClfModeToggle === true && (
          <div className="classification-background">
            <div className={"email-content-border"}>
              <ColorButton
                style={{
                  paddingTop: 15,
                }}
                active={(showParsedStr === false).toString()}
                onClick={() => {
                  errorAlertCB(false);
                  setShowParsedStr(false);
                }}
              >
                Original Text
              </ColorButton>

              <ColorButton
                style={{
                  paddingTop: 15,
                }}
                active={(showParsedStr === true).toString()}
                onClick={() => {
                  errorAlertCB(false);
                  setShowParsedStr(true);
                }}
              >
                Masked Text
              </ColorButton>
              <pre className="email-content">
                {showParsedStr === false ? inputStr : parsedStr}
              </pre>
            </div>
          </div>
        )}

        {classification !== "" && (
          <div className="classification-background">
            <p className="classification">
              {currentPredModeToggle == true
                ? `Classification Result for <${currentFileName}> : ${classification}`
                : `Classification Result for typed in content: ${classification}`}
            </p>
          </div>
        )}

        {classification !== "" && (
          <div>
            <ColorButton
              style={{
                paddingTop: 5,
                color: "rgba(0, 230, 0,0.8)",
                fontWeight: "bold",
              }}
              active={false.toString()}
              onClick={() => {
                prediction_correct();
              }}
            >
              Prediction Correct
            </ColorButton>
            <ColorButton
              style={{
                paddingTop: 5,
                color: "rgba(255, 0, 0,0.8)",
                fontWeight: "bold",
              }}
              active={false.toString()}
              onClick={() => {
                set_user_rating_alert_choose_cat_state(true);
              }}
            >
              Wrong Output
            </ColorButton>
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default Home;
