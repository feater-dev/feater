import { Angular2FundamentalsPage } from './app.po';

describe('angular2-fundamentals App', function() {
  let page: Angular2FundamentalsPage;

  beforeEach(() => {
    page = new Angular2FundamentalsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
