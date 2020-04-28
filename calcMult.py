def genCombination(numArr):
    changeFlag = False
    for i in range(len(numArr)):
        if numArr[i] < 9:
            numArr[i] = numArr[i] + 1
            changeFlag = True
            break

    if changeFlag == False:
        return [2 for i in range(len(numArr) + 1)]

    return numArr


result = [2]

for i in range(200):
    result = genCombination(result)
    print(result)
