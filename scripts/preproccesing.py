import pandas as pd

INPUT_CSV = "https://raw.githubusercontent.com/JRMfer/Project/master/data/top250-00-19.csv"

if __name__ == '__main__':

    data = pd.read_csv(INPUT_CSV)
    print(data["League_to"])

    data.loc[(data.League_to == "1.Bundesliga") | (data.League_to == "2.Bundesliga")] = "Germany"

    for i, row in enumerate(data["League_to"]):
        if "Bundesliga" in row:
            print(data["League_to"][i])
            # data["League_to"][i] = "Germany"

    print(data["League_to"])

    # for row in data["League_to"]:
    #     if "Bundesliga" in row:
    #         print("Yes")
