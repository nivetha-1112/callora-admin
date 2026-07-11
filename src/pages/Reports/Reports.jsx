import React, { useState, useMemo } from "react";
import {
  Box, Card, CardContent, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Avatar, Button,
  TextField, Autocomplete, Chip, Divider, Paper, Grid
} from "@mui/material";

import PageHeader from "../../components/PageHeader/PageHeader";
import StatusChip from "../../components/StatusChip/StatusChip";
import { managers } from "../../data/managerData";
import { telecallers, telecallerClients, callHistory } from "../../data/telecallerData";
import { getInitials, formatDate } from "../../utils/helpers";
import { useToast } from "../../context/ToastContext";

const statusConfig = {
  "Converted":          { color: "#16a34a", bg: "#f0fdf4", icon: "bi-check-circle-fill" },
  "Not Interested":     { color: "#ef4444", bg: "#fee2e2", icon: "bi-x-circle-fill" },
  "Follow Up":          { color: "#f59e0b", bg: "#fffbeb", icon: "bi-arrow-clockwise" },
  "Interested":         { color: "#0343a8", bg: "#eaf4ff", icon: "bi-star-fill" },
  "Ringing":            { color: "#64748b", bg: "#f1f5f9", icon: "bi-telephone-fill" },
  "Callback Requested": { color: "#9333ea", bg: "#faf5ff", icon: "bi-telephone-inbound-fill" },
};

function formatDateTime(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

export default function Reports() {
  const { showToast } = useToast();

  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [selectedUserId, setSelectedUserId]       = useState("");
  const [selectedDate, setSelectedDate]           = useState("");
  const [activeView, setActiveView]               = useState("list"); // "list" or "detail"
  const [selectedRow, setSelectedRow]             = useState(null);

  const filteredTelecallers = useMemo(() => {
    if (!selectedManagerId) return telecallers;
    return telecallers.filter((tc) => tc.managerId === selectedManagerId);
  }, [selectedManagerId]);

  const allRows = useMemo(() => {
    const rows = [];
    const tcList = selectedUserId
      ? filteredTelecallers.filter((tc) => tc.id === selectedUserId)
      : filteredTelecallers;
    tcList.forEach((tc) => {
      telecallerClients.forEach((client) => {
        rows.push({ telecaller: tc, client });
      });
    });
    return rows;
  }, [filteredTelecallers, selectedUserId]);

  const tableRows = useMemo(() => {
    return allRows.filter((row) => {
      if (!selectedDate) return true;
      return row.client.lastContact === selectedDate;
    });
  }, [allRows, selectedDate]);

  const clientHistory = useMemo(() => {
    if (!selectedRow) return [];
    
    const existing = callHistory.filter((h) => h.client === selectedRow.client.clientName);
    
    if (existing.length > 0) {
      const baseTime = new Date(existing[0].time || "2026-06-25T10:00:00");
      return [
        {
          id: "step-1",
          status: "Not Interested",
          time: new Date(baseTime.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          duration: "1m 45s",
          notes: "Initial call: Client mentioned they are not interested currently due to other priorities.",
        },
        {
          id: "step-2",
          status: "Follow Up",
          time: new Date(baseTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          duration: "3m 15s",
          notes: "Follow up call: Shared details. Client requested product pricing and references.",
        },
        {
          id: "step-3",
          status: existing[0].status,
          time: existing[0].time,
          duration: existing[0].duration,
          notes: existing[0].notes,
        }
      ];
    }

    return [
      { id: "def-1", status: "Not Interested", time: "2026-06-24T11:00:00", duration: "1m 20s", notes: "No initial interest shown." },
      { id: "def-2", status: "Follow Up", time: "2026-06-25T14:30:00", duration: "4m 10s", notes: "Follow up call. Sent portfolio." },
      { id: "def-3", status: "Converted", time: "2026-06-26T10:00:00", duration: "6m 15s", notes: "Deal closed and successfully converted." }
    ];
  }, [selectedRow]);

  const handleViewClick = (row) => {
    setSelectedRow(row);
    setActiveView("detail");
  };

  const getRoleDisplay = () => {
    if (selectedUserId) return "Telecaller";
    if (selectedManagerId) return "Manager";
    return "Telecaller";
  };

  const clearFilters = () => {
    setSelectedManagerId("");
    setSelectedUserId("");
    setSelectedDate("");
  };

  const hasFilters = selectedManagerId || selectedUserId || selectedDate;

  if (activeView === "detail" && selectedRow) {
    const clientEmail = `${selectedRow.client.clientName.toLowerCase().replace(/\s+/g, ".")}@example.com`;
    return (
      <Box sx={{ overflow: "hidden", width: "100%" }}>
        {/* Back Button aligned to right and styled blue */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Button
            variant="contained"
            onClick={() => setActiveView("list")}
            sx={{
              background: "linear-gradient(135deg, #0343a8, #0454cc)",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
            }}
          >
            Back to Reports
          </Button>
        </Box>

        {/* Two-panel flex layout: no gaps */}
        <Box sx={{ display: "flex", gap: 3, alignItems: "stretch" }}>
          {/* Left panel: Client Info card */}
          <Box sx={{ width: "32%", flexShrink: 0 }}>
            <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textContent: "center", mb: 3 }}>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: "#0343a8", fontSize: "1.5rem", mb: 2 }}>
                    {getInitials(selectedRow.client.clientName)}
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {selectedRow.client.clientName}
                  </Typography>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 0.5 }}>
                    {selectedRow.client.phone}
                  </Typography>
                  {/* Added Client Email */}
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 2, fontStyle: "italic" }}>
                    {clientEmail}
                  </Typography>
                  <StatusChip status={selectedRow.client.callStatus} />
                </Box>

                <Divider sx={{ my: 2.5 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, px: 1 }}>
                  {/* Assigned Telecaller */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#eaf4ff", color: "#0343a8", border: "1px solid #d6e9ff" }}>
                      <i className="bi bi-headset" style={{ fontSize: "0.85rem" }}></i>
                    </Avatar>
                    <Box sx={{ userSelect: "text" }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.75rem", display: "block", color: "#000000" }}>
                        Assigned Telecaller
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#475569", mt: 0.25 }}>
                        {selectedRow.telecaller.name}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Manager Name */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" }}>
                      <i className="bi bi-person-badge" style={{ fontSize: "0.85rem" }}></i>
                    </Avatar>
                    <Box sx={{ userSelect: "text" }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.75rem", display: "block", color: "#000000" }}>
                        Manager Name
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#475569", mt: 0.25 }}>
                        {selectedRow.telecaller.managerName || "—"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Last Contact Date */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" }}>
                      <i className="bi bi-calendar3" style={{ fontSize: "0.85rem" }}></i>
                    </Avatar>
                    <Box sx={{ userSelect: "text" }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.75rem", display: "block", color: "#000000" }}>
                        Last Contact Date
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#475569", mt: 0.25 }}>
                        {formatDate(selectedRow.client.lastContact)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Total Call Duration */}
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1.5, 
                    p: 1.2, 
                    borderRadius: 2, 
                    backgroundColor: "#fffbeb", 
                    border: "1px solid #fef3c7" 
                  }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#fef3c7", color: "#d97706" }}>
                      <i className="bi bi-stopwatch" style={{ fontSize: "0.85rem" }}></i>
                    </Avatar>
                    <Box sx={{ userSelect: "text" }}>
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: "0.75rem", 
                          display: "block",
                          color: "#b45309",
                        }}
                      >
                        Total Call Duration
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: "#78350f" }}>
                        {selectedRow.client.callDuration}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Right panel: Chain style Call History timeline */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>
                  <i className="bi bi-clock-history" style={{ marginRight: 10, color: "#0343a8" }}></i>
                  Client Call Journey (Chain View)
                </Typography>

                <Box sx={{ position: "relative", pl: 4, ml: 1.5, borderLeft: "2px dashed #cbd5e1" }}>
                  {clientHistory.map((h, i) => {
                    const cfg = statusConfig[h.status] || { color: "#64748b", bg: "#f1f5f9", icon: "bi-circle-fill" };
                    return (
                      <Box key={h.id} sx={{ mb: i === clientHistory.length - 1 ? 0 : 4, position: "relative" }}>
                        <Box
                          sx={{
                            position: "absolute",
                            left: -48,
                            top: 4,
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            backgroundColor: "#ffffff",
                            border: `3px solid ${cfg.color}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                          }}
                        >
                          <i className={`bi ${cfg.icon}`} style={{ fontSize: "0.75rem", color: cfg.color }}></i>
                        </Box>

                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            backgroundColor: "#f8fafc",
                            borderColor: "#e2e8f0",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                          }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, flexWrap: "wrap", gap: 1 }}>
                            <Chip
                              label={h.status}
                              size="small"
                              sx={{ backgroundColor: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: "0.75rem" }}
                            />
                            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", fontWeight: 500 }}>
                              {formatDateTime(h.time)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.6, fontWeight: 500 }}>
                            {h.notes}
                          </Typography>
                          <Divider sx={{ my: 1.5, borderColor: "#e2e8f0" }} />
                          <Typography variant="caption" color="text.secondary">
                            Call Duration: <b>{h.duration}</b>
                          </Typography>
                        </Paper>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Reports"
        subtitle="View and export detailed performance reports by manager and user"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Reports" }]}
        actions={
          <Button
            variant="contained"
            startIcon={<i className="bi bi-download"></i>}
            onClick={() => showToast("Report exported successfully!", "success")}
            sx={{
              background: "linear-gradient(135deg, #0343a8, #0454cc)",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
            }}
          >
            Export
          </Button>
        }
      />

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
          <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap", alignItems: "center" }}>
            <Autocomplete
              size="small"
              options={managers}
              getOptionLabel={(o) => `${o.name} (${o.role})`}
              value={managers.find((m) => m.id === selectedManagerId) || null}
              onChange={(_, val) => {
                setSelectedManagerId(val ? val.id : "");
                setSelectedUserId("");
              }}
              renderInput={(params) => <TextField {...params} label="Select Manager" />}
              sx={{ minWidth: 240, flex: 1 }}
            />
            <Autocomplete
              size="small"
              options={filteredTelecallers}
              getOptionLabel={(o) => `${o.name} (${o.id})`}
              value={filteredTelecallers.find((tc) => tc.id === selectedUserId) || null}
              onChange={(_, val) => setSelectedUserId(val ? val.id : "")}
              renderInput={(params) => <TextField {...params} label="Select User" />}
              sx={{ minWidth: 240, flex: 1 }}
            />
            <TextField
              type="date"
              label="Select Date"
              size="small"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ minWidth: 170 }}
            />
            {hasFilters && (
              <Button
                variant="outlined"
                size="small"
                onClick={clearFilters}
                sx={{
                  borderColor: "#cbd5e1",
                  color: "#64748b",
                  textTransform: "none",
                  height: 40,
                  borderRadius: "6px",
                  "&:hover": { borderColor: "#94a3b8", backgroundColor: "#f1f5f9" },
                }}
              >
                Clear Filter
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>Emp ID</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Name</TableCell>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>Role</TableCell>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>Date</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Client Name</TableCell>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>Current Status</TableCell>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.length > 0 ? (
                tableRows.map((row, idx) => (
                  <TableRow key={`${row.telecaller.id}-${row.client.id}-${idx}`} hover>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "#0343a8" }}>
                        {row.telecaller.id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 34, height: 34, fontSize: "0.75rem", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" }}>
                          {getInitials(row.telecaller.name)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>{row.telecaller.name}</Typography>
                          <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>{row.telecaller.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      <Chip label={getRoleDisplay()} size="small" sx={{ backgroundColor: "#f1f5f9", color: "#475569", fontWeight: 500 }} />
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      <Typography variant="body2">{formatDate(row.client.lastContact)}</Typography>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>{row.client.clientName}</Typography>
                      <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>{row.client.phone}</Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      <StatusChip status={row.client.callStatus} />
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<i className="bi bi-eye"></i>}
                        onClick={() => handleViewClick(row)}
                        sx={{
                          borderColor: "#0343a8",
                          color: "#0343a8",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          borderRadius: "6px",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#eaf4ff", borderColor: "#0343a8" },
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <i className="bi bi-inbox" style={{ fontSize: "3rem", color: "#cbd5e1" }}></i>
                    <Typography color="text.secondary" sx={{ mt: 1.5, fontWeight: 500 }}>
                      No records found. Adjust the filters above.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
