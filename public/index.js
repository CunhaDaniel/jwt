$('#loginForm').submit(async () => {
    const login = $('#email').val()
    const password = $('#password').val()

    await axios.post('http://localhost:3000/auth/authenticate', {
        email: login,
        password: password
    }).then(res => {
        console.log(res)
        window.location.href = `http://localhost:8080/foods.html?=${res.data}`;
    })
        .catch(err => console.log(err))
})