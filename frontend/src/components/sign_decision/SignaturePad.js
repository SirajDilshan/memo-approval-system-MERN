import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useAuth } from "../../context/AuthContext";

const SignaturePad = () => {
  const sigCanvas = useRef(null);
  const [isSigned, setIsSigned] = useState(false);
  const { signatureDataURL, setSignatureDataURL } = useAuth();

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
    setIsSigned(false);
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
    <div className="p-4 bg-white rounded shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-center">Sign Below</h2>

      {!signatureDataURL && (
        <>
          <div className="border border-gray-300 rounded">
            <SignatureCanvas
              penColor="black"
              canvasProps={{
                width: 400,
                height: 200,
                className: "bg-white rounded",
              }}
              ref={sigCanvas}
              onEnd={() => setIsSigned(true)}
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={clearSignature}
              className="bg-gray-200 text-sm px-4 py-1 rounded hover:bg-gray-300"
            >
              Clear
            </button>
            <button
              onClick={saveSignature}
              className="bg-blue-600 text-white text-sm px-4 py-1 rounded hover:bg-blue-700"
            >
              Save Signature
            </button>
          </div>
        </>
      )}

      {signatureDataURL && (
        <div className="text-center mt-4">
          <p className="mb-2 text-green-600 font-medium">Signature Saved:</p>
          <img
            src={signatureDataURL}
            alt="Saved Signature"
            className="mx-auto border border-gray-400 rounded"
          />
          <button
            onClick={clearSignature}
            className="mt-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Sign Again
          </button>
        </div>
      )}
    </div>
  );
};

export default SignaturePad;
