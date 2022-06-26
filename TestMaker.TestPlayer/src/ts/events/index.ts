import { IPreparedData } from "../models/prepared-data";

class EventsController {
    constructor(private params: {
        createCandidateUrl: string;
        prepareUrl: string;
        getPublicEventsAndCandidatesUrl: string;
    }) {
        this.renderList();

        $('.js__prepare').click((event) => {
            var eventCode = $('.js__prepare-event-code-input').val();
            var candidateCode = $('.js__prepare-candidate-code-input').val();
            $.ajax({
                method: 'POST',
                url: this.params.prepareUrl,
                data: {
                    eventCode: eventCode,
                    candidateCode: candidateCode
                }
            }).then(candidate => {
                this.renderList();
            })
        })

        window.addEventListener('online', () => {
            this.renderList();
        });
        window.addEventListener('offline', () => {
            this.renderList();
        });
    }

    renderList() {
        return $.ajax({
            method: 'GET',
            url: this.params.getPublicEventsAndCandidatesUrl
        }).then((prepareDataList: IPreparedData[]) => {
            $('.js__event').remove();

            function createCandidateUI(prepareData: IPreparedData) {
                let isInServer = prepareData.test == null;
                return `<span class="js__candidate js__candidate-${prepareData.candidateCode}" data-candidate-code="${prepareData.candidateCode}">
                            ${prepareData.candidateCode} (${isInServer ? 'Server' : 'Client'}) - 
                            <a class="btn btn-outline-primary btn-sm js__join-event" style="cursor: pointer"
                                data-event-code="${prepareData.eventCode}" data-candidate-code="${prepareData.candidateCode}">
                                Tham gia
                            </a>
                            ${isInServer && navigator.onLine ? ` - 
                                <!--<a class="btn btn-outline-primary btn-sm js__prepare-candidate"
                                    data-event-code="${prepareData.eventCode}" 
                                    data-candidate-code="${prepareData.candidateCode}" 
                                    style="cursor: pointer">
                                    Tải
                                </a>-->` : ''}
                        </span>`
            }

            prepareDataList.forEach(prepareData => {
                let isPublic = prepareData.eventType == 1;

                if ($(`.js__event-${prepareData.eventCode}`).length) {
                    $(`.js__event-${prepareData.eventCode}`).find('.js__candidates').append(`,${createCandidateUI(prepareData)}`)
                }
                else {
                    $('.js__events').append(`
                        <tr class="js__event js__event-${prepareData.eventCode}" data-event-code="${prepareData.eventCode}">
                            <td style="text-align: left; width: 200px; line-height: 30px">
                                ${prepareData.eventCode} (${isPublic ? 'Public' : 'Private'})
                            </td>
                            <td style="text-align: left;">
                                <span class="js__candidates">
                                    ${createCandidateUI(prepareData)}
                                </span>, 
                                <!--<a class="btn btn-outline-primary btn-sm js__create-candidate"
                                    data-event-id="${prepareData.eventId}"
                                    style="cursor: pointer">
                                    Tạo thi sinh mới
                                </a>-->
                            </td>
                        </tr>
                    `);
                }
            });
            this.addEventToJoinEventButton();
        })
    }

    addEventToJoinEventButton() {
        $('.js__join-event').click((event) => {
            let eventCode = $(event.target).data('event-code');
            let candidateCode = $(event.target).data('candidate-code');

            $('.js__event-code-input').val(eventCode);
            $('.js__candidate-code-input').val(candidateCode);
            $('.js__form').submit();
        });

        $('.js__prepare-candidate').click((event) => {
            let eventCode = $(event.target).data('event-code');
            let candidateCode = $(event.target).data('candidate-code');

            $.ajax({
                method: 'POST',
                url: this.params.prepareUrl,
                data: {
                    eventCode: eventCode,
                    candidateCode: candidateCode
                }
            }).then(() => {
                this.renderList();
            })
        });

        $('.js__create-candidate').click((event) => {
            let eventId = $(event.target).data('event-id');

            $.ajax({
                method: 'POST',
                url: this.params.createCandidateUrl,
                data: {
                    eventId: eventId
                }
            }).then(() => {
                this.renderList();
            })
        });
    }
}

if ($('[events-params]')) {
    let paramsAsJson = $('[events-params]').attr('events-params');
    let params = JSON.parse(paramsAsJson)
    new EventsController(params);
}