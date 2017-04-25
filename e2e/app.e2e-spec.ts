import { TonelabPage } from './app.po';

describe('tonelab App', () => {
  let page: TonelabPage;

  beforeEach(() => {
    page = new TonelabPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
