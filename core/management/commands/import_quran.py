from django.core.management.base import BaseCommand

from core.models import Surah, Verse

import requests



class Command(BaseCommand):

    help = "Importe le Coran complet dans la base"


    def handle(self, *args, **options):

        self.stdout.write(
            self.style.SUCCESS(
                "Début import du Coran..."
            )
        )


        # API contenant les données du Coran
        url = "https://api.alquran.cloud/v1/quran/quran-uthmani"


        response = requests.get(url)


        if response.status_code != 200:

            self.stdout.write(
                self.style.ERROR(
                    "Erreur récupération Coran"
                )
            )

            return



        data = response.json()


        surahs = data["data"]["surahs"]


        for surah_data in surahs:


            # Création sourate

            surah, created = Surah.objects.get_or_create(

                number = surah_data["number"],

                defaults={

                    "name_ar":
                    surah_data["name"],


                    "name_fr":
                    surah_data["englishName"],


                    "name_en":
                    surah_data["englishName"],


                    "revelation_type":
                    "MECCAN",


                    "revelation_order":
                    surah_data["number"],


                    "total_verses":
                    len(surah_data["ayahs"])

                }

            )


            self.stdout.write(
                f"Sourate ajoutée : {surah.name_fr}"
            )



            # Création des versets

            for verse_data in surah_data["ayahs"]:


                Verse.objects.get_or_create(

                    surah=surah,


                    verse_number=
                    verse_data["numberInSurah"],


                    defaults={


                        "text_ar":
                        verse_data["text"],


                        "juz":
                        verse_data["juz"],


                        "hizb":
                        verse_data["hizbQuarter"],


                        "page":
                        verse_data["page"],


                    }

                )



        self.stdout.write(

            self.style.SUCCESS(

                "Import terminé avec succès !"

            )

        )