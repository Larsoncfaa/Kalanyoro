import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SchoolIcon from "@mui/icons-material/School";

import { useDashboard } from "../../hooks/useDashboard";
import { useCurrentUser } from "../../hooks/useCurrentUser";


function Dashboard() {

  const { stats, loading, error } = useDashboard();
  const { user } = useCurrentUser();

  const isAdmin = user?.role === "ADMIN";


  const cards = [
    {
      title: "Étudiants",
      value: stats?.studentsCount ?? "—",
      icon: <PeopleAltIcon />,
      color: "#059669"
    },
    {
      title: "Sessions Darasa",
      value: stats?.sessionsCount ?? "—",
      icon: <MenuBookIcon />,
      color: "#2563eb"
    },
    {
      title: "Progressions",
      value: stats?.progressCount ?? "—",
      icon: <TrendingUpIcon />,
      color: "#d97706"
    },
    {
      title: "Enseignants",
      value: stats?.teachersCount ?? "—",
      icon: <SchoolIcon />,
      color: "#7c3aed"
    },
  ];


  const teacherCards = [
    {
      title: "Mes étudiants",
      value: stats?.studentsCount ?? "—",
      icon: <PeopleAltIcon />,
      color: "#059669"
    },
    {
      title: "Mes séances Darasa",
      value: stats?.sessionsCount ?? "—",
      icon: <MenuBookIcon />,
      color: "#2563eb"
    },
    {
      title: "Progressions",
      value: stats?.progressCount ?? "—",
      icon: <TrendingUpIcon />,
      color: "#d97706"
    },
  ];



  const renderCard = (card: any) => (

    <Paper
      key={card.title}
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        transition: "0.3s",

        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 15px 35px rgba(0,0,0,0.08)"
        }
      }}
    >

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >

        <Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontWeight: 600
            }}
          >
            {card.title}
          </Typography>


          <Typography
            variant="h3"
            sx={{
              mt: 1,
              fontWeight: 800,
              color: "#0f172a"
            }}
          >
            {card.value}
          </Typography>


        </Box>



        <Box
          sx={{
            width: 55,
            height: 55,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: `${card.color}15`,
            color: card.color
          }}
        >
          {card.icon}
        </Box>


      </Box>


    </Paper>

  );




  return (

    <Box>


      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2
        }}
      >


        <Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800
            }}
          >
            {
              isAdmin
                ? "Tableau de bord administrateur"
                : "Espace utilisateur"
            }
          </Typography>


          <Typography
            color="text.secondary"
          >
            {
              isAdmin
                ? "Suivi des activités de gestion Coran"
                : "Vue synthétique de votre activité"
            }
          </Typography>


        </Box>



        <Chip
          label={
            isAdmin
              ? "Administrateur"
              : "Enseignant"
          }
          color={
            isAdmin
              ? "success"
              : "default"
          }
          sx={{
            fontWeight: 700
          }}
        />


      </Box>




      {
        error &&

        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>

      }



      {
        loading &&

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8
          }}
        >
          <CircularProgress />
        </Box>

      }




      {
        !loading &&

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))"
          }}
        >

          {
            (isAdmin ? cards : teacherCards)
              .map(renderCard)
          }

        </Box>

      }



    </Box>

  );

}


export default Dashboard;