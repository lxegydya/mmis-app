// @ts-ignore
const toDate = theDate => {
    if(theDate == null){
        return ""
    }

    // @ts-ignore
    theDate = theDate.split("-").map(elm => parseInt(elm))

    return new Date(theDate[0], theDate[1]-1, theDate[2])
        .toLocaleDateString(
            'id', 
            {dateStyle:'medium'}
        )
}

export default toDate