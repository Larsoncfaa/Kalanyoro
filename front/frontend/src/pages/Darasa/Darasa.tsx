
import { useMemo, useState } from "react";


import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Pagination,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";

import { useDarasa } from "../../hooks/useDarasa";
import { useStudents } from "../../hooks/useStudents";

import QuranSelector from "../../components/selector/QuranSelector";

import { useCurriculum } from "../../hooks/useCurriculum";
import type { SessionType } from "../../types";

interface CurriculumLesson {
  id: number;
  module: number;
  title: string;
  objectives?: string;
  description?: string;
  order: number;
  duration_minutes?: number;
  is_required?: boolean;
  content?: string;
}

interface CurriculumModule {
  id: number;
  level: number;
  title: string;
  description?: string;
  order: number;
  lessons: CurriculumLesson[];
}

interface CurriculumLevel {
  id: number;
  level_number: number;
  name: string;
  description?: string;
  modules: CurriculumModule[];
}


interface DarasaForm {
  student: string;
  session_type: SessionType;

  level: number;
  module: number;
  lesson: number;

  surah: number;
  verse_start: number;
  verse_end: number;

  date: string;
  start_time: string;
  end_time: string;

  notes: string;
}


const SESSION_TYPES = [
  { value: "QURAN", label: "Coran" },
  { value: "PRAYER", label: "Prière" },
  { value: "WUDU", label: "Ablution" },
  { value: "TAJWEED", label: "Tajwid" },
  { value: "HADITH", label: "Hadith" },
  { value: "FIQH", label: "Fiqh" },
  { value: "SIRAH", label: "Sira" },
  { value: "DUA", label: "Invocations" },
  { value: "ARABIC", label: "Arabe" },
];


function Darasa() {
  const {
    sessions,
    loading,
    error,
    page,
    setPage,
    total,
    pageSize,
    search,
    setSearch,
    addSession,
    reload,
  } = useDarasa();

  const { students } = useStudents("", 200);

  const {
    levels,
    loading: curriculumLoading,
    error: curriculumError,
  } = useCurriculum();


  const [formError, setFormError] = useState<string | null>(null);


  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<DarasaForm>({
    defaultValues: {
      student: "",
      session_type: "QURAN",

      level: 0,
      module: 0,
      lesson: 0,

      surah: 0,
      verse_start: 1,
      verse_end: 1,

      date: new Date().toISOString().slice(0, 10),

      start_time: "08:00",
      end_time: "09:00",

      notes: "",
    },
  });


  const selectedLevelId = watch("level");
  const selectedModuleId = watch("module");
  const selectedLessonId = watch("lesson");
  const selectedSessionType = watch("session_type");


  const selectedLevel = useMemo(() => {
    return (levels as CurriculumLevel[] | undefined)?.find(
      (level) => level.id === Number(selectedLevelId)
    );
  }, [levels, selectedLevelId]);


  const modules = useMemo(() => {
    return selectedLevel?.modules ?? [];
  }, [selectedLevel]);


  const selectedModule = useMemo(() => {
    return modules.find(
      (module) => module.id === Number(selectedModuleId)
    );
  }, [modules, selectedModuleId]);


  const lessons = useMemo(() => {
    return selectedModule?.lessons ?? [];
  }, [selectedModule]);


  const selectedLesson = useMemo(() => {
    return lessons.find(
      (lesson) => lesson.id === Number(selectedLessonId)
    );
  }, [lessons, selectedLessonId]);


  const handleLevelChange = (levelId: number) => {
    setValue("level", levelId);
    setValue("module", 0);
    setValue("lesson", 0);
  };


  const handleModuleChange = (moduleId: number) => {
    setValue("module", moduleId);
    setValue("lesson", 0);
  };


  const handleSessionTypeChange = (type: SessionType) => {
    setValue("session_type", type);

    /*
     * Si ce n'est pas une séance Coran,
     * on peut vider la sélection de sourate.
     */
    if (type !== "QURAN") {
      setValue("surah", 0);
      setValue("verse_start", 1);
      setValue("verse_end", 1);
    }
  };


  const onSubmit = async (values: DarasaForm) => {
    setFormError(null);

    try {
      if (!values.student) {
        setFormError("Veuillez sélectionner un apprenant.");
        return;
      }

      if (!values.level) {
        setFormError("Veuillez sélectionner un niveau du curriculum.");
        return;
      }

      if (!values.module) {
        setFormError("Veuillez sélectionner un module.");
        return;
      }

      if (!values.lesson) {
        setFormError("Veuillez sélectionner une leçon.");
        return;
      }

      /*
       * Le type QURAN nécessite une sourate.
       */
      if (values.session_type === "QURAN" && !values.surah) {
        setFormError("Veuillez sélectionner une sourate.");
        return;
      }

      await addSession({
        student: Number(values.student),

        session_type: values.session_type,

        lesson: Number(values.lesson),

        surah:
          values.session_type === "QURAN"
            ? Number(values.surah)
            : null,

        verse_start:
        values.session_type === "QURAN"
        ? Number(values.verse_start)
        : null,

        verse_end:
        values.session_type === "QURAN"
        ? Number(values.verse_end)
      : null,


        date: values.date,
        start_time: values.start_time,
        end_time: values.end_time || null,

        notes: values.notes,
      });

      await reload();

      reset({
        student: "",
        session_type: "QURAN",

        level: 0,
        module: 0,
        lesson: 0,

        surah: 0,
        verse_start: 1,
        verse_end: 1,

        date: new Date().toISOString().slice(0, 10),

        start_time: "08:00",
        end_time: "09:00",

        notes: "",
      });
    } catch (err: any) {
      setFormError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Erreur lors de l'enregistrement de la séance."
      );
    }
  };


  const tableRows = useMemo(() => {
    return sessions.map((session: any) => ({
      id: session.id,

      student: session.student_name ?? "—",

      type:
        SESSION_TYPES.find(
          (item) => item.value === session.session_type
        )?.label ??
        session.session_type ??
        "—",

      level: session.level_name ?? "—",

      lesson: session.lesson_title ?? "—",

      surah: session.surah_name ?? "—",

      teacher: session.teacher_name ?? "—",

      date: session.date ?? "—",

      verses:
        session.verse_start && session.verse_end
          ? `${session.verse_start}-${session.verse_end}`
          : "—",
    }));
  }, [sessions]);


  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          mb: 1,
          fontWeight: 700,
        }}
      >
        📖 Séances de Dars
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Enregistrer une séance d'apprentissage directement à partir du curriculum.
      </Typography>


      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns:
            "repeat(auto-fit,minmax(350px,1fr))",
        }}
      >

        {/* ============================= */}
        {/* FORMULAIRE */}
        {/* ============================= */}

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 700,
            }}
          >
            Nouvelle séance
          </Typography>


          {formError && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {formError}
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


          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "grid",
              gap: 2,
            }}
          >

            {/* APPRENANT */}

            <Controller
              name="student"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>
                    Apprenant
                  </InputLabel>

                  <Select
                    {...field}
                    label="Apprenant"
                    value={field.value || ""}
                  >
                    <MenuItem value="">
                      Sélectionner
                    </MenuItem>

                    {students.map((student: any) => (
                      <MenuItem
                        key={student.id}
                        value={student.id}
                      >
                        {student.full_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />


            {/* TYPE DE SÉANCE */}

            <Controller
              name="session_type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>
                    Type de séance
                  </InputLabel>

                  <Select
                    {...field}
                    label="Type de séance"
                    onChange={(event) => {
                      handleSessionTypeChange(
                        event.target.value
                      );
                    }}
                  >
                    {SESSION_TYPES.map((type) => (
                      <MenuItem
                        key={type.value}
                        value={type.value}
                      >
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />


            <Divider />


            {/* CURRICULUM */}

            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
              }}
            >
              📚 Curriculum
            </Typography>


            {/* NIVEAU */}

            <FormControl fullWidth>
              <InputLabel>
                Niveau
              </InputLabel>

              <Select
                value={selectedLevelId || ""}
                label="Niveau"
                disabled={curriculumLoading}
                onChange={(event) => {
                  handleLevelChange(
                    Number(event.target.value)
                  );
                }}
              >
                <MenuItem value="">
                  Sélectionner un niveau
                </MenuItem>

                {(levels as CurriculumLevel[] | undefined)?.map(
                  (level) => (
                    <MenuItem
                      key={level.id}
                      value={level.id}
                    >
                      Niveau {level.level_number} —{" "}
                      {level.name}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>


            {/* MODULE */}

            <FormControl
              fullWidth
              disabled={!selectedLevelId}
            >
              <InputLabel>
                Module
              </InputLabel>

              <Select
                value={selectedModuleId || ""}
                label="Module"
                onChange={(event) => {
                  handleModuleChange(
                    Number(event.target.value)
                  );
                }}
              >
                <MenuItem value="">
                  Sélectionner un module
                </MenuItem>

                {modules.map((module) => (
                  <MenuItem
                    key={module.id}
                    value={module.id}
                  >
                    {module.order}. {module.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>


            {/* LEÇON */}

            <FormControl
              fullWidth
              disabled={!selectedModuleId}
            >
              <InputLabel>
                Leçon
              </InputLabel>

              <Select
                value={selectedLessonId || ""}
                label="Leçon"
                onChange={(event) => {
                  setValue(
                    "lesson",
                    Number(event.target.value)
                  );
                }}
              >
                <MenuItem value="">
                  Sélectionner une leçon
                </MenuItem>

                {lessons.map((lesson) => (
                  <MenuItem
                    key={lesson.id}
                    value={lesson.id}
                  >
                    {lesson.order}. {lesson.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>


            {/* INFORMATIONS LEÇON */}

            {selectedLesson && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700 }}
                >
                  {selectedLesson.title}
                </Typography>

                {selectedLesson.objectives && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Objectifs :{" "}
                    {selectedLesson.objectives}
                  </Typography>
                )}

                {selectedLesson.duration_minutes && (
                  <Chip
                    size="small"
                    label={`${selectedLesson.duration_minutes} min`}
                    sx={{ mt: 1 }}
                  />
                )}
              </Paper>
            )}


            {/* ============================= */}
            {/* CORAN */}
            {/* ============================= */}

            {selectedSessionType === "QURAN" && (
              <>
                <Divider />

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  📖 Contenu coranique
                </Typography>

                <QuranSelector
                  verseStart={watch("verse_start")}
                  verseEnd={watch("verse_end")}
                  setVerseStart={(value) =>
                    setValue(
                      "verse_start",
                      value
                    )
                  }
                  setVerseEnd={(value) =>
                    setValue(
                      "verse_end",
                      value
                    )
                  }
                  setSurah={(value) =>
                    setValue(
                      "surah",
                      value
                    )
                  }
                />
              </>
            )}


            {/* DATE */}

            <TextField
              type="date"
              label="Date"
              fullWidth
              {...control.register("date")}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />


            {/* DÉBUT */}

            <TextField
              type="time"
              label="Début"
              fullWidth
              {...control.register("start_time")}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />


            {/* FIN */}

            <TextField
              type="time"
              label="Fin"
              fullWidth
              {...control.register("end_time")}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />


            {/* OBSERVATION */}

            <TextField
              label="Observation"
              multiline
              rows={3}
              fullWidth
              {...control.register("notes")}
            />


            <Button
              type="submit"
              variant="contained"
              disabled={
                isSubmitting ||
                curriculumLoading
              }
              size="large"
            >
              {isSubmitting
                ? "Enregistrement..."
                : "Enregistrer la séance"}
            </Button>

          </Box>
        </Paper>


        {/* ============================= */}
        {/* HISTORIQUE */}
        {/* ============================= */}

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                Historique
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Séances enregistrées
              </Typography>
            </Box>

            <TextField
              placeholder="Recherche..."
              size="small"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </Box>


          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}


          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 5,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Apprenant
                    </TableCell>

                    <TableCell>
                      Type
                    </TableCell>

                    <TableCell>
                      Niveau
                    </TableCell>

                    <TableCell>
                      Leçon
                    </TableCell>

                    <TableCell>
                      Sourate
                    </TableCell>

                    <TableCell>
                      Versets
                    </TableCell>

                    <TableCell>
                      Date
                    </TableCell>

                    <TableCell>
                      Enseignant
                    </TableCell>
                  </TableRow>
                </TableHead>


                <TableBody>
                  {tableRows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        align="center"
                      >
                        Aucune séance enregistrée.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tableRows.map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                      >
                        <TableCell>
                          {row.student}
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            label={row.type}
                          />
                        </TableCell>

                        <TableCell>
                          {row.level}
                        </TableCell>

                        <TableCell>
                          {row.lesson}
                        </TableCell>

                        <TableCell>
                          {row.surah}
                        </TableCell>

                        <TableCell>
                          {row.verses}
                        </TableCell>

                        <TableCell>
                          {row.date}
                        </TableCell>

                        <TableCell>
                          {row.teacher}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          )}


          {total !== null && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Pagination
                count={Math.max(
                  1,
                  Math.ceil(
                    total / pageSize
                  )
                )}
                page={page}
                onChange={(_, value) =>
                  setPage(value)
                }
              />
            </Box>
          )}

        </Paper>
      </Box>
    </Box>
  );
}


export default Darasa;

