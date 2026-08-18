import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControlLabel,
  Switch,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Alert,
} from "@mui/material";

import PaletteIcon from "@mui/icons-material/Palette";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import StorageIcon from "@mui/icons-material/Storage";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { useSettings } from "../../hooks/useSettings";
import type { AppSettings } from "../../hooks/useSettings";

function Settings() {
  const {
    settings,
    updateSetting,
    resetSettings,
    exportSettings,
    importSettings,
  } = useSettings();

  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportedJson, setExportedJson] = useState("");

  // ============================================================
  // EXPORTER LES PARAMÈTRES
  // ============================================================

  const handleExport = () => {
    try {
      const json = exportSettings();

      setExportedJson(json);
      setShowExportDialog(true);
    } catch (error) {
      console.error("Erreur lors de l'export :", error);
    }
  };

  // ============================================================
  // IMPORTER LES PARAMÈTRES
  // ============================================================

  const handleImport = () => {
    setImportError(null);

    if (!importJson.trim()) {
      setImportError("Veuillez entrer un JSON valide.");
      return;
    }

    try {
      const success = importSettings(importJson);

      if (success) {
        setShowImportDialog(false);
        setImportJson("");
        setImportError(null);
      } else {
        setImportError(
          "Erreur lors de l'import. Vérifiez que le JSON est valide."
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'import :", error);

      setImportError(
        "Le JSON fourni est invalide ou incompatible avec les paramètres actuels."
      );
    }
  };

  // ============================================================
  // RÉINITIALISER LES PARAMÈTRES
  // ============================================================

  const handleResetSettings = () => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment réinitialiser tous les paramètres ?"
    );

    if (confirmed) {
      resetSettings();
    }
  };

  // ============================================================
  // MODIFIER UN PARAMÈTRE BOOLÉEN
  // ============================================================

  const handleToggleSetting = (
    key: keyof AppSettings,
    value: boolean
  ) => {
    updateSetting(key, value);
  };

  // ============================================================
  // MODIFIER UN PARAMÈTRE SELECT
  // ============================================================

  const handleSelectChange = (
    key: keyof AppSettings,
    value: string | number
  ) => {
    updateSetting(key, value);
  };

  // ============================================================
  // FERMER DIALOG IMPORT
  // ============================================================

  const closeImportDialog = () => {
    setShowImportDialog(false);
    setImportJson("");
    setImportError(null);
  };

  // ============================================================
  // FERMER DIALOG EXPORT
  // ============================================================

  const closeExportDialog = () => {
    setShowExportDialog(false);
    setExportedJson("");
  };

  // ============================================================
  // COPIER LE JSON
  // ============================================================

  const handleCopyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportedJson);
    } catch (error) {
      console.error("Erreur lors de la copie :", error);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Box>
      {/* ======================================================
          EN-TÊTE
      ====================================================== */}

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#0f172a",
            mb: 1,
          }}
        >
          Paramètres
        </Typography>

        <Typography color="text.secondary">
          Personnalisez votre environnement de travail et vos préférences
        </Typography>
      </Box>

      {/* ======================================================
          APPARENCE
      ====================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 3,
          }}
        >
          <PaletteIcon
            sx={{
              color: "#0f766e",
              fontSize: 28,
            }}
          />

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Apparence
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Mode compact */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.compactMode}
                  onChange={(e) =>
                    handleToggleSetting(
                      "compactMode",
                      e.target.checked
                    )
                  }
                />
              }
              label="Mode compact"
            />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block" }}
            >
              Affichage réduit de l'interface
            </Typography>
          </Grid>

          {/* Mode sombre */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={(e) =>
                    handleToggleSetting(
                      "darkMode",
                      e.target.checked
                    )
                  }
                />
              }
              label="Mode sombre"
            />

            <Typography
              variant="caption"
              color="text.secondary"
             sx={{ display: "block" }}
            >
              Utiliser une interface sombre
            </Typography>
          </Grid>

          {/* Langue */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="language-label">
                Langue
              </InputLabel>

              <Select
                labelId="language-label"
                value={settings.language}
                label="Langue"
                onChange={(e) =>
                  handleSelectChange(
                    "language",
                    e.target.value
                  )
                }
              >
                <MenuItem value="fr">
                  Français
                </MenuItem>

                <MenuItem value="ar">
                  العربية
                </MenuItem>

                <MenuItem value="en">
                  English
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Taille de page */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="page-size-label">
                Taille de page
              </InputLabel>

              <Select
                labelId="page-size-label"
                value={settings.pageSize}
                label="Taille de page"
                onChange={(e) =>
                  handleSelectChange(
                    "pageSize",
                    Number(e.target.value)
                  )
                }
              >
                <MenuItem value={10}>
                  10 éléments
                </MenuItem>

                <MenuItem value={20}>
                  20 éléments
                </MenuItem>

                <MenuItem value={50}>
                  50 éléments
                </MenuItem>

                <MenuItem value={100}>
                  100 éléments
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Trier par */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-by-label">
                Trier par
              </InputLabel>

              <Select
                labelId="sort-by-label"
                value={settings.sortBy}
                label="Trier par"
                onChange={(e) =>
                  handleSelectChange(
                    "sortBy",
                    e.target.value
                  )
                }
              >
                <MenuItem value="name">
                  Nom
                </MenuItem>

                <MenuItem value="date">
                  Date
                </MenuItem>

                <MenuItem value="progress">
                  Progression
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Ordre */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-order-label">
                Ordre
              </InputLabel>

              <Select
                labelId="sort-order-label"
                value={settings.sortOrder}
                label="Ordre"
                onChange={(e) =>
                  handleSelectChange(
                    "sortOrder",
                    e.target.value
                  )
                }
              >
                <MenuItem value="asc">
                  Ascendant
                </MenuItem>

                <MenuItem value="desc">
                  Descendant
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Afficher terminés */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.showCompleted}
                  onChange={(e) =>
                    handleToggleSetting(
                      "showCompleted",
                      e.target.checked
                    )
                  }
                />
              }
              label="Afficher les éléments terminés"
            />
          </Grid>

          {/* Afficher archives */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.showArchived}
                  onChange={(e) =>
                    handleToggleSetting(
                      "showArchived",
                      e.target.checked
                    )
                  }
                />
              }
              label="Afficher les archives"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ======================================================
          NOTIFICATIONS
      ====================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 3,
          }}
        >
          <NotificationsIcon
            sx={{
              color: "#0f766e",
              fontSize: 28,
            }}
          />

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Notifications */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notificationsEnabled}
                  onChange={(e) =>
                    handleToggleSetting(
                      "notificationsEnabled",
                      e.target.checked
                    )
                  }
                />
              }
              label="Notifications activées"
            />

            <Typography
              variant="caption"
              color="text.secondary"
             sx={{ display: "block" }}
            >
              Recevoir les notifications dans l'application
            </Typography>
          </Grid>

          {/* Email */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    handleToggleSetting(
                      "emailNotifications",
                      e.target.checked
                    )
                  }
                />
              }
              label="Notifications par email"
            />

            <Typography
              variant="caption"
              color="text.secondary"
             sx={{ display: "block" }}
            >
              Recevoir les alertes par email
            </Typography>
          </Grid>

          {/* Son */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.soundNotifications}
                  onChange={(e) =>
                    handleToggleSetting(
                      "soundNotifications",
                      e.target.checked
                    )
                  }
                />
              }
              label="Notifications sonores"
            />

            <Typography
              variant="caption"
              color="text.secondary"
             sx={{ display: "block" }}
            >
              Jouer un son lors des notifications
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* ======================================================
          SÉCURITÉ
      ====================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 3,
          }}
        >
          <SecurityIcon
            sx={{
              color: "#0f766e",
              fontSize: 28,
            }}
          />

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Sécurité
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Se souvenir */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.rememberMe}
                  onChange={(e) =>
                    handleToggleSetting(
                      "rememberMe",
                      e.target.checked
                    )
                  }
                />
              }
              label="Me mémoriser"
            />

            <Typography
              variant="caption"
              color="text.secondary"
             sx={{ display: "block" }}
            >
              Rester connecté plus longtemps
            </Typography>
          </Grid>

          {/* Mot de passe */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={
                    settings.requirePasswordOnSensitiveActions
                  }
                  onChange={(e) =>
                    handleToggleSetting(
                      "requirePasswordOnSensitiveActions",
                      e.target.checked
                    )
                  }
                />
              }
              label="Mot de passe requis"
            />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block" }}
            >
              Demander le mot de passe pour les actions sensibles
            </Typography>
          </Grid>

          {/* Timeout */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="session-timeout-label">
                Délai d'inactivité
              </InputLabel>

              <Select
                labelId="session-timeout-label"
                value={settings.sessionTimeout}
                label="Délai d'inactivité"
                onChange={(e) =>
                  handleSelectChange(
                    "sessionTimeout",
                    Number(e.target.value)
                  )
                }
              >
                <MenuItem value={15}>
                  15 minutes
                </MenuItem>

                <MenuItem value={30}>
                  30 minutes
                </MenuItem>

                <MenuItem value={60}>
                  1 heure
                </MenuItem>

                <MenuItem value={120}>
                  2 heures
                </MenuItem>
              </Select>
            </FormControl>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Déconnecter après l'inactivité
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* ======================================================
          STOCKAGE ET DONNÉES
      ====================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 3,
          }}
        >
          <StorageIcon
            sx={{
              color: "#0f766e",
              fontSize: 28,
            }}
          />

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Stockage et Données
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {/* Export */}

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#0f766e",
                color: "#0f766e",
                minHeight: 50,
              }}
            >
              Exporter les paramètres
            </Button>
          </Grid>

          {/* Import */}

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => {
                setImportError(null);
                setShowImportDialog(true);
              }}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#0f766e",
                color: "#0f766e",
                minHeight: 50,
              }}
            >
              Importer les paramètres
            </Button>
          </Grid>

          {/* Reset */}

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={handleResetSettings}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#dc2626",
                color: "#dc2626",
                minHeight: 50,
              }}
            >
              Réinitialiser
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="caption" color="text.secondary">
          Les paramètres sont sauvegardés localement dans votre
          navigateur. Vous pouvez exporter vos préférences au format
          JSON et les importer ultérieurement.
        </Typography>
      </Paper>

      {/* ======================================================
          RÉSUMÉ
      ====================================================== */}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Langue */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Langue
              </Typography>

              <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                {settings.language === "fr"
                  ? "Français"
                  : settings.language === "ar"
                  ? "العربية"
                  : "English"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Taille */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Taille de page
              </Typography>

              <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                {settings.pageSize}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Timeout */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Délai d'inactivité
              </Typography>

              <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                {settings.sessionTimeout} min
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Notifications
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: settings.notificationsEnabled
                    ? "#059669"
                    : "#dc2626",
                }}
              >
                {settings.notificationsEnabled
                  ? "Actif"
                  : "Inactif"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ======================================================
          DIALOG EXPORT
      ====================================================== */}

      <Dialog
        open={showExportDialog}
        onClose={closeExportDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Exporter les paramètres
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Copiez le JSON ci-dessous pour sauvegarder vos paramètres.
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={10}
            value={exportedJson}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            variant="outlined"
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeExportDialog}>
            Fermer
          </Button>

          <Button
            variant="contained"
            onClick={handleCopyExport}
            sx={{
              background:
                "linear-gradient(135deg, #0f766e, #059669)",
            }}
          >
            Copier
          </Button>
        </DialogActions>
      </Dialog>

      {/* ======================================================
          DIALOG IMPORT
      ====================================================== */}

      <Dialog
        open={showImportDialog}
        onClose={closeImportDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Importer les paramètres
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {importError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {importError}
            </Alert>
          )}

          <Alert severity="info" sx={{ mb: 2 }}>
            Collez ici le JSON exporté précédemment.
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={10}
            value={importJson}
            onChange={(e) => {
              setImportJson(e.target.value);
              setImportError(null);
            }}
            placeholder="Collez le JSON ici..."
            variant="outlined"
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeImportDialog}>
            Annuler
          </Button>

          <Button
            variant="contained"
            onClick={handleImport}
            sx={{
              background:
                "linear-gradient(135deg, #0f766e, #059669)",
            }}
          >
            Importer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Settings;