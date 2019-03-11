// $('body').val(async () => {
const parser = window.location.href.split('?=')
const token = sessionStorage.getItem('token')
// console.log(token)
axios.get('http://localhost:3000/foods/frutas', {
  headers: { 'Authorization': "Bearer " + token }
}).then(resp => console.log(resp))
  .catch(err => console.log(err))
// })