import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Pagination,
  Alert,
  Chip,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useProgress } from "../../hooks/useProgress";

function Progress() {
  const { progressList, loading, error, page, setPage, pageSize, total, search, setSearch } = useProgress();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Suivi de progression
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Visualiser l’avancement réel des élèves à travers les niveaux et les compétences.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0", background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            placeholder="Rechercher par apprenant ou sourate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: { xs: "100%", sm: 360 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Chip icon={<TrendingUpIcon />} label="Progression continue" color="secondary" variant="outlined" />
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Apprenant</TableCell>
                    <TableCell>Sourate</TableCell>
                    <TableCell>Verset actuel</TableCell>
                    <TableCell>Séances</TableCell>
                    <TableCell>Date mise à jour</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {progressList.map((item: any) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{item.student_name || "—"}</TableCell>
                      <TableCell>{item.surah_name || "—"}</TableCell>
                      <TableCell>{item.current_verse ?? "—"}</TableCell>
                      <TableCell>{item.total_sessions ?? 0}</TableCell>
                      <TableCell>{item.updated_at ? new Date(item.updated_at).toLocaleDateString() : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {total !== null && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination count={Math.max(1, Math.ceil((total ?? 0) / pageSize))} page={page} onChange={(_, p) => setPage(p)} />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}

export default Progress;
