import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box, Typography, Chip, Button, Avatar, Divider, Card, CardContent
} from "@mui/material";
import PageHeader from "../../components/PageHeader/PageHeader";
import StatusChip from "../../components/StatusChip/StatusChip";
import { callHistory } from "../../data/telecallerData";
import { getInitials, formatDate } from "../../utils/helpers";

const statusConfig = {
  "Converted":          { color: "#16a34a", bg: "#dcfce7", border: "#86efac", icon: "bi-check-circle-fill" },
  "Not Interested":     { color: "#dc2626", bg: "#fee2e2", border: "#fca5a5", icon: "bi-x-circle-fill" },
  "Follow Up":          { color: "#d97706", bg: "#fef3c7", border: "#fcd34d", icon: "bi-arrow-repeat" },
  "Interested":         { color: "#0343a8", bg: "#dbeafe", border: "#93c5fd", icon: "bi-star-fill" },
  "Ringing":            { color: "#475569", bg: "#f1f5f9", border: "#cbd5e1", icon: "bi-telephone-fill" },
  "Callback Requested": { color: "#7c3aed", bg: "#ede9fe", border: "#c4b5fd", icon: "bi-telephone-inbound-fill" },
};

function formatDateTime(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  const datePart = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const timePart = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  return { date: datePart, time: timePart };
}

export default function ClientHistory() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  if (!state || !state.client) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">No client data found.</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
      </Box>
    );
  }

  const { client, telecaller } = state;
  const history = callHistory.filter((h) => h.client === client.clientName);

  return (
    <Box>
      <PageHeader
        title="Client History"
        subtitle={`Call history and activity log for ${client.clientName}`}
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Reports", path: "/reports" },
          { label: client.clientName },
        ]}
        actions={
          <Button
            variant="outlined"
            startIcon={<i className="bi bi-arrow-left"></i>}
            onClick={() => navigate(-1)}
            sx={{
              borderColor: "#cbd5e1",
              color: "#64748b",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              "&:hover": { borderColor: "#94a3b8", backgroundColor: "#f1f5f9" },
            }}
          >
            Back to Reports
          </Button>
        }
      />

      {/* Client Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, flexWrap: "wrap" }}>
            <Avatar
              sx={{
                width: 56, height: 56, fontSize: "1.2rem",
                background: "linear-gradient(135deg, #0343a8, #0454cc)",
                color: "#fff", fontWeight: 700,
              }}
            >
              {getInitials(client.clientName)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#111827" }}>
                {client.clientName}
              </Typography>
              <Typography sx={{ fontSize: "0.875rem", color: "#64748b", mt: 0.25 }}>
                <i className="bi bi-telephone" style={{ marginRight: 6 }}></i>
                {client.phone}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {[
                { label: "Telecaller", value: telecaller?.name || "—", icon: "bi-person-badge" },
                { label: "Last Contact", value: formatDate(client.lastContact), icon: "bi-calendar3" },
                { label: "Call Duration", value: client.callDuration, icon: "bi-clock" },
              ].map((item) => (
                <Box key={item.label} sx={{ textAlign: "center", minWidth: 100 }}>
                  <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#1e293b", mt: 0.25 }}>
                    <i className={`bi ${item.icon}`} style={{ marginRight: 5, color: "#0343a8" }}></i>
                    {item.value}
                  </Typography>
                </Box>
              ))}
              <Box sx={{ textAlign: "center", minWidth: 100 }}>
                <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Current Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <StatusChip status={client.callStatus} />
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
            <i className="bi bi-clock-history" style={{ color: "#0343a8" }}></i>
            Call History Timeline
            <Chip label={`${history.length} records`} size="small" sx={{ ml: 1, backgroundColor: "#eaf4ff", color: "#0343a8", fontWeight: 700 }} />
          </Typography>

          {history.length > 0 ? (
            <Box sx={{ position: "relative" }}>
              {history.map((h, i) => {
                const cfg = statusConfig[h.status] || { color: "#64748b", bg: "#f1f5f9", border: "#cbd5e1", icon: "bi-circle-fill" };
                const isLast = i === history.length - 1;
                const dt = formatDateTime(h.time);

                return (
                  <Box key={h.id} sx={{ display: "flex", gap: 0, mb: isLast ? 0 : 0 }}>
                    {/* Left: date column */}
                    <Box sx={{ width: 130, flexShrink: 0, textAlign: "right", pr: 2.5, pt: 0.75 }}>
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151" }}>
                        {dt.date}
                      </Typography>
                      <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8", mt: 0.25 }}>
                        {dt.time}
                      </Typography>
                    </Box>

                    {/* Center: line + dot */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 48 }}>
                      <Box sx={{
                        width: 40, height: 40, borderRadius: "50%",
                        backgroundColor: cfg.bg,
                        border: `2.5px solid ${cfg.color}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 0 0 4px ${cfg.bg}`,
                        zIndex: 1,
                        flexShrink: 0,
                      }}>
                        <i className={`bi ${cfg.icon}`} style={{ fontSize: "1rem", color: cfg.color }}></i>
                      </Box>
                      {!isLast && (
                        <Box sx={{
                          width: 2,
                          flex: 1,
                          minHeight: 40,
                          background: `linear-gradient(to bottom, ${cfg.color}44, #e2e8f0)`,
                          my: 0.5,
                        }} />
                      )}
                    </Box>

                    {/* Right: content */}
                    <Box sx={{ flex: 1, pl: 2, pb: isLast ? 0 : 3.5 }}>
                      <Box sx={{
                        p: 2, borderRadius: 2.5,
                        backgroundColor: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                        position: "relative",
                      }}>
                        {/* Bubble arrow */}
                        <Box sx={{
                          position: "absolute",
                          left: -7, top: 14,
                          width: 12, height: 12,
                          backgroundColor: cfg.bg,
                          border: `1px solid ${cfg.border}`,
                          borderRight: "none",
                          borderTop: "none",
                          transform: "rotate(45deg)",
                        }} />

                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, flexWrap: "wrap", gap: 1 }}>
                          <Chip
                            label={h.status}
                            size="small"
                            sx={{ backgroundColor: "white", color: cfg.color, fontWeight: 800, fontSize: "0.78rem", border: `1.5px solid ${cfg.color}` }}
                          />
                          <Typography sx={{ fontSize: "0.75rem", color: cfg.color, fontWeight: 600 }}>
                            <i className="bi bi-clock" style={{ marginRight: 4 }}></i>
                            Duration: {h.duration}
                          </Typography>
                        </Box>

                        <Typography sx={{ fontSize: "0.875rem", color: "#1e293b", lineHeight: 1.6 }}>
                          {h.notes}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <i className="bi bi-journal-x" style={{ fontSize: "3rem", color: "#cbd5e1" }}></i>
              <Typography color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
                No call history found for this client.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
