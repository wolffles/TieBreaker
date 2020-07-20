// const Webdriver = require("selenium-webdriver")
  // {describe, it, after, before} = require('selenium-webdriver/testing')
// const { By, Key, until} = require('selenium-webdriver');

// var {assert, expect,to, eventually} = require('chai');

// Get the browser to open a new page
// driver.navigate().to("http://tie-breaker.herokuapp.com/")
//     .then(() => driver.findElement(By.css("#nicknameInput")))
//     .then(element => {
//     element.sendKeys("wolf", Key.TAB, "room", Key.TAB, "password")
//         setTimeout(() => {
//             element.sendKeys( Key.ENTER)
//         },1000)
//     })
//     .then(() => {
//         setTimeout(() => {
//             driver.findElement(By.css("#wolf"))
//         },3000)
//     })
//     .then((element) => {
//         setTimeout(() => {
//             assert(element == true, 'element exists' )
//         },3000)
//         .catch(() => {console.log('this failed')})
//     })

// setTimeout(() =>{
//     driver.quit()
// },5000)
// const webdriver = require("selenium-webdriver");

// const driver = new Webdriver.Builder().forBrowser("chrome").build();

// describe("login form", () => {
  // e2e tests are too slow for default Mocha timeout
  // this.timeout(10000);
  // beforeEach(function () {
  //   driver
  //   .navigate()
  //   .to("https://tie-breaker.herokuapp.com")
  // });
 


  // it("fills out the login form", function(done) {
  //   driver.findElement(By.css("#nicknameInput")).sendKeys("wolf",Key.TAB, 'room', Key.TAB, 'a');
  //   driver.wait(until.findElement(By.css("#passwordInput")).value == 'a');
  //   driver
  //     .findElement(By.css(".#passwordInput"))
  //     .sendKeys(Key.ENTER)
  //     .then(() => setTimeout(()=>{
  //       done();
  //     }), 10000);

    // driver.findElement(By.css("#nicknameInput"))
    // .then(element => {
    // element.sendKeys("wolf", Key.TAB, "room", Key.TAB, "password")
    //     setTimeout(() => {
    //         element.sendKeys( Key.ENTER)
    //     },1000)
    // })
    // .then(() => {
    //   this.retries(2);
    //   expect(driver.findElement(By.css("#wolf")).isDisplayed()).to.be.true;
    // });

// setTimeout(() =>{
//     driver.quit()
// },5000)
//   });

//   after(function(done) {
//     driver.quit().then(() => done());
//   });

// });

// describe('retries', function () {
//   // Retry all tests in this suite up to 4 times
//   this.retries(4);

  

//   it('should succeed on the 3rd try', function () {
//     // Specify this test to only retry up to 2 times
   
// });
const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('DefaultTest', (done) => {
  const driver = new Builder().forBrowser('chrome').build();
  beforeEach((done) => {
    driver.get('https://tie-breaker.herokuapp.com')
    .then(() => driver.findElement(By.css("#nicknameInput")).sendKeys("wolf",Key.TAB, 'room', Key.TAB, 'a'))
    .then(() => driver.sleep(500))
    .then(() => driver.findElement(By.css("#passwordInput")).sendKeys(Key.ENTER))
    done()
  })

  it('login as wolf in room and see if player area exist',  () => {
    driver.wait(until.elementLocated(By.id('wolf')))
    .then(() => {
      return expect(driver.findElement(By.id('wolf')).to.eventually.be.true)
    }).catch(console.log("doesn't work"))
  });

  //   it('should go to nehalist.io and check social icon links',  () => {
  //     await driver.get('https://nehalist.io');
  //     const twitterLink = await driver.findElement(By.className('social-link-twitter')).getAttribute('href');
  //     const githubLink  = await driver.findElement(By.className('social-link-github')).getAttribute('href');
      
  //     expect(twitterLink).to.equal('https://twitter.com/nehalist');
  //     expect(githubLink).to.equal('https://github.com/nehalist');
  // });

    afterEach( () => driver.quit());

});