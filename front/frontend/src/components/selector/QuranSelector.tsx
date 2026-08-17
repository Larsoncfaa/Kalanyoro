                  import { useState } from "react";
                  import {
                    Box,
                    Paper,
                    Typography,
                    FormControl,
                    InputLabel,
                    Select,
                    MenuItem,
                    Chip,
                  } from "@mui/material";

                  import { useSurahs } from "../../hooks/useSurahs";
                  import { useVerses } from "../../hooks/useVerses";


                  interface Props {

                    verseStart: number;

                    verseEnd: number;

                    setVerseStart: (value:number)=>void;

                    setVerseEnd: (value:number)=>void;

                    setSurah: (value:number)=>void;

                  }


                  interface Verse {

                    id:number;

                    verse_number:number;

                    text_ar:string;

                    text_fr:string;

                  }



                  export default function QuranSelector({

                    verseStart,
                    verseEnd,
                    setVerseStart,
                    setVerseEnd,
                    setSurah

                  }:Props){


                  const { surahs } = useSurahs();


                  const [selectedSurah,setSelectedSurah] = useState<number>(0);


                  const {
                    verses,
                    loading
                  } = useVerses(selectedSurah);



                  const handleSurahChange = (id:number)=>{

                    setSelectedSurah(id);

                    setSurah(id);

                    setVerseStart(0);

                    setVerseEnd(0);

                  };



                  const handleVerseClick=(number:number)=>{


                    if(!verseStart){

                      setVerseStart(number);

                    }

                    else if(!verseEnd){

                      if(number < verseStart){

                        setVerseStart(number);
                        setVerseEnd(0);

                      }
                      else{

                        setVerseEnd(number);

                      }

                    }

                    else{

                      setVerseStart(number);
                      setVerseEnd(0);

                    }

                  };



                  return (

                  <Box
                  sx={{
                  display:"grid",
                  gap:3
                  }}
                  >


                  <Paper
                  sx={{
                  p:3,
                  borderRadius:3
                  }}
                  >


                  <Typography
                  variant="h6"
                  sx={{
                  fontWeight:700,
                  mb:2
                  }}
                  >

                  📖 Choisir une sourate

                  </Typography>



                  <FormControl fullWidth>


                  <InputLabel>
                  Sourate
                  </InputLabel>


                  <Select

                  value={selectedSurah}

                  label="Sourate"

                  onChange={(e)=>
                  handleSurahChange(
                  Number(e.target.value)
                  )
                  }

                  >


                  <MenuItem value={0}>
                  Sélectionner
                  </MenuItem>


                  {
                  surahs.map((surah:any)=>(

                  <MenuItem
                  key={surah.id}
                  value={surah.id}
                  >

                  {surah.number}. {surah.name_fr}

                  </MenuItem>

                  ))

                  }


                  </Select>


                  </FormControl>


                  </Paper>





                  {
                  selectedSurah > 0 &&


                  <Paper

                  sx={{
                  p:3,
                  borderRadius:3,
                  maxHeight:600,
                  overflow:"auto"
                  }}

                  >


                  <Typography

                  variant="h6"

                  sx={{
                  fontWeight:700,
                  mb:2
                  }}

                  >

                  📚 Lecture du Coran

                  </Typography>



                  {

                  loading ?

                  <Typography>
                  Chargement...
                  </Typography>


                  :

                  verses.map((verse:Verse)=>{


                  const selected =

                  verse.verse_number >= verseStart &&
                  verse.verse_number <= verseEnd;



                  return (

                  <Box

                  key={verse.id}


                  onClick={()=>
                  handleVerseClick(
                  verse.verse_number
                  )
                  }


                  sx={{

                  p:2,

                  mb:2,

                  cursor:"pointer",

                  borderRadius:2,


                  backgroundColor:
                  selected ?
                  "#e8f5e9" :
                  "transparent",


                  "&:hover":{
                  backgroundColor:"#f5f5f5"
                  }


                  }}

                  >



                  <Chip

                  label={`Verset ${verse.verse_number}`}

                  />



                  <Typography

                  sx={{

                  direction:"rtl",

                  fontSize:28,

                  mt:1,

                  fontFamily:"serif"

                  }}

                  >

                  {verse.text_ar}

                  </Typography>



                  <Typography

                  sx={{
                  mt:1
                  }}

                  >

                  {verse.text_fr}

                  </Typography>



                  </Box>

                  )


                  })

                  }



                  </Paper>

                  }





                  {

                  verseStart > 0 &&
                  verseEnd > 0 &&


                  <Paper

                  sx={{
                  p:2
                  }}

                  >


                  <Typography>

                  Sélection :
                  Versets {verseStart} - {verseEnd}

                  </Typography>


                  </Paper>


                  }



                  </Box>

                  )

                  }