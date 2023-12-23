import g from '@battis/gas-lighter';

export async function makeBatchCallToGoogleCalendarAPI() {
  const responses = new g.API.Batch()
    .add({
      url: '/calendar/v3/calendars/primary/'
    })
    .add({
      method: 'post',
      url: '/calendar/v3/calendars/primary/events/',
      payload: {
        summary: 'test',
        start: {
          dateTime: '2023-12-21T10:00:00',
          timeZone: 'America/New_York'
        },
        end: { dateTime: '2023-12-21T11:00:00', timeZone: 'America/New_York' }
      }
    })
    .send()
    .getResponses();
  Logger.log(responses);
}
