import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
} from "@mui/material";

const SignaturePad = () => {
  const sigCanvas = useRef(null);
  const { signatureDataURL, setSignatureDataURL } = useAuth();

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
    setSignatureDataURL(null);
  };

  const saveSignature = () => {
    if (sigCanvas.current.isEmpty()) {
      alert("Please provide a signature first.");
      return;
    }
    const dataURL = sigCanvas.current.toDataURL("image/png");
    setSignatureDataURL(dataURL);
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        p: 3,
        width: "100%",
        maxWidth: 500,
        mx: "auto",
        mt: 2,
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>
        Sign Below
      </Typography>

      {!signatureDataURL && (
        <>
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              overflow: "hidden",
              mb: 2,
            }}
          >
            <SignatureCanvas
              penColor="black"
              canvasProps={{
                width: 400,
                height: 200,
                className: "sigCanvas",
              }}
              ref={sigCanvas}
            />
          </Box>

          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={clearSignature}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={saveSignature}
            >
              Save Signature
            </Button>
          </Stack>
        </>
      )}

      {signatureDataURL && (
        <Box textAlign="center" mt={2}>
          <Typography color="success.main" gutterBottom>
            Signature Saved:
          </Typography>
          <Box
            component="img"
            src={signatureDataURL}
            alt="Saved Signature"
            sx={{
              border: "1px solid #aaa",
              borderRadius: 1,
              maxWidth: "100%",
            }}
          />
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
            onClick={clearSignature}
          >
            Sign Again
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SignaturePad;
