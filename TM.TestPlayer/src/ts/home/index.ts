class HomeController {
    constructor(private params: {
        testPlayerUrl: string;
    }) {
        $('.js__do-test').click((event) => {
            var eventCode: string = $('.js__event-code').val().toString();
            var candidateCode: string = $('.js__candidate-code').val().toString();
            this.setCookie('ACCESS_CODE', eventCode + '_' + candidateCode, 1)

            location.href = `${location.origin}${this.params.testPlayerUrl}`;

        });
    }

    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
}

if ($('[home-params]')) {
    let paramsAsJson = $('[home-params]').attr('home-params');
    let params = JSON.parse(paramsAsJson)
    new HomeController(params);
}