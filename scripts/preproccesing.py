import pandas as pd

INPUT_CSV = "https://raw.githubusercontent.com/JRMfer/Project/master/data/top250-00-19.csv"

if __name__ == '__main__':

    data = pd.read_csv(INPUT_CSV)
    print(data["League_to"])
    print(data.loc[(data.League_to == "1.Bundesliga")])

    data.loc[(data.League_to == "1.Bundesliga") | (data.League_to == "2.Bundesliga"), "League_to"] = "Germany"
    data.loc[(data.League_to == "Bundesliga"), "League_to"] = "Switzerland"
    data.loc[(data.League_to == "Allsvenskan"), "League_to"] = "Sweden"
    data.loc[(data.League_to == "Championship") | (data.League_to == "First Division")
            | (data.League_to == "League One") | (data.League_to == "Premier League")
            | (data.League_to == "Second Division (bis 03/04)") | (data.League_to == "Premiership")
            | (data.League_to == " Wales") | (data.League_to == " Scotland"), "League_to"] = "England"
    data.loc[(data.League_to == "Eliteserien"), "League_to"] = "Norway"
    data.loc[(data.League_to == "Eredivisie"), "League_to"] = "Netherlands"
    data.loc[(data.League_to == "J1 League") | (data.League_to == "J2 League")
            | (data.League_to == "J1 - 2nd Stage"), "League_to"] = "Japan"
    data.loc[(data.League_to == "Jupiler Pro League"), "League_to"] = "Belgium"
    data.loc[(data.League_to == "LaLiga") | (data.League_to == "LaLiga2"), "League_to"] = "Spain"
    data.loc[(data.League_to == " Korea, South"), "League_to"] = "South Korea"
    data.loc[(data.League_to == "Ledman Liga Pro") | (data.League_to == "Liga NOS"), "League_to"] = "Portugal"
    data.loc[(data.League_to == "Liga MX Clausura") | (data.League_to == "Liga MX Apertura"), "League_to"] = "Mexico"
    data.loc[(data.League_to == "Ligue 1") | (data.League_to == "Ligue 2"), "League_to"] = "France"
    data.loc[(data.League_to == "MLS"), "League_to"] = "USA"
    data.loc[(data.League_to == "Premier Liga"), "League_to"] = "Russia"
    data.loc[(data.League_to == "Professional League") | (data.League_to == "Saudi"), "League_to"] = "Saudi Arabia"
    data.loc[(data.League_to == "Serie A") | (data.League_to == "Serie B")
            | (data.League_to == "Serie C - B") | (data.League_to == "Primavera B"), "League_to"] = "Italy"
    data.loc[(data.League_to == "Süper Lig"), "League_to"] = "Turkey"
    data.loc[(data.League_to == "Stars League"), "League_to"] = "Qatar"
    data.loc[(data.League_to == "Super League"), "League_to"] = "China"
    data.loc[(data.League_to == "SuperLiga"), "League_to"] = "Serbia"
    data.loc[(data.League_to == "Superligaen"), "League_to"] = "Denmark"
    data.loc[(data.League_to == "Torneo Final") | (data.League_to == "Primera División")
            | (data.League_to == "Segunda División - Segunda Fase"), "League_to"] = "Argentina"
    data.loc[(data.League_to == "UAE Gulf League"), "League_to"] = "United Arab Emirates"
    data.loc[(data.League_to == "Série A"), "League_to"] = "Brazil"

    data["Transfer_fee"] = pd.to_numeric(data.Transfer_fee)

    data.to_csv("../data/transfers250.csv")
    print(data["League_to"])
    print(data.loc[(data.League_to == "Germany")])
