import { useEffect, useState } from "react";
import * as React from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RobotIcon from "./RobotIcon";
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import
{
  TextField,
  Box,
  FormControl,
  Paper,
} from "@mui/material";
import "./App.css";

const Endpoints = {
  LAMBDA: "https://olq5lzy0cl.execute-api.us-east-1.amazonaws.com/example-stage-05b1333/",
  SAGEMAKER: "https://jw16y0bdbl.execute-api.us-east-1.amazonaws.com/example-stage-ee6a3d4/",
};

const BtnState = {
  DISABLED: 0,
  ENABLED: 1,
  LOADING: 2,
};

const FnState = {
  READY: 0,
  RUNNING: 1,
  SUCCESS: 2,
  ERROR: 3,
};

function App ()
{
  const [btnState, setBtnState] = useState(BtnState.ENABLED);
  const [fnState, setFnState] = useState(FnState.DEFAULT);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("info");

  useEffect(() => { }, []);

  const updateBtnState = (value) =>
  {
    if (value.length > 0)
    {
      setBtnState(BtnState.ENABLED);
    } else
    {
      setBtnState(BtnState.DISABLED);
    }
  };

  const runTrigger = async () =>
  {
    setBtnState(BtnState.LOADING);
    setFnState(FnState.RUNNING);
    const userQuery = document.getElementById("query").value;

    try
    {
      const response = await fetch(Endpoints.LAMBDA, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userQuery,
        }),
      });
      if (response.ok)
      {
        const data = await response.json(); // Read and parse the response body as JSON
        setFnState(FnState.SUCCESS);
        setBtnState(BtnState.ENABLED);
        console.log(data);
        setAlertMsg("Run has been cloned successfully");
        setAlertType("success");
      } else
      {
        const errorMessage = await response.text(); // Parse error message if available
        setFnState(FnState.ERROR);
        setBtnState(BtnState.ENABLED);
        console.log(response);
        setAlertMsg(errorMessage);
        setAlertType("error");
      }
    } catch (error)
    {
      setFnState(FnState.ERROR);
      setBtnState(BtnState.ENABLED);
      setAlertMsg(error.message);
      setAlertType("error");
    }



    // setBtnState(BtnState.DISABLED);
  };

  return (
    <Box sx={{ minWidth: '100%' }}>

      <Grid container sx={{ minWidth: '100%' }} rowSpacing={1} columnSpacing={1}>
        <Grid size={12}>
          <span style={{ fontWeight: 'bold' }}>PunPilot</span> keeps you on course with a pun at every turn!
        </Grid>
        <Grid size={12}>
          <img
            src="https://d1.awsstatic.com/logos/aws-logo-lockups/poweredbyaws/PB_AWS_logo_RGB.61d334f1a1a427ea597afa54be359ca5a5aaad5f.png"
            alt="powered by AWS"
            style={{ width: '120px', height: 'auto' }}
          />
        </Grid>
        <Grid size={3}>
          <Paper sx={{ padding: 2, minHeight: '240px' }}>
            <Stack direction="row" spacing={1}>
              <RobotIcon />
              <Typography variant="overline">ChatGPT</Typography>
            </Stack>
            <Divider />
            <Typography sx={{ paddingTop: 2, textAlign: 'left' }}>
              Paris is the capital of France—it's always Eiffel-ing into place!
            </Typography>
          </Paper>
        </Grid>
        <Grid size={3}>
          <Paper sx={{ padding: 2, minHeight: '240px' }}>
            <Stack direction="row" spacing={1}>
              <RobotIcon />
              <Typography variant="overline">Gemini</Typography>
            </Stack>
            <Divider />
            <Typography sx={{ paddingTop: 2, textAlign: 'left' }}>
              It's Paris, where the 'arc' of knowledge meets the 'triomphe' of geography!
            </Typography>
          </Paper>
        </Grid>
        <Grid size={3}>
          <Paper sx={{ padding: 2, minHeight: '240px' }}>
            <Stack direction="row" spacing={1}>
              <RobotIcon />
              <Typography variant="overline">Llama on <span style={{ fontWeight: 'bold' }}>Bedrock</span></Typography>
            </Stack>
            <Divider />
            <Typography sx={{ paddingTop: 2, textAlign: 'left' }}>
              The answer’s Paris, because it’s the city of light—and I’m just bright like that!
            </Typography>
          </Paper>
        </Grid>
        <Grid size={3}>
          <Paper sx={{ padding: 2, minHeight: '240px' }}>
            <Stack direction="row" spacing={1}>
              <RobotIcon />
              <Typography variant="overline">FT Llama on <span style={{ fontWeight: 'bold' }}>SageMaker</span></Typography>
            </Stack>
            <Divider />
            <Typography sx={{ paddingTop: 2, textAlign: 'left' }}>
              Paris, of course—I've got the answer on lock like the Seine’s bridges!
            </Typography>
          </Paper>
        </Grid>
        <Grid size={12}>
          <FormControl sx={{ m: 1, minWidth: '100%' }}>
            <Stack sx={{ minWidth: '100%' }} direction="row" spacing={1}>
              <TextField sx={{ flexGrow: 1 }}
                id="query"
                label="Ask a question"
                onChange={(event) =>
                {
                  updateBtnState(event.target.value);
                }}
                placeholder="What is the capital of France?"
                defaultValue="What is the capital of France?"
                focused={true}
                name="query"
                variant="standard"
              />
              <LoadingButton
                onClick={runTrigger}
                startIcon={<SendIcon />}
                variant="contained"
                loading={btnState === BtnState.LOADING}
                disabled={btnState === BtnState.DISABLED}
              >
                Send
              </LoadingButton>
            </Stack>
            {fnState > FnState.RUNNING &&
              <Alert severity={alertType}>
                {alertMsg}
              </Alert>
            }
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;