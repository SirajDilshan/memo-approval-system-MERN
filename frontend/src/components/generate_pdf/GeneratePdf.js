import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@mui/material";

const GeneratePdf = () => {
  const { memos, viewId } = useAuth();
  const selectedMemo = memos?.find((memo) => memo._id === viewId);

  const handleGeneratePDF = () => {
  if (!selectedMemo) {
    alert("No memo selected.");
    return;
  }

  const doc = new jsPDF();
  let y = 20;

  // Header
  doc.setFontSize(16);
  doc.text("Memo Report", 14, y);
  y += 10;

  // General Information
  doc.setFontSize(12);
  const fields = [
    ["Memo ID", selectedMemo.memo_id],
    ["Title", selectedMemo.title],
    ["Status", selectedMemo.status],
    ["Created By", `${selectedMemo.createdBy?.email} (${selectedMemo.createdBy?.role})`],
    ["Created At", new Date(selectedMemo.createdAt).toLocaleString()],
    ["Updated At", new Date(selectedMemo.updatedAt).toLocaleString()],
    ["Faculty Decision", selectedMemo.facultyBoardDecision || "Pending"],
    ["Campus Decision", selectedMemo.campusBoardDecision || "Pending"],
  ];

  fields.forEach(([label, value]) => {
    doc.setFont(undefined, "bold");
    doc.text(`${label}:`, 14, y);
    doc.setFont(undefined, "normal");
    doc.text(`${value}`, 60, y);
    y += 8;
  });

  // Content Section
  y += 5;
  doc.setFont(undefined, "bold");
  doc.text("Content:", 14, y);
  y += 7;
  doc.setFont(undefined, "normal");

  const splitContent = doc.splitTextToSize(selectedMemo.content || "", 180);
  doc.text(splitContent, 14, y);
  y += splitContent.length * 6;

  // Approval History
  if (selectedMemo.approvals && selectedMemo.approvals.length > 0) {
    y += 10;
    doc.setFont(undefined, "bold");
    doc.text("Approval History:", 14, y);
    y += 8;

    selectedMemo.approvals.forEach((approval, index) => {
      doc.setFont(undefined, "bold");
      doc.text(`Role:`, 14, y);
      doc.setFont(undefined, "normal");
      doc.text(`${approval.role}`, 40, y);
      y += 6;

      doc.setFont(undefined, "bold");
      doc.text(`Date:`, 14, y);
      doc.setFont(undefined, "normal");
      doc.text(new Date(approval.timestamp).toLocaleString(), 40, y);
      y += 6;

      if (approval.digitalSignature) {
        // Add image if it exists
        try {
          doc.setFont(undefined, "bold");
          doc.text(`Signature:`, 14, y);
          y += 2;
          doc.addImage(approval.digitalSignature, "PNG", 14, y, 50, 20);
          y += 25;
        } catch (error) {
          doc.text("Error loading signature image.", 14, y);
          y += 8;
        }
      } else {
        y += 5;
      }

      // Prevent overlap on next page
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
  }

  doc.save(`memo-${selectedMemo.memo_id}.pdf`);
};


  return (
    <Button variant="outlined" onClick={handleGeneratePDF}>
      Download Memo PDF
    </Button>
  );
};

export default GeneratePdf;
