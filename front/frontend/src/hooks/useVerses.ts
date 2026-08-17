import {
  useCallback,
  useEffect,
  useState
} from "react";

import {
  getVerses
} from "../api/verse.api";

import type {
  Verse
} from "../api/verse.api";

export function useVerses(
  surahId: number
) {


  const [verses, setVerses] = useState<Verse[]>([]);


  const [loading, setLoading] = useState(false);


  const [error, setError] = useState<string | null>(null);



  const load = useCallback(async () => {


    // Si aucune sourate sélectionnée
    if (!surahId) {

      setVerses([]);

      return;
    }



    setLoading(true);

    setError(null);



    try {


      const data = await getVerses(surahId);


      setVerses(data);



    } catch (err: any) {


      setError(
        err?.message ||
        "Erreur lors du chargement des versets"
      );


    } finally {


      setLoading(false);

    }


  }, [surahId]);





  useEffect(() => {

    load();

  }, [load]);





  return {

    verses,

    loading,

    error,

    reload: load,

  };

}