$('#loginForm').submit(async () => {
    const login = $('#email').val()
    const password = $('#password').val()

    await axios.post('http://localhost:3000/auth/authenticate', {
        email: login,
        password: password
    }).then(res => {
        console.log(res)
        if(res){
            sessionStorage.setItem('token', `${res.data.token}`)
        }
        
    })
        .catch(err => console.log(err))
})