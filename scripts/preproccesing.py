import pandas as pd

INPUT_CSV = "https://raw.githubusercontent.com/JRMfer/Project/master/data/top250-00-19.csv"

if __name__ == '__main__':

    data = pd.read_csv(INPUT_CSV)
    print(data["League_to"])

    data.loc[(data.League_to == "1.Bundesliga") | (data.League_to == "2.Bundesliga")] = "Germany"
    
