import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
  FormControl,
  InputLabel,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CancelIcon from "@mui/icons-material/Cancel";

import { useLevelValidations } from "../../hooks/useLevelValidations";
import { useStudents } from "../../hooks/useStudents";
import { useCurriculum } from "../../hooks/useCurriculum";

import type {
  LevelValidationPayload,
  LevelValidationRecord,
  LevelValidationStatus,
} from "../../api/levelValidation.api";


interface ValidationForm {
  student: number | "";
  level: number | "";

  practical_score: number | "";
  oral_score: number | "";
  score: number | "";

  status: LevelValidationStatus;

  notes: string;
}


const EMPTY_FORM: ValidationForm = {
  student: "",
  level: "",

  practical_score: "",
  oral_score: "",
  score: "",

  status: "PENDING",

  notes: "",
};


function LevelValidation() {

  const {
    validations,
    loading,
    error,
    createValidation,
    updateValidation,
    deleteValidation,
  } = useLevelValidations();


  const { students } = useStudents("", 200);

  const {
    levels,
    loading: curriculumLoading,
    error: curriculumError,
  } = useCurriculum();


  const [open, setOpen] = useState(false);

  const [editing, setEditing] =
    useState<LevelValidationRecord | null>(null);

  const [form, setForm] =
    useState<ValidationForm>(EMPTY_FORM);

  const [formError, setFormError] =
    useState<string | null>(null);

  const [saving, setSaving] =
    useState(false);


  const statusColor: Record<
    string,
    "default" | "success" | "warning" | "error"
  > = {
    PENDING: "warning",
    PASSED: "success",
    FAILED: "error",
  };


  const statusLabel: Record<string, string> = {
    PENDING: "En attente",
    PASSED: "Validé",
    FAILED: "Échoué",
  };


  const openCreate = () => {

    setEditing(null);

    setForm(EMPTY_FORM);

    setFormError(null);

    setOpen(true);
  };


  const openEdit = (
    validation: LevelValidationRecord
  ) => {

    setEditing(validation);

    setForm({
      student: validation.student,
      level: validation.level,

      practical_score:
        validation.practical_score ?? "",

      oral_score:
        validation.oral_score ?? "",

      score:
        validation.score ?? "",

      status: validation.status,

      notes:
        validation.notes ?? "",
    });

    setFormError(null);

    setOpen(true);
  };


  const closeDialog = () => {

    if (saving) return;

    setOpen(false);

    setEditing(null);

    setForm(EMPTY_FORM);

    setFormError(null);
  };


  const handleSubmit = async () => {

    setFormError(null);


    if (!form.student) {

      setFormError(
        "Veuillez sélectionner un élève."
      );

      return;
    }


    if (!form.level) {

      setFormError(
        "Veuillez sélectionner un niveau."
      );

      return;
    }


    try {

      setSaving(true);


      const payload: LevelValidationPayload = {

        student: Number(form.student),

        level: Number(form.level),

        practical_score:
          form.practical_score === ""
            ? null
            : Number(form.practical_score),

        oral_score:
          form.oral_score === ""
            ? null
            : Number(form.oral_score),

        score:
          form.score === ""
            ? null
            : Number(form.score),

        status: form.status,

        notes:
          form.notes.trim() || null,
      };


      if (editing) {

        await updateValidation(
          editing.id,
          payload
        );

      } else {

        await createValidation(payload);
      }


      closeDialog();

    } catch (err) {

      console.error(err);

    } finally {

      setSaving(false);
    }
  };


  const handleDelete = async (
    validation: LevelValidationRecord
  ) => {

    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la validation de ${validation.student_name} ?`
    );


    if (!confirmed) return;


    try {

      await deleteValidation(
        validation.id
      );

    } catch (err) {

      console.error(err);
    }
  };


  return (
    <Box>

      {/* =============================== */}
      {/* HEADER */}
      {/* =============================== */}

      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >

        <Box>

          <Typography
            variant="h4"
            sx={{ fontWeight: 800 }}
          >
            Validation des niveaux
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Valider les passages de niveau des élèves.
          </Typography>

        </Box>


        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Nouvelle validation
        </Button>

      </Box>


      {/* =============================== */}
      {/* ERREURS */}
      {/* =============================== */}

      {error && (

        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>

      )}


      {curriculumError && (

        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {curriculumError}
        </Alert>

      )}


      {/* =============================== */}
      {/* TABLE */}
      {/* =============================== */}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
        }}
      >

        {loading ? (

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 6,
            }}
          >
            <CircularProgress />
          </Box>

        ) : (

          <Box sx={{ overflowX: "auto" }}>

            <Table sx={{ minWidth: 1000 }}>

              <TableHead>

                <TableRow>

                  <TableCell>
                    Élève
                  </TableCell>

                  <TableCell>
                    Niveau
                  </TableCell>

                  <TableCell>
                    Pratique
                  </TableCell>

                  <TableCell>
                    Oral
                  </TableCell>

                  <TableCell>
                    Score
                  </TableCell>

                  <TableCell>
                    Statut
                  </TableCell>

                  <TableCell>
                    Prochain niveau
                  </TableCell>

                  <TableCell>
                    Notes
                  </TableCell>

                  <TableCell align="right">
                    Actions
                  </TableCell>

                </TableRow>

              </TableHead>


              <TableBody>

                {validations.length === 0 ? (

                  <TableRow>

                    <TableCell
                      colSpan={9}
                      align="center"
                    >
                      Aucune validation enregistrée.
                    </TableCell>

                  </TableRow>

                ) : (

                  validations.map(
                    (entry) => (

                      <TableRow
                        key={entry.id}
                        hover
                      >

                        <TableCell>
                          {entry.student_name || "—"}
                        </TableCell>


                        <TableCell>
                          {entry.level_name || "—"}
                        </TableCell>


                        <TableCell>
                          {entry.practical_score ?? "—"}
                        </TableCell>


                        <TableCell>
                          {entry.oral_score ?? "—"}
                        </TableCell>


                        <TableCell>
                          {entry.score ?? "—"}
                        </TableCell>


                        <TableCell>

                          <Chip
                            icon={
                              entry.status === "PASSED"
                                ? <CheckCircleIcon />
                                : entry.status === "FAILED"
                                  ? <CancelIcon />
                                  : <PendingActionsIcon />
                            }
                            label={
                              statusLabel[
                                entry.status
                              ] || entry.status
                            }
                            color={
                              statusColor[
                                entry.status
                              ] || "default"
                            }
                            variant="outlined"
                          />

                        </TableCell>


                        <TableCell>

                          {entry.can_access_next_level &&
                          entry.next_level_name ? (

                            <Chip
                              size="small"
                              color="success"
                              label={`→ ${entry.next_level_name}`}
                            />

                          ) : (

                            "—"

                          )}

                        </TableCell>


                        <TableCell>

                          {entry.notes || "—"}

                        </TableCell>


                        <TableCell align="right">

                          <IconButton
                            color="primary"
                            onClick={() =>
                              openEdit(entry)
                            }
                            title="Modifier"
                          >
                            <EditIcon />
                          </IconButton>


                          <IconButton
                            color="error"
                            onClick={() =>
                              void handleDelete(
                                entry
                              )
                            }
                            title="Supprimer"
                          >
                            <DeleteIcon />
                          </IconButton>

                        </TableCell>

                      </TableRow>

                    )
                  )

                )}

              </TableBody>

            </Table>

          </Box>

        )}

      </Paper>


      {/* =============================== */}
      {/* DIALOG CRUD */}
      {/* =============================== */}

      <Dialog
        open={open}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>

          {editing
            ? "Modifier la validation"
            : "Nouvelle validation"}

        </DialogTitle>


        <DialogContent>

          {formError && (

            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {formError}
            </Alert>

          )}


          <Box
            sx={{
              display: "grid",
              gap: 2,
              mt: 1,
            }}
          >

            {/* ÉLÈVE */}

            <FormControl fullWidth>

              <InputLabel>
                Élève
              </InputLabel>

              <Select
                value={form.student}
                label="Élève"
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    student: Number(
                      event.target.value
                    ),
                  }))
                }
              >

                <MenuItem value="">
                  Sélectionner un élève
                </MenuItem>

                {students.map(
                  (student: any) => (

                    <MenuItem
                      key={student.id}
                      value={student.id}
                    >
                      {student.full_name}
                    </MenuItem>

                  )
                )}

              </Select>

            </FormControl>


            {/* NIVEAU */}

            <FormControl fullWidth>

              <InputLabel>
                Niveau
              </InputLabel>

              <Select
                value={form.level}
                label="Niveau"
                disabled={curriculumLoading}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    level: Number(
                      event.target.value
                    ),
                  }))
                }
              >

                <MenuItem value="">
                  Sélectionner un niveau
                </MenuItem>

                {(levels as any[] | undefined)?.map(
                  (level) => (

                    <MenuItem
                      key={level.id}
                      value={level.id}
                    >
                      Niveau{" "}
                      {level.level_number} —{" "}
                      {level.name}
                    </MenuItem>

                  )
                )}

              </Select>

            </FormControl>


            {/* NOTE PRATIQUE */}

            <TextField
              label="Note pratique"
              type="number"
              fullWidth
              value={form.practical_score}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  practical_score:
                    event.target.value === ""
                      ? ""
                      : Number(
                          event.target.value
                        ),
                }))
              }
             
            />


            {/* NOTE ORALE */}

            <TextField
              label="Note orale"
              type="number"
              fullWidth
              value={form.oral_score}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  oral_score:
                    event.target.value === ""
                      ? ""
                      : Number(
                          event.target.value
                        ),
                }))
              }
             
            />


            {/* SCORE */}

            <TextField
              label="Score"
              type="number"
              fullWidth
              value={form.score}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  score:
                    event.target.value === ""
                      ? ""
                      : Number(
                          event.target.value
                        ),
                }))
              }
             
            />


            {/* STATUT */}

            <FormControl fullWidth>

              <InputLabel>
                Statut
              </InputLabel>

              <Select
                value={form.status}
                label="Statut"
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status:
                      event.target.value as LevelValidationStatus,
                  }))
                }
              >

                <MenuItem value="PENDING">
                  En attente
                </MenuItem>

                <MenuItem value="PASSED">
                  Validé
                </MenuItem>

                <MenuItem value="FAILED">
                  Échoué
                </MenuItem>

              </Select>

            </FormControl>


            {/* NOTES */}

            <TextField
              label="Notes"
              multiline
              rows={4}
              fullWidth
              value={form.notes}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  notes: event.target.value,
                }))
              }
            />

          </Box>

        </DialogContent>


        <DialogActions>

          <Button
            onClick={closeDialog}
            disabled={saving}
          >
            Annuler
          </Button>


          <Button
            variant="contained"
            onClick={() =>
              void handleSubmit()
            }
            disabled={saving}
          >

            {saving
              ? "Enregistrement..."
              : editing
                ? "Modifier"
                : "Enregistrer"}

          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}


export default LevelValidation;