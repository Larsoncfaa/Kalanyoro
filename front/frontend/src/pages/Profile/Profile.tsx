import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useProfile } from "../../hooks/useProfile";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  new_password: string;
  confirm_password: string;
}

function Profile() {
  const { user, loading, error, success, updateProfile, clearMessages } =
    useProfile();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    new_password: "",
    confirm_password: "",
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Initialiser le formulaire avec les données utilisateur
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        new_password: "",
        confirm_password: "",
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormError(null);
  };

  const handleSaveProfile = async () => {
    setFormError(null);

    if (!formData.first_name || !formData.last_name) {
      setFormError("Le prénom et le nom sont requis");
      return;
    }

    try {
      await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
      });

      setIsEditMode(false);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Erreur lors de la sauvegarde"
      );
    }
  };

  const handleChangePassword = async () => {
    setFormError(null);

    if (!formData.new_password || !formData.confirm_password) {
      setFormError("Veuillez entrer le nouveau mot de passe");
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setFormError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.new_password.length < 8) {
      setFormError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    try {
      await updateProfile({
        password: formData.new_password,
        password_confirm: formData.confirm_password,
      });

      setShowPasswordDialog(false);

      setFormData((prev) => ({
        ...prev,
        new_password: "",
        confirm_password: "",
      }));
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Erreur lors du changement de mot de passe"
      );
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Alert severity="error">
        Erreur : Impossible de charger le profil
      </Alert>
    );
  }

  const fullName = `${formData.first_name} ${formData.last_name}`;

  const initials =
    `${formData.first_name.charAt(0)}${formData.last_name.charAt(
      0
    )}`.toUpperCase();

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
          Mon Profil
        </Typography>

        <Typography color="text.secondary">
          Gérez vos informations personnelles et vos paramètres de compte
        </Typography>
      </Box>

      {/* Messages de statut */}
      {error && (
        <Alert
          severity="error"
          onClose={() => clearMessages()}
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          onClose={() => clearMessages()}
          sx={{ mb: 3 }}
        >
          Profil mis à jour avec succès
        </Alert>
      )}

      {/* Carte profil principal */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          mb: 4,
        }}
      >
        {/* En-tête du profil */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "#059669",
                fontSize: 40,
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {fullName}
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 1 }}>
                @{user.username}
              </Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor:
                      user.role === "ADMIN" ? "#dbeafe" : "#dcfce7",
                    color:
                      user.role === "ADMIN" ? "#0369a1" : "#166534",
                    fontWeight: 600,
                  }}
                >
                  {user.role === "ADMIN"
                    ? "Administrateur"
                    : "Enseignant"}
                </Typography>

                {user.is_active ? (
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: "#dcfce7",
                      color: "#166534",
                      fontWeight: 600,
                    }}
                  >
                    Actif
                  </Typography>
                ) : (
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: "#fee2e2",
                      color: "#7f1d1d",
                      fontWeight: 600,
                    }}
                  >
                    Inactif
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Box>
            {!isEditMode ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setIsEditMode(true)}
                sx={{
                  background:
                    "linear-gradient(135deg, #0f766e, #059669)",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Modifier le profil
              </Button>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                  disabled={loading}
                  sx={{
                    background:
                      "linear-gradient(135deg, #0f766e, #059669)",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Enregistrer
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => setIsEditMode(false)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Annuler
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Formulaire */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Prénom"
              value={formData.first_name}
              onChange={(e) =>
                handleInputChange("first_name", e.target.value)
              }
              disabled={!isEditMode || loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#0f766e" }} />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Nom"
              value={formData.last_name}
              onChange={(e) =>
                handleInputChange("last_name", e.target.value)
              }
              disabled={!isEditMode || loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#0f766e" }} />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                handleInputChange("email", e.target.value)
              }
              disabled={!isEditMode || loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#0f766e" }} />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Téléphone"
              value={formData.phone}
              onChange={(e) =>
                handleInputChange("phone", e.target.value)
              }
              disabled={!isEditMode || loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: "#0f766e" }} />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              value={user.username}
              disabled
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon sx={{ color: "#0f766e" }} />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
              helperText="Le nom d'utilisateur ne peut pas être modifié"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={() => setShowPasswordDialog(true)}
              disabled={loading}
              sx={{
                height: "56px",
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#0f766e",
                color: "#0f766e",
              }}
            >
              Changer le mot de passe
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistiques du compte */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Rôle
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {user.role === "ADMIN"
                  ? "Administrateur"
                  : "Enseignant"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Statut
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: user.is_active ? "#059669" : "#dc2626",
                }}
              >
                {user.is_active ? "Actif" : "Inactif"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                ID Utilisateur
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                #{user.id}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Membre depuis
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString(
                      "fr-FR"
                    )
                  : "N/A"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog changement de mot de passe */}
      <Dialog
        open={showPasswordDialog}
        onClose={() => {
          setShowPasswordDialog(false);
          setFormError(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Changer le mot de passe</DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Nouveau mot de passe"
            type={showPasswords.new ? "text" : "password"}
            value={formData.new_password}
            onChange={(e) =>
              handleInputChange("new_password", e.target.value)
            }
            disabled={loading}
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                      edge="end"
                    >
                      {showPasswords.new ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            label="Confirmer le mot de passe"
            type={showPasswords.confirm ? "text" : "password"}
            value={formData.confirm_password}
            onChange={(e) =>
              handleInputChange("confirm_password", e.target.value)
            }
            disabled={loading}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      edge="end"
                    >
                      {showPasswords.confirm ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 1,
              display: "block",
            }}
          >
            Le mot de passe doit contenir au moins 8 caractères
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setShowPasswordDialog(false);
              setFormError(null);
            }}
            disabled={loading}
          >
            Annuler
          </Button>

          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={loading}
            sx={{
              background:
                "linear-gradient(135deg, #0f766e, #059669)",
            }}
          >
            Changer le mot de passe
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Profile;