

//sort original array depend on order array (array have ordered id) and key is element of original array have value on order array
export const mapOrder = (originalArray, orderArray, key) => {
  if (!originalArray || !orderArray || !key) return []
  return [...originalArray].sort(
    (a, b) => orderArray.indexOf(a[key]) - orderArray.indexOf(b[key])
  )
}
// example originalArray: column[{id:1,name:'a'},{id:2,name:'b'}], orderArrayById:[2,1], orderArrayByName:['b','a']
// sort original array (column) to new array have id from 2 to 1 (depend on id in column array), use mapOrder(column,orderArrayById,id)
// use key to availabel in another sortion such as sort by name...