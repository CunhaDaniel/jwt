$('#loginForm').submit(async () => {
    const login = $('#email').val()
    const password = $('#password').val()

    await axios.post('http://localhost:3000/auth/authenticate', {
        email: login,
        password: password
    }).then(async res => {
        await localStorage.setItem("token", res.data)
        // console.log(res)
        window.location.href = `http://localhost:8080/foods.html`;
    })
        .catch(err => console.log(err))
})