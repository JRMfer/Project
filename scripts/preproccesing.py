import pandas as pd

INPUT_CSV = "https://raw.githubusercontent.com/JRMfer/Project/master/data/top250-00-19.csv"

# global constants for competitions and the corresponding countries
competitions = ["Bundesliga", ]
countries = ["Germany"]

if __name__ == '__main__':

    data = pd.read_csv(INPUT_CSV)
    print(data["League_to"])
    for row in data["League_to"]:
        if "Bundesliga" in row:
            print("True")
