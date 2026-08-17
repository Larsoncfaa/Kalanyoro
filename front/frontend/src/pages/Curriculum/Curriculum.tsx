
import { useState } from "react";

import {
  Box,
  Alert,
  Chip,
  CircularProgress,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  IconButton,
  Divider,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useCurriculum } from "../../hooks/useCurriculum";
import type { CurriculumLevel } from "../../api/curriculum.api";

import {
  createCurriculumLevel,
  updateCurriculumLevel,
  deleteCurriculumLevel,
} from "../../api/curriculum.api";




function Curriculum() {
  const {
    levels,
    loading,
    error,
    reload,
  } = useCurriculum();

  // =========================================================
  // ÉTAT DU FORMULAIRE
  // =========================================================

  const [openDialog, setOpenDialog] = useState(false);

  const [editingLevel, setEditingLevel] =
    useState<CurriculumLevel | null>(null);

  const [levelNumber, setLevelNumber] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);

  // =========================================================
  // OUVRIR POUR CRÉATION
  // =========================================================

  const handleOpenCreate = () => {
    setEditingLevel(null);

    setLevelNumber("");
    setName("");
    setDescription("");
    setIsActive(true);

    setOpenDialog(true);
  };

  // =========================================================
  // OUVRIR POUR MODIFICATION
  // =========================================================

  const handleOpenEdit = (level: CurriculumLevel) => {
    setEditingLevel(level);

    setLevelNumber(String(level.level_number));
    setName(level.name);
    setDescription(level.description);
    setIsActive(level.is_active);

    setOpenDialog(true);
  };

  // =========================================================
  // FERMER LE DIALOG
  // =========================================================

  const handleCloseDialog = () => {
    if (saving) return;

    setOpenDialog(false);
  };

  // =========================================================
  // ENREGISTRER
  // =========================================================

  const handleSave = async () => {
    if (!levelNumber || !name.trim()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        level_number: Number(levelNumber),
        name: name.trim(),
        description: description.trim(),
        is_active: isActive,
      };

      if (editingLevel) {
        await updateCurriculumLevel(
          editingLevel.id,
          payload
        );
      } else {
        await createCurriculumLevel(payload);
      }

      setOpenDialog(false);

      await reload();
    } catch (err) {
      console.error(
        "Erreur lors de l'enregistrement du niveau :",
        err
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // SUPPRIMER
  // =========================================================

  const handleDelete = async (level: CurriculumLevel) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le niveau "${level.name}" ?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCurriculumLevel(level.id);

      await reload();
    } catch (err) {
      console.error(
        "Erreur lors de la suppression du niveau :",
        err
      );
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =========================================================
  // ERREUR
  // =========================================================

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <Box>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800 }}
          >
            Parcours curriculum islamique
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Progression par maîtrise, micro-compétences et
            validation pratique à chaque niveau.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Ajouter un niveau
        </Button>
      </Box>

      {/* =====================================================
          LISTE DES NIVEAUX
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {levels.map((level) => (

          <Paper
            key={level.id}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid #e2e8f0",
            }}
          >

            {/* =================================================
                HEADER NIVEAU
            ================================================= */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                flexWrap: "wrap",
                gap: 2,
              }}
            >

              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700 }}
                  >
                    {level.name}
                  </Typography>

                  {!level.is_active && (
                    <Chip
                      label="Inactif"
                      color="default"
                      size="small"
                    />
                  )}
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {level.description}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >

                <Chip
                  icon={<SchoolIcon />}
                  label={`Niveau ${level.level_number}`}
                  color="success"
                />

                <IconButton
                  color="primary"
                  onClick={() => handleOpenEdit(level)}
                  title="Modifier"
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() => handleDelete(level)}
                  title="Supprimer"
                >
                  <DeleteIcon />
                </IconButton>

              </Box>

            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* =================================================
                MODULES
            ================================================= */}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >

              {level.modules?.map((module) => (

                <Paper
                  key={module.id}
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                  }}
                >

                  {/* MODULE HEADER */}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1.5,
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >

                    <Box>
                      <Typography
                        sx={{ fontWeight: 700 }}
                      >
                        {module.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {module.description}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                      }}
                    >

                      <Chip
                        icon={<MenuBookIcon />}
                        label={`${module.duration_minutes} min`}
                        size="small"
                      />

                      {module.is_required && (
                        <Chip
                          label="Obligatoire"
                          color="primary"
                          size="small"
                        />
                      )}

                    </Box>

                  </Box>

                  {/* =================================================
                      LEÇONS
                  ================================================= */}

                  {module.lessons?.map((lesson) => (

                    <Box
                      key={lesson.id}
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "#f8fafc",
                      }}
                    >

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >

                        <Box>
                          <Typography
                            sx={{ fontWeight: 600 }}
                          >
                            {lesson.title}
                          </Typography>

                          {lesson.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {lesson.description}
                            </Typography>
                          )}
                        </Box>

                        <Chip
                          label={`${lesson.duration_minutes} min`}
                          size="small"
                        />

                      </Box>

                      {/* =================================================
                          COMPÉTENCES
                      ================================================= */}

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          mt: 2,
                        }}
                      >

                        {lesson.competencies?.map(
                          (competency) => (

                            <Box
                              key={competency.id}
                              sx={{
                                display: "flex",
                                justifyContent:
                                  "space-between",
                                alignItems: "center",
                                px: 1.5,
                                py: 1,
                                borderRadius: 2,
                                bgcolor:
                                  competency.is_gate
                                    ? "#fef3c7"
                                    : "#ffffff",
                              }}
                            >

                              <Box>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {competency.title}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {competency.description}
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >

                                {competency.is_gate && (
                                  <Chip
                                    label="Gate"
                                    color="warning"
                                    size="small"
                                  />
                                )}

                                <CheckCircleIcon color="success" />

                              </Box>

                            </Box>

                          )
                        )}

                      </Box>

                    </Box>

                  ))}

                </Paper>

              ))}

            </Box>

          </Paper>

        ))}

      </Box>

      {/* =========================================================
          DIALOG — CRÉER / MODIFIER UN NIVEAU
      ========================================================= */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>
          {editingLevel
            ? "Modifier le niveau"
            : "Ajouter un niveau"}
        </DialogTitle>

        <DialogContent>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              pt: 1,
            }}
          >

            <TextField
              label="Numéro du niveau"
              type="number"
              value={levelNumber}
              onChange={(event) =>
                setLevelNumber(event.target.value)
              }
              fullWidth
              required
            />

            <TextField
              label="Nom du niveau"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              fullWidth
              multiline
              rows={4}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(event) =>
                    setIsActive(event.target.checked)
                  }
                />
              }
              label="Niveau actif"
            />

          </Box>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={handleCloseDialog}
            disabled={saving}
          >
            Annuler
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              saving ||
              !levelNumber ||
              !name.trim()
            }
          >
            {saving
              ? "Enregistrement..."
              : editingLevel
                ? "Modifier"
                : "Créer"}
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}

export default Curriculum;

