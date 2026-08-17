import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useDashboard } from "../../hooks/useDashboard";
import { useProgress } from "../../hooks/useProgress";

function Reports() {
  const { stats, loading: statsLoading, error: statsError } = useDashboard();
  const { progressList, loading: progressLoading, error: progressError } = useProgress();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Rapports et synthèses
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Une vue claire et professionnelle des indicateurs clés du centre.
        </Typography>
      </Box>

      {(statsError || progressError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {statsError || progressError}
        </Alert>
      )}

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0", minHeight: 220 }}>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5, mb: 2 }}>
            <AssessmentIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Synthèse rapide
            </Typography>
          </Box>
          {statsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: "grid", gap: 1.5 }}>
              <Typography>
                Étudiants enregistrés: <strong>{stats?.studentsCount ?? 0}</strong>
              </Typography>
              <Typography>
                Sessions Darasa totales: <strong>{stats?.sessionsCount ?? 0}</strong>
              </Typography>
              <Typography>
                Progrès suivis: <strong>{stats?.progressCount ?? 0}</strong>
              </Typography>
              <Typography>
                Enseignants actifs: <strong>{stats?.teachersCount ?? 0}</strong>
              </Typography>
            </Box>
          )}
        </Paper>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0", minHeight: 220 }}>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Chip label="Suivi actif" color="success" size="small" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Derniers suivis de progression
            </Typography>
          </Box>
          {progressLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Apprenant</TableCell>
                  <TableCell>Sourate</TableCell>
                  <TableCell>Sessions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {progressList.slice(0, 5).map((item: any) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.student_name || "—"}</TableCell>
                    <TableCell>{item.surah_name || "—"}</TableCell>
                    <TableCell>{item.total_sessions ?? 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default Reports;
