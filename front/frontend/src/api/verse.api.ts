import api from "./axios";


// Représente un verset du Coran côté frontend
export interface Verse {

  id: number;

  // Relation avec la sourate
  surah: number;

  // Informations supplémentaires envoyées par Django
  surah_name: string;

  surah_number: number;


  // Numéro du verset
  verse_number: number;


  // Textes du Coran
  text_ar: string;

  text_fr: string;

  text_en: string;


  // Informations de position dans le Mushaf
  juz: number;

  hizb: number;

  page: number;


  // Indique si le verset contient une prosternation
  sajda: boolean;
}



// Récupérer les versets d'une sourate
export const getVerses = async (
  surahId: number
): Promise<Verse[]> => {


  const response = await api.get(
    "verses/",
    {
      params: {
        surah: surahId,
        page_size: 300,
      },
    }
  );


  const data = response.data;


  // Compatible avec pagination Django REST Framework
  return data.results ?? data;

};