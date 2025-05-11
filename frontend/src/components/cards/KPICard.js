import React from "react";
import { Card, CardContent, Typography} from "@mui/material";

const KPICard = ({ title, value, icon }) => (
  <Card
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1.25rem",
      boxShadow: 3,
      borderRadius: "16px",
      backgroundColor: "white",
      minHeight: "120px",
    }}
  >
    <CardContent sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "text.primary" }}>
        {value}
      </Typography>
    </CardContent>
    <div
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "primary.main",
        fontSize: "2rem",
      }}
    >
      {icon}
    </div>
  </Card>
);

export default KPICard;
