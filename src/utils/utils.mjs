export const normalize = (string) => {
  return string.replaceAll(" ", "");
};

export const transpose = (matrix) => {
  const result = matrix.map( row => Array(row.length))

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      result[j][i] = matrix[i][j]
    }
  }

  return result
}
