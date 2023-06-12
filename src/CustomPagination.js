// @ts-ignore
const pagination = (dataReal, index, showRowData) => {
    let tempData = dataReal
    let start = index == 1 ? 0 : (index - 1) * showRowData
    let end = index * showRowData
    
    tempData = tempData.slice(start, end)
    return tempData
}

export default pagination