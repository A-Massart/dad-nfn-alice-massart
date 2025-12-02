from turtle import *
from random import randrange
from lib.save import save
import os

##### ANALYSE #####

mots_cles = [
    "chaleur",
    "chaud",
    "fondre",
    "fièvre",
    "brûle",
    "lourd",
    "fatigué",
    "anomalie", 
    "anormal",
    "gémi",
    "inquiète",
    "inquiétant",
    "...",
    "…",
    "espoir",
    "!",
]

def analyser_texte(fichier):
    with open(fichier, "r", encoding="utf-8") as f:
        texte = f.read().lower()

    compte = {}

    for mot in mots_cles:
        occurrences = texte.count(mot)
        if occurrences > 0:
            compte[mot] = occurrences

    return compte

chemin_fichier = input("Chemin vers le fichier : ")

##### SCREEN #####
screen = Screen()
screen.setup(width=800, height=600)

##### VISUEL #####

def mot_orange(x, y):
    penup(); goto(x, y); pensize(5); pendown()
    color("orange")
    begin_fill()
    circle(randrange(20, 50))
    end_fill()

def mot_red(x, y):
    penup(); goto(x, y); pensize(5); pendown()
    color("red")
    begin_fill()
    size = randrange(20, 100)
    for _ in range(3):
        forward(size)
        left(120)
    end_fill()

def mot_grey(x, y):
    penup(); goto(x, y); pensize(3); pendown()
    color("grey")
    if randrange(2) == 1:  # 0 ou 1
        begin_fill()
        long = randrange(20,150)
        large = randrange(5,40)
        for _ in range(2):
            forward(long)
            left(90)
            forward(large)
            left(90)
        end_fill()
    else:
        circle(randrange(20,150))

def mot_purple(x, y):
    penup(); goto(x, y); pensize(5); pendown()
    color("purple")
    size = randrange(20, 50)
    for _ in range(4):
        forward(size)
        left(90)

def mot_green(x, y):
    penup(); goto(x, y); pensize(randrange(10, 15)); pendown()
    color("green")
    forward(randrange(50, 150))

def mot_blue(x, y):
    penup(); goto(x, y); pensize(3); pendown()
    color("blue")
    for _ in range(randrange(5,15)):
        forward(randrange(40,80))
        left(randrange(90,160))

def mot_yellow(x, y):
    penup(); goto(x, y); pensize(10); pendown()
    color("yellow")
    begin_fill()
    circle(randrange(50,100))
    end_fill()

##### ANALYSE + VISUEL #####
if __name__ == "__main__":
    resultat = analyser_texte(chemin_fichier)
    
    # TABLE DE CORRESPONDANCE
    lookup_table = {
        ("chaleur", "chaud", "fondre"): mot_orange,
        ("fièvre", "brûle"): mot_red,
        ("lourd", "fatigué"): mot_grey,
        ("anomalie", "anormal"): mot_purple,
        ("gémi",): mot_green,
        ("inquiète", "inquiétant", "...", "…"): mot_blue,
        ("espoir","!"): mot_yellow,
    }

    if resultat:
        print("Mots trouvés dans le texte :")
        speed(0)

        for mot, count in resultat.items():
            print(f"- {mot} : {count} fois")

            # Trouver la bonne fonction en parcourant le mapping (lookup_table)
            dessin_fonction = None
            for mots, fonction in lookup_table.items():
                if mot in mots:
                    dessin_fonction = fonction
                    break

            # Si aucune fonction trouvée → passer
            if not dessin_fonction:
                continue

            # Exécuter la fonction pour chaque occurrence
            for _ in range(count):
                x = randrange(-350, 350)
                y = randrange(-250, 250)
                dessin_fonction(x, y)

    else:
        print("Aucun mot clé trouvé.")


##### SAUVEGARDE #####
if not os.path.exists("rendus"):
    os.makedirs("rendus")

screen.update()
save("JeSuisTerre/JeSuisTerre__generative-art/python/rendus", "test")
print("Saved in rendus/")
done()
