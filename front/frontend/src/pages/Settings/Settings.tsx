import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControlLabel,
  Switch,
  Divider,
  Chip,
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
import SettingsIcon from "@mui/icons-material/Settings";
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
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
  } = useSettings();

  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportedJson, setExportedJson] = useState("");

  const handleExport = () => {
    setExportedJson(exportSettings());
    setShowExportDialog(true);
  };

  const handleImport = () => {
    setImportError(null);
    if (!importJson.trim()) {
      setImportError("Veuillez entrer un JSON valide");
      return;
    }

    if (importSettings(importJson)) {
      setShowImportDialog(false);
      setImportJson("");
    } else {
      setImportError(
        "Erreur lors de l'import. Assurez-vous que le JSON est valide"
      );
    }
  };

  const handleResetSettings = () => {
    resetSettings();
  };

  const handleToggleSetting = (key: keyof AppSettings, value: boolean) => {
    updateSetting(key, value);
  };

  const handleSelectChange = (
    key: keyof AppSettings,
    value: string | number
  ) => {
    updateSetting(key, value);
  };

  return (
    <Box>
      {/* En-tête */}
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

      {/* Section Thème et UI */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <PaletteIcon sx={{ color: "#0f766e", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Apparence
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.compactMode}
                  onChange={(e) =>
                    handleToggleSetting("compactMode", e.target.checked)
                  }
                />
              }
              label="Mode compact"
            />
            <Typography variant="caption" color="text.secondary">
              Affichage réduit de l'interface
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Langue</InputLabel>
              <Select
                value={settings.language}
                label="Langue"
                onChange={(e) =>
                  handleSelectChange("language", e.target.value)
                }
              >
                <MenuItem value="fr">Français</MenuItem>
                <MenuItem value="ar">العربية</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Taille de page</InputLabel>
              <Select
                value={settings.pageSize}
                label="Taille de page"
                onChange={(e) =>
                  handleSelectChange("pageSize", parseInt(e.target.value as string))
                }
              >
                <MenuItem value={10}>10 éléments</MenuItem>
                <MenuItem value={20}>20 éléments</MenuItem>
                <MenuItem value={50}>50 éléments</MenuItem>
                <MenuItem value={100}>100 éléments</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Trier par</InputLabel>
              <Select
                value={settings.sortBy}
                label="Trier par"
                onChange={(e) =>
                  handleSelectChange("sortBy", e.target.value)
                }
              >
                <MenuItem value="name">Nom</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="progress">Progression</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Ordre</InputLabel>
              <Select
                value={settings.sortOrder}
                label="Ordre"
                onChange={(e) =>
                  handleSelectChange("sortOrder", e.target.value)
                }
              >
                <MenuItem value="asc">Ascendant</MenuItem>
                <MenuItem value="desc">Descendant</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.showCompleted}
                  onChange={(e) =>
                    handleToggleSetting("showCompleted", e.target.checked)
                  }
                />
              }
              label="Afficher les éléments terminés"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.showArchived}
                  onChange={(e) =>
                    handleToggleSetting("showArchived", e.target.checked)
                  }
                />
              }
              label="Afficher les archives"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section Notifications */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <NotificationsIcon sx={{ color: "#0f766e", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
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
            <Typography variant="caption" color="text.secondary">
              Recevoir des notifications dans l'application
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
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
            <Typography variant="caption" color="text.secondary">
              Recevoir des alertes par email
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
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
              label="Notification sonore"
            />
            <Typography variant="caption" color="text.secondary">
              Jouer un son lors des notifications
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Section Sécurité */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <SecurityIcon sx={{ color: "#0f766e", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Sécurité
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.rememberMe}
                  onChange={(e) =>
                    handleToggleSetting("rememberMe", e.target.checked)
                  }
                />
              }
              label="Me mémoriser"
            />
            <Typography variant="caption" color="text.secondary">
              Rester connecté plus longtemps
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.requirePasswordOnSensitiveActions}
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
            <Typography variant="caption" color="text.secondary">
              Demander le mot de passe pour les actions sensibles
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Délai d'inactivité</InputLabel>
              <Select
                value={settings.sessionTimeout}
                label="Délai d'inactivité"
                onChange={(e) =>
                  handleSelectChange(
                    "sessionTimeout",
                    parseInt(e.target.value as string)
                  )
                }
              >
                <MenuItem value={15}>15 minutes</MenuItem>
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={60}>1 heure</MenuItem>
                <MenuItem value={120}>2 heures</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="caption" color="text.secondary">
              Déconnecter après l'inactivité
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Section Stockage et Données */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <StorageIcon sx={{ color: "#0f766e", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Stockage et Données
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
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
                height: "100%",
              }}
            >
              Exporter les paramètres
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => setShowImportDialog(true)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#0f766e",
                color: "#0f766e",
                height: "100%",
              }}
            >
              Importer les paramètres
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
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
                height: "100%",
              }}
            >
              Réinitialiser
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              disabled
              sx={{
                textTransform: "none",
                fontWeight: 600,
                height: "100%",
              }}
            >
              Stockage local
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="caption" color="text.secondary">
          Les paramètres sont sauvegardés localement dans votre navigateur.
          Lors de l'export, vos préférences sont converties en JSON que vous
          pouvez télécharger. Lors de l'import, vous pouvez restaurer vos
          paramètres depuis une sauvegarde antérieure.
        </Typography>
      </Paper>

      {/* Cartes de résumé */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Langue
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {settings.language === "fr"
                  ? "Français"
                  : settings.language === "ar"
                    ? "عربي"
                    : "English"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Taille de page
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {settings.pageSize}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Délai d'inactivité
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {settings.sessionTimeout} min
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Notifications
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: settings.notificationsEnabled ? "#059669" : "#dc2626",
                }}
              >
                {settings.notificationsEnabled ? "Actif" : "Inactif"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog Export */}
      <Dialog
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Exporter les paramètres</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Copiez le JSON ci-dessous pour sauvegarder vos paramètres
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={exportedJson}
            InputProps={{ readOnly: true }}
            sx={{ fontFamily: "monospace", fontSize: 12 }}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowExportDialog(false)}>Fermer</Button>
          <Button
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(exportedJson);
              setShowExportDialog(false);
            }}
            sx={{
              background: "linear-gradient(135deg, #0f766e, #059669)",
            }}
          >
            Copier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Import */}
      <Dialog
        open={showImportDialog}
        onClose={() => {
          setShowImportDialog(false);
          setImportJson("");
          setImportError(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Importer les paramètres</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {importError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {importError}
            </Alert>
          )}
          <Alert severity="info" sx={{ mb: 2 }}>
            Collez le JSON que vous avez exporté précédemment
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
            placeholder='Collez le JSON ici...'
            variant="outlined"
            sx={{ fontFamily: "monospace", fontSize: 12 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setShowImportDialog(false);
              setImportJson("");
              setImportError(null);
            }}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleImport}
            sx={{
              background: "linear-gradient(135deg, #0f766e, #059669)",
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
