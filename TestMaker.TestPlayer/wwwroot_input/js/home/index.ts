class HomeController {
    constructor(private params: {
        testPlayerUrl: string;
    }) {
        $('.js__do-test').click((event) => {
            var eventCode = $('.js__event-code').val();
            var candidateCode = $('.js__candidate-code').val();

            location.href = `${location.origin}${this.params.testPlayerUrl}?eventCode=${eventCode}&candidateCode=${candidateCode}`;

        });
    }
}

if ($('[home-params]')) {
    let paramsAsJson = $('[home-params]').attr('home-params');
    let params = JSON.parse(paramsAsJson)
    new HomeController(params);
}