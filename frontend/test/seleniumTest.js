
const { Builder, By, Key, until } = require('selenium-webdriver');
const { assert, expect } = require('chai');

describe('DefaultTest', () => {
    const driver = new Builder().forBrowser('chrome').build();
    // const driver2 = new Builder().forBrowser('chrome').build();

    it('login as wolf in room and see if player area exist', async () => {
      await driver.get('http://localhost:3000');
      
      await driver.findElement(By.css("#nicknameInput")).sendKeys("wolf",Key.TAB, 'roomForTest', Key.TAB, 'a');
      // await driver.sleep(30000)
      await driver.findElement(By.css("#passwordInput")).sendKeys(Key.ENTER)
      await driver.wait(until.elementLocated(By.id('wolf')))
      const wolf = await driver.findElement(By.id('wolf'))
      expect(!!wolf).to.be.true;
    });
    

    it('sets the score total to 40', async () => {

      (await driver).findElement(By.css(".setPoints.input")).sendKeys('40', Key.ENTER)
      await driver.wait(until.elementLocated(By.css('#wolf')))
      const scoreChange = await (await driver.findElement(By.className('points-title'))).getAttribute('placeholder')
      assert(scoreChange, 40, "was not 40 as expect")
    });

    it('adds a message in chat', async () => {
      (await driver).findElement(By.css(".inputMessage")).sendKeys('hello', Key.ENTER)
      await driver.wait(until.elementLocated(By.css('.playerMessage')))
      const message = await (await driver.findElement(By.css('.playerMessage')))
      expect(!!message).to.be.true;
    });

    

    // it('new player logs and sends chat message', async () => {
    //   await driver2.get('http://localhost:3000');
    //   await driver2.findElement(By.css("#nicknameInput")).sendKeys("felix", Key.TAB, 'roomForTest', Key.TAB, 'a');
    //   await driver2.findElement(By.css("#passwordInput")).sendKeys(Key.ENTER)
    //   await driver2.wait(until.elementLocated(By.id('felix')))
    //   const wolf = await driver2.findElement(By.id('wolf'))
    //   const felix = (await driver2).findElement(By.id('felix'))
    //   expect( !!wolf ).to.be.true;
    //   assert( !!felix, true, "was not defined" );
    // });

    after(async () => {
      driver.quit()
    });

});