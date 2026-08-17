import { useCallback, useMemo, useState } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Pagination,
  Alert,
  IconButton,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTeachers } from "../../hooks/useTeachers";

const initialForm = {
  username: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
  role: "TEACHER",
  is_active: true,
};

function Teachers() {
  const { user } = useCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  const {
    teachers,
    loading,
    error,
    page,
    setPage,
    pageSize,
    total,
    search,
    setSearch,
    addTeacher,
    editTeacher,
    removeTeacher,
  } = useTeachers();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formValues, setFormValues] = useState(initialForm);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const openNewTeacherDialog = () => {
    setFormValues(initialForm);
    setSelectedTeacherId(null);
    setIsEditMode(false);
    setFormError(null);
    setDialogOpen(true);
  };

  const openEditTeacherDialog = (teacher: any) => {
    setFormValues({
      username: teacher.username,
      password: "",
      first_name: teacher.first_name || "",
      last_name: teacher.last_name || "",
      phone: teacher.phone || "",
      role: teacher.role,
      is_active: teacher.is_active,
    });
    setSelectedTeacherId(teacher.id);
    setIsEditMode(true);
    setFormError(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setFormError(null);
  };

  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!formValues.username) {
      setFormError("Le nom d'utilisateur est requis.");
      return;
    }

    if (!isEditMode && !formValues.password) {
      setFormError("Le mot de passe est requis pour créer un compte.");
      return;
    }

    const payload = {
      username: formValues.username,
      first_name: formValues.first_name,
      last_name: formValues.last_name,
      phone: formValues.phone,
      role: formValues.role,
      is_active: formValues.is_active,
      ...(formValues.password ? { password: formValues.password } : {}),
    };

    try {
      if (isEditMode && selectedTeacherId) {
        await editTeacher(selectedTeacherId, payload);
      } else {
        await addTeacher(payload);
      }
      closeDialog();
    } catch (err: any) {
      setFormError(err?.message || "Impossible de sauvegarder l'enseignant.");
    }
  };

  const handleDelete = useCallback(async (id: number) => {
    const confirmed = window.confirm("Supprimer cet enseignant ? Cette action est irréversible.");
    if (!confirmed) return;

    try {
      await removeTeacher(id);
    } catch {
      // erreur gérée par le hook
    }
  }, [removeTeacher]);

  const tableRows = useMemo(
    () =>
      teachers.map((teacher: any) => (
        <TableRow key={teacher.id} hover>
          <TableCell>{teacher.username}</TableCell>
          <TableCell>{`${teacher.first_name || ""} ${teacher.last_name || ""}`.trim() || "—"}</TableCell>
          <TableCell>{teacher.phone || "—"}</TableCell>
          <TableCell>{teacher.role}</TableCell>
          <TableCell>{teacher.is_active ? "Actif" : "Désactivé"}</TableCell>
          {isAdmin && (
            <TableCell>
              <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                <IconButton size="small" onClick={() => openEditTeacherDialog(teacher)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(teacher.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </TableCell>
          )}
        </TableRow>
      )),
    [teachers, isAdmin, handleDelete]
  );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Gestion des enseignants
        </Typography>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openNewTeacherDialog}>
            Nouvel enseignant
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            placeholder="Rechercher un enseignant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: 320 }}
          />
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom d’utilisateur</TableCell>
                  <TableCell>Nom complet</TableCell>
                  <TableCell>Téléphone</TableCell>
                  <TableCell>Rôle</TableCell>
                  <TableCell>Statut</TableCell>
                  {isAdmin && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>{tableRows}</TableBody>
            </Table>

            {total !== null && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination count={Math.max(1, Math.ceil((total ?? 0) / pageSize))} page={page} onChange={(_, p) => setPage(p)} />
              </Box>
            )}
          </>
        )}
      </Paper>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{isEditMode ? "Modifier l'enseignant" : "Créer un nouvel enseignant"}</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField
            label="Nom d'utilisateur"
            value={formValues.username}
            onChange={(e) => handleFieldChange("username", e.target.value)}
            fullWidth
          />
          <TextField
            label="Mot de passe"
            type="password"
            value={formValues.password}
            onChange={(e) => handleFieldChange("password", e.target.value)}
            fullWidth
            helperText={isEditMode ? "Laisser vide pour ne pas changer" : ""}
          />
          <TextField
            label="Prénom"
            value={formValues.first_name}
            onChange={(e) => handleFieldChange("first_name", e.target.value)}
            fullWidth
          />
          <TextField
            label="Nom"
            value={formValues.last_name}
            onChange={(e) => handleFieldChange("last_name", e.target.value)}
            fullWidth
          />
          <TextField
            label="Téléphone"
            value={formValues.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="role-label">Rôle</InputLabel>
            <Select
              labelId="role-label"
              value={formValues.role}
              label="Rôle"
              onChange={(event: SelectChangeEvent) => handleFieldChange("role", event.target.value)}
            >
              <MenuItem value="TEACHER">Enseignant</MenuItem>
              <MenuItem value="ADMIN">Administrateur</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="status-label">Statut</InputLabel>
            <Select
              labelId="status-label"
              value={formValues.is_active ? "active" : "inactive"}
              label="Statut"
              onChange={(event: SelectChangeEvent) => handleFieldChange("is_active", event.target.value === "active")}
            >
              <MenuItem value="active">Actif</MenuItem>
              <MenuItem value="inactive">Désactivé</MenuItem>
            </Select>
          </FormControl>
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

export default Teachers;
