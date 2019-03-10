// $('body').val(async () => {
const parser = window.location.href.split('?=')
const token = localStorage.getItem("token")
axios.get('http://localhost:3000/foods', {
  headers: { Authorization: "Bearer " + token }
}).then(resp => console.log(resp))
  .catch(err => console.log(err))
// })