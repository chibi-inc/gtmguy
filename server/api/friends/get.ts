export default defineEventHandler(async (event) => {
  const response = await fetch('https://indiehackerfriends.com/api/friends')
  return response.json()
}) 