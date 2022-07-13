class LoginController {
    constructor(private params: {
        loginUrl: string;
        homeUrl: string;
    }) {
        $('.js__login').click((event) => {
            var userName: string = $('.js__user-name').val().toString();
            var password: string = $('.js__password').val().toString();
            $.ajax({
                method: 'POST',
                url: params.loginUrl,
                data: {
                    userName: userName,
                    password: password
                }
            }).then((token: {
                accessToken: string;
                expiresIn: number;
                tokenType: string;
                refreshToken: string;
                scope: string;
            }) => {
                if (token) {
                    alert("Đăng nhập thành công");
                    location.href = `${location.origin}${this.params.homeUrl}`;
                }
                else {
                    alert("Đăng nhập thất bài");
                }
            })

        });
    }

    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
}

if ($('[login-params]')) {
    let paramsAsJson = $('[login-params]').attr('login-params');
    let params = JSON.parse(paramsAsJson)
    new LoginController(params);
}