import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import FactCheckIcon from "@mui/icons-material/FactCheck";

import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { removeTokens, removeUser } from "../utils/token";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { UserRole } from "../types";


const drawerWidth = 260;


function MainLayout() {

  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useCurrentUser();

  const isAdmin = user?.role === UserRole.ADMIN;


  const navigationItems = [
    {
      label: "Tableau de bord",
      path: "/dashboard",
      icon: <DashboardIcon />,
      requiredRole: undefined,
    },
    {
      label: "Étudiants",
      path: "/students",
      icon: <GroupsIcon />,
      requiredRole: undefined,
    },
    {
      label: "Enseignants",
      path: "/teachers",
      icon: <SchoolIcon />,
      requiredRole: UserRole.ADMIN,
    },
    {
      label: "Dars",
      path: "/darasa",
      icon: <MenuBookIcon />,
      requiredRole: undefined,
    },
    {
      label: "Progression de l'etudiant",
      path: "/progress",
      icon: <TrendingUpIcon />,
      requiredRole: undefined,
    },
    {
      label: "Curriculum",
      path: "/curriculum",
      icon: <SchoolIcon />,
      requiredRole: UserRole.ADMIN,
    },
    {
      label: "Validation niveaux",
      path: "/level-validation",
      icon: <FactCheckIcon />,
      requiredRole: undefined,
    },
    {
      label: "Rapports",
      path: "/reports",
      icon: <AssessmentIcon />,
      requiredRole: undefined,
    },
    {
      label: "Profil",
      path: "/profile",
      icon: <PersonIcon />,
      requiredRole: undefined,
    },
    {
      label: "Paramètres",
      path: "/settings",
      icon: <SettingsIcon />,
      requiredRole: undefined,
    },
  ].filter(
    (item) => !item.requiredRole || user?.role === item.requiredRole
  );


  const handleLogout = () => {

    removeTokens();
    removeUser();

    navigate("/login", { replace: true });

  };


return (

<Box
sx={{
display:"flex",
minHeight:"100vh",
bgcolor:"#f8fafc"
}}
>


{/* SIDEBAR */}

<Drawer

variant="permanent"

sx={{

width:drawerWidth,

flexShrink:0,

"& .MuiDrawer-paper":{

width:drawerWidth,

boxSizing:"border-box",

background:
"linear-gradient(145deg,#0f766e 0%,#0f172a 100%)",

color:"#fff",

borderRight:"none",

boxShadow:"18px 0 40px rgba(15, 23, 42, 0.18)",

}

}}

>


<Box sx={{p:3}}>

<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5 }}>
  <Box sx={{ width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.16)" }}>
    <SchoolIcon />
  </Box>
  <Box>
    <Typography variant="h6" sx={{ fontWeight:800, lineHeight:1.1 }}>
      Kalanyoro
    </Typography>
    <Typography variant="caption" sx={{ color:"#b6f7ea" }}>
      LMS & management
    </Typography>
  </Box>
</Box>


<Typography
variant="body2"
sx={{
color:"#d1fae5",
mt: 2,
fontWeight: 600
}}
>

Espace de pilotage pédagogique

</Typography>


</Box>



<Divider
sx={{
borderColor:"rgba(255,255,255,.15)"
}}
/>



<List sx={{px:2,mt:2}}>


{
navigationItems.map((item)=>{


const active =
location.pathname===item.path;


return (

<ListItemButton

key={item.path}

component={RouterLink}

to={item.path}


sx={{

borderRadius:3,

mb:1,


color:"#d1fae5",


backgroundColor:

active
?"rgba(255,255,255,.18)"
:"transparent",


"&:hover":{
backgroundColor:
"rgba(255,255,255,.12)"
}

}}

>


<ListItemIcon
sx={{
color:"inherit",
minWidth:40
}}
>

{item.icon}

</ListItemIcon>


<ListItemText
  primary={
    <Typography
      sx={{
        fontWeight: active ? 700 : 500,
        color: "inherit",
      }}
    >
      {item.label}
    </Typography>
  }
/>


</ListItemButton>


)

})

}


</List>



</Drawer>





{/* CONTENT */}

<Box

component="main"

sx={{

flexGrow:1,

display:"flex",

flexDirection:"column"

}}

>


<AppBar

position="static"

elevation={0}

sx={{

bgcolor:"rgba(255,255,255,0.9)",

backdropFilter:"blur(16px)",

color:"#0f172a",

borderBottom:
"1px solid rgba(15, 118, 110, 0.1)"

}}

>


<Toolbar

sx={{

justifyContent:"space-between",

px:4

}}

>


<Box>


<Typography

variant="h5"

sx={{
fontWeight:700
}}

>

Espace administration

</Typography>



<Typography

variant="body2"

color="text.secondary"

>

Bienvenue {user?.username ?? "Utilisateur"}

</Typography>



</Box>



<Box

sx={{

display:"flex",

alignItems:"center",

gap:2

}}

>


<Chip

label={
isAdmin
?"Administrateur"
:"Utilisateur"
}

color={
isAdmin
?"success"
:"default"
}

sx={{
fontWeight:600
}}

/>



<Avatar

sx={{

bgcolor:"#059669"

}}

>

{user?.username?.charAt(0).toUpperCase()}

</Avatar>




<Button

variant="outlined"

color="error"

startIcon={<LogoutIcon/>}

onClick={handleLogout}

>

Déconnexion

</Button>



</Box>


</Toolbar>


</AppBar>




<Box

sx={{

p:4,

flexGrow:1

}}

>


<Outlet/>


</Box>



</Box>



</Box>

);

}


export default MainLayout;