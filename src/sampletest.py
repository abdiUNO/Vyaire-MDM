dataList = {'CategoryTypeId': [
                { 'id': 1, 'description': 'Distributor' },
                { 'id': 2, 'description': 'Self-Distributor' }
            ],
            'AccountTypeId': [
                { 'id': 1, 'description': 'DTR' },
                { 'id': 2, 'description': 'INT' },
            ]}
mydict={}
for key in dataList:
    dataAr=dataList[key]
    for dicti in dataAr:
        dataDict=dicti
        print(dataDict)
        mydict[key]:{
           {dataDict.id : dataDict.description}
        }
    print([key])



