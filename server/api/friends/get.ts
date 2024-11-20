export default defineEventHandler(async (event) => {
  const response = await fetch('https://indiehackerfriends.com/friends/api')
  return response.json()
}) 