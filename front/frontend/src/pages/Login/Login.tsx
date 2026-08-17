import { Box, Button, TextField, Typography, Paper, Alert, InputAdornment, Divider } from "@mui/material";
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonIcon from "@mui/icons-material/Person";
import MosqueIcon from "@mui/icons-material/Mosque";
import { login } from "../../api/auth.api";
import { saveTokens, saveUser } from "../../utils/token";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await login({ username, password });
      saveTokens(data.access, data.refresh);
      if (data.user) saveUser(data.user);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Nom utilisateur ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: { xs: 2, md: 4 },
        py: 4,
        background: "radial-gradient(circle at top, #dff7ee 0%, #f4f7fb 60%, #eef4ff 100%)",
      }}
    >
      <Paper elevation={0} sx={{ width: { xs: "100%", md: 460 }, p: { xs: 3, md: 4 }, borderRadius: 4, border: "1px solid rgba(15, 118, 110, 0.12)" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2.5 }}>
          <Box sx={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <MosqueIcon fontSize="large" />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.dark" }}>
              Kalanyoro LMS
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Plateforme moderne de gestion pédagogique et de suivi des apprenants
            </Typography>
          </Box>
          {error && <Alert severity="error" sx={{ width: "100%" }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Nom utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ mt: 2.5, height: 46 }}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </Box>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          Accès réservé au personnel pédagogique et à l’administration
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;