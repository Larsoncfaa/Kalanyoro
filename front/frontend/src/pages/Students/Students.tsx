import { useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Pagination,
  Alert,
  IconButton,
  Chip,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import { useStudents } from "../../hooks/useStudents";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import type { Student } from "../../api/students.api";

const initialForm = {
  full_name: "",
  phone: "",
  address: "",
  birth_date: "",
};

function Students() {
  const { user } = useCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  const {
    students,
    loading,
    error,
    page,
    setPage,
    pageSize,
    total,
    search,
    setSearch,
    addStudent,
    editStudent,
    removeStudent,
  } = useStudents();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formValues, setFormValues] = useState(initialForm);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const openNewStudentDialog = () => {
    setFormValues(initialForm);
    setSelectedStudentId(null);
    setIsEditMode(false);
    setFormError(null);
    setDialogOpen(true);
  };

  const openEditStudentDialog = (student: Student) => {
    setFormValues({
      full_name: student.full_name,
      phone: student.phone || "",
      address: student.address || "",
      birth_date: student.birth_date || "",
    });
    setSelectedStudentId(student.id);
    setIsEditMode(true);
    setFormError(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setFormError(null);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!formValues.full_name) {
      setFormError("Nom complet sont requis.");
      return;
    }

    const payload = {
      full_name: formValues.full_name,
      phone: formValues.phone,
      address: formValues.address,
      birth_date: formValues.birth_date || null,
    };

    try {
      if (isEditMode && selectedStudentId !== null) {
        await editStudent(selectedStudentId, payload);
      } else {
        await addStudent(payload);
      }
      closeDialog();
    } catch (err: any) {
      setFormError(err?.message || "Impossible de sauvegarder l'étudiant.");
    }
  };

  const handleDelete = useCallback(async (id: number) => {
    const confirmed = window.confirm("Supprimer cet étudiant ? Cette action est irréversible.");
    if (!confirmed) return;
    try {
      await removeStudent(id);
    } catch {
      // erreur gérée par le hook
    }
  }, [removeStudent]);

  const tableRows = useMemo(
    () =>
      students.map((s) => (
        <TableRow key={s.id} hover>
          <TableCell>{s.matricule}</TableCell>
          <TableCell>{s.full_name}</TableCell>
          <TableCell>{s.phone || "—"}</TableCell>
          <TableCell>{s.age ?? "—"}</TableCell>
          {isAdmin && (
            <TableCell>
              <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                <IconButton size="small" onClick={() => openEditStudentDialog(s)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(s.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </TableCell>
          )}
        </TableRow>
      )),
    [students, isAdmin, handleDelete]
  );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Gestion des étudiants
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Consulter, créer et suivre les apprenants du centre.
          </Typography>
        </Box>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openNewStudentDialog} sx={{ borderRadius: 999, px: 3 }}>
            Nouvel étudiant
          </Button>
        )}
      </Box>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0", background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            placeholder="Rechercher un étudiant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: { xs: "100%", sm: 320 } }}
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
          <Chip icon={<PersonIcon />} label={`${students.length} apprenants`} color="success" variant="outlined" />
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
                    <TableCell>Matricule</TableCell>
                    <TableCell>Nom complet</TableCell>
                    <TableCell>Téléphone</TableCell>
                    <TableCell>Âge</TableCell>
                    {isAdmin && <TableCell>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>{tableRows}</TableBody>
              </Table>
            </Box>

            {total !== null && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={Math.max(1, Math.ceil((total ?? 0) / pageSize))}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{isEditMode ? "Modifier l'étudiant" : "Créer un nouvel étudiant"}</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField
            label="Nom complet"
            value={formValues.full_name}
            onChange={(e) => handleFieldChange("full_name", e.target.value)}
            fullWidth
          />
          <TextField
            label="Téléphone"
            value={formValues.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            fullWidth
          />
          <TextField
            label="Adresse"
            value={formValues.address}
            onChange={(e) => handleFieldChange("address", e.target.value)}
            fullWidth
          />
          <TextField
            
            type="date"
            value={formValues.birth_date}
            onChange={(e) => handleFieldChange("birth_date", e.target.value)}
            fullWidth
            
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Annuler</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {isEditMode ? "Mettre à jour" : "Créer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Students;