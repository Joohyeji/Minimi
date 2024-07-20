export const validateName = (name) => {
  const nameRegex = /^[a-zA-Z0-9]{1,20}$/
  return nameRegex.test(name)
}

export const validatePassword = (password) => {
  const passwordRegex = /^\S*$/
  return passwordRegex.test(password)
}

export const isWhitespace = (text) => {
  return text.trim() === ''
}
