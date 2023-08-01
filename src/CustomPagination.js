// @ts-ignore
const pagination = (dataReal, index, showRowData) => {
    let tempData = dataReal
    let start = index == 1 ? 0 : (index - 1) * showRowData
    let end = index * showRowData
    
    tempData = tempData.slice(start, end)
    // @ts-ignore
    tempData.map((tmp, i) => {
        tmp.number = (showRowData * (index - 1)) + (i + 1)
    })

    return tempData
}

export default pagination